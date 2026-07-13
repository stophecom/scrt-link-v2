// Shared inline styles for transactional emails.
//
// Email clients strip <style> blocks and ignore class-based CSS, so every style
// must be inlined on the element. These tokens keep the templates consistent
// without pulling in a Tailwind-to-inline build step.
//
// Colors are static hex resolved from the app design system (src/app.css). Email
// clients don't support CSS variables, oklch() or contrast-color(), so the values
// are flattened here for the light theme.

export const colors = {
	background: '#faf8f5', // --background (cream)
	foreground: '#0f1b2e', // --foreground (deep navy)
	primary: '#1a2942', // --primary (navy)
	primaryForeground: '#ffffff', // contrast-color(--primary)
	mutedForeground: '#404e64', // --muted-foreground (slate)
	card: '#fffdfa', // --card (cream-white)
	border: '#d6d4d0' // --border (warm tan)
};

// Font names are single-quoted so the stack can be embedded in a double-quoted
// HTML style attribute (see wrapEmailDocument) without terminating it early.
export const fontFamily =
	"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif";

export const styles = {
	// Font + color repeated on the container so the email still styles correctly
	// in clients that strip <body> styles (e.g. Gmail).
	container: `max-width:600px;margin:0 auto;padding:48px 24px;font-family:${fontFamily};color:${colors.foreground};`,
	logo: `display:block;margin-bottom:24px;`,
	heading: `margin:0 0 16px;font-size:32px;line-height:1.15;font-weight:700;color:${colors.foreground};`,
	lead: `margin:0 0 16px;font-size:20px;line-height:1.4;color:${colors.foreground};`,
	text: `margin:0 0 16px;font-size:16px;line-height:1.5;color:${colors.foreground};`,
	muted: `margin:0 0 16px;font-size:16px;line-height:1.5;color:${colors.mutedForeground};`,
	// Monospace box used for OTP codes / receipt IDs.
	code: `display:inline-block;margin:0 0 24px;padding:8px 16px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:22px;font-weight:700;letter-spacing:0.15em;color:${colors.foreground};background-color:${colors.card};border:1px solid ${colors.border};border-radius:6px;`,
	// Highlighted value inline in a paragraph (e.g. promo code).
	tag: `display:inline-block;margin:0 0 32px;padding:8px 16px;font-size:18px;font-weight:700;letter-spacing:0.1em;color:${colors.foreground};border:1px solid ${colors.border};border-radius:6px;`,
	buttonPrimary: `display:inline-block;padding:12px 20px;font-size:14px;font-weight:500;line-height:1;text-decoration:none;border-radius:6px;color:${colors.primaryForeground};background-color:${colors.primary};`,
	buttonOutline: `display:inline-block;padding:12px 20px;font-size:14px;font-weight:500;line-height:1;text-decoration:none;border-radius:6px;color:${colors.foreground};background-color:${colors.background};border:1px solid ${colors.foreground};`,
	hr: `margin:32px 0 16px;border:none;border-top:1px solid ${colors.border};`,
	footer: `margin:0;font-size:12px;line-height:1.5;color:${colors.mutedForeground};`,
	footerLink: `color:${colors.mutedForeground};`
};
