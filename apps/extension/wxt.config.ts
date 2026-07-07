import { defineConfig } from 'wxt';

// https://wxt.dev/api/config.html
export default defineConfig({
	modules: ['@wxt-dev/module-svelte'],
	manifest: ({ browser }) => ({
		name: 'scrt.link — Share a secret',
		description: 'Create an encrypted, one-time-view secret link in one click.',
		permissions: ['storage', 'clipboardWrite'],
		host_permissions: ['https://scrt.link/*'],
		action: {
			default_title: 'Share a secret'
		},
		// Firefox/AMO-only. Chrome ignores browser_specific_settings, so we omit it
		// there to avoid an "unrecognized manifest key" warning.
		...(browser === 'firefox'
			? {
					browser_specific_settings: {
						gecko: {
							id: 'scrt-link@scrt.link',
							// Required by AMO for new extensions. scrt.link is zero-knowledge:
							// secrets are end-to-end encrypted (the server can't read them) and
							// the API key stays in local storage — so no user data is collected.
							data_collection_permissions: {
								required: ['none']
							}
						}
					}
				}
			: {})
	})
});
