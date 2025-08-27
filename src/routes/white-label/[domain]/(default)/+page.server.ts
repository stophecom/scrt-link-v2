import { error } from '@sveltejs/kit';

import { isOriginalHost } from '$lib/app-routing';
import { redirectLocalized } from '$lib/i18n';
import { getLocale } from '$lib/paraglide/runtime';
import { postSecret } from '$lib/server/form/actions';
import { secretFormValidator } from '$lib/server/form/validators';
import { getWhiteLabelSiteByHost } from '$lib/server/whiteLabelSite';
import type { LocalizedWhiteLabelMessage } from '$lib/types';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url, locals }) => {
	const locale = getLocale();

	const whiteLabel = await getWhiteLabelSiteByHost(params.domain);

	if (!whiteLabel) {
		throw error(500, `No data for ${params.domain} found.`);
	}

	if (!isOriginalHost(url.host) && !whiteLabel.published) {
		throw error(403, `Page is not published.`);
	}

	// If site is private, force login
	if (whiteLabel.private && !locals.user) {
		return redirectLocalized(307, '/login');
	}

	return {
		secretForm: await secretFormValidator(),
		title: (whiteLabel?.messages as LocalizedWhiteLabelMessage)?.[locale]?.title || '',
		lead: (whiteLabel?.messages as LocalizedWhiteLabelMessage)?.[locale]?.lead || '',
		description: (whiteLabel?.messages as LocalizedWhiteLabelMessage)?.[locale]?.description || '',
		imprint: (whiteLabel?.messages as LocalizedWhiteLabelMessage)?.[locale]?.imprint || '',
		enabledSecretTypes: whiteLabel.enabledSecretTypes
	};
};

export const actions: Actions = {
	postSecret: postSecret
};
