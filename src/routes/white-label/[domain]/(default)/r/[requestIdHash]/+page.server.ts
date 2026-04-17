import { loadSecretResponse, secretResponseActions } from '$lib/server/secret-response-handlers';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => loadSecretResponse(params.requestIdHash);

export const actions: Actions = secretResponseActions;
