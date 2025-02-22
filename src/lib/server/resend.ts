import { type CreateEmailOptions, Resend } from 'resend';

import { RESEND_API } from '$env/static/private';

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

export default sendTransactionalEmail;
