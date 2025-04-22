import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { redirectLocalized } from '$lib/i18n';
import { getLocale } from '$lib/paraglide/runtime';
import { db } from '$lib/server/db';
import { whiteLabelSite } from '$lib/server/db/schema';
import { saveWhiteLabelSite } from '$lib/server/form/actions';
import type { LocalizedWhiteLabelMessage, Theme } from '$lib/types';
import { whiteLabelSiteSchema } from '$lib/validators/formSchemas';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirectLocalized(307, '/signup');
	}

	const customDomain = event.params.domain;

	const user = event.locals.user;
	const locale = getLocale();

	const [whiteLabel] = await db
		.select()
		.from(whiteLabelSite)
		.where(eq(whiteLabelSite.userId, user.id));

	if (whiteLabel.customDomain !== customDomain) {
		return error(405, `Not allowed to edit site with domain ${customDomain}`);
	}

	const whiteLabelSiteFormValidator = async () => {
		return await superValidate(
			{
				title: (whiteLabel?.messages as LocalizedWhiteLabelMessage)?.[locale]?.title || '',
				lead: (whiteLabel?.messages as LocalizedWhiteLabelMessage)?.[locale]?.lead || '',
				description:
					(whiteLabel?.messages as LocalizedWhiteLabelMessage)?.[locale]?.description || '',
				imprint: (whiteLabel?.messages as LocalizedWhiteLabelMessage)?.[locale]?.imprint || '',
				logo: whiteLabel?.logo || undefined,
				appIcon: whiteLabel?.appIcon || undefined,
				ogImage: whiteLabel?.ogImage || undefined,
				primaryColor: (whiteLabel.theme as Theme)?.primaryColor || '#000000'
			},
			zod(whiteLabelSiteSchema())
		);
	};

	return {
		whiteLabelSiteForm: await whiteLabelSiteFormValidator()
	};
};

export const actions: Actions = {
	saveWhiteLabelSite: saveWhiteLabelSite
};
