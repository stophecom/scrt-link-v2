import { redirectLocalized } from '$lib/i18n';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return redirectLocalized(301, '/account/secret-service');
};
