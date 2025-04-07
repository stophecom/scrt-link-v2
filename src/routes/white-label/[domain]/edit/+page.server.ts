import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { redirectLocalized } from '$lib/i18n';
import { db } from '$lib/server/db';
import { whiteLabelSite } from '$lib/server/db/schema';
import { postSecret } from '$lib/server/form/actions';
import { saveWhiteLabelSite } from '$lib/server/form/actions';
import { secretFormValidator } from '$lib/server/form/validators';
import type { Theme } from '$lib/types';
import { whiteLabelSiteSchema } from '$lib/validators/formSchemas';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirectLocalized(307, '/signup');
	}
	const user = event.locals.user;

	const validator = async () => {
		const [whiteLabel] = await db
			.select()
			.from(whiteLabelSite)
			.where(eq(whiteLabelSite.userId, user.id));

		return await superValidate(
			{
				title: whiteLabel?.title || '',
				lead: whiteLabel?.lead || '',
				logo: whiteLabel?.logo || '',
				primaryColor: (whiteLabel.theme as Theme)?.primaryColor || '#000000'
			},
			zod(whiteLabelSiteSchema())
		);
	};

	return {
		whiteLabelSiteForm: await validator(),
		secretForm: await secretFormValidator()
	};
};

export const actions: Actions = {
	saveWhiteLabelSite: saveWhiteLabelSite,
	postSecret: postSecret
};
