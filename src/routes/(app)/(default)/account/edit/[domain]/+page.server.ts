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

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return redirectLocalized(307, '/signup');
	}

	const user = locals.user;
	const locale = getLocale();

	const [whiteLabel] = await db
		.select()
		.from(whiteLabelSite)
		.where(eq(whiteLabelSite.userId, user.id));

	if (!whiteLabel) {
		return error(404, 'No white-label website found.');
	}

	const whiteLabelSiteFormValidator = async () => {
		return await superValidate(
			{
				title: (whiteLabel?.messages as LocalizedWhiteLabelMessage)?.[locale]?.title || '',
				lead: (whiteLabel?.messages as LocalizedWhiteLabelMessage)?.[locale]?.lead || '',
				description:
					(whiteLabel?.messages as LocalizedWhiteLabelMessage)?.[locale]?.description || '',
				imprint: (whiteLabel?.messages as LocalizedWhiteLabelMessage)?.[locale]?.imprint || '',
				logo: whiteLabel?.logo,
				logoDarkMode: whiteLabel?.logoDarkMode,
				appIcon: whiteLabel?.appIcon,
				ogImage: whiteLabel?.ogImage,
				primaryColor: (whiteLabel.theme as Theme)?.primaryColor || '#000000',
				published: whiteLabel.published || false
			},
			zod(whiteLabelSiteSchema())
		);
	};

	return {
		domain: whiteLabel.customDomain,
		whiteLabelSiteForm: await whiteLabelSiteFormValidator()
	};
};

export const actions: Actions = {
	saveWhiteLabelSite: saveWhiteLabelSite
};
