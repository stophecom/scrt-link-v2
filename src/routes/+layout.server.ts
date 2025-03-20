import { getBaseUrl } from '$lib/constants';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	return {
		user: event.locals.user,
		baseUrl: getBaseUrl(),
		pathname: event.url.pathname
	};
};
