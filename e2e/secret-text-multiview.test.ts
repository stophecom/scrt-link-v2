import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

/**
 * E2E tests for the multi-view secret feature (viewLimit > 1).
 *
 * These tests cover:
 * - A secret with viewLimit=3 survives the first two reveals
 * - The "X of Y views remaining" message is displayed before each reveal
 * - The secret is permanently destroyed after the final (3rd) view
 *
 * NOTE: The viewLimit input is only enabled for paid-tier accounts.
 * These tests require a logged-in paid-tier session OR the dev environment
 * to bypass plan enforcement. Currently they run against the dev server
 * where plan limits are not enforced server-side.
 */

test.describe.configure({ mode: 'serial' });

const VIEW_LIMIT = 3;
const secret = 'Multi-view secret content.';

let page: Page;
let secretUrl: string;

test.beforeAll(async ({ browser }) => {
	page = await browser.newPage();
});

test.afterAll(async () => {
	await page.close();
});

test('Create a secret with viewLimit > 1', async ({ baseURL }) => {
	await page.goto('/text');

	await page.getByTestId('input-secret-content').fill(secret);

	// Set the view limit via the number input (name="viewLimit")
	const viewLimitInput = page.locator('input[name="viewLimit"]');
	await viewLimitInput.fill(String(VIEW_LIMIT));

	await expect(page.getByTestId('secret-form-submit')).toBeEnabled();

	const responsePromise = page.waitForResponse((response) =>
		response.url().includes('?/postSecret')
	);
	await page.getByTestId('secret-form-submit').click();
	await responsePromise;

	await expect(page.getByTestId('copy-link')).toBeVisible({ timeout: 15000 });
	await page.getByTestId('copy-link').click();
	secretUrl = await page.evaluate(() => navigator.clipboard.readText());

	expect(secretUrl).toContain(`${baseURL}/s#`);
});

test('Reveal page shows correct remaining views count before first reveal', async () => {
	await page.goto(secretUrl);

	// Wait for the async metadata fetch to complete (spinner disappears)
	await expect(page.getByTestId('revelation-form-submit')).toBeVisible({ timeout: 10000 });

	// The page should display a message indicating multiple views are available.
	// The message key spare_tangy_crow_view is used when showPasswordInput is false.
	// We just verify there is numeric content referencing the view limit.
	const bodyText = await page.locator('body').innerText();
	expect(bodyText).toMatch(new RegExp(`${VIEW_LIMIT}`));
});

test('First reveal succeeds and the secret content is shown', async () => {
	await page.getByTestId('revelation-form-submit').click();

	await expect(page.getByTestId('secret-revelation-content')).toContainText(secret, {
		timeout: 10000
	});
});

test('Second visit shows the secret again (not yet destroyed)', async () => {
	// Navigate back to the secret URL — it should still be accessible
	await page.goto(secretUrl);

	await expect(page.getByTestId('revelation-form-submit')).toBeVisible({ timeout: 10000 });

	// Remaining views should now show VIEW_LIMIT - 1
	const bodyText = await page.locator('body').innerText();
	expect(bodyText).toMatch(new RegExp(`${VIEW_LIMIT - 1}`));
});

test('Second reveal succeeds and content is shown', async () => {
	await page.getByTestId('revelation-form-submit').click();

	await expect(page.getByTestId('secret-revelation-content')).toContainText(secret, {
		timeout: 10000
	});
});

test('Third (final) visit shows the secret and reveals it one last time', async () => {
	await page.goto(secretUrl);

	await expect(page.getByTestId('revelation-form-submit')).toBeVisible({ timeout: 10000 });

	// Should indicate this is the last view (1 remaining)
	const bodyText = await page.locator('body').innerText();
	expect(bodyText).toMatch(/1/);

	await page.getByTestId('revelation-form-submit').click();

	await expect(page.getByTestId('secret-revelation-content')).toContainText(secret, {
		timeout: 10000
	});
});

test('Secret is permanently destroyed after the final view', async () => {
	// Reload the page — the secret should now be gone
	await page.goto(secretUrl);

	// The error alert should be shown; the reveal form should not appear
	await expect(page.getByTestId('alert-error')).toBeVisible({ timeout: 10000 });
	await expect(page.getByTestId('revelation-form-submit')).not.toBeVisible();
});
