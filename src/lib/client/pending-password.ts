// Temporary in-memory password store for encryption onboarding.
// Holds the login password between the sign-in page and the encryption setup page
// so the user doesn't have to re-enter it. Same security model as key-manager.ts:
// module-scoped variable, never persisted, cleared on tab close or page refresh.

let pendingPassword: string | null = null;

/**
 * Store the password temporarily after login, before encryption setup.
 */
export function setPendingPassword(password: string): void {
	pendingPassword = password;
}

/**
 * Retrieve and clear the pending password (one-time read).
 */
export function getPendingPassword(): string | null {
	const pw = pendingPassword;
	pendingPassword = null;
	return pw;
}

/**
 * Explicitly clear the pending password.
 */
export function clearPendingPassword(): void {
	pendingPassword = null;
}
