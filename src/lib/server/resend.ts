import { type CreateEmailOptions, Resend } from 'resend';

import { RESEND_API } from '$env/static/private';
import { appName, emailSupport } from '$lib/data/app';

const resend = new Resend(RESEND_API);

const transactionalEmail = async (options: Pick<CreateEmailOptions, 'to' | 'subject' | 'html'>) => {
	const { data, error } = await resend.emails.send({
		from: `${appName} <${emailSupport}>`,
		// subject: 'Hello World',
		html: '<strong>It works!</strong>',
		...options
	});

	if (error) {
		return console.error({ error });
	}

	console.log({ data });
};

export default transactionalEmail;
