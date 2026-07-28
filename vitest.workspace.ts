import { fileURLToPath } from 'node:url';

import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
	{
		// The unit project doesn't run the SvelteKit plugin, so `$lib` imports
		// (e.g. file-transfer.ts -> $lib/api) need resolving by hand.
		resolve: {
			alias: {
				$lib: fileURLToPath(new URL('./src/lib', import.meta.url))
			}
		},
		test: {
			// an example of file based convention,
			// you don't have to follow it
			// include: ['tests/unit/**/*.{test,spec}.ts', 'tests/**/*.unit.{test,spec}.ts'],
			include: ['src/**/*.{test,spec}.{js,ts}'],
			exclude: ['src/**/*browser*.{test,spec}.{js,ts}'],
			name: 'unit',
			environment: 'node'
		}
	},
	{
		test: {
			// an example of file based convention,
			// you don't have to follow it
			// include: ['tests/browser/**/*.{test,spec}.ts', 'tests/**/*.browser.{test,spec}.ts'],
			include: ['src/**/*.browser.{test,spec}.{js,ts}'],
			name: 'browser',
			browser: {
				enabled: true,
				instances: [{ browser: 'chromium' }]
			}
		}
	}
]);
