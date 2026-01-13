import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

let page: Page;
let secretUrl: string;
const secret = 'Top secret information.';

test.beforeAll(async ({ browser }) => {
	page = await browser.newPage();
});

test.afterAll(async () => {
	await page.close();
});

test('Add text secret ', async ({ baseURL }) => {
	await page.goto('/text');

	await page.getByTestId('input-secret-content').fill(secret);

	await expect(page.getByTestId('secret-form-submit')).toBeEnabled();
	page.on('response', async (response) => {
		if (response.status() >= 400) {
			console.log(`<< ${response.status()} ${response.statusText()}:`, response.url());
			// Try to read body for more info
			try {
				const body = await response.text();
				console.log('Error Body:', body.slice(0, 1000));
			} catch (e) {
				console.log('Could not read response body', e);
			}
		}
	});

	await page.getByTestId('secret-form-submit').click();

	await expect(page.getByTestId('copy-link')).toBeVisible();
	await page.getByTestId('copy-link').click();
	secretUrl = await page.evaluate(() => navigator.clipboard.readText());

	expect(secretUrl).toContain(`${baseURL}/s#`);
});

test('Revelation page renders correctly', async () => {
	await page.goto(secretUrl);
	await expect(page.locator('h1')).toBeVisible();
	await expect(page.getByTestId('revelation-form-submit')).toBeVisible();
});

test('Secret is revealed correctly', async () => {
	await page.getByTestId('revelation-form-submit').click();

	await expect(page.getByTestId('secret-revelation-content')).toContainText(secret);
});

test(`Secret can't be accessed twice`, async () => {
	await page.reload();
	await expect(page.getByTestId('alert-error')).toBeVisible();
});
