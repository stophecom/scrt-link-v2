import { getLocale } from '$lib/paraglide/runtime';
import type { LocalizedWhiteLabelMessage } from '$lib/types';

import type { PageServerLoad } from './$types';

// Preview/index page for the secret request flow. The real recipient page lives at
// /r/[requestIdHash]; this bare route exists so the white-label editor can preview the
// request texts, so it intentionally renders regardless of the enableSecretRequests flag.
export const load: PageServerLoad = async ({ locals }) => {
	const locale = getLocale();
	const messages = locals.whiteLabelSite?.messages as LocalizedWhiteLabelMessage | undefined;

	return {
		title: messages?.[locale]?.request?.title || '',
		lead: messages?.[locale]?.request?.lead || ''
	};
};
