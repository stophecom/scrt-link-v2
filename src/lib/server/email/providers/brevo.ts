import { BrevoClient } from '@getbrevo/brevo';

import { BREVO_API, BREVO_MQL_LIST_ID } from '$env/static/private';

import { appName, emailNoReply } from '../../../data/app';
import type { EmailProvider } from '../types';

const brevo = new BrevoClient({ apiKey: BREVO_API });

// Brevo identifies contact lists by numeric id.
const mqlListId = Number(BREVO_MQL_LIST_ID);
const hasMqlList = Number.isInteger(mqlListId) && mqlListId > 0;

const toRecipients = (to: string | string[]) =>
	(Array.isArray(to) ? to : [to]).map((email) => ({ email }));

export const brevoProvider: EmailProvider = {
	async send({ to, subject, html, replyTo }) {
		try {
			await brevo.transactionalEmails.sendTransacEmail({
				subject,
				htmlContent: html,
				sender: { name: appName, email: emailNoReply },
				to: toRecipients(to),
				...(replyTo ? { replyTo: { email: replyTo } } : {})
			});
		} catch (error) {
			console.error({ error });
		}
	},

	audiences: {
		async add({ email }) {
			if (!hasMqlList) return;
			// updateEnabled avoids a 4xx when the contact already exists.
			await brevo.contacts.createContact({
				email,
				listIds: [mqlListId],
				updateEnabled: true
			});
		},
		async remove({ email }) {
			if (!hasMqlList) return;
			await brevo.contacts.removeContactFromList({
				listId: mqlListId,
				body: { emails: [email] }
			});
		}
	}
};
