import { SecretType } from '@scrt-link/core';

// Only text based secrets are supported via API.
export type Options = {
	secretType?: SecretType.TEXT | SecretType.REDIRECT | SecretType.NEOGRAM;
	password?: string;
	publicNote?: string;
	expiresIn?: number;
	host?: string;
};
