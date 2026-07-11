import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { getWhiteLabelPageTexts } from '$lib/server/whiteLabelSite';
import { revealSecretFormSchema } from '$lib/validators/formSchemas';

import { actions } from '../../../../(app)/(default)/s/+page.server';
import type { PageServerLoad } from './$types';

export { actions };

export const load: PageServerLoad = async ({ locals }) => {
	return {
		form: await superValidate(zod4(revealSecretFormSchema())),
		...getWhiteLabelPageTexts(locals.whiteLabelSite, 'reception')
	};
};
