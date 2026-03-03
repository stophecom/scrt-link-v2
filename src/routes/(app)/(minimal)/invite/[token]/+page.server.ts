import { sha256Hash } from '@scrt-link/core';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import { InviteStatus } from '$lib/data/enums.js';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db/index.js';
import { invite, membership, organization } from '$lib/server/db/schema.js';
import { createOrUpdateUser } from '$lib/server/user.js';

export const load = async (event) => {
	const otpToken = event.params.token;

	if (!otpToken) {
		throw error(500, `No token found.`);
	}

	const otpTokenHash = await sha256Hash(otpToken);

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

	try {
		// Create or update user
		const { userId, passwordHash } = await createOrUpdateUser({
			email: existingInvite.email,
			name: existingInvite.name,
			emailVerified: true
		});

		// Add to membership
		if (userId && existingInvite.organizationId) {
			await db.insert(membership).values({
				userId: userId,
				organizationId: existingInvite.organizationId,
				role: existingInvite.membershipRole
			});
		}

		// Cleanup
		await db.delete(invite).where(eq(invite.id, existingInvite.id));

		// Create session
		await auth.createSession(event, userId);

		// Get organization name from invite
		let organizationName = '';
		if (existingInvite.organizationId) {
			const [organizationResult] = await db
				.select()
				.from(organization)
				.where(eq(organization.id, existingInvite.organizationId));

			organizationName = organizationResult.name;
		}

		return {
			organizationName: organizationName,
			hasPassword: !!passwordHash
		};
	} catch (e) {
		console.error(e);
		error(500, 'Failed to register.');
	}
};
