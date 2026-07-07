import { browser } from 'wxt/browser';

// The API key is a credential. Keep it in `local` storage only — never `sync`
// (we don't want it leaving the device) and never exposed to a content script.
const API_KEY = 'apiKey';

export async function getApiKey(): Promise<string | null> {
	const result = await browser.storage.local.get(API_KEY);
	const value = result[API_KEY];
	return typeof value === 'string' && value.length > 0 ? value : null;
}

export async function setApiKey(key: string): Promise<void> {
	await browser.storage.local.set({ [API_KEY]: key.trim() });
}

export async function clearApiKey(): Promise<void> {
	await browser.storage.local.remove(API_KEY);
}
