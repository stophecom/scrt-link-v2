import { VERCEL_PROJECT_PRODUCTION_URL } from '$env/static/private';
import { PUBLIC_ENV } from '$env/static/public';

const scheme = PUBLIC_ENV === 'development' ? 'http' : 'https';

export const getBaseUrl = () => `${scheme}://${VERCEL_PROJECT_PRODUCTION_URL}`;
