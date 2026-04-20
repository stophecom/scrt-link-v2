import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

const email = process.env.E2E_USER_EMAIL || 'e2e@scrt.link';
const password = process.env.E2E_USER_PASSWORD || 'foobar123';

let page: Page;
let requestLink: string;
let receiptId: string;

const noteText = 'Please provide secret.';
const responseText = 'Some secret';

test.beforeAll(async ({ browser }) => {
	page = await browser.newPage();
});

test.afterAll(async () => {
	await page.close();
});

test('Login and navigate to requests', async () => {
	// Login
	await page.goto('/login');
	await page.waitForLoadState('networkidle');
	await page.getByTestId('input-email').fill(email);

	const submitEmailBtn = page.getByTestId('submit-email');
	await expect(submitEmailBtn).toBeEnabled();

	const emailResponse = page.waitForResponse((r) => r.url().includes('?/loginWithEmail'));
	await submitEmailBtn.click();
	await emailResponse;

	await page.waitForURL('**/login/password', { timeout: 10000 });
	await page.waitForLoadState('networkidle');

	const passwordInput = page.getByTestId('input-password');
	await passwordInput.click();
	await passwordInput.fill(password);
	await expect(passwordInput).toHaveValue(password);

	const submitBtn = page.getByTestId('submit-login');
	await expect(submitBtn).toBeEnabled();
	await Promise.all([page.waitForURL(/\/account/, { timeout: 15000 }), submitBtn.click()]);

	expect(page.url()).toMatch(/\/account/);
});

test('Create a secret request with note', async () => {
	await page.goto('/account/requests');
	await page.waitForLoadState('networkidle');

	// Wait for encryption key to be restored and form to be ready
	await expect(page.getByTestId('input-request-note')).toBeVisible({ timeout: 15000 });

	// Fill in the note
	await page.getByTestId('input-request-note').fill(noteText);

	// Submit the request
	await expect(page.getByTestId('submit-request')).toBeEnabled({ timeout: 10000 });
	const responsePromise = page.waitForResponse((r) => r.url().includes('?/postSecretRequest'));
	await page.getByTestId('submit-request').click();
	await responsePromise;

	// Wait for success state with the request link
	await expect(page.getByTestId('request-link')).toBeVisible({ timeout: 15000 });
	requestLink = (await page.getByTestId('request-link').textContent())?.trim() ?? '';
	expect(requestLink).toContain('/r/');

	// Extract receipt ID from success message
	const successMessage = (await page.getByTestId('request-success-message').textContent()) ?? '';
	const receiptMatch = successMessage.match(/receipt code is:\s*(\w+)/i);
	expect(receiptMatch).toBeTruthy();
	receiptId = receiptMatch![1];
});

test('Response page shows note and accepts response', async () => {
	// Open the request link
	await page.goto(requestLink);
	await page.waitForLoadState('networkidle');

	// Verify the decrypted note is visible
	await expect(page.getByTestId('decrypted-note')).toBeVisible({ timeout: 10000 });
	await expect(page.getByTestId('decrypted-note')).toContainText(noteText);

	// Fill in the response
	await page.getByTestId('input-response-content').fill(responseText);

	// Submit the response
	const responsePromise = page.waitForResponse((r) => r.url().includes('/r/'));
	await page.getByTestId('submit-response').click();
	await responsePromise;

	// Verify success
	await expect(page.getByTestId('response-success')).toBeVisible({ timeout: 15000 });
});

test('Requests list shows unread item with matching receipt ID', async () => {
	await page.goto('/account/requests');
	await page.waitForLoadState('networkidle');

	// Wait for the table to load
	await expect(page.getByTestId('request-receipt-id').first()).toBeVisible({ timeout: 15000 });

	// Find the row with our receipt ID
	const receiptCells = page.getByTestId('request-receipt-id');
	const count = await receiptCells.count();

	let found = false;
	for (let i = 0; i < count; i++) {
		const text = await receiptCells.nth(i).textContent();
		if (text?.trim() === receiptId) {
			// Verify the status in the same row is "Unread"
			const row = receiptCells.nth(i).locator('xpath=ancestor::tr');
			const status = row.getByTestId('request-status-label');
			await expect(status).toContainText('Unread');
			found = true;
			break;
		}
	}

	expect(found).toBe(true);
});

test('View response and verify decrypted content', async () => {
	// Click the first "View" button (most recent request)
	await page.getByTestId('view-response').first().click();

	// Wait for decryption and verify the response content
	await expect(page.getByTestId('decrypted-response')).toBeVisible({ timeout: 15000 });
	await expect(page.getByTestId('decrypted-response')).toContainText(responseText);
});
