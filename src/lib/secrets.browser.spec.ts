/// <reference types="@vitest/browser/providers/playwright" />
import { describe, expect, test } from 'vitest';

import { encryptString, generateMasterKey } from './web-crypto';

describe('Create secret', () => {
	test('Simple encryption', async () => {
		const secret = 'Very secret message! 🤫';
		const masterKey = await generateMasterKey();

		const encryptedSecret = await encryptString(secret, masterKey);

		expect(encryptedSecret).toBeTypeOf('string');

		console.log(encryptedSecret);
	});
});
