import { z } from 'zod';

import { m } from '$lib/paraglide/messages.js';

import { ReadReceiptOptions, ThemeOptions } from '../data/enums';
import { getExpiresInOptions } from '../data/secretSettings';

// We return functions in order for translations to work as expected.
export const emailFormSchema = () =>
	z.object({
		email: z.string().toLowerCase().email(m.every_chunky_osprey_zip())
	});

export const emailVerificationCodeFormSchema = () =>
	z.object({
		email: z.string().toLowerCase().email(m.every_chunky_osprey_zip()),
		code: z.string().length(6, { message: m.arable_such_jay_swim({ number: 6 }) })
	});

export const passwordFormSchema = () =>
	z.object({
		password: z
			.string()
			.min(8, m.aloof_careful_trout_dine({ number: 8 }))
			.max(255)
	});

export const deleteAccountSchema = () =>
	z.object({
		confirm: z.boolean().refine((val) => val === true, {
			message: m.gross_glad_marlin_cure()
		})
	});

export const signInFormSchema = () =>
	z.object({
		email: z.string().toLowerCase().email(m.every_chunky_osprey_zip()),
		password: z
			.string()
			.min(6, m.aloof_careful_trout_dine({ number: 6 }))
			.max(512)
	});

// Set default value for expiresIn to the "medium" option.
const expiresInOptions = getExpiresInOptions();
const defaultExpiresInValue = expiresInOptions[(expiresInOptions.length / 2) | 0];
export const secretFormSchema = () =>
	z.object({
		secretIdHash: z.string().max(512),
		publicKey: z.string().max(512),
		meta: z.string().max(100_000),
		content: z.string().min(1, m.orange_each_goldfish_amuse()).max(100_000),
		password: z
			.string()
			.min(6, m.aloof_careful_trout_dine({ number: 6 }))
			.max(512)
			.optional(),
		expiresIn: z.number().default(defaultExpiresInValue.value)
	});

export const themeFormSchema = () => z.object({ themeOption: z.nativeEnum(ThemeOptions) });

export const userFormSchema = () =>
	z.object({
		name: z
			.string()
			.min(2, m.minor_noble_cowfish_relish({ number: 2 }))
			.max(30)
	});

export const settingsFormSchema = () =>
	z
		.object({
			readReceiptOption: z.nativeEnum(ReadReceiptOptions),
			email: z
				.string()
				.toLowerCase()
				.email(m.every_chunky_osprey_zip())
				.optional()
				.or(z.literal('')), // https://github.com/colinhacks/zod/issues/310#issuecomment-794533682
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
		password: z
			.string()
			.min(6, m.aloof_careful_trout_dine({ number: 6 }))
			.max(255)
	});

export const contactFormSchema = () =>
	z.object({
		email: z.string().toLowerCase().email(m.every_chunky_osprey_zip()),
		content: z.string().min(30, m.soft_proof_mink_pinch({ number: 30 })),
		recaptchaToken: z.string()
	});

export type SignInFormSchema = ReturnType<typeof signInFormSchema>;
export type EmailFormSchema = ReturnType<typeof emailFormSchema>;
export type EmailVerificationCodeFormSchema = ReturnType<typeof emailVerificationCodeFormSchema>;
export type PasswordFormSchema = ReturnType<typeof passwordFormSchema>;
export type DeleteAccountSchema = ReturnType<typeof deleteAccountSchema>;
export type SecretTextFormSchema = ReturnType<typeof secretFormSchema>;
export type UserFormSchema = ReturnType<typeof userFormSchema>;
export type SettingsFormSchema = ReturnType<typeof settingsFormSchema>;
export type ThemeFormSchema = ReturnType<typeof themeFormSchema>;
export type RevealSecretFormSchema = ReturnType<typeof revealSecretFormSchema>;
export type ContactFormSchema = ReturnType<typeof contactFormSchema>;
