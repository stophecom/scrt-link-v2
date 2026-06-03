/**
 * Pure decision logic for publishing / unpublishing a white-label site.
 *
 * Drafting a white-label site is free; only taking it live (published: true) requires a
 * qualifying plan, and that is also when the custom domain is attached to Vercel. Unpublishing
 * is always allowed and detaches the domain. Keeping this logic pure (no DB / network / SvelteKit
 * imports) makes the gate independently unit-testable — the action and webhook only wire the side
 * effects (DB writes, Vercel calls) around these decisions.
 */

export type WhiteLabelSiteLinks = {
	customDomain: string | null;
	organizationId: string | null;
	userId: string | null;
};

export type PublishDecision =
	| {
			ok: false;
			status: 400 | 403 | 404 | 405;
			reason: 'not-found' | 'forbidden' | 'no-plan' | 'no-domain';
	  }
	| { ok: true; published: boolean; vercel: 'attach' | 'detach' | 'none' };

export function decideWhiteLabelPublish(input: {
	site: WhiteLabelSiteLinks | null;
	userId: string;
	/** Pre-computed org owner/admin check (only meaningful for org-linked sites). */
	isOrgOwnerOrAdmin: boolean;
	/** Whether the actor's effective plan permits white-label (i.e. publishing). */
	whiteLabelAllowed: boolean;
	desiredPublished: boolean;
}): PublishDecision {
	const { site, userId, isOrgOwnerOrAdmin, whiteLabelAllowed, desiredPublished } = input;

	if (!site) {
		return { ok: false, status: 404, reason: 'not-found' };
	}

	// Org sites: only owners/admins. Personal sites: only the owner.
	const authorized = site.organizationId ? isOrgOwnerOrAdmin : site.userId === userId;
	if (!authorized) {
		return { ok: false, status: 403, reason: 'forbidden' };
	}

	if (desiredPublished) {
		// Publishing is the only gated transition.
		if (!whiteLabelAllowed) {
			return { ok: false, status: 405, reason: 'no-plan' };
		}
		if (!site.customDomain) {
			return { ok: false, status: 400, reason: 'no-domain' };
		}
		return { ok: true, published: true, vercel: 'attach' };
	}

	// Unpublishing is always allowed; detach the domain if one is set.
	return { ok: true, published: false, vercel: site.customDomain ? 'detach' : 'none' };
}

/**
 * Given the white-label sites that were just unpublished (e.g. on subscription cancellation),
 * return the custom domains that should be detached from Vercel.
 */
export function domainsToDetachOnDowngrade(
	sites: Array<{ customDomain: string | null }>
): string[] {
	return sites
		.map((site) => site.customDomain)
		.filter((domain): domain is string => typeof domain === 'string' && domain.length > 0);
}
