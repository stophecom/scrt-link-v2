import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { redirectLocalized } from '$lib/i18n';
import { m } from '$lib/paraglide/messages.js';
import { planOwnedOrganizationsForAccountDeletion } from '$lib/server/account-deletion';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import { organization, user as userSchema } from '$lib/server/db/schema';
import { getOwnedOrganizationStates } from '$lib/server/organization';
import { cancelSubscription, getActiveSubscription } from '$lib/server/stripe';
import { deleteAccountSchema } from '$lib/validators/formSchemas';

import type { Actions, RequestEvent } from './$types';

export async function load(event: RequestEvent) {
	if (!event.locals.user) {
		return redirectLocalized(307, '/login');
	}

	return {
		user: event.locals.user,
		accountDeletionForm: await superValidate(zod4(deleteAccountSchema()))
	};
}

export const actions: Actions = {
	deleteAccount: deleteAccount
};

/** Cancels the active subscription of a Stripe customer, if there is one. */
async function cancelActiveSubscription(stripeCustomerId: string) {
	const subscription = await getActiveSubscription(stripeCustomerId);
	if (subscription?.id) {
		await cancelSubscription(subscription.id);
	}
}

async function deleteAccount(event: RequestEvent) {
	if (!event.locals.user) {
		return redirectLocalized(307, '/login');
	}

	if (!event.locals.session) {
		return fail(401);
	}

	const accountDeletionForm = await superValidate(event.request, zod4(deleteAccountSchema()));

	if (!accountDeletionForm.valid) {
		return fail(400, { accountDeletionForm });
	}

	const { confirm } = accountDeletionForm.data;

	if (!confirm) {
		return redirectLocalized(303, '/farewell');
	}

	// Organizations are not owned by the user record: deleting the account only
	// cascades the membership. An organization the user solely owns would keep
	// its own Stripe subscription running with nobody left to cancel it.
	const { blocked, orphaned } = planOwnedOrganizationsForAccountDeletion(
		await getOwnedOrganizationStates(event.locals.user.id)
	);

	if (blocked.length) {
		return message(
			accountDeletionForm,
			{
				status: 'error',
				title: m.east_ago_hedgehog_pause(),
				description: m.patchy_equal_myna_affirm()
			},
			{ status: 400 }
		);
	}

	try {
		// Cancel subscription if necessary
		if (event.locals.user.stripeCustomerId) {
			await cancelActiveSubscription(event.locals.user.stripeCustomerId);
		}

		// Organizations the user solely owns and is the only member of go away
		// with the account, including their billing.
		for (const org of orphaned) {
			if (org.stripeCustomerId) {
				await cancelActiveSubscription(org.stripeCustomerId);
			}
			await db.delete(organization).where(eq(organization.id, org.id));
		}

		await db.delete(userSchema).where(eq(userSchema.id, event.locals.user.id));
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);
	} catch (e) {
		console.error(e);
		error(500, 'Failed to delete account.');
	}

	return redirectLocalized(303, '/farewell');
}
