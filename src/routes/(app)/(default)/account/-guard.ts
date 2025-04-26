import type { Guard } from 'svelte-guard';

export const guard: Guard = async ({ locals }) => {
	if (!locals.user) {
		return false; // Access denied
	}
	return true;
};

// Optional redirect for unauthorized users
// this will be the default for nested sub-routes
export const reroute = '/signup';
