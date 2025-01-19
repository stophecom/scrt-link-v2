import { VERCEL_PROJECT_PRODUCTION_URL } from '$env/static/private';
import { PUBLIC_ENV } from '$env/static/public';

export const MB = 10 ** 6; // 1000000 Bytes = 1 MB.
export const GB = 10 ** 9; // 1000000000 Bytes = 1 GB.

const scheme = PUBLIC_ENV === 'development' ? 'http' : 'https';

export const getBaseUrl = () => `${scheme}://${VERCEL_PROJECT_PRODUCTION_URL}`;
