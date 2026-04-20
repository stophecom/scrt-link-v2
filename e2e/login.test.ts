import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

const email = process.env.E2E_USER_EMAIL || 'e2e@scrt.link';
const password = process.env.E2E_USER_PASSWORD || 'foobar123';

let page: Page;

test.beforeAll(async ({ browser }) => {
	page = await browser.newPage();
});

test.afterAll(async () => {
	await page.close();
});

test('Login page loads', async () => {
	await page.goto('/login');
	await expect(page.locator('h1')).toContainText('Sign in');
	await expect(page.getByTestId('input-email')).toBeVisible();
});

test('Email step submits and navigates to password page', async () => {
	await page.waitForLoadState('networkidle');
	await page.getByTestId('input-email').fill(email);

	const submitEmailBtn = page.getByTestId('submit-email');
	await expect(submitEmailBtn).toBeEnabled();

	const responsePromise = page.waitForResponse((response) =>
		response.url().includes('?/loginWithEmail')
	);
	await submitEmailBtn.click();
	await responsePromise;

	await page.waitForURL('**/login/password', { timeout: 10000 });
	await expect(page.getByTestId('input-password')).toBeVisible();
});

test('Password step submits and redirects to authenticated area', async () => {
	// Fill email if not pre-filled from cookie
	const emailInput = page.getByTestId('input-email');
	const currentEmail = await emailInput.inputValue();
	if (!currentEmail) {
		await emailInput.fill(email);
	}
	// Wait for hydration before interacting
	await page.waitForLoadState('networkidle');

	const passwordInput = page.getByTestId('input-password');
	await passwordInput.click();
	await passwordInput.fill(password);
	// Verify the value was set in the reactive binding
	await expect(passwordInput).toHaveValue(password);

	const submitBtn = page.getByTestId('submit-login');
	await expect(submitBtn).toBeEnabled();

	await Promise.all([page.waitForURL(/\/account/, { timeout: 15000 }), submitBtn.click()]);

	const url = page.url();
	expect(url).toMatch(/\/account/);
	expect(url).not.toContain('/login');
});

test('User is authenticated after login', async () => {
	await page.goto('/account/secrets');

	// If encryption guard is active, we might be redirected to /account/encryption
	const url = page.url();
	expect(url).toMatch(/\/account/);
	expect(url).not.toContain('/login');
});
