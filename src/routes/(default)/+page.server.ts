import { error } from '@sveltejs/kit';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { hashPassword } from '$lib/crypto';
import { db } from '$lib/server/db';
import { secret } from '$lib/server/db/schema';
import { secretTextFormSchema } from '$lib/validators/formSchemas';

import type { Actions, PageServerLoad } from './$types';

const CHARACTER_LIMIT = 100_000;

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(secretTextFormSchema(CHARACTER_LIMIT))) // Limit needs to be bigger b/c of encryption.
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event.request, zod(secretTextFormSchema(CHARACTER_LIMIT)));

		const { text, password, secretIdHash, meta } = form.data;

		if (!form.valid) {
			return fail(400, { form });
		}

		const expiresAt = new Date(Date.now() + 1000 * 60 * 1); // 10 minutes
		let passwordHash;

		try {
			if (password) {
				passwordHash = await hashPassword(password);
			}
			await db.insert(secret).values({
				secretIdHash,
				meta,
				content: text,
				passwordHash,
				expiresAt
			});

			return message(form, { status: 'success', title: 'All went well' });
		} catch (e) {
			console.error(e);
			error(500, `Couldn't save secret.`);
		}
	}
};
