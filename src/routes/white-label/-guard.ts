import { error } from '@sveltejs/kit';
import type { Guard } from 'svelte-guard';

import { isOriginalHostname } from '$lib/app-routing';
import { redirectLocalized } from '$lib/i18n';
import { isMemberOfOrganization } from '$lib/server/organization';

export const guard: Guard = async ({ params, locals, url }) => {
	const hostNameFromParams = params.domain;

	if (!hostNameFromParams) {
		throw error(500, `No white-label domain parameter found`);
	}

	const whiteLabel = locals.whiteLabelSite;

	if (!whiteLabel) {
		throw error(500, `No data for ${hostNameFromParams} found.`);
	}

	// We don't want to expose white-label pages via /white-label/example.com.
	// Personal sites: only the owner. Org sites: verified org members only.
	if (isOriginalHostname(url.hostname)) {
		const userId = locals.user?.id;
		if (!userId) {
			redirectLocalized(307, '/login');
			return true;
		}

		const isPersonalOwner = whiteLabel.userId !== null && userId === whiteLabel.userId;
		const isOrgMember =
			whiteLabel.userId === null &&
			whiteLabel.organizationId !== null &&
			(await isMemberOfOrganization(userId, whiteLabel.organizationId));

		if (!isPersonalOwner && !isOrgMember) {
			redirectLocalized(307, '/login');
		}
	}

	return true;
};
