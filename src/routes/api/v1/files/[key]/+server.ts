import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import { importPublicKey, verifyMessageSignature } from '$lib/client/web-crypto';
import { s3Client } from '$lib/s3';
import { db } from '$lib/server/db';
import { secret as secretSchema } from '$lib/server/db/schema';

import type { RequestEvent } from './$types';

export const POST = async ({ params, request }: RequestEvent) => {
	const body = await request.json();
	const { secretIdHash, bucket, keyHash, signature } = body;

	const Bucket = bucket;
	const Key = keyHash;

	// const resourceAccessToken = request.headers['X-Sharrr-Access-Token']

	if (!Key) {
		error(400, 'No file key provided.');
	}

	const [secret] = await db
		.select()
		.from(secretSchema)
		.where(eq(secretSchema.secretIdHash, secretIdHash));

	if (!secret) {
		error(400, `No database entry for alias ${secretIdHash}.`);
	}

	// Here we check if the requested file belongs to the "owner" via signature.
	const publicKey = await importPublicKey(secret.publicKey);
	if (!publicKey) {
		error(400, `Public key missing or invalid.`);
	}
	const isSignatureValid = verifyMessageSignature(params.key, signature, publicKey);
	if (!isSignatureValid) {
		error(400, `Invalid signature`);
	}

	const bucketParams = {
		Bucket,
		Key,
		ACL: 'public-read'
	};
	const url = await getSignedUrl(s3Client, new GetObjectCommand(bucketParams), {
		expiresIn: 5 * 60 // 5min
	});

	if (!url) {
		error(400, `Couldn't get signed url. File no longer exist.`);
	}

	return json({ url });
};
