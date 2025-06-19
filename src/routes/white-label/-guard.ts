import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Guard } from 'svelte-guard';

import { isOriginalHost } from '$lib/app-routing';
import { db } from '$lib/server/db';
import { whiteLabelSite } from '$lib/server/db/schema';

export const guard: Guard = async ({ locals, url, params }) => {
	const domainFromParam = params.domain || '';

	const [whiteLabel] = await db
		.select()
		.from(whiteLabelSite)
		.where(eq(whiteLabelSite.customDomain, domainFromParam));

	if (!whiteLabel) {
		throw error(500, `No data for ${params.domain} found.`);
	}

	// We don't want to expose white-label pages via /white-label/example.com
	if (isOriginalHost(url.host) && locals.user?.id !== whiteLabel.userId) {
		return false; // Access denied
	}

	return true;
};

// Optional redirect for unauthorized users
// this will be the default for nested sub-routes
export const reroute = '/login';
