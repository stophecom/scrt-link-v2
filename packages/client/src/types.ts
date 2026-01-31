export enum SecretType {
	TEXT = 'text',
	FILE = 'file',
	REDIRECT = 'redirect',
	SNAP = 'snap',
	NEOGRAM = 'neogram'
}

// Only text based secrets are supported via API.
export type Options = {
	secretType?: SecretType.TEXT | SecretType.NEOGRAM;
	password?: string;
	publicNote?: string;
	expiresIn?: number;
	host?: string;
};
