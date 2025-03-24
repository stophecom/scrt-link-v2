import { VERCEL_PROJECT_PRODUCTION_URL, VERCEL_URL } from '$env/static/private';
import { PUBLIC_ENV } from '$env/static/public';

export const getBaseUrl = () => {
	switch (PUBLIC_ENV) {
		case 'preview': {
			return `https://${VERCEL_URL}`;
		}
		case 'production': {
			return `https://${VERCEL_PROJECT_PRODUCTION_URL}`;
		}
		default: {
			return `http://localhost:5173`;
		}
	}
};

export const FILE_RETENTION_PERIOD_IN_DAYS = 30;
export const MAX_API_KEYS_PER_USER = 5;
