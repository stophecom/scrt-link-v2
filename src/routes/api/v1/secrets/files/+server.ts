import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import type { Conditions as PresignedPostConditions } from '@aws-sdk/s3-presigned-post/dist-types/types';
import { error, json } from '@sveltejs/kit';

import { PUBLIC_S3_BUCKET } from '$env/static/public';
import { MAX_ENCRYPTED_CHUNK_SIZE } from '$lib/client/constants';
import { s3Client } from '$lib/s3';

import type { RequestEvent } from './$types';

export const POST = async ({ url }: RequestEvent) => {
	const Bucket = PUBLIC_S3_BUCKET;
	const key: string | null = url.searchParams.get('file');

	if (!key) {
		return error(400, 'File parameter missing.');
	}

	const Conditions: PresignedPostConditions[] = [
		{ 'Content-Type': 'application/octet-stream' },
		// The endpoint is unauthenticated, so bound what a single presigned POST can
		// write. Uploads are chunked client-side; nothing legitimate exceeds this.
		['content-length-range', 1, MAX_ENCRYPTED_CHUNK_SIZE]
	];

	try {
		const post = await createPresignedPost(s3Client, {
			Bucket,
			Fields: {
				acl: 'bucket-owner-full-control',
				key: key,
				'Content-type': 'application/octet-stream'
			},
			Key: key,
			Expires: 3 * 60 * 60, // seconds -> 3h (For really big files)
			Conditions
		});

		return json(post);
	} catch (err) {
		console.error(err);
		error(400, 'No able to get a presigned post URL.');
	}
};
