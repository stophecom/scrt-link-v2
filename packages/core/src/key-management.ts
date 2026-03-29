// Zero-knowledge encryption key management utilities
// These helpers run in the Browser using the Web Crypto API.
// They implement the key hierarchy: Password → PDK → Master Key

import { base64ToBinary, binaryToBase64, encodeText } from './crypto';

const PDK_ALGORITHM = 'PBKDF2';
const PDK_HASH = 'SHA-256';
const DEFAULT_PDK_ITERATIONS = 600_000;
const MASTER_KEY_ALGORITHM = 'AES-GCM';
const MASTER_KEY_LENGTH = 256;
const IV_LENGTH = 12;
const SALT_LENGTH = 16;

// Base32 alphabet (Crockford variant): excludes I, L, O, U to avoid ambiguity
const BASE32_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

// --- Password-Derived Key (PDK) ---

/**
 * Generate a random salt for PBKDF2 key derivation.
 * Returns hex-encoded string for storage.
 */
export function generatePdkSalt(): string {
	const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
	return Array.from(salt, (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Derive a Password-Derived Key from a password and salt.
 * The PDK is used to wrap/unwrap the Master Key.
 */
export async function derivePDK(
	password: string,
	saltHex: string,
	iterations: number = DEFAULT_PDK_ITERATIONS
): Promise<CryptoKey> {
	const salt = hexToBytes(saltHex);
	const passwordKey = await crypto.subtle.importKey(
		'raw',
		encodeText(password),
		PDK_ALGORITHM,
		false,
		['deriveKey']
	);

	return crypto.subtle.deriveKey(
		{
			name: PDK_ALGORITHM,
			salt: salt as BufferSource,
			iterations,
			hash: PDK_HASH
		},
		passwordKey,
		{
			name: MASTER_KEY_ALGORITHM,
			length: MASTER_KEY_LENGTH
		},
		false,
		['wrapKey', 'unwrapKey']
	);
}

// --- Master Key ---

/**
 * Generate a new random 256-bit Master Key.
 * This key is generated once per user and never changes.
 */
export async function generateMasterKey(): Promise<CryptoKey> {
	return crypto.subtle.generateKey(
		{
			name: MASTER_KEY_ALGORITHM,
			length: MASTER_KEY_LENGTH
		},
		true, // extractable: true — needed for wrapKey operations
		['encrypt', 'decrypt', 'wrapKey', 'unwrapKey']
	);
}

/**
 * Wrap (encrypt) the Master Key with the PDK.
 * Returns base64-encoded string of IV || wrappedKey.
 */
export async function wrapMasterKey(masterKey: CryptoKey, pdk: CryptoKey): Promise<string> {
	const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
	const wrappedKey = await crypto.subtle.wrapKey('raw', masterKey, pdk, {
		name: MASTER_KEY_ALGORITHM,
		iv
	});

	// Concatenate IV || wrappedKey
	const result = new Uint8Array(iv.length + wrappedKey.byteLength);
	result.set(iv);
	result.set(new Uint8Array(wrappedKey), iv.length);

	return binaryToBase64(result.buffer);
}

/**
 * Unwrap (decrypt) the Master Key using the PDK.
 * Input is the base64-encoded IV || wrappedKey string.
 */
export async function unwrapMasterKey(encryptedMK: string, pdk: CryptoKey): Promise<CryptoKey> {
	const data = new Uint8Array(base64ToBinary(encryptedMK));
	const iv = data.slice(0, IV_LENGTH);
	const wrappedKey = data.slice(IV_LENGTH);

	return crypto.subtle.unwrapKey(
		'raw',
		wrappedKey,
		pdk,
		{ name: MASTER_KEY_ALGORITHM, iv },
		{ name: MASTER_KEY_ALGORITHM, length: MASTER_KEY_LENGTH },
		true,
		['encrypt', 'decrypt', 'wrapKey', 'unwrapKey']
	);
}

// --- Recovery Key ---

/**
 * Generate a recovery key (32 random bytes) and its human-readable display code.
 * The display code uses a base32 alphabet without ambiguous characters,
 * grouped in 4-character blocks separated by dashes.
 */
export function generateRecoveryKey(): { rawBytes: Uint8Array; displayCode: string } {
	const rawBytes = crypto.getRandomValues(new Uint8Array(32));
	const displayCode = encodeRecoveryCode(rawBytes);
	return { rawBytes, displayCode };
}

/**
 * Encode raw bytes to a human-readable Crockford base32 recovery code.
 * Format: XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX (8 groups of 4)
 * The alphabet excludes I, L, O, U to avoid visual ambiguity with 0/1.
 * decodeRecoveryCode() normalizes these back (O→0, I/L→1) so hand-typed
 * codes still work.
 */
export function encodeRecoveryCode(bytes: Uint8Array): string {
	let bits = '';
	for (const byte of bytes) {
		bits += byte.toString(2).padStart(8, '0');
	}

	// Pad to multiple of 5 so no bits are lost (256 → 260 bits = 52 base32 chars)
	while (bits.length % 5 !== 0) {
		bits += '0';
	}

	// Take 5 bits at a time for base32
	const chars: string[] = [];
	for (let i = 0; i < bits.length; i += 5) {
		const index = parseInt(bits.slice(i, i + 5), 2);
		chars.push(BASE32_ALPHABET[index]);
	}

	// Group into 4-character blocks with dashes
	const code = chars.join('');
	const groups: string[] = [];
	for (let i = 0; i < code.length; i += 4) {
		groups.push(code.slice(i, i + 4));
	}

	return groups.join('-');
}

/**
 * Decode a human-readable recovery code back to raw bytes.
 * Strips dashes and whitespace, case-insensitive.
 * Normalizes ambiguous characters per Crockford base32 spec: O→0, I/L→1.
 */
export function decodeRecoveryCode(code: string): Uint8Array {
	const cleaned = code
		.replace(/[-\s]/g, '')
		.toUpperCase()
		.replace(/O/g, '0') // letter O → digit 0
		.replace(/[IL]/g, '1'); // letter I or L → digit 1

	let bits = '';
	for (const char of cleaned) {
		const index = BASE32_ALPHABET.indexOf(char);
		if (index === -1) {
			throw new Error(`Invalid recovery code character: ${char}`);
		}
		bits += index.toString(2).padStart(5, '0');
	}

	// Convert bits back to bytes (take first 256 bits = 32 bytes)
	const bytes = new Uint8Array(32);
	for (let i = 0; i < 32; i++) {
		bytes[i] = parseInt(bits.slice(i * 8, i * 8 + 8), 2);
	}

	return bytes;
}

/**
 * Hash the recovery key with SHA-256 for server-side verification.
 * Returns hex-encoded hash.
 */
export async function hashRecoveryKey(recoveryKeyBytes: Uint8Array): Promise<string> {
	const hashBuffer = await crypto.subtle.digest('SHA-256', recoveryKeyBytes as BufferSource);
	return Array.from(new Uint8Array(hashBuffer), (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Wrap the Master Key with the Recovery Key.
 * Returns base64-encoded IV || wrappedKey.
 */
export async function wrapMasterKeyWithRecovery(
	masterKey: CryptoKey,
	recoveryKeyBytes: Uint8Array
): Promise<string> {
	const recoveryKey = await crypto.subtle.importKey(
		'raw',
		recoveryKeyBytes as BufferSource,
		{ name: MASTER_KEY_ALGORITHM, length: MASTER_KEY_LENGTH },
		false,
		['wrapKey']
	);

	const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
	const wrappedKey = await crypto.subtle.wrapKey('raw', masterKey, recoveryKey, {
		name: MASTER_KEY_ALGORITHM,
		iv
	});

	const result = new Uint8Array(iv.length + wrappedKey.byteLength);
	result.set(iv);
	result.set(new Uint8Array(wrappedKey), iv.length);

	return binaryToBase64(result.buffer);
}

/**
 * Unwrap the Master Key using the Recovery Key.
 * Input is the base64-encoded IV || wrappedKey string.
 */
export async function unwrapMasterKeyWithRecovery(
	encryptedMK: string,
	recoveryKeyBytes: Uint8Array
): Promise<CryptoKey> {
	const recoveryKey = await crypto.subtle.importKey(
		'raw',
		recoveryKeyBytes as BufferSource,
		{ name: MASTER_KEY_ALGORITHM, length: MASTER_KEY_LENGTH },
		false,
		['unwrapKey']
	);

	const data = new Uint8Array(base64ToBinary(encryptedMK));
	const iv = data.slice(0, IV_LENGTH);
	const wrappedKey = data.slice(IV_LENGTH);

	return crypto.subtle.unwrapKey(
		'raw',
		wrappedKey,
		recoveryKey,
		{ name: MASTER_KEY_ALGORITHM, iv },
		{ name: MASTER_KEY_ALGORITHM, length: MASTER_KEY_LENGTH },
		true,
		['encrypt', 'decrypt', 'wrapKey', 'unwrapKey']
	);
}

// --- Helpers ---

function hexToBytes(hex: string): Uint8Array {
	const bytes = new Uint8Array(hex.length / 2);
	for (let i = 0; i < hex.length; i += 2) {
		bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
	}
	return bytes;
}

/**
 * Encrypt data using a CryptoKey (AES-256-GCM).
 * Returns IV || ciphertext as ArrayBuffer.
 */
export async function encryptWithKey(data: ArrayBuffer, key: CryptoKey): Promise<ArrayBuffer> {
	const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
	const ciphertext = await crypto.subtle.encrypt({ name: MASTER_KEY_ALGORITHM, iv }, key, data);

	const result = new Uint8Array(iv.length + ciphertext.byteLength);
	result.set(iv);
	result.set(new Uint8Array(ciphertext), iv.length);
	return result.buffer;
}

/**
 * Decrypt data using a CryptoKey (AES-256-GCM).
 * Input is IV || ciphertext as ArrayBuffer.
 */
export async function decryptWithKey(data: ArrayBuffer, key: CryptoKey): Promise<ArrayBuffer> {
	const iv = new Uint8Array(data, 0, IV_LENGTH);
	const ciphertext = new Uint8Array(data, IV_LENGTH);
	return crypto.subtle.decrypt({ name: MASTER_KEY_ALGORITHM, iv }, key, ciphertext);
}
