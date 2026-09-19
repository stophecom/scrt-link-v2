import { type Actions, error, fail } from '@sveltejs/kit';

import { redirectLocalized } from '$lib/i18n';
import { m } from '$lib/paraglide/messages';
import {
	deleteSecretRequest,
	getRequestById,
	markRequestViewed
} from '$lib/server/secret-requests';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const user = locals.user;
	if (!user) {
		return redirectLocalized(307, '/signup');
	}

	const request = await getRequestById(params.id, user.id);

	if (!request) {
		error(404, 'Request not found.');
	}

	if (
		(!request.encryptedResponseContent && !request.encryptedResponseFile) ||
		!request.wrappedResponseKey
	) {
		error(400, 'No response has been submitted yet.');
	}

	return {
		request: {
			id: request.id,
			requestIdHash: request.requestIdHash,
			encryptedPrivateKey: request.encryptedPrivateKey,
			encryptedResponseContent: request.encryptedResponseContent,
			wrappedResponseKey: request.wrappedResponseKey,
			encryptedResponseMeta: request.encryptedResponseMeta,
			encryptedResponseFile: request.encryptedResponseFile,
			respondedAt: request.respondedAt,
			createdAt: request.createdAt
		},
		pageTitle: m.keen_bright_fox_peek()
	};
};

export const actions: Actions = {
	// Marking a request as viewed must not happen in `load`: a GET can be triggered by
	// link preloading (hover), which would mark a response as viewed without the user
	// ever opening it. The client calls this action once the response page is open.
	markViewed: async ({ locals, params }) => {
		const user = locals.user;
		if (!user) {
			return fail(401, { error: 'Unauthorized' });
		}

		if (!params.id) {
			return fail(400, { error: 'Missing request ID' });
		}

		await markRequestViewed(params.id, user.id);

		return { success: true };
	},

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
