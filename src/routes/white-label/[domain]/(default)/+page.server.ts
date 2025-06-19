import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import { isOriginalHost } from '$lib/app-routing';
import { getLocale } from '$lib/paraglide/runtime';
import { db } from '$lib/server/db';
import { whiteLabelSite } from '$lib/server/db/schema';
import { postSecret } from '$lib/server/form/actions';
import { secretFormValidator } from '$lib/server/form/validators';
import type { LocalizedWhiteLabelMessage } from '$lib/types';

import type { Actions, PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ params, url }) => {
	const locale = getLocale();

	const [whiteLabel] = await db
		.select()
		.from(whiteLabelSite)
		.where(eq(whiteLabelSite.customDomain, params.domain));

	if (!whiteLabel) {
		throw error(500, `No data for ${params.domain} found.`);
	}

	if (!isOriginalHost(url.host) && !whiteLabel.published) {
		throw error(403, `Page is not published.`);
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
