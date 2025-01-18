import { error } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { hashPassword } from '$lib/crypto';
import { db } from '$lib/server/db';
import { secret } from '$lib/server/db/schema';
import { secretTextFormSchema } from '$lib/validators/formSchemas';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(secretTextFormSchema(100_000))) // Limit needs to be bigger b/c of encryption.
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event.request, zod(secretTextFormSchema()));

		const { text, password, secretIdHash, meta } = form.data;
		let passwordHash;

		if (!form.valid) {
			return fail(400, { form });
		}

		const expiresAt = new Date(Date.now() + 1000 * 60 * 1); // 10 minutes

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
		} catch (e) {
			console.error(e);
			error(500, `Something went wrong. Couldn't save secret.`);
		}

		return { form };
	}
};
