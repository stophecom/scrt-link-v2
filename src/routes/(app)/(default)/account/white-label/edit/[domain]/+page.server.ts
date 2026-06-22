import { error, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { getUserPlanLimits } from '$lib/data/plans';
import { redirectLocalized } from '$lib/i18n';
import { getLocale } from '$lib/paraglide/runtime';
import { db } from '$lib/server/db';
import { whiteLabelSite as whiteLabelSiteTable } from '$lib/server/db/schema';
import { saveWhiteLabelSite, setWhiteLabelPublished } from '$lib/server/form/actions';
import { isUserOrgOwnerOrAdmin } from '$lib/server/organization';
import { getWhiteLabelSiteByHost } from '$lib/server/whiteLabelSite';
import type { LocalizedWhiteLabelMessage, Theme } from '$lib/types';
import { whiteLabelPublishSchema, whiteLabelSiteSchema } from '$lib/validators/formSchemas';

import type { Actions, PageServerLoad } from './$types';

const defaultTheme = {
	light: {
		background: '#F9F7F4',
		foreground: '#0E1B2E',
		primary: '#2a466a',
		card: '#FAFAF8',
		destructive: '#B42222',
		success: '#208345',
		info: '#0779AE'
	},
	dark: {
		background: '#0C1220',
		foreground: '#EBE6DE',
		primary: '#6990C3',
		card: '#091019',
		destructive: '#E87373',
		success: '#53C67D',
		info: '#39B5EF'
	}
};

async function buildWhiteLabelSiteForm(domain: string, locale: ReturnType<typeof getLocale>) {
	const site = await getWhiteLabelSiteByHost(domain);
	if (!site) return null;

	const theme = (site.theme as Theme) ?? {};
	return superValidate(
		{
			title: (site.messages as LocalizedWhiteLabelMessage)?.[locale]?.title || '',
			lead: (site.messages as LocalizedWhiteLabelMessage)?.[locale]?.lead || '',
			description: (site.messages as LocalizedWhiteLabelMessage)?.[locale]?.description || '',
			imprint: (site.messages as LocalizedWhiteLabelMessage)?.[locale]?.imprint || '',
			logo: site.logo,
			logoDarkMode: site.logoDarkMode,
			appIcon: site.appIcon,
			ogImage: site.ogImage,
			primaryColor: theme.light?.primary ?? theme.primaryColor ?? defaultTheme.light.primary,
			lightBackground: theme.light?.background ?? defaultTheme.light.background,
			lightForeground: theme.light?.foreground ?? defaultTheme.light.foreground,
			lightPrimary: theme.light?.primary ?? theme.primaryColor ?? defaultTheme.light.primary,
			lightCard: theme.light?.card ?? defaultTheme.light.card,
			lightDestructive: theme.light?.destructive ?? defaultTheme.light.destructive,
			lightSuccess: theme.light?.success ?? defaultTheme.light.success,
			lightInfo: theme.light?.info ?? defaultTheme.light.info,
			darkBackground: theme.dark?.background ?? defaultTheme.dark.background,
			darkForeground: theme.dark?.foreground ?? defaultTheme.dark.foreground,
			darkPrimary: theme.dark?.primary ?? defaultTheme.dark.primary,
			darkCard: theme.dark?.card ?? defaultTheme.dark.card,
			darkDestructive: theme.dark?.destructive ?? defaultTheme.dark.destructive,
			darkSuccess: theme.dark?.success ?? defaultTheme.dark.success,
			darkInfo: theme.dark?.info ?? defaultTheme.dark.info
		},
		zod4(whiteLabelSiteSchema()),
		{ id: 'whiteLabelSite' }
	);
}

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) {
		return redirectLocalized(307, '/signup');
	}

	const whiteLabel = await getWhiteLabelSiteByHost(params.domain);
	if (!whiteLabel) {
		return error(404, 'No white-label website found.');
	}

	const whiteLabelSiteForm = await buildWhiteLabelSiteForm(params.domain, getLocale());
	if (!whiteLabelSiteForm) return error(404, 'No white-label website found.');

	const publishForm = await superValidate(
		{ published: whiteLabel.published || false },
		zod4(whiteLabelPublishSchema()),
		{ id: 'whiteLabelPublish' }
	);

	return {
		domain: whiteLabel.customDomain,
		whiteLabelSiteForm,
		publishForm,
		canPublish: getUserPlanLimits(locals.effectiveTier).whiteLabel
	};
};

export const actions: Actions = {
	saveWhiteLabelSite: saveWhiteLabelSite,
	setWhiteLabelPublished: setWhiteLabelPublished,
	resetWhiteLabelTheme: async ({ locals, params }) => {
		if (!locals.user) return fail(401);

		const site = await getWhiteLabelSiteByHost(params.domain);
		if (!site) return fail(404);

		if (site.organizationId) {
			const allowed = await isUserOrgOwnerOrAdmin(locals.user.id, site.organizationId);
			if (!allowed) return fail(403);
		} else if (site.userId !== locals.user.id) {
			return fail(403);
		}

		await db
			.update(whiteLabelSiteTable)
			.set({ theme: defaultTheme })
			.where(eq(whiteLabelSiteTable.id, site.id));

		const form = await buildWhiteLabelSiteForm(params.domain, getLocale());
		if (!form) return fail(404);
		return message(form, { status: 'success' });
	}
};
