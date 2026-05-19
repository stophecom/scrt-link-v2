import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { authFile } from './auth';

test.describe.configure({ mode: 'serial' });

const password = process.env.E2E_USER_PASSWORD || 'foobar123';

const VIEW_LIMIT = 3;
const secret = 'Multi-view secret content.';

let page: Page;
let secretUrl: string;

test.beforeAll(async ({ browser }) => {
	const context = await browser.newContext({ storageState: authFile });
	page = await context.newPage();

	// Unlock the in-memory master key via the encryption page (session is pre-loaded
	// from storageState, so no new login request is made).
	await page.goto('/encryption');
	await expect(page.getByTestId('input-password')).toBeVisible({ timeout: 10000 });
	await page.getByTestId('input-password').fill(password);
	await page.getByTestId('submit-unlock').click();
	await page.waitForURL(/\/account/, { timeout: 15000 });
	await page.waitForLoadState('networkidle');
});

test.afterAll(async () => {
	await page.context().close();
});

test('Create a secret with viewLimit > 1', async ({ baseURL }) => {
	await page.goto('/text');
	// Wait for onMount/setCryptoKeys to finish — submit becomes enabled only after privateKey is set
	await expect(page.getByTestId('secret-form-submit')).toBeEnabled({ timeout: 15000 });

	await page.getByTestId('input-secret-content').fill(secret);

	const toggle = page.getByTestId('secret-form-more-options');
	const viewLimitInput = page.locator('input[name="viewLimit"]');
	if ((await toggle.getAttribute('aria-pressed')) !== 'true') {
		await toggle.click();
		await expect(viewLimitInput).toBeVisible({ timeout: 5000 });
	}
	await viewLimitInput.fill(String(VIEW_LIMIT));

	await expect(page.getByTestId('secret-form-submit')).toBeEnabled();

	const responsePromise = page.waitForResponse((r) => r.url().includes('?/postSecret'));
	await page.getByTestId('secret-form-submit').click();
	await responsePromise;

	await expect(page.getByTestId('copy-link')).toBeVisible({ timeout: 15000 });
	await page.getByTestId('copy-link').click();
	secretUrl = await page.evaluate(() => navigator.clipboard.readText());

	expect(secretUrl).toContain(`${baseURL}/s#`);
});

test('First reveal succeeds and secret content is shown', async () => {
	await page.goto(secretUrl);
	await expect(page.getByTestId('revelation-form-submit')).toBeVisible({ timeout: 10000 });
	await page.getByTestId('revelation-form-submit').click();
	await expect(page.getByTestId('secret-revelation-content')).toContainText(secret, {
		timeout: 10000
	});
});

test('Second visit shows the secret again (not yet destroyed)', async () => {
	// Navigate away first — the secret URL is a hash URL (/s#key), and browsers
	// won't reload the page when navigating to the same hash, leaving stale state.
	await page.goto('/');
	await page.goto(secretUrl);
	await expect(page.getByTestId('revelation-form-submit')).toBeVisible({ timeout: 10000 });
	await page.getByTestId('revelation-form-submit').click();
	await expect(page.getByTestId('secret-revelation-content')).toContainText(secret, {
		timeout: 10000
	});
});

test('Third (final) reveal succeeds', async () => {
	await page.goto('/');
	await page.goto(secretUrl);
	await expect(page.getByTestId('revelation-form-submit')).toBeVisible({ timeout: 10000 });
	await page.getByTestId('revelation-form-submit').click();
	await expect(page.getByTestId('secret-revelation-content')).toContainText(secret, {
		timeout: 10000
	});
});

test('Secret is permanently destroyed after the final view', async () => {
	await page.goto('/');
	await page.goto(secretUrl);
	await expect(page.getByTestId('alert-error')).toBeVisible({ timeout: 10000 });
	await expect(page.getByTestId('revelation-form-submit')).not.toBeVisible();
});
