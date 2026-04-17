import { error } from '@sveltejs/kit';

import { postSecretResponse } from '$lib/server/form/actions';
import { secretResponseFormValidator } from '$lib/server/form/validators';
import { loadSecretResponsePageData } from '$lib/server/secret-requests';

import type { Actions, PageServerLoad, RequestEvent } from './$types';

const assertFeatureEnabled = (event: Pick<RequestEvent, 'locals'>) => {
	if (!event.locals.whiteLabelSite?.enableSecretRequests) {
		error(404, 'Not found.');
	}
};

export const load: PageServerLoad = async (event) => {
	assertFeatureEnabled(event);
	return {
		form: await secretResponseFormValidator(),
		...(await loadSecretResponsePageData(event.params.requestIdHash))
	};
};

export const actions: Actions = {
	default: async (event) => {
		assertFeatureEnabled(event);
		return postSecretResponse(event);
	}
};
