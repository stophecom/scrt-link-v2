import { sha256Hash } from '@scrt-link/core';
import { json, type RequestHandler } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

import { isOriginalHostname } from '$lib/app-routing';
import { TierOptions } from '$lib/data/enums';
import { getUserPlanLimits } from '$lib/data/plans';
import { db } from '$lib/server/db';
import { apiKey } from '$lib/server/db/schema';
import { user } from '$lib/server/db/schema';
import {
	getEffectiveTierForUser,
	getOrganizationById,
	isMemberOfOrganization
} from '$lib/server/organization';
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
		.where(and(eq(apiKey.key, token), eq(apiKey.revoked, false)));

	if (!userWithApiKey || !userWithApiKey.api_key) {
		return jsonWithCors({ error: 'Invalid API key.' }, { status: 403 });
	}

	const userId = userWithApiKey.user?.id;
	const userTier = userWithApiKey.user?.subscriptionTier ?? undefined;
	const keyOrganizationId = userWithApiKey.api_key.organizationId;

	// Organization keys derive their limits from the organization's own plan, so the key keeps
	// working as configured even if the member who created it changes plan or leaves the org.
	let effectiveTier: TierOptions | undefined;
	if (keyOrganizationId) {
		const org = await getOrganizationById({ organizationId: keyOrganizationId });
		effectiveTier = org?.subscriptionTier ?? undefined;
	} else {
		effectiveTier = userId
			? await getEffectiveTierForUser(userId, userTier ?? TierOptions.CONFIDENTIAL)
			: userTier;
	}

	const planLimits = getUserPlanLimits(effectiveTier);

	if (!planLimits.apiAccess) {
		return jsonWithCors({ error: 'API access requires a premium plan.' }, { status: 403 });
	}

	const body = await request.json();
	const validation = secretFormSchema().safeParse(body);

	if (!validation.success) {
		return jsonWithCors(
			{ error: 'Invalid request', issues: validation.error.flatten() },
			{ status: 400 }
		);
	}

	if (validation.data.viewLimit > planLimits.maxViewLimit) {
		return jsonWithCors(
			{ error: `View limit exceeds your plan maximum of ${planLimits.maxViewLimit}.` },
			{ status: 403 }
		);
	}

	// Validate checksum
	const payload = JSON.stringify(body);
	const computedChecksum = await sha256Hash(payload);

	if (receivedChecksum !== computedChecksum) {
		return jsonWithCors({ error: 'Checksum mismatch.' }, { status: 400 });
	}

	let whiteLabelSiteId;
	if (keyOrganizationId) {
		// Organization keys are usable only on the organization's own white-label domain.
		if (!host || isOriginalHostname(host)) {
			return jsonWithCors(
				{
					error: `Organization API keys require the X-Host header to be set to the organization's white-label domain.`
				},
				{ status: 400 }
			);
		}

		const whiteLabelSiteResult = await getWhiteLabelSiteByHost(host);

		if (!whiteLabelSiteResult || whiteLabelSiteResult.organizationId !== keyOrganizationId) {
			return jsonWithCors(
				{ error: `Not allowed to create secret for host ${host}` },
				{ status: 400 }
			);
		}

		whiteLabelSiteId = whiteLabelSiteResult.id;
	} else if (host && !isOriginalHostname(host)) {
		const whiteLabelSiteResult = await getWhiteLabelSiteByHost(host);

		if (!whiteLabelSiteResult) {
			return jsonWithCors(
				{ error: `Not allowed to create secret for host ${host}` },
				{ status: 400 }
			);
		}

		whiteLabelSiteId = whiteLabelSiteResult.id;

		const organizationId = whiteLabelSiteResult?.organizationId;

		// For API users we need to check if user is allowed to use custom domain (white-label host)
		const isOwner =
			whiteLabelSiteResult?.userId !== null && whiteLabelSiteResult?.userId === userId;
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
			secretType: validation.data.secretType,
			whiteLabelSiteId
		});
		return jsonWithCors({ receiptId, expiresIn, expiresAt, viewLimit: validation.data.viewLimit });
	} catch (error) {
		console.error(error);
		return jsonWithCors({ error: `Couldn't save secret.` }, { status: 400 });
	}
};
