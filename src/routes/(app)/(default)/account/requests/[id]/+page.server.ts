import { type Actions,error, fail } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

import { redirectLocalized } from '$lib/i18n';
import { m } from '$lib/paraglide/messages';
import { db } from '$lib/server/db';
import { secretRequest } from '$lib/server/db/schema';
import { deleteSecretRequest, markRequestViewed } from '$lib/server/secret-requests';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const user = locals.user;
	if (!user) {
		return redirectLocalized(307, '/signup');
	}

	const [request] = await db
		.select()
		.from(secretRequest)
		.where(and(eq(secretRequest.id, params.id), eq(secretRequest.userId, user.id)));

	if (!request) {
		error(404, 'Request not found.');
	}

	if (!request.encryptedResponseContent || !request.wrappedResponseKey) {
		error(400, 'No response has been submitted yet.');
	}

	// Mark as viewed
	if (!request.viewedAt) {
		await markRequestViewed(request.id, user.id);
	}

	return {
		request: {
			id: request.id,
			encryptedPrivateKey: request.encryptedPrivateKey,
			encryptedResponseContent: request.encryptedResponseContent,
			wrappedResponseKey: request.wrappedResponseKey,
			encryptedResponseMeta: request.encryptedResponseMeta,
			respondedAt: request.respondedAt,
			createdAt: request.createdAt
		},
		pageTitle: m.keen_bright_fox_peek()
	};
};

export const actions: Actions = {
	deleteRequest: async ({ locals, params }) => {
		const user = locals.user;
		if (!user) {
			return fail(401, { error: 'Unauthorized' });
		}

		if (!params.id) {
			return fail(400, { error: 'Missing request ID' });
		}

		const result = await deleteSecretRequest(params.id, user.id);
		if (!result) {
			return fail(404, { error: 'Request not found' });
		}

		return redirectLocalized(303, '/account/requests');
	}
};
