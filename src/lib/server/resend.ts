import { type CreateEmailOptions, Resend } from 'resend';

import { RESEND_API } from '$env/static/private';
import { appName, emailSupport } from '$lib/data/app';

const resend = new Resend(RESEND_API);

const sendTransactionalEmail = async ({
	html,
	...options
}: Omit<CreateEmailOptions, 'html' | 'from'> & { html: string }) => {
	const { error } = await resend.emails.send({
		from: `${appName} <${emailSupport}>`,
		html: html,
		...options
	});

	if (error) {
		return console.error({ error });
	}
};

export default sendTransactionalEmail;
