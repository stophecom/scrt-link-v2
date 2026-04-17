import { type Actions, error, fail } from '@sveltejs/kit';

import { redirectLocalized } from '$lib/i18n';
import { postSecretRequest } from '$lib/server/form/actions';
import { secretRequestFormValidator } from '$lib/server/form/validators';
import {
	countUnreadResponses,
	deleteSecretRequest,
	fetchUserRequests
} from '$lib/server/secret-requests';

import type { PageServerLoad, RequestEvent } from './$types';

const assertFeatureEnabled = (event: Pick<RequestEvent, 'locals'>) => {
	if (!event.locals.whiteLabelSite?.enableSecretRequests) {
		error(404, 'Not found.');
	}
};

export const load: PageServerLoad = async (event) => {
	event.depends('app:requests');
	assertFeatureEnabled(event);

	const user = event.locals.user;
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
		assertFeatureEnabled(event);
		return postSecretRequest(event);
	},
	deleteRequest: async (event) => {
		assertFeatureEnabled(event);

		const user = event.locals.user;
		if (!user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await event.request.formData();
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
