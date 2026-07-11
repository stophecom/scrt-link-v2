import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { getLocale } from '$lib/paraglide/runtime';
import type { LocalizedWhiteLabelMessage } from '$lib/types';
import { revealSecretFormSchema } from '$lib/validators/formSchemas';

import { actions } from '../../../../(app)/(default)/s/+page.server';
import type { PageServerLoad } from './$types';

export { actions };

export const load: PageServerLoad = async ({ locals }) => {
	const locale = getLocale();
	const messages = locals.whiteLabelSite?.messages as LocalizedWhiteLabelMessage | undefined;

	return {
		form: await superValidate(zod4(revealSecretFormSchema())),
		title: messages?.[locale]?.reception?.title || '',
		lead: messages?.[locale]?.reception?.lead || ''
	};
};
