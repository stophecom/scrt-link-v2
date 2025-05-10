import { z } from 'zod';

import { pemFooter, pemHeader } from '$lib/client/web-crypto';
import { getSupportedLocales } from '$lib/data/supportedLocales';
import { m } from '$lib/paraglide/messages.js';

import { ReadReceiptOptions, SecretType, ThemeOptions } from '../data/enums';
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
const expiresInOptionsValues = getExpiresInOptions().map(({ value }) => value);
const defaultExpiresInValue = expiresInOptionsValues[(expiresInOptionsValues.length / 2) | 0];
export const secretFormSchema = () =>
	z.object({
		secretIdHash: z.string().length(64), // See sha256Hash() in web-crypto.ts
		publicKey: z.string().length(212).startsWith(pemHeader).endsWith(pemFooter), // See exportPublicKey() in web-crypto.ts
		meta: z.string().max(100_000), // Validation is loose by design. Meta is encrypted on client.
		content: z.string().min(1, m.orange_each_goldfish_amuse()).max(100_000), // Validation is loose by design. Content is encrypted on client.
		publicNote: z.string().max(150).optional(),
		password: z
			.string()
			.min(6, m.aloof_careful_trout_dine({ number: 6 }))
			.max(512)
			.optional(),
		expiresIn: z
			.union(
				[
					z.literal(expiresInOptionsValues[0]), // Making TS happy
					z.literal(expiresInOptionsValues[1]),
					...expiresInOptionsValues.slice(2).map((item) => z.literal(item))
				],
				{
					errorMap: (error) => {
						if (error.code === 'invalid_union') {
							return {
								message: `Valid options are: ${expiresInOptionsValues.join(', ')}`
							};
						}
						return {
							message: error.message ?? 'Unknown validation error.'
						};
					}
				}
			)

			.default(defaultExpiresInValue)
	});

export const themeFormSchema = () => z.object({ themeOption: z.nativeEnum(ThemeOptions) });

export const userFormSchema = () =>
	z.object({
		name: z
			.string()
			.min(2, m.minor_noble_cowfish_relish({ number: 2 }))
			.max(30)
	});

export const whiteLabelMetaSchema = () =>
	z.object({
		customDomain: z.string().max(30),
		name: z.string().max(30),
		locale: z.enum(getSupportedLocales() as [string, ...string[]]),
		enabledSecretTypes: z
			.array(z.nativeEnum(SecretType))
			.refine((value) => value.some((item) => item), {
				message: 'You have to select at least one item.'
			})
	});

export const whiteLabelSiteSchema = () =>
	z.object({
		title: z.string().max(50).nullable().optional(),
		lead: z.string().max(150).nullable().optional(),
		description: z.string().max(5000).nullable().optional(),
		imprint: z.string().nullable().optional(),
		primaryColor: z.string().optional(),
		logo: z.string().nullable().optional(),
		logoDarkMode: z.string().nullable().optional(),
		appIcon: z.string().nullable().optional(),
		ogImage: z.string().nullable().optional(),
		published: z.boolean().optional().default(false)
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

export const apiKeyFormSchema = () =>
	z.object({
		keyId: z.string().optional(),
		description: z.string().max(50).optional()
	});

// @todo infer types by default
export type SignInFormSchema = ReturnType<typeof signInFormSchema>;
export type EmailFormSchema = ReturnType<typeof emailFormSchema>;
export type EmailVerificationCodeFormSchema = ReturnType<typeof emailVerificationCodeFormSchema>;
export type PasswordFormSchema = ReturnType<typeof passwordFormSchema>;
export type DeleteAccountSchema = ReturnType<typeof deleteAccountSchema>;
export type SecretFormSchema = z.infer<ReturnType<typeof secretFormSchema>>;
export type UserFormSchema = z.infer<ReturnType<typeof userFormSchema>>;
export type SettingsFormSchema = ReturnType<typeof settingsFormSchema>;
export type ThemeFormSchema = ReturnType<typeof themeFormSchema>;
export type RevealSecretFormSchema = z.infer<ReturnType<typeof revealSecretFormSchema>>;
export type ContactFormSchema = ReturnType<typeof contactFormSchema>;
export type ApiTokenFormSchema = ReturnType<typeof apiKeyFormSchema>;
export type WhiteLabelMetaSchema = z.infer<ReturnType<typeof whiteLabelMetaSchema>>;
export type WhiteLabelSiteSchema = z.infer<ReturnType<typeof whiteLabelSiteSchema>>;
