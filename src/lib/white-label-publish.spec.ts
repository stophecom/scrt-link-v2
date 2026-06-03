import { describe, expect, test } from 'vitest';

import {
	decideWhiteLabelPublish,
	domainsToDetachOnDowngrade,
	type WhiteLabelSiteLinks
} from './white-label-publish';

const orgSite: WhiteLabelSiteLinks = {
	customDomain: 'secrets.acme.com',
	organizationId: 'org-1',
	userId: null
};

const personalSite: WhiteLabelSiteLinks = {
	customDomain: 'secrets.me.com',
	organizationId: null,
	userId: 'user-1'
};

describe('decideWhiteLabelPublish', () => {
	test('returns not-found when the site is missing', () => {
		const decision = decideWhiteLabelPublish({
			site: null,
			userId: 'user-1',
			isOrgOwnerOrAdmin: true,
			whiteLabelAllowed: true,
			desiredPublished: true
		});
		expect(decision).toEqual({ ok: false, status: 404, reason: 'not-found' });
	});

	test('forbids publishing an org site for a non owner/admin', () => {
		const decision = decideWhiteLabelPublish({
			site: orgSite,
			userId: 'user-1',
			isOrgOwnerOrAdmin: false,
			whiteLabelAllowed: true,
			desiredPublished: true
		});
		expect(decision).toEqual({ ok: false, status: 403, reason: 'forbidden' });
	});

	test('forbids publishing a personal site owned by someone else', () => {
		const decision = decideWhiteLabelPublish({
			site: personalSite,
			userId: 'someone-else',
			isOrgOwnerOrAdmin: false,
			whiteLabelAllowed: true,
			desiredPublished: true
		});
		expect(decision).toEqual({ ok: false, status: 403, reason: 'forbidden' });
	});

	test('free user (no white-label plan) is blocked from publishing — no Vercel side effect', () => {
		const decision = decideWhiteLabelPublish({
			site: orgSite,
			userId: 'owner',
			isOrgOwnerOrAdmin: true,
			whiteLabelAllowed: false,
			desiredPublished: true
		});
		expect(decision).toEqual({ ok: false, status: 405, reason: 'no-plan' });
		// A blocked decision carries no 'attach' instruction, so the caller never touches Vercel
		// and never flips `published`.
		expect('vercel' in decision).toBe(false);
	});

	test('publishing without a domain is rejected', () => {
		const decision = decideWhiteLabelPublish({
			site: { ...orgSite, customDomain: null },
			userId: 'owner',
			isOrgOwnerOrAdmin: true,
			whiteLabelAllowed: true,
			desiredPublished: true
		});
		expect(decision).toEqual({ ok: false, status: 400, reason: 'no-domain' });
	});

	test('subscribed org owner can publish — attaches the domain and sets published', () => {
		const decision = decideWhiteLabelPublish({
			site: orgSite,
			userId: 'owner',
			isOrgOwnerOrAdmin: true,
			whiteLabelAllowed: true,
			desiredPublished: true
		});
		expect(decision).toEqual({ ok: true, published: true, vercel: 'attach' });
	});

	test('personal site owner with plan can publish', () => {
		const decision = decideWhiteLabelPublish({
			site: personalSite,
			userId: 'user-1',
			isOrgOwnerOrAdmin: false,
			whiteLabelAllowed: true,
			desiredPublished: true
		});
		expect(decision).toEqual({ ok: true, published: true, vercel: 'attach' });
	});

	test('unpublishing is always allowed and detaches the domain — even without a plan', () => {
		const decision = decideWhiteLabelPublish({
			site: orgSite,
			userId: 'owner',
			isOrgOwnerOrAdmin: true,
			whiteLabelAllowed: false,
			desiredPublished: false
		});
		expect(decision).toEqual({ ok: true, published: false, vercel: 'detach' });
	});

	test('unpublishing a site without a domain detaches nothing', () => {
		const decision = decideWhiteLabelPublish({
			site: { ...orgSite, customDomain: null },
			userId: 'owner',
			isOrgOwnerOrAdmin: true,
			whiteLabelAllowed: true,
			desiredPublished: false
		});
		expect(decision).toEqual({ ok: true, published: false, vercel: 'none' });
	});

	test('unpublishing still enforces authorization', () => {
		const decision = decideWhiteLabelPublish({
			site: orgSite,
			userId: 'intruder',
			isOrgOwnerOrAdmin: false,
			whiteLabelAllowed: true,
			desiredPublished: false
		});
		expect(decision).toEqual({ ok: false, status: 403, reason: 'forbidden' });
	});
});

describe('domainsToDetachOnDowngrade', () => {
	test('returns the non-empty custom domains', () => {
		expect(
			domainsToDetachOnDowngrade([{ customDomain: 'a.com' }, { customDomain: 'b.com' }])
		).toEqual(['a.com', 'b.com']);
	});

	test('skips null and empty domains', () => {
		expect(
			domainsToDetachOnDowngrade([
				{ customDomain: null },
				{ customDomain: '' },
				{ customDomain: 'c.com' }
			])
		).toEqual(['c.com']);
	});

	test('returns an empty list when there is nothing to detach', () => {
		expect(domainsToDetachOnDowngrade([])).toEqual([]);
		expect(domainsToDetachOnDowngrade([{ customDomain: null }])).toEqual([]);
	});
});
