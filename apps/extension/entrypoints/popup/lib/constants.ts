// Where users generate/manage API keys.
export const ACCOUNT_API_URL = 'https://scrt.link/account/api';

// `expiresIn` is a duration in milliseconds (server does `Date.now() + expiresIn`).
const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

export const EXPIRY_OPTIONS: { label: string; value: number }[] = [
	{ label: '1 hour', value: HOUR },
	{ label: '1 day', value: DAY },
	{ label: '1 week', value: 7 * DAY },
	{ label: '1 month', value: 30 * DAY }
];

export const DEFAULT_EXPIRY = 7 * DAY;
