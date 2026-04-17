import { type Actions, error, fail } from '@sveltejs/kit';

import { redirectLocalized } from '$lib/i18n';
import { postSecretRequest } from '$lib/server/form/actions';
import { secretRequestFormValidator } from '$lib/server/form/validators';
import {
	countUnreadResponses,
	deleteSecretRequest,
	fetchUserRequests
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

export const load: PageServerLoad = async ({ locals, depends, parent }) => {
	depends('app:requests');

	const { enableSecretRequests } = await parent();
	if (!enableSecretRequests) {
		error(404, 'Not found.');
	}

	const user = locals.user;
	if (!user) {
		return redirectLocalized(307, '/signup');
	}

	const [requests, unreadCount] = await Promise.all([
		fetchUserRequests(user.id),
		countUnreadResponses(user.id)
	]);

	return {
		user,
		requests,
		unreadCount,
		secretRequestForm: await secretRequestFormValidator()
	};
};

export const actions: Actions = {
	postSecretRequest: async (event) => {
		await assertFeatureEnabled(event.params.domain);
		return postSecretRequest(event);
	},
	deleteRequest: async ({ request, locals, params }) => {
		await assertFeatureEnabled(params.domain);

		const user = locals.user;
		if (!user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const requestId = formData.get('requestId');

		if (!requestId || typeof requestId !== 'string') {
			return fail(400, { error: 'Missing request ID' });
		}

		const result = await deleteSecretRequest(requestId, user.id);
		if (!result) {
			return fail(404, { error: 'Request not found' });
		}

		return { success: true };
	}
};
