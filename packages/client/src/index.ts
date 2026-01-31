import {
	DAY,
	encryptString,
	exportPublicKey,
	generateKeyPair,
	generateRandomUrlSafeString,
	MASTER_PASSWORD_LENGTH,
	SECRET_ID_LENGTH,
	SecretType,
	sha256Hash
} from '@scrt-link/core';

import type { Options } from './types';

// http://localhost:5173
const PROTOCOL = 'https';
const DEFAULT_HOST = 'scrt.link';

export const scrtLink = (apiKey: string) => {
	if (!apiKey) {
		throw new Error('API key is required');
	}

	const createSecret = async (secret: string, options: Partial<Options> = {}) => {
		const {
			secretType = SecretType.TEXT,
			password,
			publicNote,
			expiresIn = 7 * DAY,
			host = DEFAULT_HOST
		} = options;

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
			publicNote,
			expiresIn,
			password
		});

		const checksum = await sha256Hash(body);

		const res = await fetch(`${PROTOCOL}://${host}/api/v1/secrets`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`,
				'X-Checksum': checksum,
				...(host ? { 'X-Host': host } : {})
			},
			body: body
		});

		const data = await res.json();

		// API returns error message.
		if (!res.ok) {
			return data;
		}

		const secretLink = `${PROTOCOL}://${host}/s#${masterKey}`;
		return { secretLink: secretLink, ...data };
	};

	return {
		createSecret: createSecret
	};
};

export { type Options,SecretType };
export default scrtLink;
