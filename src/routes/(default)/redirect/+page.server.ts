import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { secretFormSchema } from '$lib/validators/formSchemas';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(secretFormSchema()))
	};
};

export { actions } from '../+page.server';
