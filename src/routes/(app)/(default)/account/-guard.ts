import type { Guard } from 'svelte-guard';

import { redirectLocalized } from '$lib/i18n';

export const guard: Guard = async ({ locals }) => {
	if (!locals.user) {
		redirectLocalized(307, '/signup');
	}
	return true;
};
