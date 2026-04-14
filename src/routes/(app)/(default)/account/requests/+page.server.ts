import { type Actions, fail } from '@sveltejs/kit';

import { redirectLocalized } from '$lib/i18n';
import { m } from '$lib/paraglide/messages';
import { postSecretRequest } from '$lib/server/form/actions';
import { secretRequestFormValidator } from '$lib/server/form/validators';
import { deleteSecretRequest, fetchUserRequests } from '$lib/server/secret-requests';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, depends }) => {
	depends('app:requests');
	const user = locals.user;
	if (!user) {
		return redirectLocalized(307, '/signup');
	}

	const requests = await fetchUserRequests(user.id);

	return {
		user,
		requests,
		secretRequestForm: await secretRequestFormValidator(),
		pageTitle: m.calm_proud_ibis_list()
	};
};

export const actions: Actions = {
	postSecretRequest,
	deleteRequest: async ({ request, locals }) => {
		const user = locals.user;
		if (!user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const requestId = formData.get('requestId') as string;

		if (!requestId) {
			return fail(400, { error: 'Missing request ID' });
		}

		const result = await deleteSecretRequest(requestId, user.id);
		if (!result) {
			return fail(404, { error: 'Request not found' });
		}

		return { success: true };
	}
};
