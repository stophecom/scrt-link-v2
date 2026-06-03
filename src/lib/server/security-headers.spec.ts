import { describe, expect, test } from 'vitest';

import { applyFrameHeaders } from './security-headers';

// Mirrors the frame-ancestors directive emitted by SvelteKit's CSP config.
const BASE_CSP =
	"default-src 'none'; script-src 'self'; frame-src 'self' https://js.stripe.com; frame-ancestors 'none'; base-uri 'self'";

describe('applyFrameHeaders', () => {
	describe('non-white-label responses', () => {
		test('denies framing entirely', () => {
			const headers = new Headers({ 'content-security-policy': BASE_CSP });
			applyFrameHeaders(headers, false);
			expect(headers.get('X-Frame-Options')).toBe('DENY');
		});

		test('leaves the CSP frame-ancestors directive untouched', () => {
			const headers = new Headers({ 'content-security-policy': BASE_CSP });
			applyFrameHeaders(headers, false);
			expect(headers.get('content-security-policy')).toContain("frame-ancestors 'none'");
		});
	});

	describe('white-label responses', () => {
		test('allows same-origin framing via X-Frame-Options', () => {
			const headers = new Headers({ 'content-security-policy': BASE_CSP });
			applyFrameHeaders(headers, true);
			expect(headers.get('X-Frame-Options')).toBe('SAMEORIGIN');
		});

		test("relaxes frame-ancestors to 'self'", () => {
			const headers = new Headers({ 'content-security-policy': BASE_CSP });
			applyFrameHeaders(headers, true);
			const csp = headers.get('content-security-policy');
			expect(csp).toContain("frame-ancestors 'self'");
			expect(csp).not.toContain("frame-ancestors 'none'");
		});

		test('does not touch other CSP directives (e.g. frame-src)', () => {
			const headers = new Headers({ 'content-security-policy': BASE_CSP });
			applyFrameHeaders(headers, true);
			const csp = headers.get('content-security-policy');
			expect(csp).toContain("frame-src 'self' https://js.stripe.com");
			expect(csp).toContain("default-src 'none'");
			expect(csp).toContain("base-uri 'self'");
		});

		test('sets SAMEORIGIN even when no CSP header is present', () => {
			const headers = new Headers();
			applyFrameHeaders(headers, true);
			expect(headers.get('X-Frame-Options')).toBe('SAMEORIGIN');
			expect(headers.get('content-security-policy')).toBeNull();
		});
	});
});
