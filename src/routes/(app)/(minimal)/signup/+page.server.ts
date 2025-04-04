import { redirectLocalized } from '$lib/i18n';
import { signupWithEmail } from '$lib/server/form/actions';
import { emailFormValidator } from '$lib/server/form/validators';

// import { userInsertSchema } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirectLocalized(307, '/account');
	}
	return {
		signupForm: await emailFormValidator()
	};
};

export const actions: Actions = {
	signupWithEmail: signupWithEmail
};
