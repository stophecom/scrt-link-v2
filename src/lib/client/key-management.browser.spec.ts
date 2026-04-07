/// <reference types="@vitest/browser/providers/playwright" />
import {
	decodeRecoveryCode,
	decryptWithKey,
	derivePDK,
	encodeRecoveryCode,
	encryptWithKey,
	generateMasterKey,
	generatePdkSalt,
	generateRecoveryKey,
	hashRecoveryKey,
	unwrapMasterKey,
	unwrapMasterKeyWithRecovery,
	wrapMasterKey,
	wrapMasterKeyWithRecovery
} from '@scrt-link/core';
import { describe, expect, expectTypeOf, test } from 'vitest';

describe('Key Management', () => {
	test('generatePdkSalt returns 32-char hex string', () => {
		const salt = generatePdkSalt();
		expect(salt).toHaveLength(32);
		expect(salt).toMatch(/^[0-9a-f]{32}$/);
	});

	test('derivePDK returns a CryptoKey with wrapKey/unwrapKey usages', async () => {
		const salt = generatePdkSalt();
		const pdk = await derivePDK('testpassword', salt, 1000); // Low iterations for speed

		expectTypeOf(pdk).toMatchTypeOf<CryptoKey>();
		expect(pdk.algorithm).toMatchObject({ name: 'AES-GCM', length: 256 });
		expect(pdk.usages).toContain('wrapKey');
		expect(pdk.usages).toContain('unwrapKey');
		expect(pdk.extractable).toBe(false);
	});

	test('generateMasterKey returns an extractable AES-GCM CryptoKey', async () => {
		const mk = await generateMasterKey();

		expectTypeOf(mk).toMatchTypeOf<CryptoKey>();
		expect(mk.algorithm).toMatchObject({ name: 'AES-GCM', length: 256 });
		expect(mk.extractable).toBe(true);
		expect(mk.usages).toContain('encrypt');
		expect(mk.usages).toContain('decrypt');
	});

	test('wrapMasterKey + unwrapMasterKey round-trip', async () => {
		const salt = generatePdkSalt();
		const pdk = await derivePDK('mypassword123', salt, 1000);
		const mk = await generateMasterKey();

		// Wrap
		const wrapped = await wrapMasterKey(mk, pdk);
		expect(wrapped).toBeTruthy();
		expectTypeOf(wrapped).toMatchTypeOf<string>();

		// Unwrap
		const unwrapped = await unwrapMasterKey(wrapped, pdk);
		expectTypeOf(unwrapped).toMatchTypeOf<CryptoKey>();
		expect(unwrapped.algorithm).toMatchObject({ name: 'AES-GCM', length: 256 });

		// Verify the unwrapped key works: encrypt with original, decrypt with unwrapped
		const plaintext = new TextEncoder().encode('test data');
		const encrypted = await encryptWithKey(plaintext.buffer, mk);
		const decrypted = await decryptWithKey(encrypted, unwrapped);
		const result = new TextDecoder().decode(decrypted);
		expect(result).toBe('test data');
	});

	test('unwrapMasterKey fails with wrong password', async () => {
		const salt = generatePdkSalt();
		const correctPdk = await derivePDK('correct-password', salt, 1000);
		const wrongPdk = await derivePDK('wrong-password', salt, 1000);
		const mk = await generateMasterKey();

		const wrapped = await wrapMasterKey(mk, correctPdk);

		await expect(unwrapMasterKey(wrapped, wrongPdk)).rejects.toThrow();
	});

	test('generateRecoveryKey returns rawBytes (32) and displayCode', () => {
		const { rawBytes, displayCode } = generateRecoveryKey();

		expect(rawBytes).toBeInstanceOf(Uint8Array);
		expect(rawBytes).toHaveLength(32);
		expect(displayCode).toBeTruthy();
		// Display code should have dashes
		expect(displayCode).toMatch(/-/);
	});

	test('encodeRecoveryCode + decodeRecoveryCode round-trip', () => {
		const original = crypto.getRandomValues(new Uint8Array(32));
		const encoded = encodeRecoveryCode(original);
		const decoded = decodeRecoveryCode(encoded);

		expect(decoded).toEqual(original);
	});

	test('hashRecoveryKey returns 64-char hex string', async () => {
		const bytes = crypto.getRandomValues(new Uint8Array(32));
		const hash = await hashRecoveryKey(bytes);

		expect(hash).toHaveLength(64);
		expect(hash).toMatch(/^[0-9a-f]{64}$/);
	});

	test('wrapMasterKeyWithRecovery + unwrapMasterKeyWithRecovery round-trip', async () => {
		const mk = await generateMasterKey();
		const { rawBytes } = generateRecoveryKey();

		// Wrap with recovery key
		const wrapped = await wrapMasterKeyWithRecovery(mk, rawBytes);
		expect(wrapped).toBeTruthy();

		// Unwrap with same recovery key
		const unwrapped = await unwrapMasterKeyWithRecovery(wrapped, rawBytes);
		expectTypeOf(unwrapped).toMatchTypeOf<CryptoKey>();

		// Verify the key works
		const plaintext = new TextEncoder().encode('recovery test');
		const encrypted = await encryptWithKey(plaintext.buffer, mk);
		const decrypted = await decryptWithKey(encrypted, unwrapped);
		expect(new TextDecoder().decode(decrypted)).toBe('recovery test');
	});

	test('encryptWithKey + decryptWithKey round-trip', async () => {
		const mk = await generateMasterKey();
		const plaintext = new TextEncoder().encode('Hello, encryption!');

		const encrypted = await encryptWithKey(plaintext.buffer, mk);
		expect(encrypted.byteLength).toBeGreaterThan(plaintext.byteLength);

		const decrypted = await decryptWithKey(encrypted, mk);
		expect(new TextDecoder().decode(decrypted)).toBe('Hello, encryption!');
	});
});
