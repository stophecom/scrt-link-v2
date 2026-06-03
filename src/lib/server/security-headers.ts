/**
 * Applies frame-embedding (clickjacking) protection headers to a response.
 *
 * White-label pages (the `/white-label/[domain]` preview route and custom domains)
 * may be embedded same-origin, e.g. for in-app previews, so they get
 * `X-Frame-Options: SAMEORIGIN` and CSP `frame-ancestors 'self'`. Every other
 * response stays fully frame-denied.
 *
 * Both headers are set: modern browsers honor CSP `frame-ancestors` over
 * `X-Frame-Options`, but older ones rely on the latter, so they must agree.
 *
 * Mutates the passed `Headers` in place.
 */
export function applyFrameHeaders(headers: Headers, isWhiteLabel: boolean): void {
	if (isWhiteLabel) {
		headers.set('X-Frame-Options', 'SAMEORIGIN');
		const csp = headers.get('content-security-policy');
		if (csp) {
			headers.set(
				'content-security-policy',
				csp.replace(/frame-ancestors[^;]*/, "frame-ancestors 'self'")
			);
		}
	} else {
		headers.set('X-Frame-Options', 'DENY');
	}
}
