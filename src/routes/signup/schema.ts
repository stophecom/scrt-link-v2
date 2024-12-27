import { z } from 'zod';

export const formSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6).max(255),
	hasTermsAccepted: z.boolean().default(false)
});

export type FormSchema = typeof formSchema;
