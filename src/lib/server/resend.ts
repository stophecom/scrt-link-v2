import {
	type CreateContactOptions,
	type CreateEmailOptions,
	type RemoveContactOptions,
	Resend
} from 'resend';

import { RESEND_API } from '$env/static/private';
import type { MakeOptional } from '$lib/typescript-helpers';

import { appName, emailSupport } from '../data/app';

const resend = new Resend(RESEND_API);

const sendTransactionalEmail = async ({
	html,
	...options
}: Omit<CreateEmailOptions, 'html' | 'from'> & { html: string }) => {
	const { error } = await resend.emails.send({
		...options,
		html: html,
		from: `${appName} <${emailSupport}>`
	});

	if (error) {
		return console.error({ error });
	}
};

export const addContactToAudience = async ({
	email,
	audienceId = '5f72f540-84a5-4e2a-9d2d-c775b4d09f35', // MQL
	...props
}: MakeOptional<CreateContactOptions, 'audienceId'>) => {
	return await resend.contacts.create({
		email: email,
		unsubscribed: false,
		audienceId: audienceId,
		...props
	});
};

export const removeContactFromAudience = async ({
	email,
	audienceId = '5f72f540-84a5-4e2a-9d2d-c775b4d09f35' // MQL
}: MakeOptional<RemoveContactOptions, 'audienceId'>) => {
	// Delete by contact email
	return resend.contacts.remove({
		email: email,
		audienceId: audienceId
	});
};

export default sendTransactionalEmail;
