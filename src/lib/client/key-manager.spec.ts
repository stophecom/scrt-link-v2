import { beforeEach, describe, expect, test } from 'vitest';

import { clearMasterKey, getMasterKey, isKeyUnlocked, setMasterKey } from './key-manager';

describe('Key Manager', () => {
	beforeEach(() => {
		clearMasterKey();
	});

	test('isKeyUnlocked returns false initially', () => {
		expect(isKeyUnlocked()).toBe(false);
	});

	test('getMasterKey throws when not unlocked', () => {
		expect(() => getMasterKey()).toThrow('Encryption keys are not unlocked');
	});

	test('setMasterKey + isKeyUnlocked returns true', () => {
		// Create a mock CryptoKey-like object for unit testing
		const mockKey = { type: 'secret', algorithm: { name: 'AES-GCM' } } as CryptoKey;
		setMasterKey(mockKey);
		expect(isKeyUnlocked()).toBe(true);
	});

	test('getMasterKey returns the key after setMasterKey', () => {
		const mockKey = { type: 'secret', algorithm: { name: 'AES-GCM' } } as CryptoKey;
		setMasterKey(mockKey);
		expect(getMasterKey()).toBe(mockKey);
	});

	test('clearMasterKey resets state', () => {
		const mockKey = { type: 'secret', algorithm: { name: 'AES-GCM' } } as CryptoKey;
		setMasterKey(mockKey);
		expect(isKeyUnlocked()).toBe(true);

		clearMasterKey();
		expect(isKeyUnlocked()).toBe(false);
		expect(() => getMasterKey()).toThrow();
	});
});
