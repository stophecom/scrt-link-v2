import {
	getActiveSubscriptions,
	getAdoptionRates,
	getApiKeyStats,
	getGlobalStats,
	getOrganizationSizes,
	getRecentSignups,
	getSecretCounts,
	getSecretRequestStats,
	getTopUsersBySecrets,
	getTotalOrganizations,
	getTotalUsers,
	getUsersByTier,
	getUserSignupsByMonth,
	getWhiteLabelStats
} from '$lib/server/analytics';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [
		totalUsers,
		usersByTier,
		userSignups,
		recentSignups,
		adoptionRates,
		globalStats,
		topUsers,
		secretCounts,
		secretRequestStats,
		totalOrganizations,
		organizationSizes,
		activeSubscriptions,
		apiKeyStats,
		whiteLabelStats
	] = await Promise.all([
		getTotalUsers(),
		getUsersByTier(),
		getUserSignupsByMonth(),
		getRecentSignups(10),
		getAdoptionRates(),
		getGlobalStats(),
		getTopUsersBySecrets(10),
		getSecretCounts(),
		getSecretRequestStats(),
		getTotalOrganizations(),
		getOrganizationSizes(),
		getActiveSubscriptions(),
		getApiKeyStats(),
		getWhiteLabelStats()
	]);

	return {
		pageTitle: 'Admin',
		totalUsers,
		usersByTier,
		userSignups,
		recentSignups,
		adoptionRates,
		globalStats,
		topUsers,
		secretCounts,
		secretRequestStats,
		totalOrganizations,
		organizationSizes,
		activeSubscriptions,
		apiKeyStats,
		whiteLabelStats
	};
};
