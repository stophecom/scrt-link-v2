import { error } from '@sveltejs/kit';
import type { Guard } from 'svelte-guard';

import { isOriginalHostname } from '$lib/app-routing';
import { redirectLocalized } from '$lib/i18n';
import { getWhiteLabelSiteByHost } from '$lib/server/whiteLabelSite';

export const guard: Guard = async ({ params, locals, url }) => {
	const hostNameFromParams = params.domain;

	if (!hostNameFromParams) {
		throw error(500, `No white-label domain parameter found`);
	}

	const whiteLabel = await getWhiteLabelSiteByHost(hostNameFromParams);

	if (!whiteLabel) {
		throw error(500, `No data for ${hostNameFromParams} found.`);
	}

	// We don't want to expose white-label pages via /white-label/example.com
	if (isOriginalHostname(url.hostname) && locals.user?.id !== whiteLabel.userId) {
		redirectLocalized(307, '/login');
	}

	return true;
};
