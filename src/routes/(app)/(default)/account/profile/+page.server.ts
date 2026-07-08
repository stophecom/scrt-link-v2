import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { getAbsoluteLocalizedUrl, redirectLocalized } from '$lib/i18n';
import { m } from '$lib/paraglide/messages.js';
import {
	confirmEmailChange,
	requestEmailChange,
	saveUser,
	setupRecoveryKey,
	verifyCurrentPassword
} from '$lib/server/form/actions';
import { userFormValidator } from '$lib/server/form/validators';
import stripeInstance, {
	getActiveSubscription,
	getOrgInvoices,
	getStripePortalUrl
} from '$lib/server/stripe';
import { getUserEncryptionKeyStore } from '$lib/server/user';
import {
	changeEmailConfirmFormSchema,
	changeEmailRequestFormSchema,
	passwordFormSchema,
	recoverySetupFormSchema
} from '$lib/validators/formSchemas';

import type { Actions, PageServerLoad } from './$types';

async function getProductName(subscription: import('stripe').Stripe.Subscription) {
	const productId = subscription.items.data[0]?.plan?.product;
	if (!productId || typeof productId !== 'string') return null;
	const product = await stripeInstance.products.retrieve(productId);
	return product.name;
}

export const load: PageServerLoad = async ({ locals, url }) => {
	const user = locals.user;
	if (!user) {
		return redirectLocalized(307, '/signup');
	}

	const keyStore = user.encryptionEnabled ? await getUserEncryptionKeyStore(user.id) : null;

	let subscription: import('stripe').Stripe.Subscription | null = null;
	let invoices: import('stripe').Stripe.Invoice[] = [];
	let stripePortalUrl: string | null = null;
	let planName: string | null = null;

	const billingReturnUrl = getAbsoluteLocalizedUrl(url.origin, '/account/profile');

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
	} catch (e) {
		console.error(e);
	}

	return {
		user,
		userForm: await userFormValidator(user),
		pageTitle: m.novel_proud_anaconda_zoom(),
		encryptionEnabled: user.encryptionEnabled ?? false,
		hasRecoveryKey: !!keyStore?.recoveryKeyHash,
		keyStore: keyStore
			? {
					pdkSalt: keyStore.pdkSalt,
					pdkIterations: keyStore.pdkIterations,
					encryptedMasterKey: keyStore.encryptedMasterKey
				}
			: null,
		recoveryPasswordForm: await superValidate(zod4(passwordFormSchema()), {
			id: 'recovery-password-form'
		}),
		recoveryForm: await superValidate(zod4(recoverySetupFormSchema()), {
			id: 'recovery-setup-form'
		}),
		changeEmailRequestForm: await superValidate(zod4(changeEmailRequestFormSchema()), {
			id: 'change-email-request-form'
		}),
		changeEmailConfirmForm: await superValidate(zod4(changeEmailConfirmFormSchema()), {
			id: 'change-email-confirm-form'
		}),
		subscription,
		invoices,
		stripePortalUrl,
		planName
	};
};

export const actions: Actions = {
	saveUser,
	verifyCurrentPassword,
	setupRecoveryKey,
	requestEmailChange,
	confirmEmailChange
};
