import { hash } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { error, redirect } from '@sveltejs/kit';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { signupFormSchema } from '$lib/formSchemas';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { checkIfUserExists } from '$lib/server/helpers';

// import { userInsertSchema } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/account');
	}
	return {
		form: await superValidate(zod(signupFormSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event.request, zod(signupFormSchema));

		const { email, password } = form.data;

		// Server side validation
		// @todo check if additional DB Schema validation is necessary
		// console.log(userInsertSchema.parse({ username }));
		if (!form.valid) {
			return fail(400, { form });
		}

		const userId = generateUserId();
		const passwordHash = await hash(password, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		// Check existing email
		if (await checkIfUserExists(email)) {
			// Technically we can use "return setError". For some reason this doesn't work with "use:enhance" enabled.
			setError(form, 'email', 'E-mail already exists.');
			return { form };
		}

		// Save new user and create session
		try {
			await db.insert(table.users).values({ id: userId, username: email, passwordHash });

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, userId);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (e) {
			console.error(e);
			error(500, 'Failed to register');
		}

		return redirect(302, '/account');
	}
};

function generateUserId() {
	// ID with 120 bits of entropy, or about the same as UUID v4.
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const id = encodeBase32LowerCase(bytes);
	return id;
}
