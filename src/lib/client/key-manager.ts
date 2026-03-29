// In-memory Master Key store for zero-knowledge encryption.
// The CryptoKey lives only in module scope — cleared on tab close or page refresh.
// This is intentional: same security model as Proton Mail.

import { decryptWithKey, encryptWithKey } from '@scrt-link/core';

let masterKey: CryptoKey | null = null;

/**
 * Store the unwrapped Master Key in memory.
 * Called after successful key derivation on login or setup.
 */
export function setMasterKey(key: CryptoKey): void {
	masterKey = key;
}

/**
 * Clear the Master Key from memory.
 * Called on logout or when the user explicitly locks encryption.
 */
export function clearMasterKey(): void {
	masterKey = null;
}

/**
 * Check whether the Master Key is currently unlocked in memory.
 */
export function isKeyUnlocked(): boolean {
	return masterKey !== null;
}

/**
 * Get the Master Key. Throws if not unlocked.
 * Use sparingly — prefer encryptWithMasterKey/decryptWithMasterKey.
 */
export function getMasterKey(): CryptoKey {
	if (!masterKey) {
		throw new Error('Encryption keys are not unlocked');
	}
	return masterKey;
}

/**
 * Encrypt data using the in-memory Master Key.
 * Returns IV || ciphertext as ArrayBuffer.
 */
export async function encryptWithMasterKey(data: ArrayBuffer): Promise<ArrayBuffer> {
	return encryptWithKey(data, getMasterKey());
}

/**
 * Decrypt data using the in-memory Master Key.
 * Input is IV || ciphertext as ArrayBuffer.
 */
export async function decryptWithMasterKey(data: ArrayBuffer): Promise<ArrayBuffer> {
	return decryptWithKey(data, getMasterKey());
}
