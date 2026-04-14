import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { postSecretResponse } from '$lib/server/form/actions';
import { getSecretRequestByHash } from '$lib/server/secret-requests';
import { secretResponseFormSchema } from '$lib/validators/formSchemas';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { requestIdHash } = params;

	const request = await getSecretRequestByHash(requestIdHash);

	if (!request) {
		error(404, 'Request not found.');
	}

	if (request.expiresAt < new Date()) {
		error(410, 'This request has expired.');
	}

	// Mask email to prevent full exposure on public page (e.g. "s***@email.com")
	const maskEmail = (email: string) => {
		const [local, domain] = email.split('@');
		return `${local[0]}***@${domain}`;
	};

	return {
		form: await superValidate(zod4(secretResponseFormSchema())),
		publicKey: request.publicKey,
		encryptedNote: request.encryptedNote,
		requestIdHash,
		alreadyResponded: !!request.respondedAt,
		requesterName: request.requesterName,
		requesterEmail: maskEmail(request.requesterEmail),
		requesterEmailVerified: request.requesterEmailVerified
	};
};

export const actions: Actions = {
	default: postSecretResponse
};
