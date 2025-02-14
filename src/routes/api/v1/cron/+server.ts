import { DeleteObjectsCommand, paginateListObjectsV2 } from '@aws-sdk/client-s3';
import type { RequestHandler } from '@sveltejs/kit';
import { error, json } from '@sveltejs/kit';
import { or } from 'drizzle-orm';
import { lte } from 'drizzle-orm';

import { CRON_SECRET } from '$env/static/private';
import { PUBLIC_S3_BUCKET } from '$env/static/public';
import { fileRetentionPeriodInDays } from '$lib/constants';
import { s3Client } from '$lib/s3';
import { db } from '$lib/server/db';
import { secret as secretSchema } from '$lib/server/db/schema';

const BucketName = PUBLIC_S3_BUCKET;
const client = s3Client;

function subtractDays(date: Date, days: number) {
	date.setDate(date.getDate() - days);
	return date;
}

type ObjectList = { Key: string }[];
export const POST: RequestHandler = async ({ request }) => {
	const authorization = request.headers.get('authorization');

	if (authorization === `Bearer ${CRON_SECRET}`) {
		// Delete files older than X days
		const deleteFilesBeforeDate = subtractDays(new Date(), fileRetentionPeriodInDays);

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
				const bucketParams = { Bucket: BucketName, Delete: { Objects: s3ObjectsToDelete } };
				await client.send(new DeleteObjectsCommand(bucketParams));
				console.log(`Cron: Deleted ${s3ObjectsToDelete.length} files from S3.`);
			} else {
				console.log(`Cron: No files to delete from S3.`);
			}
		}

		// Delete secrets that have been retrieved older than 1 days
		const deleteRetrievedSecretsBeforeDate = subtractDays(new Date(), 1);

		const result = await db
			.delete(secretSchema)
			.where(
				or(
					lte(secretSchema.retrievedAt, deleteRetrievedSecretsBeforeDate),
					lte(secretSchema.expiresAt, new Date()) // Expired secrets
				)
			)
			.returning();

		console.log(`Cron: Deleted ${result.length} entries from the Secrets database.`);
		return json({ success: true });
	} else {
		error(401, 'Unauthorized');
	}
};
