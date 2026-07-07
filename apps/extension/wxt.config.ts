import { defineConfig } from 'wxt';

// https://wxt.dev/api/config.html
export default defineConfig({
	modules: ['@wxt-dev/module-svelte'],
	manifest: {
		name: 'scrt.link — Share a secret',
		description: 'Create an encrypted, one-time-view secret link in one click.',
		permissions: ['storage', 'clipboardWrite'],
		host_permissions: ['https://scrt.link/*'],
		action: {
			default_title: 'Share a secret'
		},
		browser_specific_settings: {
			gecko: {
				id: 'scrt-link@scrt.link'
			}
		}
	}
});
