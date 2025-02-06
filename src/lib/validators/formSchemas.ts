import { z } from 'zod';

import { getExpiresAtOptions, getReadReceiptOptions } from '$lib/data/secretSettings';
import * as m from '$lib/paraglide/messages.js';

// Typescript
const expiresAtOptions = getExpiresAtOptions();
type Property = (typeof expiresAtOptions)[number]['value'];
const expiresAtEnum: [Property, ...Property[]] = [
	expiresAtOptions[0].value,
	...expiresAtOptions.slice(1).map((p) => p.value)
];

const readReceiptOptions = getReadReceiptOptions();
type ReadReceiptProperty = (typeof readReceiptOptions)[number]['value'];
const readReceiptEnum: [ReadReceiptProperty, ...ReadReceiptProperty[]] = [
	readReceiptOptions[0].value,
	...readReceiptOptions.slice(1).map((p) => p.value)
];

// We return functions in order for translations to work as expected.
export const emailFormSchema = () =>
	z.object({
		email: z.string().email(m.every_chunky_osprey_zip())
	});

export const emailVerificationCodeFormSchema = () =>
	z.object({
		email: z.string().email(),
		code: z.string().length(6)
	});

export const passwordFormSchema = () =>
	z.object({
		password: z.string().min(8, m.aloof_careful_trout_dine()).max(255)
	});

export const signInFormSchema = () =>
	z.object({
		email: z.string().email(),
		password: z.string().min(6).max(255)
	});

export const secretFormSchema = (limit: number = 100_000) =>
	z.object({
		secretIdHash: z.string(),
		publicKey: z.string(),
		meta: z.string(),
		content: z.string().min(1).max(limit),
		password: z.string().min(6).max(255).optional(),
		expiresAt: z.enum(expiresAtEnum).default(expiresAtEnum[expiresAtEnum.length - 2])
	});

export const settingsFormSchema = () =>
	z
		.object({
			readReceiptOption: z.enum(readReceiptEnum),
			email: z.string().email().optional().or(z.literal('')), // https://github.com/colinhacks/zod/issues/310#issuecomment-794533682
			ntfyEndpoint: z.string().optional()
		})
		.refine(
			(data) => {
				return (
					data.readReceiptOption !== 'email' || (data.readReceiptOption === 'email' && data.email)
				);
			},
			{
				message: m.least_heavy_panda_create(),
				path: ['email'] // Target
			}
		)
		.refine(
			(data) => {
				return (
					data.readReceiptOption !== 'ntfy' ||
					(data.readReceiptOption === 'ntfy' && data.ntfyEndpoint)
				);
			},
			{
				message: m.least_heavy_panda_create(),
				path: ['ntfyEndpoint'] // Target
			}
		);

export const revealSecretFormSchema = () =>
	z.object({
		secretIdHash: z.string(),
		password: z.string().min(6).max(255)
	});

export type SignInFormSchema = ReturnType<typeof signInFormSchema>;
export type EmailFormSchema = ReturnType<typeof emailFormSchema>;
export type CodeFormSchema = ReturnType<typeof emailVerificationCodeFormSchema>;
export type PasswordFormSchema = ReturnType<typeof passwordFormSchema>;
export type SecretTextFormSchema = ReturnType<typeof secretFormSchema>;
export type SettingsFormSchema = ReturnType<typeof settingsFormSchema>;
export type RevealSecretFormSchema = ReturnType<typeof revealSecretFormSchema>;

// export const RegisterUserZodSchema = createInsertSchema(usersTable, {
// 	name: (schema) =>
// 		schema.name
// 			.min(MIN_NAME_LENGTH, NAME_MIN_ERROR_MESSAGE)
// 			.max(MAX_NAME_LENGTH, NAME_MAX_ERROR_MESSAGE),

// 	email: (schema) => schema.email.email().max(MAX_EMAIL_LENGTH, EMAIL_MAX_ERROR_MESSAGE),

// 	password: (schema) =>
// 		schema.password
// 			.min(MIN_PASSWORD_LENGTH, PASSWORD_MIN_ERROR_MESSAGE)
// 			.max(MAX_PASSWORD_LENGTH, PASSWORD_MAX_ERROR_MESSAGE)
// });

// export const UserLoginZodSchema = RegisterUserZodSchema.pick({ email: true, password: true });
