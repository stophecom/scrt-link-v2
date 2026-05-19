import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { authFile } from './auth';

test.describe.configure({ mode: 'serial' });

const password = process.env.E2E_USER_PASSWORD || 'foobar123';

let page: Page;
let requestLink: string;
let receiptId: string;

// Separate request used for the file-attachment flow
let attachmentRequestLink: string;
let attachmentReceiptId: string;

const noteText = 'Please provide secret.';
const responseText = 'Some secret';
const attachmentNoteText = 'Please attach the file.';

test.beforeAll(async ({ browser }) => {
	const context = await browser.newContext({ storageState: authFile });
	page = await context.newPage();

	// Strip the Vercel bypass header from S3 requests — S3 CORS rejects unknown
	// headers in preflight, causing the attachment upload to fail.
	await page.route(/flow\.swiss/, async (route) => {
		const headers = { ...route.request().headers() };
		delete headers['x-vercel-protection-bypass'];
		await route.continue({ headers });
	});

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

test('Create a secret request with note', async () => {
	await page.goto('/account/requests');
	await page.waitForURL('**/account/requests', { timeout: 15000 });
	await page.waitForLoadState('networkidle');

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
	const responsePromise = page.waitForResponse((r) => r.url().includes('?/postSecretResponse'));
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

test('Create a secret request that allows an attachment', async () => {
	await page.goto('/account/requests');
	await page.waitForURL('**/account/requests', { timeout: 15000 });
	await page.waitForLoadState('networkidle');

	await expect(page.getByTestId('input-request-note')).toBeVisible({ timeout: 15000 });
	await page.getByTestId('input-request-note').fill(attachmentNoteText);

	// Enable file attachments for this request
	await page.getByTestId('input-allow-attachment').click();

	await expect(page.getByTestId('submit-request')).toBeEnabled({ timeout: 10000 });
	const responsePromise = page.waitForResponse((r) => r.url().includes('?/postSecretRequest'));
	await page.getByTestId('submit-request').click();
	await responsePromise;

	await expect(page.getByTestId('request-link')).toBeVisible({ timeout: 15000 });
	attachmentRequestLink = (await page.getByTestId('request-link').textContent())?.trim() ?? '';
	expect(attachmentRequestLink).toContain('/r/');

	const successMessage = (await page.getByTestId('request-success-message').textContent()) ?? '';
	const receiptMatch = successMessage.match(/receipt code is:\s*(\w+)/i);
	expect(receiptMatch).toBeTruthy();
	attachmentReceiptId = receiptMatch![1];
});

test('Response page accepts a file attachment', async () => {
	await page.goto(attachmentRequestLink);
	await page.waitForLoadState('networkidle');

	// The upload field is only present when attachments are allowed
	const fileInput = page.locator("input[type='file']");
	await expect(fileInput).toBeAttached({ timeout: 10000 });

	// Upload a file (file-only response — no text)
	await fileInput.setInputFiles('src/app.html');

	// Submit is disabled while the encrypted chunk uploads to S3
	await expect(page.getByTestId('submit-response')).toBeEnabled({ timeout: 30000 });

	const responsePromise = page.waitForResponse((r) => r.url().includes('?/postSecretResponse'));
	await page.getByTestId('submit-response').click();
	await responsePromise;

	await expect(page.getByTestId('response-success')).toBeVisible({ timeout: 15000 });
});

test('Requester can view and download the attachment', async () => {
	await page.goto('/account/requests');
	await page.waitForLoadState('networkidle');

	await expect(page.getByTestId('request-receipt-id').first()).toBeVisible({ timeout: 15000 });

	// Find the row matching our attachment request and open it
	const receiptCells = page.getByTestId('request-receipt-id');
	const count = await receiptCells.count();
	let opened = false;
	for (let i = 0; i < count; i++) {
		const text = await receiptCells.nth(i).textContent();
		if (text?.trim() === attachmentReceiptId) {
			const row = receiptCells.nth(i).locator('xpath=ancestor::tr');
			await row.getByTestId('view-response').click();
			opened = true;
			break;
		}
	}
	expect(opened).toBe(true);

	// Attachment metadata card + download button are shown after decryption
	await expect(page.getByTestId('decrypted-attachment')).toBeVisible({ timeout: 15000 });
	await expect(page.getByTestId('download-attachment')).toBeVisible({ timeout: 15000 });

	// Download decrypts the file client-side and saves it
	const downloadPromise = page.waitForEvent('download');
	await page.getByTestId('download-attachment').click();
	const download = await downloadPromise;
	expect(download.suggestedFilename()).toMatch(/\.html$/);
});
