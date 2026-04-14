// RSA-OAEP hybrid encryption for Secret Requests
// Used when a requester wants to receive encrypted data from someone without a shared secret.
// The requester generates an RSA key pair; the responder encrypts with the public key.

import { base64ToBinary, binaryToBase64, decodeText, encodeText } from './crypto';

const RSA_ALGORITHM = 'RSA-OAEP';
const RSA_HASH = 'SHA-256';
const RSA_MODULUS_LENGTH = 2048;
const AES_ALGORITHM = 'AES-GCM';
const AES_KEY_LENGTH = 256;
const IV_LENGTH = 12;

// --- RSA Key Pair ---

/**
 * Generate an RSA-OAEP key pair for Secret Requests.
 * The public key encrypts; the private key decrypts.
 */
export async function generateRSAKeyPair(): Promise<CryptoKeyPair> {
	return crypto.subtle.generateKey(
		{
			name: RSA_ALGORITHM,
			modulusLength: RSA_MODULUS_LENGTH,
			publicExponent: new Uint8Array([1, 0, 1]),
			hash: RSA_HASH
		},
		true, // extractable — needed for export/wrap
		['wrapKey', 'unwrapKey']
	);
}

/**
 * Export RSA public key as JWK string for storage.
 */
export async function exportPublicKeyJWK(key: CryptoKey): Promise<string> {
	const jwk = await crypto.subtle.exportKey('jwk', key);
	return JSON.stringify(jwk);
}

/**
 * Import RSA public key from JWK string.
 */
export async function importPublicKeyJWK(jwkString: string): Promise<CryptoKey> {
	const jwk = JSON.parse(jwkString);
	return crypto.subtle.importKey(
		'jwk',
		jwk,
		{ name: RSA_ALGORITHM, hash: RSA_HASH },
		false,
		['wrapKey']
	);
}

// --- Private Key Wrapping with Master Key ---

/**
 * Wrap (encrypt) the RSA private key with the user's Master Key (AES-GCM).
 * Returns base64-encoded IV || wrappedKey.
 */
export async function wrapPrivateKey(privateKey: CryptoKey, masterKey: CryptoKey): Promise<string> {
	const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
	const wrappedKey = await crypto.subtle.wrapKey('jwk', privateKey, masterKey, {
		name: AES_ALGORITHM,
		iv
	});

	const result = new Uint8Array(iv.length + wrappedKey.byteLength);
	result.set(iv);
	result.set(new Uint8Array(wrappedKey), iv.length);

	return binaryToBase64(result.buffer);
}

/**
 * Unwrap (decrypt) the RSA private key using the user's Master Key.
 */
export async function unwrapPrivateKey(
	wrappedKeyBase64: string,
	masterKey: CryptoKey
): Promise<CryptoKey> {
	const data = new Uint8Array(base64ToBinary(wrappedKeyBase64));
	const iv = data.slice(0, IV_LENGTH);
	const wrappedKey = data.slice(IV_LENGTH);

	return crypto.subtle.unwrapKey(
		'jwk',
		wrappedKey,
		masterKey,
		{ name: AES_ALGORITHM, iv },
		{ name: RSA_ALGORITHM, hash: RSA_HASH },
		false,
		['unwrapKey']
	);
}

// --- AES Key for Response Encryption ---

/**
 * Generate a random AES-256-GCM key for encrypting a response.
 */
export async function generateAESKey(): Promise<CryptoKey> {
	return crypto.subtle.generateKey(
		{ name: AES_ALGORITHM, length: AES_KEY_LENGTH },
		true, // extractable — needed for wrapping with RSA
		['encrypt', 'decrypt']
	);
}

/**
 * Wrap an AES key with the RSA public key.
 * Returns base64-encoded wrapped key.
 */
export async function wrapAESKeyWithRSA(
	aesKey: CryptoKey,
	rsaPublicKey: CryptoKey
): Promise<string> {
	const wrappedKey = await crypto.subtle.wrapKey('raw', aesKey, rsaPublicKey, {
		name: RSA_ALGORITHM
	});
	return binaryToBase64(wrappedKey);
}

/**
 * Unwrap an AES key using the RSA private key.
 */
export async function unwrapAESKeyWithRSA(
	wrappedKeyBase64: string,
	rsaPrivateKey: CryptoKey
): Promise<CryptoKey> {
	const wrappedKey = base64ToBinary(wrappedKeyBase64);
	return crypto.subtle.unwrapKey(
		'raw',
		wrappedKey,
		rsaPrivateKey,
		{ name: RSA_ALGORITHM },
		{ name: AES_ALGORITHM, length: AES_KEY_LENGTH },
		false,
		['decrypt']
	);
}

// --- AES Encrypt/Decrypt for Response Content ---

/**
 * Encrypt a string with an AES key.
 * Returns base64-encoded IV || ciphertext.
 */
export async function encryptResponseContent(
	plaintext: string,
	aesKey: CryptoKey
): Promise<string> {
	const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
	const ciphertext = await crypto.subtle.encrypt(
		{ name: AES_ALGORITHM, iv },
		aesKey,
		encodeText(plaintext)
	);

	const result = new Uint8Array(iv.length + ciphertext.byteLength);
	result.set(iv);
	result.set(new Uint8Array(ciphertext), iv.length);

	return binaryToBase64(result.buffer);
}

/**
 * Decrypt response content with an AES key.
 * Input is base64-encoded IV || ciphertext.
 */
export async function decryptResponseContent(
	encryptedBase64: string,
	aesKey: CryptoKey
): Promise<string> {
	const data = new Uint8Array(base64ToBinary(encryptedBase64));
	const iv = data.slice(0, IV_LENGTH);
	const ciphertext = data.slice(IV_LENGTH);

	const plaintext = await crypto.subtle.decrypt({ name: AES_ALGORITHM, iv }, aesKey, ciphertext);

	return decodeText(plaintext);
}

// --- Note Encryption (symmetric, key in URL hash) ---

/**
 * Encrypt a request note with a random key.
 * Returns { encryptedNote, noteKey } where noteKey goes in the URL hash.
 */
export async function encryptRequestNote(note: string): Promise<{
	encryptedNote: string;
	noteKey: string;
}> {
	const aesKey = await generateAESKey();
	const rawKey = await crypto.subtle.exportKey('raw', aesKey);
	const noteKey = binaryToBase64(rawKey);
	const encryptedNote = await encryptResponseContent(note, aesKey);
	return { encryptedNote, noteKey };
}

/**
 * Decrypt a request note using the key from the URL hash.
 */
export async function decryptRequestNote(
	encryptedNote: string,
	noteKeyBase64: string
): Promise<string> {
	const rawKey = base64ToBinary(noteKeyBase64);
	const aesKey = await crypto.subtle.importKey(
		'raw',
		rawKey,
		{ name: AES_ALGORITHM, length: AES_KEY_LENGTH },
		false,
		['decrypt']
	);
	return decryptResponseContent(encryptedNote, aesKey);
}
