import { DeleteObjectCommand, paginateListObjectsV2 } from '@aws-sdk/client-s3';
import type { RequestHandler } from '@sveltejs/kit';
import { error, json } from '@sveltejs/kit';
import { eq, or } from 'drizzle-orm';
import { lte } from 'drizzle-orm';

import { CRON_SECRET } from '$env/static/private';
import { PUBLIC_S3_BUCKET } from '$env/static/public';
import { FILE_RETENTION_PERIOD_IN_DAYS } from '$lib/constants';
import { s3Client } from '$lib/s3';
import { db } from '$lib/server/db';
import {
	apiKey,
	emailVerificationRequest,
	rateLimit,
	secret as secretSchema
} from '$lib/server/db/schema';

const BucketName = PUBLIC_S3_BUCKET;
const client = s3Client;

function subtractDays(date: Date, days: number) {
	date.setDate(date.getDate() - days);
	return date;
}

type ObjectList = { Key: string }[];
export const GET: RequestHandler = async ({ request }) => {
	const authorization = request.headers.get('authorization');

	if (authorization === `Bearer ${CRON_SECRET}`) {
		// Delete files older than X days
		const deleteFilesBeforeDate = subtractDays(new Date(), FILE_RETENTION_PERIOD_IN_DAYS);

		for await (const data of paginateListObjectsV2(
			{ client, pageSize: 1000 },
			{ Bucket: BucketName }
		)) {
			if (!data.Contents) {
				error(500, 'No Contents');
			}

			// Filter files by retention threshold date
			// Using "as ObjectList" b/c https://www.karltarvas.com/2021/03/11/typescript-array-filter-boolean.html
			const s3ObjectsToDelete = data.Contents.map(({ Key, LastModified }) => {
				if (LastModified && LastModified < deleteFilesBeforeDate) {
					if (typeof Key === 'string') {
						return { Key };
					}
				}
			}).filter(Boolean) as ObjectList;

			if (s3ObjectsToDelete.length) {
				console.log(`Cron: Start deleting files...`);
				// Using per-object DeleteObjectCommand instead of batch DeleteObjectsCommand:
				// flow.swiss rejects the checksum header that AWS SDK v3 attaches to the batch op.
				await Promise.all(
					s3ObjectsToDelete.map(({ Key }) =>
						client.send(new DeleteObjectCommand({ Bucket: BucketName, Key }))
					)
				);
				console.log(`Cron: Deleted ${s3ObjectsToDelete.length} files from S3.`);
			} else {
				console.log(`Cron: No files to delete from S3.`);
			}
		}

		// Delete secrets that have been retrieved older than 7 days
		const deleteRetrievedSecretsBeforeDate = subtractDays(new Date(), 7);
		const deleteExpiredSecretsBeforeDate = subtractDays(new Date(), 7);

		const deletedSecrets = await db
			.delete(secretSchema)
			.where(
				or(
					lte(secretSchema.retrievedAt, deleteRetrievedSecretsBeforeDate),
					lte(secretSchema.expiresAt, deleteExpiredSecretsBeforeDate) // Expired secrets
				)
			)
			.returning();

		console.log(`Cron: Deleted ${deletedSecrets.length} entries from the Secrets database.`);

		// Delete email verification requests if expired
		const deletedEmailVerificationRequests = await db
			.delete(emailVerificationRequest)
			.where(
				lte(emailVerificationRequest.expiresAt, new Date()) // Expired requests
			)
			.returning();

		console.log(
			`Cron: Deleted ${deletedEmailVerificationRequests.length} entries from the Email Verification Requests database.`
		);

		// Delete revoked API keys
		const deleteRevokedAPIkeys = await db
			.delete(apiKey)
			.where(
				eq(apiKey.revoked, true) // Revoked
			)
			.returning();

		console.log(`Cron: Deleted ${deleteRevokedAPIkeys.length} entries from the api keys database.`);

		// Delete expired rate-limit entries
		const deletedRateLimitEntries = await db
			.delete(rateLimit)
			.where(lte(rateLimit.expiresAt, new Date()))
			.returning();

		console.log(
			`Cron: Deleted ${deletedRateLimitEntries.length} expired entries from the rate limit database.`
		);

		return json({ success: true });
	} else {
		error(401, 'Unauthorized');
	}
};
