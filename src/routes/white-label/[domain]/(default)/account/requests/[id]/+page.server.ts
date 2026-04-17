import { type Actions, error, fail } from '@sveltejs/kit';

import { redirectLocalized } from '$lib/i18n';
import { m } from '$lib/paraglide/messages';
import {
	deleteSecretRequest,
	getRequestById,
	markRequestViewed
} from '$lib/server/secret-requests';

import type { PageServerLoad, RequestEvent } from './$types';

const assertFeatureEnabled = (event: Pick<RequestEvent, 'locals'>) => {
	if (!event.locals.whiteLabelSite?.enableSecretRequests) {
		error(404, 'Not found.');
	}
};

export const load: PageServerLoad = async (event) => {
	assertFeatureEnabled(event);

	const user = event.locals.user;
	if (!user) {
		return redirectLocalized(307, '/signup');
	}

	const request = await getRequestById(event.params.id, user.id);

	if (!request) {
		error(404, 'Request not found.');
	}

	if (!request.encryptedResponseContent || !request.wrappedResponseKey) {
		error(400, 'No response has been submitted yet.');
	}

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
	deleteRequest: async (event) => {
		assertFeatureEnabled(event);

		const user = event.locals.user;
		if (!user) {
			return fail(401, { error: 'Unauthorized' });
		}

		if (!event.params.id) {
			return fail(400, { error: 'Missing request ID' });
		}

		const result = await deleteSecretRequest(event.params.id, user.id);
		if (!result) {
			return fail(404, { error: 'Request not found' });
		}

		return redirectLocalized(303, '/account/requests');
	}
};
