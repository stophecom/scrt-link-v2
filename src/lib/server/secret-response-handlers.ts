import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { postSecretResponse } from '$lib/server/form/actions';
import { getSecretRequestByHash } from '$lib/server/secret-requests';
import { secretResponseFormSchema } from '$lib/validators/formSchemas';

export const loadSecretResponse = async (requestIdHash: string) => {
	const request = await getSecretRequestByHash(requestIdHash);

	if (!request) {
		error(404, 'Request not found.');
	}

	if (request.expiresAt < new Date()) {
		error(410, 'This request has expired.');
	}

	const maskEmail = (email: string) => {
		const [local, domain] = email.split('@');
		if (!local || !domain) return '***';
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

export const secretResponseActions = {
	default: postSecretResponse
};
