import { type Actions, error, fail } from '@sveltejs/kit';

import { redirectLocalized } from '$lib/i18n';
import { m } from '$lib/paraglide/messages';
import {
	deleteSecretRequest,
	getRequestById,
	markRequestViewed
} from '$lib/server/secret-requests';
import { getWhiteLabelSiteByHost } from '$lib/server/whiteLabelSite';

import type { PageServerLoad } from './$types';

const assertFeatureEnabled = async (domain: string | undefined) => {
	if (!domain) error(404, 'Not found.');
	const whiteLabel = await getWhiteLabelSiteByHost(domain);
	if (!whiteLabel?.enableSecretRequests) {
		error(404, 'Not found.');
	}
};

export const load: PageServerLoad = async ({ locals, params, parent }) => {
	const { enableSecretRequests } = await parent();
	if (!enableSecretRequests) {
		error(404, 'Not found.');
	}

	const user = locals.user;
	if (!user) {
		return redirectLocalized(307, '/signup');
	}

	const request = await getRequestById(params.id, user.id);

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
	deleteRequest: async ({ locals, params }) => {
		await assertFeatureEnabled(params.domain);

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
