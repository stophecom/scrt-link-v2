import { SecretType } from '@scrt-link/core';
import { error } from '@sveltejs/kit';
import { and, count, desc, eq, isNotNull, isNull, sql } from 'drizzle-orm';

import { generateRandomAlphanumericString } from '$lib/crypto';
import { TierOptions } from '$lib/data/enums';
import { getUserPlanLimits } from '$lib/data/plans';
import type { SecretRequestFormSchema } from '$lib/validators/formSchemas';

import { db } from './db';
import { type SecretRequest, secretRequest, stats, user } from './db/schema';
import { getEffectiveTierForUser } from './organization';

const maskEmail = (email: string) => {
	const [local, domain] = email.split('@');
	if (!local || !domain) return '***';
	return `${local[0]}***@${domain}`;
};

type SaveSecretRequest = {
	userId: string;
	data: SecretRequestFormSchema;
};

export const saveSecretRequest = async ({ userId, data }: SaveSecretRequest) => {
	const {
		requestIdHash,
		publicKey,
		encryptedPrivateKey,
		encryptedNote,
		encryptedNoteForOwner,
		allowAttachment,
		expiresIn
	} = data;

	const receiptId = generateRandomAlphanumericString(8);

	const result = await db.transaction(async (tx) => {
		const [row] = await tx
			.insert(secretRequest)
			.values({
				requestIdHash,
				publicKey,
				encryptedPrivateKey,
				encryptedNote,
				encryptedNoteForOwner,
				allowAttachment,
				receiptId,
				expiresAt: new Date(Date.now() + expiresIn),
				userId
			})
			.returning();

		// Global stats
		await tx
			.insert(stats)
			.values({ id: 1, scope: 'global' })
			.onConflictDoUpdate({
				target: stats.id,
				set: { totalSecretRequests: sql`${stats.totalSecretRequests} + 1` }
			});

		// User stats
		await tx
			.insert(stats)
			.values({ userId, scope: 'user' })
			.onConflictDoUpdate({
				target: stats.userId,
				set: { totalSecretRequests: sql`${stats.totalSecretRequests} + 1` }
			});

		return row;
	});

	return { id: result.id, receiptId, expiresAt: result.expiresAt, expiresIn };
};

export const loadSecretResponsePageData = async (requestIdHash: string) => {
	const request = await getSecretRequestByHash(requestIdHash);

	if (!request) {
		error(404, 'Request not found.');
	}

	if (request.expiresAt < new Date()) {
		error(410, 'This request has expired.');
	}

	// The requester bears the storage cost, so the attachment is capped by their plan.
	const effectiveTier = await getEffectiveTierForUser(
		request.userId,
		(request.requesterSubscriptionTier as TierOptions) ?? TierOptions.CONFIDENTIAL
	);
	const maxAttachmentSize = Number(getUserPlanLimits(effectiveTier)[SecretType.FILE]);

	return {
		publicKey: request.publicKey,
		encryptedNote: request.encryptedNote,
		allowAttachment: request.allowAttachment,
		maxAttachmentSize,
		requestIdHash,
		alreadyResponded: !!request.respondedAt,
		requesterName: request.requesterName,
		requesterEmail: maskEmail(request.requesterEmail),
		requesterEmailVerified: request.requesterEmailVerified
	};
};

export const getSecretRequestByHash = async (requestIdHash: string) => {
	const [result] = await db
		.select({
			id: secretRequest.id,
			requestIdHash: secretRequest.requestIdHash,
			publicKey: secretRequest.publicKey,
			encryptedPrivateKey: secretRequest.encryptedPrivateKey,
			encryptedNote: secretRequest.encryptedNote,
			allowAttachment: secretRequest.allowAttachment,
			wrappedResponseKey: secretRequest.wrappedResponseKey,
			encryptedResponseMeta: secretRequest.encryptedResponseMeta,
			encryptedResponseContent: secretRequest.encryptedResponseContent,
			encryptedResponseFile: secretRequest.encryptedResponseFile,
			responseFilePublicKey: secretRequest.responseFilePublicKey,
			expiresAt: secretRequest.expiresAt,
			respondedAt: secretRequest.respondedAt,
			viewedAt: secretRequest.viewedAt,
			userId: secretRequest.userId,
			createdAt: secretRequest.createdAt,
			requesterName: user.name,
			requesterEmail: user.email,
			requesterEmailVerified: user.emailVerified,
			requesterSubscriptionTier: user.subscriptionTier
		})
		.from(secretRequest)
		.innerJoin(user, eq(secretRequest.userId, user.id))
		.where(eq(secretRequest.requestIdHash, requestIdHash));

	return result ?? null;
};

type SubmitResponse = {
	requestIdHash: string;
	encryptedResponseContent?: string;
	wrappedResponseKey: string;
	encryptedResponseMeta?: string;
	encryptedResponseFile?: string;
	responseFilePublicKey?: string;
};

export const submitSecretResponse = async (data: SubmitResponse) => {
	const [result] = await db
		.update(secretRequest)
		.set({
			encryptedResponseContent: data.encryptedResponseContent,
			wrappedResponseKey: data.wrappedResponseKey,
			encryptedResponseMeta: data.encryptedResponseMeta,
			encryptedResponseFile: data.encryptedResponseFile,
			responseFilePublicKey: data.responseFilePublicKey,
			respondedAt: new Date()
		})
		.where(
			and(
				eq(secretRequest.requestIdHash, data.requestIdHash),
				isNull(secretRequest.respondedAt) // Prevent overwriting existing response
			)
		)
		.returning();

	return result ?? null;
};

export const getRequestById = async (requestId: string, userId: string) => {
	const [result] = await db
		.select()
		.from(secretRequest)
		.where(and(eq(secretRequest.id, requestId), eq(secretRequest.userId, userId)));

	return result ?? null;
};

export const markRequestViewed = async (requestId: string, userId: string) => {
	await db
		.update(secretRequest)
		.set({ viewedAt: new Date() })
		.where(and(eq(secretRequest.id, requestId), eq(secretRequest.userId, userId)));
};

export const fetchUserRequests = async (userId: string) => {
	const requests = await db
		.select()
		.from(secretRequest)
		.where(eq(secretRequest.userId, userId))
		.orderBy(desc(secretRequest.createdAt));

	return requests.map((r) => ({
		id: r.id,
		receiptId: r.receiptId ?? null,
		hasNote: !!r.encryptedNote,
		encryptedNoteForOwner: r.encryptedNoteForOwner ?? null,
		expiresAt: r.expiresAt,
		respondedAt: r.respondedAt,
		viewedAt: r.viewedAt,
		createdAt: r.createdAt,
		status: getRequestStatus(r)
	}));
};

export const getRequestStatus = (
	request: Pick<SecretRequest, 'respondedAt' | 'viewedAt' | 'expiresAt'>
) => {
	if (request.viewedAt) return 'viewed' as const;
	if (request.respondedAt) return 'responded' as const;
	if (request.expiresAt < new Date()) return 'expired' as const;
	return 'pending' as const;
};

export const deleteSecretRequest = async (requestId: string, userId: string) => {
	const [result] = await db
		.delete(secretRequest)
		.where(and(eq(secretRequest.id, requestId), eq(secretRequest.userId, userId)))
		.returning();

	return result ?? null;
};

export const countUnreadResponses = async (userId: string) => {
	const [result] = await db
		.select({ count: count() })
		.from(secretRequest)
		.where(
			and(
				eq(secretRequest.userId, userId),
				isNull(secretRequest.viewedAt),
				isNotNull(secretRequest.respondedAt)
			)
		);

	return result?.count ?? 0;
};
