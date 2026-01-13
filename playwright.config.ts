import type { PlaywrightTestConfig } from '@playwright/test';

// Run local tests headed: PUBLIC_ENV=development npm run test -- --headed
const isLocalTest = process.env.PUBLIC_ENV === 'development';

// Runs in local webserver
const config: PlaywrightTestConfig = {
	use: {
		contextOptions: {
			permissions: ['clipboard-read', 'clipboard-write']
		},
		video: 'off',
		screenshot: 'only-on-failure'
	},
	webServer: {
		command: 'VERCEL_URL=http://localhost:5173 pnpm run build && pnpm run preview',
		port: 4173
	},
	testDir: 'e2e'
};

// Runs on published websites
const configPublished: PlaywrightTestConfig = {
	timeout: 60000,
	use: {
		extraHTTPHeaders: {
			'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET || ''
		},
		contextOptions: {
			permissions: ['clipboard-read', 'clipboard-write']
		},
		video: 'on',
		screenshot: 'only-on-failure',
		baseURL: process.env.VERCEL_URL || 'http://localhost:5173'
	},

	testDir: 'e2e'
};

export default isLocalTest ? config : configPublished;
