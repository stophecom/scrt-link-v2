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

test.skip('File upload ', async ({ baseURL }) => {
	await page.goto('/file');

	// page.on('request', (request) => console.log('>>', request.method(), request.url()));
	page.on('response', (response) => console.log('<<', response.status(), response.url()));
	const responsePromise = page.waitForResponse(
		'https://scrt-link-v2-development.os.zrh1.flow.swiss/'
	);
	await page.locator("input[type='file']").setInputFiles('src/app.html');

	const response = await responsePromise;
	console.log(response);

	await page.getByTestId('secret-form-submit').click();
	await page.getByTestId('copy-link').click();
	secretUrl = await page.evaluate(() => navigator.clipboard.readText());

	expect(secretUrl).toContain(`${baseURL}/s#`);
});

test.skip('Download page renders correctly', async () => {
	await page.goto(secretUrl);
	await expect(page.locator('h1')).toBeVisible();
	await expect(page.getByTestId('revelation-form-submit')).toBeVisible();
});

test.skip('File download succeeds', async () => {
	// Download file
	// Start waiting for download before clicking. Note no await.
	const downloadPromise = page.waitForEvent('download');
	await page.getByTestId('revelation-form-submit').click();
	download = await downloadPromise;

	expect(download.suggestedFilename()).toMatch(/\.html$/);

	expect(downloadPromise).resolves.toBeDefined();
});

test.skip(`File can't be accessed twice`, async () => {
	await page.reload();
	await expect(page.getByTestId('alert-error')).toBeVisible();
});
