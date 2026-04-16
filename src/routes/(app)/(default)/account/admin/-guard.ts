import type { Guard } from 'svelte-guard';

import { redirectLocalized } from '$lib/i18n';

export const guard: Guard = async ({ locals }) => {
	if (locals.user?.role !== 'admin') {
		redirectLocalized(307, '/');
	}
	return true;
};
