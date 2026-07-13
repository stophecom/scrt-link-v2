import { fail } from '@sveltejs/kit';
import type { Component } from 'svelte';
import { render } from 'svelte/server';

import { wrapEmailDocument } from '$lib/emails/document';
import sendTransactionalEmail from '$lib/server/email';

// Auto-discover every transactional email template. Each renders with its own
// built-in default props (see the templates in $lib/emails).
const modules = import.meta.glob<{ default: Component }>('$lib/emails/*.svelte', {
	eager: true
});

const emails = new Map<string, Component>(
	Object.entries(modules).map(([path, mod]) => [
		path.split('/').pop()!.replace('.svelte', ''),
		mod.default
	])
);

const renderEmail = (name: string): string | null => {
	const component = emails.get(name);
	if (!component) return null;
	const { head, body } = render(component, { props: {} });
	return wrapEmailDocument(head, body);
};

export async function load() {
	const previews = [...emails.keys()].sort().map((name) => ({ name, html: renderEmail(name)! }));

	return { previews };
}

export const actions = {
	send: async ({ request }) => {
		const data = await request.formData();
		const name = String(data.get('name') ?? '');
		const to = String(data.get('to') ?? '');

		if (!to) {
			return fail(400, { error: 'Please enter a recipient email address.' });
		}

		const html = renderEmail(name);
		if (!html) {
			return fail(400, { error: `Unknown email template: ${name}` });
		}

		await sendTransactionalEmail({ to, subject: `[Preview] ${name}`, html });

		return { success: true, name, to };
	}
};
