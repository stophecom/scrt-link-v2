import { sha256Hash } from '@scrt-link/core';
import { json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import { isOriginalHost } from '$lib/app-routing';
import { db } from '$lib/server/db';
import { apiKey } from '$lib/server/db/schema';
import { user } from '$lib/server/db/schema';
import { isMemberOfOrganization } from '$lib/server/organization';
import { saveSecret } from '$lib/server/secrets';
import { getWhiteLabelSiteByHost } from '$lib/server/whiteLabelSite';
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

	const userId = userWithApiKey.user?.id;

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

	let whiteLabelSiteId;
	if (host && !isOriginalHost(host)) {
		const whiteLabelSiteResult = await getWhiteLabelSiteByHost(host);
		whiteLabelSiteId = whiteLabelSiteResult.id;

		const organizationId = whiteLabelSiteResult?.organizationId;

		// For API users we need to check if user is allowed to use custom domain (white-label host)
		const isOwner = whiteLabelSiteResult?.userId === userId;
		const isMemberOfWhiteLabelSiteOwningOrganization =
			userId && organizationId && (await isMemberOfOrganization(userId, organizationId));

		if (!isOwner && !isMemberOfWhiteLabelSiteOwningOrganization) {
			return jsonWithCors(
				{ error: `Not allowed to create secret for host ${host}` },
				{ status: 400 }
			);
		}
	}

	try {
		const { receiptId, expiresIn, expiresAt } = await saveSecret({
			userId: userId,
			secretRequest: validation.data,
			whiteLabelSiteId
		});
		return jsonWithCors({ receiptId, expiresIn, expiresAt });
	} catch (error) {
		console.error(error);
		return jsonWithCors({ error: `Couldn't save secret.` }, { status: 400 });
	}
};
