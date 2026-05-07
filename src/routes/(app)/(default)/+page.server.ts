import { postSecret } from '$lib/server/form/actions';
import { secretFormValidator } from '$lib/server/form/validators';
import { rateLimiterPreflight } from '$lib/server/rate-limit';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	await rateLimiterPreflight(event);
	return {
		secretForm: await secretFormValidator()
	};
};

export const actions: Actions = {
	postSecret: postSecret
};
