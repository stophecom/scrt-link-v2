// This module is intended to be used in browser-based applications to interact with the API.

import { SecretType } from '$lib/data/enums';
import { DAY } from '$lib/data/units';
import { DEFAULT_LOCALE, getLocalizedUrl } from '$lib/i18n';
import type { Locale } from '$lib/paraglide/runtime';

import { MASTER_PASSWORD_LENGTH, SECRET_ID_LENGTH } from './constants';
import {
	encryptString,
	exportPublicKey,
	generateKeyPair,
	generateRandomUrlSafeString,
	sha256Hash
} from './web-crypto';

const BASE_URL =
	process.env.VERCEL_ENV === 'production'
		? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
		: process.env.VERCEL === '1'
			? `https://${process.env.VERCEL_URL}`
			: 'http://localhost:5173';

// Only text based secrets are supported via API.
type Options = {
	secretType?: SecretType.TEXT | SecretType.NEOGRAM | SecretType.NEOGRAM;
	password?: string;
	expiresIn?: number;
	locale: Locale;
};
export const scrtLink = (apiKey: string) => {
	if (!apiKey) {
		throw new Error('API key is required');
	}

	const createSecret = async (
		secret: string,
		options: Options = { secretType: SecretType.TEXT, expiresIn: 7 * DAY, locale: DEFAULT_LOCALE }
	) => {
		const { secretType, password, expiresIn, locale } = options;

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

		const secretLink = `${BASE_URL}${getLocalizedUrl('/s', locale)}#${masterKey}`;
		return { secretLink: secretLink, ...data };
	};

	return {
		createSecret: createSecret
	};
};

export default scrtLink;
