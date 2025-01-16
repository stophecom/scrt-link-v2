import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
	{
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
