import type { Download, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

let page: Page;
let secretUrl: string;
const downloads: Download[] = [];

test.beforeAll(async ({ browser }) => {
	page = await browser.newPage();

	// Strip the Vercel bypass header from S3 requests — S3 CORS rejects unknown headers
	// in preflight, causing the upload to fail with a network error.
	await page.route(/flow\.swiss/, async (route) => {
		const headers = { ...route.request().headers() };
		delete headers['x-vercel-protection-bypass'];
		await route.continue({ headers });
	});

	page.on('download', (download) => downloads.push(download));
});

test.afterAll(async () => {
	await page.close();
});

test('Multiple files upload together', async ({ baseURL }) => {
	await page.goto('/file');

	page.on('console', (msg) => {
		if (msg.type() === 'error') {
			console.log(`[BROWSER ERROR] ${msg.text()}`);
		}
	});

	await page
		.locator("input[type='file']")
		.setInputFiles(['src/app.html', 'svelte.config.js', 'package.json']);

	// Every file is listed, and the footer counts them.
	await expect(page.getByTestId('file-upload-summary')).toContainText('3 files');

	// The submit button stays disabled until the last upload lands.
	await expect(page.getByTestId('secret-form-submit')).toBeEnabled({ timeout: 30000 });

	const responsePromise = page.waitForResponse((r) => r.url().includes('?/postSecret'));
	await page.getByTestId('secret-form-submit').click();
	await responsePromise;

	await expect(page.getByTestId('secret-link')).toBeVisible({ timeout: 15000 });
	secretUrl = (await page.getByTestId('secret-link').textContent())?.trim() ?? '';

	expect(secretUrl).toContain(`${baseURL}/s#`);
});

test('Reveal lists every file instead of auto-downloading', async () => {
	await page.goto(secretUrl);
	await page.getByTestId('revelation-form-submit').click();

	await expect(page.getByTestId('download-all-files')).toBeVisible({ timeout: 15000 });

	for (const name of ['app.html', 'svelte.config.js', 'package.json']) {
		await expect(page.getByText(name, { exact: true })).toBeVisible();
	}

	// Nothing downloads until the recipient asks for it.
	expect(downloads).toHaveLength(0);
});

test('Download all retrieves every file', async () => {
	await page.getByTestId('download-all-files').click();

	await expect.poll(() => downloads.length, { timeout: 60000 }).toBe(3);

	expect(downloads.map((d) => d.suggestedFilename()).sort()).toEqual([
		'app.html',
		'package.json',
		'svelte.config.js'
	]);
});

test(`Files can't be accessed twice`, async () => {
	await page.reload();
	await expect(page.getByTestId('alert-error')).toBeVisible();
});
