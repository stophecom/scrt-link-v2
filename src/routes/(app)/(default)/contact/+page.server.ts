import { type Actions, error } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { render } from 'svelte/server';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { RECAPTCHA_SERVER_KEY } from '$env/static/private';
import { emailSupport } from '$lib/data/app';
import EmailContact from '$lib/emails/email-contact.svelte';
import { m } from '$lib/paraglide/messages.js';
import sendTransactionalEmail from '$lib/server/resend';
import { contactFormSchema } from '$lib/validators/formSchemas';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(contactFormSchema()))
	};
};

export const actions: Actions = {
	contact: async (event) => {
		const form = await superValidate(event.request, zod(contactFormSchema()));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { email, content, recaptchaToken } = form.data;

		// Verify reCAPTCHA token with Google API
		const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';

		const response = await fetch(verifyUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({
				secret: RECAPTCHA_SERVER_KEY,
				response: recaptchaToken
			})
		});

		const data = await response.json();

		if (!data.success || data.score < 0.5) {
			error(400, m.front_wise_spider_hunt());
		}

		try {
			// We send an email
			const { html } = render(EmailContact, { props: { message: content, email } });
			await sendTransactionalEmail({
				subject: `New message from ${email}`,
				to: emailSupport,
				html: html
			});
		} catch (e) {
			console.error(e);
			error(400, 'Something went wrong.');
		}

		return message(form, {
			status: 'success',
			title: m.low_many_porpoise_dazzle(),
			description: m.away_free_crow_vent()
		});
	}
};
