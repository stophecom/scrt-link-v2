import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import { type EmailVerificationRequest, emailVerificationRequest } from '$lib/server/db/schema';

import { generateOtp, scryptHash } from '../crypto';
import { db } from './db';

export async function createEmailVerificationRequest(
	email: string
): Promise<EmailVerificationRequest> {
	const expiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes

	const code = generateOtp();
	try {
		const hashedCode = await scryptHash(code);
		const [request] = await db
			.insert(emailVerificationRequest)
			.values({ codeHash: hashedCode, email, expiresAt })
			.returning();

		sendVerificationEmail(email, code);

		return request;
	} catch (e) {
		console.error(e);
		error(500, `Something went wrong. Couldn't send email verification code.`);
	}
}

export async function deleteEmailVerificationRequests(email: string) {
	return await db.delete(emailVerificationRequest).where(eq(emailVerificationRequest.email, email));
}

export function sendVerificationEmail(email: string, code: string): void {
	console.log(`To ${email}: Your verification code is ${code}`);
}
