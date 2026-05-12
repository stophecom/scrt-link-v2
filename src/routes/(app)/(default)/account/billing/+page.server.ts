import { eq } from 'drizzle-orm';
import type { Stripe } from 'stripe';

import { getBaseUrl } from '$lib/constants';
import { MembershipRole } from '$lib/data/enums';
import { getAbsoluteLocalizedUrl, redirectLocalized } from '$lib/i18n';
import { m } from '$lib/paraglide/messages.js';
import { db } from '$lib/server/db';
import { organization } from '$lib/server/db/schema';
import { getOrganizationsByUserId } from '$lib/server/organization';
import stripeInstance, {
	getActiveSubscription,
	getOrgInvoices,
	getStripePortalUrl
} from '$lib/server/stripe';

import type { PageServerLoad } from './$types';

async function getProductName(subscription: Stripe.Subscription): Promise<string | null> {
	const productId = subscription.items.data[0]?.plan?.product;
	if (!productId || typeof productId !== 'string') return null;
	const product = await stripeInstance.products.retrieve(productId);
	return product.name;
}

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	if (!user) return redirectLocalized(307, '/signup');

	let subscription: Stripe.Subscription | null = null;
	let invoices: Stripe.Invoice[] = [];
	let stripePortalUrl: string | null = null;
	let planName: string | null = null;

	let orgSubscription: Stripe.Subscription | null = null;
	let orgInvoices: Stripe.Invoice[] = [];
	let orgStripePortalUrl: string | null = null;
	let orgPlanName: string | null = null;

	const billingReturnUrl = getAbsoluteLocalizedUrl(getBaseUrl(), '/account/billing');

	try {
		if (user.stripeCustomerId) {
			subscription = await getActiveSubscription(user.stripeCustomerId);
			if (subscription) {
				[invoices, { url: stripePortalUrl }, planName] = await Promise.all([
					getOrgInvoices(user.stripeCustomerId),
					getStripePortalUrl(user.stripeCustomerId, billingReturnUrl),
					getProductName(subscription)
				]);
			}
		}

		const orgs = await getOrganizationsByUserId(user.id);
		const ownerOrg = orgs.find((o) => o.role === MembershipRole.OWNER);
		if (ownerOrg) {
			const [orgRow] = await db
				.select()
				.from(organization)
				.where(eq(organization.id, ownerOrg.id))
				.limit(1);

			if (orgRow?.stripeCustomerId) {
				const [orgSub, orgInvData, orgPortal] = await Promise.all([
					getActiveSubscription(orgRow.stripeCustomerId),
					getOrgInvoices(orgRow.stripeCustomerId),
					getStripePortalUrl(orgRow.stripeCustomerId, billingReturnUrl)
				]);
				orgSubscription = orgSub;
				orgInvoices = orgInvData;
				orgStripePortalUrl = orgPortal.url;
				if (orgSub) {
					orgPlanName = await getProductName(orgSub);
				}
			}
		}
	} catch (e) {
		console.error(e);
	}

	return {
		subscription,
		invoices,
		stripePortalUrl,
		planName,
		orgSubscription,
		orgInvoices,
		orgStripePortalUrl,
		orgPlanName,
		pageTitle: m.misty_teal_hawk_glow()
	};
};
