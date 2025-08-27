import { render } from 'svelte/server';

import { emailSupport } from '$lib/data/app';
import EmailContact from '$lib/emails/email-contact.svelte';
import EmailOrganizationInvitation from '$lib/emails/email-organization-invitation.svelte';
import EmailOtpVerification from '$lib/emails/email-otp-verification.svelte';
import EmailReadReceipt from '$lib/emails/email-read-receipt.svelte';
import EmailSubscriptionTrialStart from '$lib/emails/email-subscription-trial-start.svelte';
import EmailWelcome from '$lib/emails/email-welcome.svelte';
import { m } from '$lib/paraglide/messages.js';

import sendTransactionalEmail from './resend';

export const sendVerificationEmail = async (email: string, code: string) => {
	const { html } = render(EmailOtpVerification, { props: { code } });
	await sendTransactionalEmail({
		subject: m.sunny_this_falcon_coax(),
		to: email,
		html: html
	});
	console.log(`To ${email}: Your verification code is ${code}`);
};

export const sendWelcomeEmail = async (email: string, name?: string) => {
	const { html } = render(EmailWelcome, { props: { name } });
	await sendTransactionalEmail({
		subject: m.pink_crisp_snail_flow(),
		to: email,
		html: html
	});
};

export const sendContactEmail = async (email: string, content: string) => {
	const { html } = render(EmailContact, { props: { message: content, email } });
	await sendTransactionalEmail({
		subject: `New message from ${email}`,
		to: emailSupport,
		html: html
	});
};

export const sendReidReceiptEmail = async (email: string, receiptId: string) => {
	const { html } = render(EmailReadReceipt, { props: { receiptId } });
	await sendTransactionalEmail({
		subject: m.spry_bald_guppy_cry(),
		to: email,
		html: html
	});
	console.log(`Send read receipt to ${email}.`);
};

export const sendSubscriptionTrialStartEmail = async (
	email: string,
	planName: string,
	name?: string
) => {
	const { html } = render(EmailSubscriptionTrialStart, { props: { planName, name } });
	await sendTransactionalEmail({
		subject: m.level_every_chicken_fall(),
		to: email,
		html: html
	});
};

export const sendOrganisationInvitationEmail = async (
	email: string,
	token: string,
	name: string
) => {
	const { html } = render(EmailOrganizationInvitation, { props: { token, name } });
	await sendTransactionalEmail({
		subject: m.formal_each_zebra_pull({ name }),
		to: email,
		html: html
	});
	console.log(`To ${email}:  Invitation OTP-token is ${token}`);
};
