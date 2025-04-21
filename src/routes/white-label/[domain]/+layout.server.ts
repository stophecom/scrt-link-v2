import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import { PUBLIC_IMGIX_CDN_URL } from '$env/static/public';
import { db } from '$lib/server/db';
import { whiteLabelSite } from '$lib/server/db/schema';
import type { Theme } from '$lib/types';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, locals }) => {
	const [result] = await db
		.select()
		.from(whiteLabelSite)
		.where(eq(whiteLabelSite.customDomain, params.domain));

	if (!result) {
		throw error(500, `No data for ${params.domain} found.`);
	}

	const { name, appIcon, theme } = result;

	const baseUrl = `https://${PUBLIC_IMGIX_CDN_URL}/${appIcon}`;

	return {
		user: locals.user,
		domain: params.domain,
		name,
		appIcon: appIcon ? baseUrl : undefined,
		theme: theme as Theme
	};
};
