import { error } from '@sveltejs/kit';

import { redirectLocalized } from '$lib/i18n';
import { m } from '$lib/paraglide/messages.js';
import { getOrgStats } from '$lib/server/analytics';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const user = locals.user;
	if (!user) return redirectLocalized(307, '/signup');

	const { org, isOrgOwner } = await parent();

	if (!isOrgOwner) {
		return error(403, 'Only org owners can view logs and statistics.');
	}

	const stats = await getOrgStats(org.id);

	return {
		stats,
		pageTitle: m.flat_warm_logs_title()
	};
};
