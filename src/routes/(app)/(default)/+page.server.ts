import { postSecret } from '$lib/server/form/actions';
import { secretFormValidator } from '$lib/server/form/validators';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		secretForm: await secretFormValidator()
	};
};

export const actions: Actions = {
	postSecret: postSecret
};
