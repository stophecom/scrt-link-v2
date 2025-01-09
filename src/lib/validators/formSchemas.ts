import { z } from 'zod';

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
		password: z
			.string()
			.min(8, m.aloof_careful_trout_dine())
			.max(255)
			.refine((password) => /[A-Z]/.test(password), {
				message: 'Include at least one uppercase character.'
			})
			.refine((password) => /[a-z]/.test(password), {
				message: 'Include at least one lowercase character.'
			})
			.refine((password) => /[0-9]/.test(password), {
				message: 'Include at least one integer: 0-9'
			})
			.refine((password) => /[!@#$%^&*]/.test(password), {
				message: 'Include at least one special character: !@#$%^&*'
			})
	});

export const signInFormSchema = () =>
	z.object({
		email: z.string().email(),
		password: z.string().min(6).max(255)
	});

export const secretTextFormSchema = (limit: number = 150) =>
	z.object({
		text: z.string().min(1).max(limit)
	});

export type SignInFormSchema = ReturnType<typeof signInFormSchema>;
export type EmailFormSchema = ReturnType<typeof emailFormSchema>;
export type CodeFormSchema = ReturnType<typeof emailVerificationCodeFormSchema>;
export type PasswordFormSchema = ReturnType<typeof passwordFormSchema>;
export type SecretTextFormSchema = ReturnType<typeof secretTextFormSchema>;

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
