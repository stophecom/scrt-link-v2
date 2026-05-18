import fs from 'fs';
import path from 'path';

import { expect, test as setup } from '@playwright/test';

import { authFile } from './auth';

const email = process.env.E2E_USER_EMAIL || 'e2e@scrt.link';
const password = process.env.E2E_USER_PASSWORD || 'foobar123';

setup('authenticate', async ({ page }) => {
	fs.mkdirSync(path.dirname(authFile), { recursive: true });

	await page.goto('/login');
	await page.waitForLoadState('networkidle');
	await page.getByTestId('input-email').fill(email);

	const emailResponse = page.waitForResponse((r) => r.url().includes('?/loginWithEmail'));
	await page.getByTestId('submit-email').click();
	await emailResponse;

	await page.waitForURL('**/login/password', { timeout: 10000 });
	await page.waitForLoadState('networkidle');

	const emailInput = page.getByTestId('input-email');
	if (!(await emailInput.inputValue())) {
		await emailInput.fill(email);
	}

	const passwordInput = page.getByTestId('input-password');
	await passwordInput.click();
	await passwordInput.fill(password);
	await expect(passwordInput).toHaveValue(password);

	await Promise.all([
		page.waitForURL(/\/account/, { timeout: 15000 }),
		page.getByTestId('submit-login').click()
	]);

	await page.context().storageState({ path: authFile });
});
