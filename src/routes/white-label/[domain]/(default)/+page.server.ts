import { redirectLocalized } from '$lib/i18n';
import { getLocale } from '$lib/paraglide/runtime';
import { postSecret } from '$lib/server/form/actions';
import { secretFormValidator } from '$lib/server/form/validators';
import { getWhiteLabelSiteByHost } from '$lib/server/whiteLabelSite';
import type { LocalizedWhiteLabelMessage } from '$lib/types';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const locale = getLocale();

	const hostNameFromUrl = params.domain;
	const whiteLabel = await getWhiteLabelSiteByHost(hostNameFromUrl);

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
