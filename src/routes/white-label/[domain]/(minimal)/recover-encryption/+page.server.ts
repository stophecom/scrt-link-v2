import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { redirectLocalized } from '$lib/i18n';
import { db } from '$lib/server/db';
import { userEncryptionKey } from '$lib/server/db/schema';
import { verifyRecoveryKey } from '$lib/server/form/actions';
import { recoveryVerifyFormSchema } from '$lib/validators/formSchemas';

import type { Actions, RequestEvent } from './$types';

export async function load(event: RequestEvent) {
	const user = event.locals.user;
	if (!user) {
		return redirectLocalized(307, '/login');
	}

	if (!user.encryptionEnabled) {
		return redirectLocalized(302, '/set-password');
	}

	const [keyStore] = await db
		.select({
			recoveryKeyHash: userEncryptionKey.recoveryKeyHash
		})
		.from(userEncryptionKey)
		.where(eq(userEncryptionKey.userId, user.id))
		.limit(1);

	return {
		user,
		hasRecoveryKey: !!keyStore?.recoveryKeyHash,
		form: await superValidate(zod4(recoveryVerifyFormSchema()), { id: 'recovery-form' })
	};
}

export const actions: Actions = {
	verifyRecoveryKey
};
