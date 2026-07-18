import { sha256Hash } from '@scrt-link/core';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import { InviteStatus } from '$lib/data/enums.js';
import { redirectLocalized } from '$lib/i18n';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db/index.js';
import { invite, membership, organization } from '$lib/server/db/schema.js';
import { syncOrgSeatCount } from '$lib/server/organization.js';
import { createOrUpdateUser } from '$lib/server/user.js';

import type { Actions, RequestEvent } from './$types';

async function getValidInvite(token: string) {
	const otpTokenHash = await sha256Hash(token);
	const [existingInvite] = await db.select().from(invite).where(eq(invite.token, otpTokenHash));

	if (!existingInvite) {
		throw error(500, `No invitation found.`);
	}

	if (existingInvite.acceptedAt) {
		throw error(401, `Invitation has been accepted already.`);
	}

	if (existingInvite.expiresAt < new Date() || existingInvite.status !== InviteStatus.PENDING) {
		throw error(401, `Invitation expired. Request new one.`);
	}

	return existingInvite;
}

export const load = async (event) => {
	const otpToken = event.params.token;

	if (!otpToken) {
		throw error(500, `No token found.`);
	}

	const existingInvite = await getValidInvite(otpToken);

	let organizationName = '';
	if (existingInvite.organizationId) {
		const [organizationResult] = await db
			.select()
			.from(organization)
			.where(eq(organization.id, existingInvite.organizationId));

		organizationName = organizationResult?.name ?? '';
	}

	return {
		organizationName,
		email: existingInvite.email
	};
};

export const actions: Actions = {
	acceptInvitation: async (event: RequestEvent) => {
		const otpToken = event.params.token;

		if (!otpToken) {
			throw error(500, `No token found.`);
		}

		const existingInvite = await getValidInvite(otpToken);

		let passwordHash: string | null | undefined;

		try {
			const result = await createOrUpdateUser({
				email: existingInvite.email,
				name: existingInvite.name,
				emailVerified: true,
				// Invited members are onboarded into an existing organization,
				// so they skip the welcome wizard.
				showWelcomeWizard: false
			});

			if (result.userId && existingInvite.organizationId) {
				await db.insert(membership).values({
					userId: result.userId,
					organizationId: existingInvite.organizationId,
					role: existingInvite.membershipRole
				});
				syncOrgSeatCount(existingInvite.organizationId).catch(console.error);
			}

			await db.delete(invite).where(eq(invite.id, existingInvite.id));
			await auth.createSession(event, result.userId);

			passwordHash = result.passwordHash;
		} catch (e) {
			console.error(e);
			error(500, 'Failed to accept invitation.');
		}

		return redirectLocalized(303, passwordHash ? '/account' : '/set-password');
	}
};
