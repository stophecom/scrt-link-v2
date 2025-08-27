import { eq } from 'drizzle-orm';
import { type Infer, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

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

export const secretFormValidator = async () => await superValidate(zod(secretFormSchema()));

// Auth
export const emailFormValidator = async () => await superValidate(zod(emailFormSchema())); // Used for login, signup, password reset

export const loginPasswordFormValidator = async (defaultValues: Partial<Infer<SignInFormSchema>>) =>
	await superValidate(defaultValues, zod(signInFormSchema()), {
		errors: false
	});

export const resendEmailVerificationFormValidator = async (
	defaultValues: Partial<EmailFormSchema>
) =>
	await superValidate(defaultValues, zod(emailFormSchema()), {
		errors: false,
		id: 'resend-form'
	});

export const emailVerificationFormValidator = async (
	defaultValues: Partial<Infer<EmailVerificationCodeFormSchema>>
) =>
	await superValidate(defaultValues, zod(emailVerificationCodeFormSchema()), {
		errors: false
	});

// Settings
export const themeFormValidator = async (user: App.Locals['user']) =>
	await superValidate(
		{
			themeOption: user?.preferences?.themeColor || ThemeOptions.PINK
		},
		zod(themeFormSchema())
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
		zod(settingsFormSchema())
	);
};

// User
export const userFormValidator = async (user: App.Locals['user']) => {
	return await superValidate(
		{
			name: user?.name || ''
		},
		zod(userFormSchema()),
		{ errors: false }
	);
};

export const apiKeyFormValidator = async () =>
	await superValidate(zod(apiKeyFormSchema()), {
		id: 'api-token-form'
	});
