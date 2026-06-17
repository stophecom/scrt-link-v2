/// <reference types="@vitest/browser/providers/playwright" />
import {
	decodeRecoveryCode,
	decryptWithKey,
	deriveAuthVerifier,
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

	test('deriveAuthVerifier returns a 64-char hex string', async () => {
		const verifier = await deriveAuthVerifier('mypassword123', 'user@example.com', 1000);

		expect(verifier).toHaveLength(64);
		expect(verifier).toMatch(/^[0-9a-f]{64}$/);
	});

	test('deriveAuthVerifier is deterministic for same password + email', async () => {
		const a = await deriveAuthVerifier('mypassword123', 'user@example.com', 1000);
		const b = await deriveAuthVerifier('mypassword123', 'user@example.com', 1000);

		expect(a).toBe(b);
	});

	test('deriveAuthVerifier normalizes email (case/whitespace insensitive)', async () => {
		const a = await deriveAuthVerifier('mypassword123', 'User@Example.com', 1000);
		const b = await deriveAuthVerifier('mypassword123', '  user@example.com  ', 1000);

		expect(a).toBe(b);
	});

	test('deriveAuthVerifier differs for different email (email is the salt)', async () => {
		const a = await deriveAuthVerifier('mypassword123', 'a@example.com', 1000);
		const b = await deriveAuthVerifier('mypassword123', 'b@example.com', 1000);

		expect(a).not.toBe(b);
	});

	test('deriveAuthVerifier differs for different password', async () => {
		const a = await deriveAuthVerifier('password-one', 'user@example.com', 1000);
		const b = await deriveAuthVerifier('password-two', 'user@example.com', 1000);

		expect(a).not.toBe(b);
	});

	// The core zero-knowledge property: the verifier sent to the server is derived with
	// a domain-separated salt ("scrt-auth:" + email), so it is independent of any key
	// the same password derives. Here we show that even PBKDF2 over the *raw* email salt
	// (worst-case overlap with a PDK salt) yields a different value than the verifier.
	test('deriveAuthVerifier is domain-separated from raw PBKDF2 over the email', async () => {
		const password = 'mypassword123';
		const email = 'user@example.com';

		const passwordKey = await crypto.subtle.importKey(
			'raw',
			new TextEncoder().encode(password),
			'PBKDF2',
			false,
			['deriveBits']
		);
		const rawBits = await crypto.subtle.deriveBits(
			{ name: 'PBKDF2', salt: new TextEncoder().encode(email), iterations: 1000, hash: 'SHA-256' },
			passwordKey,
			256
		);
		const rawHex = Array.from(new Uint8Array(rawBits), (b) => b.toString(16).padStart(2, '0')).join(
			''
		);

		const verifier = await deriveAuthVerifier(password, email, 1000);

		expect(verifier).not.toBe(rawHex);
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
