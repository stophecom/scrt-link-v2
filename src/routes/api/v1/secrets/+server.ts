import { json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import { sha256Hash } from '$lib/client/web-crypto';
import { db } from '$lib/server/db';
import { apiKey } from '$lib/server/db/schema';
import { user } from '$lib/server/db/schema';
import { saveSecret } from '$lib/server/secrets';
import { secretFormSchema } from '$lib/validators/formSchemas';

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Checksum, X-Host'
};

type JsonWithCors = typeof json;
const jsonWithCors: JsonWithCors = (data, init) =>
	json(data, {
		headers: corsHeaders,
		...init
	});

// Handle CORS
export async function OPTIONS() {
	return new Response(null, {
		status: 204,
		headers: corsHeaders
	});
}

export const POST: RequestHandler = async ({ request }) => {
	const authorizationHeader = request.headers.get('authorization');
	const receivedChecksum = request.headers.get('x-checksum');
	const host = request.headers.get('x-host') || undefined;

	if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
		return jsonWithCors({ error: 'No API bearer token provided.' }, { status: 403 });
	}

	const token = authorizationHeader.split(' ')[1];
	const [userWithApiKey] = await db
		.select()
		.from(apiKey)
		.leftJoin(user, eq(user.id, apiKey.userId))
		.where(eq(apiKey.key, token));

	if (!userWithApiKey || !userWithApiKey.api_key) {
		return jsonWithCors({ error: 'Invalid API key.' }, { status: 403 });
	}

	const body = await request.json();
	const validation = secretFormSchema().safeParse(body);

	if (!validation.success) {
		return jsonWithCors(
			{ error: 'Invalid request', issues: validation.error.flatten() },
			{ status: 400 }
		);
	}

	// Validate checksum
	const payload = JSON.stringify(body);
	const computedChecksum = await sha256Hash(payload);

	if (receivedChecksum !== computedChecksum) {
		return jsonWithCors({ error: 'Checksum mismatch.' }, { status: 400 });
	}

	try {
		const { receiptId, expiresIn, expiresAt } = await saveSecret({
			userId: userWithApiKey.user?.id,
			secretRequest: validation.data,
			host
		});
		return jsonWithCors({ receiptId, expiresIn, expiresAt });
	} catch (error) {
		return jsonWithCors(
			{ error: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 400 }
		);
	}
};
