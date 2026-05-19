import type { PlaywrightTestConfig } from '@playwright/test';
// Run local tests headed: PUBLIC_ENV=development pnpm test:e2e --ui --headed
const isLocalTest = process.env.PUBLIC_ENV === 'development';

const sharedProjects: PlaywrightTestConfig['projects'] = [
	{ name: 'setup', testMatch: /global\.setup\.ts/ },
	{
		name: 'e2e',
		dependencies: ['setup'],
		testIgnore: /global\.setup\.ts/
	}
];

// Runs in local webserver
const config: PlaywrightTestConfig = {
	// webServer: {
	// 	command: 'VERCEL_URL=http://localhost:5173 pnpm run build && pnpm run preview',
	// 	port: 4173
	// },
	use: {
		baseURL: 'https://localhost:5173',
		contextOptions: {
			permissions: ['clipboard-read', 'clipboard-write']
		},
		video: 'off',
		screenshot: 'only-on-failure'
	},
	testDir: 'e2e',
	projects: sharedProjects
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
		baseURL: process.env.VERCEL_URL
	},
	testDir: 'e2e',
	projects: sharedProjects
};

export default isLocalTest ? config : configPublished;
