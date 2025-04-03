import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	return {
		user: event.locals.user,
		baseUrl: `http://${event.params.domain}`,
		domain: event.params.domain
	};
};
