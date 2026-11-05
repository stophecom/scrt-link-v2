import { count, eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { redirectLocalized } from '$lib/i18n';
import { db } from '$lib/server/db';
import { secretRequest, userEncryptionKey } from '$lib/server/db/schema';
import { resetEncryption, verifyRecoveryKey } from '$lib/server/form/actions';
import { recoveryVerifyFormSchema, resetEncryptionSchema } from '$lib/validators/formSchemas';

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

	// Shown on the "I lost my recovery key" confirmation, so the user knows
	// exactly what resetting costs them.
	const [requestCount] = await db
		.select({ value: count() })
		.from(secretRequest)
		.where(eq(secretRequest.userId, user.id));

	return {
		user,
		hasRecoveryKey: !!keyStore?.recoveryKeyHash,
		secretRequestCount: requestCount?.value ?? 0,
		form: await superValidate(zod4(recoveryVerifyFormSchema()), { id: 'recovery-form' }),
		resetForm: await superValidate(zod4(resetEncryptionSchema()), { id: 'reset-encryption-form' })
	};
}

export const actions: Actions = {
	verifyRecoveryKey,
	resetEncryption
};
