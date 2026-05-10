import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

const email = process.env.E2E_USER_EMAIL || 'e2e@scrt.link';
const password = process.env.E2E_USER_PASSWORD || 'foobar123';

const VIEW_LIMIT = 3;
const secret = 'Multi-view secret content.';

let page: Page;
let secretUrl: string;

test.beforeAll(async ({ browser }) => {
	page = await browser.newPage();

	// Log in — viewLimit > 1 requires a paid-tier account
	await page.goto('/login');
	await page.waitForLoadState('networkidle');
	await page.getByTestId('input-email').fill(email);

	const emailResponse = page.waitForResponse((r) => r.url().includes('?/loginWithEmail'));
	await page.getByTestId('submit-email').click();
	await emailResponse;

	await page.waitForURL('**/login/password', { timeout: 10000 });

	const emailInput = page.getByTestId('input-email');
	if (!(await emailInput.inputValue())) {
		await emailInput.fill(email);
	}
	await page.waitForLoadState('networkidle');
	const passwordInput = page.getByTestId('input-password');
	await passwordInput.click();
	await passwordInput.fill(password);
	await expect(passwordInput).toHaveValue(password);

	await Promise.all([
		page.waitForURL(/\/account/, { timeout: 15000 }),
		page.getByTestId('submit-login').click()
	]);
});

test.afterAll(async () => {
	await page.close();
});

test('Create a secret with viewLimit > 1', async ({ baseURL }) => {
	await page.goto('/text');

	await page.getByTestId('input-secret-content').fill(secret);

	await page.getByTestId('secret-form-more-options').click();

	const viewLimitInput = page.locator('input[name="viewLimit"]');
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
	await page.goto(secretUrl);
	await expect(page.getByTestId('revelation-form-submit')).toBeVisible({ timeout: 10000 });
	await page.getByTestId('revelation-form-submit').click();
	await expect(page.getByTestId('secret-revelation-content')).toContainText(secret, {
		timeout: 10000
	});
});

test('Third (final) reveal succeeds', async () => {
	await page.goto(secretUrl);
	await expect(page.getByTestId('revelation-form-submit')).toBeVisible({ timeout: 10000 });
	await page.getByTestId('revelation-form-submit').click();
	await expect(page.getByTestId('secret-revelation-content')).toContainText(secret, {
		timeout: 10000
	});
});

test('Secret is permanently destroyed after the final view', async () => {
	await page.goto(secretUrl);
	await expect(page.getByTestId('alert-error')).toBeVisible({ timeout: 10000 });
	await expect(page.getByTestId('revelation-form-submit')).not.toBeVisible();
});
