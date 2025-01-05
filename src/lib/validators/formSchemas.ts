import { z } from 'zod';

export const signupFormSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6).max(255)
});

export type SignupFormSchema = typeof signupFormSchema;

export const emailFormSchema = z.object({
	email: z.string().email()
});

export const emailVerificationCodeFormSchema = z.object({
	email: z.string().email(),
	code: z.string().length(6)
});

export const passwordFormSchema = z.object({
	password: z
		.string()
		.min(8)
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

export type EmailFormSchema = typeof emailFormSchema;
export type CodeFormSchema = typeof emailVerificationCodeFormSchema;
export type PasswordFormSchema = typeof passwordFormSchema;

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
