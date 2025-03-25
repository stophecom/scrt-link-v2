import { json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import { sha256Hash } from '$lib/client/web-crypto';
import { db } from '$lib/server/db';
import { apiKey } from '$lib/server/db/schema';
import { user } from '$lib/server/db/schema';
import { saveSecret } from '$lib/server/secrets';
import { secretFormSchema } from '$lib/validators/formSchemas';

// Handle CORS
export async function OPTIONS() {
	return new Response(null, {
		status: 204,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Checksum'
		}
	});
}

export const POST: RequestHandler = async ({ request }) => {
	const authorizationHeader = request.headers.get('authorization');
	const receivedChecksum = request.headers.get('x-checksum');

	if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
		return json({ error: 'No API bearer token provided.' }, { status: 403 });
	}

	const token = authorizationHeader.split(' ')[1];
	const [matchingApiKey] = await db
		.select()
		.from(apiKey)
		.leftJoin(user, eq(user.id, apiKey.userId))
		.where(eq(apiKey.key, token));

	if (!matchingApiKey) {
		return json({ error: 'Invalid API key.' }, { status: 403 });
	}

	const body = await request.json();
	const validation = secretFormSchema().safeParse(body);

	if (!validation.success) {
		return json({ error: 'Invalid request', issues: validation.error.flatten() }, { status: 400 });
	}

	// Validate checksum
	const payload = JSON.stringify(body);
	const computedChecksum = await sha256Hash(payload);

	if (receivedChecksum !== computedChecksum) {
		return json({ error: 'Checksum mismatch.' }, { status: 400 });
	}

	const { receiptId, expiresIn } = await saveSecret({
		userId: matchingApiKey.user?.id,
		secretRequest: validation.data
	});

	return json({ receiptId, expiresIn });
};
