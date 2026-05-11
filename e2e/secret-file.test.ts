import type { Download, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

let page: Page;
let secretUrl: string;
let download: Download;

test.beforeAll(async ({ browser }) => {
	page = await browser.newPage();
});

test.afterAll(async () => {
	await page.close();
});

test('File upload', async ({ baseURL }) => {
	await page.goto('/file');

	page.on('response', async (response) => {
		if (response.status() >= 400) {
			console.log(`<< ${response.status()} ${response.statusText()}:`, response.url());
			try {
				const body = await response.text();
				console.log('Error Body:', body.slice(0, 1000));
			} catch (e) {
				console.log('Could not read response body', e);
			}
		}
	});

	page.on('requestfailed', (request) => {
		console.log(`[REQUEST FAILED] ${request.method()} ${request.url()} — ${request.failure()?.errorText}`);
	});

	page.on('console', (msg) => {
		if (msg.type() === 'error') {
			console.log(`[BROWSER ERROR] ${msg.text()}`);
		}
	});

	// Upload a file via the hidden file input inside the drop zone
	await page.locator("input[type='file']").setInputFiles('src/app.html');

	// Wait for the S3 upload to finish — the submit button is disabled while uploading
	await expect(page.getByTestId('secret-form-submit')).toBeEnabled({ timeout: 30000 });

	const responsePromise = page.waitForResponse((r) => r.url().includes('?/postSecret'));
	await page.getByTestId('secret-form-submit').click();
	await responsePromise;

	await expect(page.getByTestId('secret-link')).toBeVisible({ timeout: 15000 });
	secretUrl = (await page.getByTestId('secret-link').textContent())?.trim() ?? '';

	expect(secretUrl).toContain(`${baseURL}/s#`);
});

test('Download page renders correctly', async () => {
	await page.goto(secretUrl);
	await expect(page.locator('h1')).toBeVisible();
	await expect(page.getByTestId('revelation-form-submit')).toBeVisible();
});

test('File download succeeds', async () => {
	const downloadPromise = page.waitForEvent('download');
	await page.getByTestId('revelation-form-submit').click();
	download = await downloadPromise;

	expect(download.suggestedFilename()).toMatch(/\.html$/);
	expect(downloadPromise).resolves.toBeDefined();
});

test(`File can't be accessed twice`, async () => {
	await page.reload();
	await expect(page.getByTestId('alert-error')).toBeVisible();
});
