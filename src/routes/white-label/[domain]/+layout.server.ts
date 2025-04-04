import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

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

	const { name, title, lead, logo, theme } = result;

	return {
		user: locals.user,
		domain: params.domain,
		title,
		lead,
		logo,
		name,
		theme: theme as Theme
	};
};
