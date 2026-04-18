// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import '@poppanator/sveltekit-svg/dist/svg';
declare global {
	namespace App {
		interface Locals {
			user: import('$lib/server/auth').SessionValidationResult['user'];
			session: import('$lib/server/auth').SessionValidationResult['session'];
			whiteLabelSite: Awaited<
				ReturnType<typeof import('$lib/server/whiteLabelSite').getWhiteLabelSiteByHost>
			> | null;
		}

		namespace Superforms {
			type Message = {
				status: 'error' | 'success';
				title?: string;
				description?: string;
			};
		}
	}
}

export {};
