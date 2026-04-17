import { postSecretResponse } from '$lib/server/form/actions';
import { secretResponseFormValidator } from '$lib/server/form/validators';
import { loadSecretResponsePageData } from '$lib/server/secret-requests';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => ({
	form: await secretResponseFormValidator(),
	...(await loadSecretResponsePageData(params.requestIdHash))
});

export const actions: Actions = {
	default: postSecretResponse
};
