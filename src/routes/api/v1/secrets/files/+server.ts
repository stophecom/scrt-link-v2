import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { error, json } from '@sveltejs/kit';

import { PUBLIC_S3_BUCKET } from '$env/static/public';
import { s3Client } from '$lib/s3';

import type { RequestEvent } from './$types';

export const POST = async ({ url }: RequestEvent) => {
	const Bucket = PUBLIC_S3_BUCKET;
	const key: string | null = url.searchParams.get('file');

	if (!key) {
		return error(400, 'File parameter missing.');
	}

	const Conditions = [{ 'Content-Type': 'application/octet-stream' }];

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
