// Master Key store with IndexedDB persistence.
// The CryptoKey is stored alongside the owning user id so that switching
// accounts in the same browser never exposes one user's key to another.
// Cleared on logout, tab close, or user-id mismatch on restore.

import { decryptWithKey, encryptWithKey } from '@scrt-link/core';

import { browser } from '$app/environment';

type StoredKey = { userId: string; key: CryptoKey };

let masterKey: CryptoKey | null = null;
let masterKeyUserId: string | null = null;

const DB_NAME = 'scrt-encryption';
const STORE_NAME = 'keys';
const MK_KEY = 'master-key';

// --- IndexedDB helpers ---

function openDB(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, 1);
		request.onupgradeneeded = () => {
			request.result.createObjectStore(STORE_NAME);
		};
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

async function persistKey(entry: StoredKey): Promise<void> {
	try {
		const db = await openDB();
		const tx = db.transaction(STORE_NAME, 'readwrite');
		tx.objectStore(STORE_NAME).put(entry, MK_KEY);
		db.close();
	} catch {
		// IndexedDB unavailable (e.g. private browsing) — fall back to memory-only
	}
}

async function loadPersistedKey(): Promise<StoredKey | null> {
	try {
		const db = await openDB();
		return new Promise((resolve) => {
			const tx = db.transaction(STORE_NAME, 'readonly');
			const request = tx.objectStore(STORE_NAME).get(MK_KEY);
			request.onsuccess = () => {
				const value = request.result;
				if (value && typeof value === 'object' && 'userId' in value && 'key' in value) {
					resolve(value as StoredKey);
				} else {
					resolve(null);
				}
			};
			request.onerror = () => resolve(null);
			tx.oncomplete = () => db.close();
		});
	} catch {
		return null;
	}
}

async function deletePersistedKey(): Promise<void> {
	try {
		const db = await openDB();
		const tx = db.transaction(STORE_NAME, 'readwrite');
		tx.objectStore(STORE_NAME).delete(MK_KEY);
		db.close();
	} catch {
		// Ignore — key may not exist or IndexedDB unavailable
	}
}

// --- Restore from IndexedDB on module load ---

if (browser) {
	// Clear on tab close (not on reload — that's the whole point of IndexedDB persistence)
	// Use 'pagehide' with persisted check for more reliable cleanup
	window.addEventListener('pagehide', (e) => {
		if (!e.persisted) {
			// Tab is being closed (not bfcache), clear IndexedDB
			// Use sync approach since async isn't reliable in pagehide
			try {
				const request = indexedDB.open(DB_NAME, 1);
				request.onsuccess = () => {
					const db = request.result;
					const tx = db.transaction(STORE_NAME, 'readwrite');
					tx.objectStore(STORE_NAME).delete(MK_KEY);
					db.close();
				};
			} catch {
				// Best effort
			}
		}
	});
}

// --- Public API ---

/**
 * Store the unwrapped Master Key in memory and IndexedDB, bound to the user id.
 * Called after successful key derivation on login or setup.
 */
export function setMasterKey(userId: string, key: CryptoKey): void {
	masterKey = key;
	masterKeyUserId = userId;
	persistKey({ userId, key });
}

/**
 * Clear the Master Key from memory and IndexedDB.
 * Called on logout or when the user explicitly locks encryption.
 */
export function clearMasterKey(): void {
	masterKey = null;
	masterKeyUserId = null;
	deletePersistedKey();
}

/**
 * Check whether the Master Key is currently unlocked in memory.
 */
export function isKeyUnlocked(): boolean {
	return masterKey !== null;
}

/**
 * Try to restore the Master Key from IndexedDB for the given user.
 * If the persisted key belongs to a different user, it is cleared and
 * the function returns false — the caller must prompt for unlock again.
 * Returns true if a matching key was restored.
 */
export async function tryRestoreKey(expectedUserId: string): Promise<boolean> {
	if (masterKey && masterKeyUserId === expectedUserId) return true;
	if (masterKey && masterKeyUserId !== expectedUserId) {
		// In-memory key belongs to another account — drop it.
		masterKey = null;
		masterKeyUserId = null;
	}

	const stored = await loadPersistedKey();
	if (!stored) return false;

	if (stored.userId !== expectedUserId) {
		await deletePersistedKey();
		return false;
	}

	masterKey = stored.key;
	masterKeyUserId = stored.userId;
	return true;
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
