import {
	base64ToBinary,
	binaryToBase64,
	decryptString,
	encryptString,
	exportPublicKey,
	generateKeyPair,
	generateRandomUrlSafeString,
	importPublicKey,
	signMessage,
	verifyMessageSignature
} from '@scrt-link/core';
import { describe, expect, expectTypeOf, test } from 'vitest';

const keyPair = await generateKeyPair();

describe('Browser Crypto', () => {
	test('Random URL save string', async () => {
		const randomString = generateRandomUrlSafeString();

		expectTypeOf(randomString).toMatchTypeOf<string>();
		const forbiddenUrlCharacters = /[ "?#&/=%+]/; // Not allowed in URLs
		expect(randomString).not.toMatch(forbiddenUrlCharacters);
	});

	test('Create public/private key pair', async () => {
		expectTypeOf(keyPair.publicKey).toMatchTypeOf<CryptoKey>();
	});

	test('Message signature using public/private key pair', async () => {
		const message = 'Some random text';

		// Sign signature with private key
		const signature = await signMessage(message, keyPair.privateKey);

		// Verify signature using public key
		const verifiedMessageWithPublicKey = await verifyMessageSignature(
			message,
			signature,
			keyPair.publicKey
		);

		expect(verifiedMessageWithPublicKey).equal(true);
	});

	test('Binary to Base64 to Binary', async () => {
		const randomBinary = crypto.getRandomValues(new Uint8Array(16)).buffer;

		const base64 = binaryToBase64(randomBinary);
		const binaryKey = base64ToBinary(base64);

		function equalBuffer(buf1: ArrayBuffer, buf2: ArrayBuffer) {
			if (buf1.byteLength != buf2.byteLength) {
				return false;
			}
			const dv1 = new Int8Array(buf1);
			const dv2 = new Int8Array(buf2);
			for (let i = 0; i != buf1.byteLength; i++) {
				if (dv1[i] != dv2[i]) return false;
			}
			return true;
		}

		expect(equalBuffer(randomBinary, binaryKey)).toBe(true);
	});

	test('Test password encryption', async () => {
		const originalMessage = 'This is a secret';
		const password = 'sdfl$#243😅';

		const secret = await encryptString(originalMessage, password);

		expectTypeOf(secret).toMatchTypeOf<string>();

		const decryptedMessage = await decryptString(secret, password);

		expect(originalMessage).equal(decryptedMessage);
	});

	test('Import/export public key', async () => {
		const exportedPublicKey = await exportPublicKey(keyPair.publicKey);
		const importedKey = await importPublicKey(exportedPublicKey);

		expectTypeOf(importedKey).toMatchTypeOf<CryptoKey>();
	});

	test('Test signature with exported public key', async () => {
		const message = 'Some random text';
		const exportedPublicKey = await exportPublicKey(keyPair.publicKey);

		// Sign signature with private key
		const signature = await signMessage(message, keyPair.privateKey);

		const importedKey = await importPublicKey(exportedPublicKey);

		// Verify signature using public key
		const verifiedMessageWithPublicKey = await verifyMessageSignature(
			message,
			signature,
			importedKey
		);

		expect(verifiedMessageWithPublicKey).equal(true);
	});
});
