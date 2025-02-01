import { createEmail, emailList, sendEmail } from 'svelte-email-tailwind/preview';

import { RESEND_API } from '$env/static/private';

export async function load() {
	// return the list of email components
	return { previewData: emailList() };
}

export const actions = {
	// Pass in the two actions. Provide your Resend API key.
	...createEmail,
	...sendEmail({ resendApiKey: RESEND_API })
};
