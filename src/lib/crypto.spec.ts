import { assert, describe, expect, test } from 'vitest';

import {
	base64Decode,
	base64Encode,
	base64UrlSafeDecode,
	base64UrlSafeEncode,
	generateOtp,
	hashPassword,
	verifyPassword
} from './crypto';

describe('Nodes.js Crypto', () => {
	test('Base64 encode / decode', async () => {
		const message = 'Hello, world!';

		// Encode
		const base64 = base64Encode(message);
		expect(base64).equal('SGVsbG8sIHdvcmxkIQ==');

		const base64Decoded = base64Decode(base64);
		expect(base64Decoded).equal(message);

		// Encode URL-Safe
		const base64UrlSafe = base64UrlSafeEncode(base64);
		expect(base64UrlSafe).not.toContain('=');

		const original = base64Decode(base64UrlSafeDecode(base64UrlSafe));

		expect(original).equal(message);
	});

	test('Password hashing and verification', async () => {
		const password = 'foobar1234';

		const hashedPassword = await hashPassword(password);

		expect(hashedPassword).toHaveLength(164);

		const passwordVerified = await verifyPassword(password, hashedPassword);
		expect(passwordVerified).toBe(true);
	});

	test('Generate OTP', async () => {
		const otp1 = generateOtp();

		assert.isString(otp1, 'otp is a string');
		expect(otp1).toHaveLength(6);

		const largeOtp = generateOtp(12);
		expect(largeOtp).toHaveLength(12);
	});
});
