import { eq } from 'drizzle-orm';
import { type Infer, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { ReadReceiptOptions, ThemeOptions } from '$lib/data/enums';
import { db } from '$lib/server/db';
import { userSettings } from '$lib/server/db/schema';
import {
	apiKeyFormSchema,
	type EmailFormSchema,
	emailFormSchema,
	type EmailVerificationCodeFormSchema,
	emailVerificationCodeFormSchema,
	secretFormSchema,
	settingsFormSchema,
	type SignInFormSchema,
	signInFormSchema,
	themeFormSchema,
	userFormSchema
} from '$lib/validators/formSchemas';

export const secretFormValidator = async () => await superValidate(zod4(secretFormSchema()));

// Auth
export const emailFormValidator = async () => await superValidate(zod4(emailFormSchema())); // Used for login, signup, password reset

export const loginPasswordFormValidator = async (defaultValues: Partial<Infer<SignInFormSchema>>) =>
	await superValidate(defaultValues, zod4(signInFormSchema()), {
		errors: false
	});

export const resendEmailVerificationFormValidator = async (
	defaultValues: Partial<EmailFormSchema>
) =>
	await superValidate(defaultValues, zod4(emailFormSchema()), {
		errors: false,
		id: 'resend-form'
	});

export const emailVerificationFormValidator = async (
	defaultValues: Partial<Infer<EmailVerificationCodeFormSchema>>
) =>
	await superValidate(defaultValues, zod4(emailVerificationCodeFormSchema()), {
		errors: false
	});

// Settings
export const themeFormValidator = async (user: App.Locals['user']) =>
	await superValidate(
		{
			themeOption: user?.preferences?.themeColor || ThemeOptions.PINK
		},
		zod4(themeFormSchema())
	);

export const settingsFormValidator = async (user: App.Locals['user']) => {
	if (!user) {
		throw new Error('User is undefined.');
	}

	const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, user.id));

	return await superValidate(
		{
			readReceiptOption: settings?.readReceipt || ReadReceiptOptions.NONE,
			email: settings?.email || user.email || '',
			ntfyEndpoint: settings?.ntfyEndpoint || ''
		},
		zod4(settingsFormSchema())
	);
};

// User
export const userFormValidator = async (user: App.Locals['user']) => {
	return await superValidate(
		{
			name: user?.name || ''
		},
		zod4(userFormSchema()),
		{ errors: false }
	);
};

export const apiKeyFormValidator = async () =>
	await superValidate(zod4(apiKeyFormSchema()), {
		id: 'api-token-form'
	});
