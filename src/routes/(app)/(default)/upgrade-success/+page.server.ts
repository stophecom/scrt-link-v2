import { redirectLocalized } from '$lib/i18n';
import { getCheckoutSession, getOrgSubscriptionStats } from '$lib/server/stripe';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
	if (!locals.user) {
		return redirectLocalized(307, '/signup');
	}

	const sessionId = url.searchParams.get('session_id');
	if (!sessionId) {
		return redirectLocalized(302, '/account');
	}

	let planName: string | null = null;
	try {
		const session = await getCheckoutSession(sessionId);
		if (session.subscription) {
			const { planName: tier } = await getOrgSubscriptionStats(session.subscription);
			planName = tier;
		}
	} catch (e) {
		console.error(e);
	}

	// Without a resolvable plan there is nothing to celebrate — send the user to their account.
	if (!planName) {
		return redirectLocalized(302, '/account');
	}

	return { planName };
};
