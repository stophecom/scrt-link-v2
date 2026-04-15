import { and, count, desc, eq, isNotNull, isNull } from 'drizzle-orm';

import type { SecretRequestFormSchema } from '$lib/validators/formSchemas';

import { db } from './db';
import { type SecretRequest, secretRequest, user } from './db/schema';

type SaveSecretRequest = {
	userId: string;
	data: SecretRequestFormSchema;
};

export const saveSecretRequest = async ({ userId, data }: SaveSecretRequest) => {
	const { requestIdHash, publicKey, encryptedPrivateKey, encryptedNote, encryptedNoteForOwner, expiresIn } = data;

	const [result] = await db
		.insert(secretRequest)
		.values({
			requestIdHash,
			publicKey,
			encryptedPrivateKey,
			encryptedNote,
			encryptedNoteForOwner,
			expiresAt: new Date(Date.now() + expiresIn),
			userId
		})
		.returning();

	return { id: result.id, expiresAt: result.expiresAt, expiresIn };
};

export const getSecretRequestByHash = async (requestIdHash: string) => {
	const [result] = await db
		.select({
			id: secretRequest.id,
			requestIdHash: secretRequest.requestIdHash,
			publicKey: secretRequest.publicKey,
			encryptedPrivateKey: secretRequest.encryptedPrivateKey,
			encryptedNote: secretRequest.encryptedNote,
			wrappedResponseKey: secretRequest.wrappedResponseKey,
			encryptedResponseMeta: secretRequest.encryptedResponseMeta,
			encryptedResponseContent: secretRequest.encryptedResponseContent,
			expiresAt: secretRequest.expiresAt,
			respondedAt: secretRequest.respondedAt,
			viewedAt: secretRequest.viewedAt,
			userId: secretRequest.userId,
			createdAt: secretRequest.createdAt,
			requesterName: user.name,
			requesterEmail: user.email,
			requesterEmailVerified: user.emailVerified
		})
		.from(secretRequest)
		.innerJoin(user, eq(secretRequest.userId, user.id))
		.where(eq(secretRequest.requestIdHash, requestIdHash));

	return result ?? null;
};

type SubmitResponse = {
	requestIdHash: string;
	encryptedResponseContent: string;
	wrappedResponseKey: string;
	encryptedResponseMeta?: string;
};

export const submitSecretResponse = async (data: SubmitResponse) => {
	const [result] = await db
		.update(secretRequest)
		.set({
			encryptedResponseContent: data.encryptedResponseContent,
			wrappedResponseKey: data.wrappedResponseKey,
			encryptedResponseMeta: data.encryptedResponseMeta,
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
