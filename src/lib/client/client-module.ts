// This module is intended to be used in browser-based applications to interact with the API.

import { SecretType } from '$lib/data/enums';
import { DAY } from '$lib/data/units';

import { MASTER_PASSWORD_LENGTH, SECRET_ID_LENGTH } from './constants';
import {
	encryptString,
	exportPublicKey,
	generateKeyPair,
	generateRandomUrlSafeString,
	sha256Hash
} from './web-crypto';

// http://localhost:5173
const BASE_URL = 'https://scrt.link';

// Only text based secrets are supported via API.
type Options = {
	secretType?: SecretType.TEXT | SecretType.NEOGRAM | SecretType.NEOGRAM;
	password?: string;
	expiresIn?: number;
};
export const scrtLink = (apiKey: string) => {
	if (!apiKey) {
		throw new Error('API key is required');
	}

	const createSecret = async (
		secret: string,
		options: Options = { secretType: SecretType.TEXT, expiresIn: 7 * DAY }
	) => {
		const { secretType, password, expiresIn } = options;

		let encryptedContent = secret;
		let encryptedMeta = JSON.stringify({
			secretType: secretType
		});

		const masterKey = generateRandomUrlSafeString(MASTER_PASSWORD_LENGTH);
		const keyPair = await generateKeyPair();
		// const privateKey = keyPair.privateKey; // Only used for files

		const secretIdSubstring = masterKey.substring(SECRET_ID_LENGTH);
		const secretIdHash = await sha256Hash(secretIdSubstring);
		const publicKey = await exportPublicKey(keyPair.publicKey);

		if (password) {
			encryptedMeta = await encryptString(encryptedMeta, password);
			encryptedContent = await encryptString(encryptedContent, password);
		}
		encryptedMeta = await encryptString(encryptedMeta, masterKey);
		encryptedContent = await encryptString(encryptedContent, masterKey);

		const body = JSON.stringify({
			secretIdHash,
			meta: encryptedMeta,
			content: encryptedContent,
			publicKey,
			expiresIn,
			password
		});

		const checksum = await sha256Hash(body);

		const res = await fetch(`${BASE_URL}/api/v1/secrets`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`,
				'X-Checksum': checksum
			},
			body: body
		});

		const data = await res.json();

		// API returns error message.
		if (!res.ok) {
			return data;
		}

		const secretLink = `${BASE_URL}/s#${masterKey}`;
		return { secretLink: secretLink, ...data };
	};

	return {
		createSecret: createSecret
	};
};

export default scrtLink;
