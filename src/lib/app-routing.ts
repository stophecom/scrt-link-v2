import { PUBLIC_PRODUCTION_URL } from '$env/static/public';

export const isOriginalHost = (host: string) => {
	// Handle all possible production domains.
	// Preview domain regex (e.g. scrt-link-v2-caqr8zo1g-stophe.vercel.app)
	const regex = /^[a-zA-Z0-9-]+-stophe\.vercel\.app$/;

	return (
		host === 'localhost:5173' ||
		host === 'localhost:3000' ||
		host === PUBLIC_PRODUCTION_URL ||
		host === `www.${PUBLIC_PRODUCTION_URL}` ||
		host === `dev.${PUBLIC_PRODUCTION_URL}` ||
		host === `scrt-link-v2.vercel.app` ||
		regex.test(host)
	);
};
