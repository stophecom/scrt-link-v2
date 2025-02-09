import { z } from 'zod';

import { ReadReceiptOptions } from '$lib/data/schemaEnums';
import { getExpiresInOptions } from '$lib/data/secretSettings';
import * as m from '$lib/paraglide/messages.js';

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
		password: z.string().min(6).max(512)
	});

// Set default value for expiresIn to the "medium" option.
const expiresInOptions = getExpiresInOptions();
const defaultExpiresInValue = expiresInOptions[(expiresInOptions.length / 2) | 0];
export const secretFormSchema = () =>
	z.object({
		secretIdHash: z.string().max(512),
		publicKey: z.string().max(512),
		meta: z.string().max(100_000),
		content: z.string().min(1).max(100_000),
		password: z.string().min(6).max(512).optional(),
		expiresIn: z.number().default(defaultExpiresInValue.value)
	});

export const settingsFormSchema = () =>
	z
		.object({
			readReceiptOption: z.nativeEnum(ReadReceiptOptions),
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
