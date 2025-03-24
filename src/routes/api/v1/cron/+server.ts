import { DeleteObjectsCommand, paginateListObjectsV2 } from '@aws-sdk/client-s3';
import type { RequestHandler } from '@sveltejs/kit';
import { error, json } from '@sveltejs/kit';
import { eq, or } from 'drizzle-orm';
import { lte } from 'drizzle-orm';

import { CRON_SECRET } from '$env/static/private';
import { PUBLIC_S3_BUCKET } from '$env/static/public';
import { FILE_RETENTION_PERIOD_IN_DAYS } from '$lib/constants';
import { s3Client } from '$lib/s3';
import { db } from '$lib/server/db';
import { apiKey, emailVerificationRequest, secret as secretSchema } from '$lib/server/db/schema';

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

			// @todo
			// We currently get an error for no obvious reason
			// InvalidDigest: The Content-MD5 you specified was an invalid
			// We catch the error for now
			try {
				if (s3ObjectsToDelete.length) {
					console.log(`Cron: Start deleting files...`);
					const bucketParams = {
						Bucket: BucketName,
						Delete: { Objects: s3ObjectsToDelete, Quiet: false }
					};
					await client.send(new DeleteObjectsCommand(bucketParams));
					console.log(`Cron: Deleted ${s3ObjectsToDelete.length} files from S3.`);
				} else {
					console.log(`Cron: No files to delete from S3.`);
				}
			} catch (e) {
				console.error(e);
			}
		}

		// Delete secrets that have been retrieved older than 1 days
		const deleteRetrievedSecretsBeforeDate = subtractDays(new Date(), 1);

		const deletedSecrets = await db
			.delete(secretSchema)
			.where(
				or(
					lte(secretSchema.retrievedAt, deleteRetrievedSecretsBeforeDate),
					lte(secretSchema.expiresAt, new Date()) // Expired secrets
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

		return json({ success: true });
	} else {
		error(401, 'Unauthorized');
	}
};
