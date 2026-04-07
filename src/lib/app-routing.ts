import { PUBLIC_PRODUCTION_URL } from '$env/static/public';

export const isOriginalHostname = (hostname: string) => {
	// Handle all possible production domains.
	// Preview domain regex (e.g. scrt-link-v2-caqr8zo1g-stophe.vercel.app)
	const regex = /^[a-zA-Z0-9-]+-stophe\.vercel\.app$/;

	return (
		hostname === 'localhost' ||
		hostname === PUBLIC_PRODUCTION_URL ||
		hostname === `www.${PUBLIC_PRODUCTION_URL}` ||
		hostname === `dev.${PUBLIC_PRODUCTION_URL}` ||
		hostname === `scrt-link-v2.vercel.app` ||
		regex.test(hostname)
	);
};
