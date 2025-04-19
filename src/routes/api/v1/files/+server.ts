import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import type { Conditions } from '@aws-sdk/s3-presigned-post/dist-types/types';
import { error, json } from '@sveltejs/kit';

import { PUBLIC_S3_CDN_BUCKET } from '$env/static/public';
import { s3Client } from '$lib/s3';

import type { RequestEvent } from './$types';

// This endpoint is for storing public files.
// Endpoint for secret files: /secrets/files
export const POST = async ({ url, locals }: RequestEvent) => {
	if (!locals.user) {
		error(405, 'Not allowed. You need to be signed in.');
	}

	const Bucket = PUBLIC_S3_CDN_BUCKET;

	const key: string | null = url.searchParams.get('name');
	const type: string | null = url.searchParams.get('type');

	if (!key || !type) {
		return error(400, 'File parameter missing.');
	}

	const Conditions: Conditions[] = [
		['starts-with', '$Content-Type', 'image/'],
		{ acl: 'public-read' },
		['content-length-range', 1024, 10 * 1024 * 1024] // min 1KB, max 10MB
	];

	try {
		const post = await createPresignedPost(s3Client, {
			Bucket,
			Fields: {
				acl: 'public-read',
				key: key,
				'Content-Type': decodeURIComponent(type)
			},
			Key: key,
			Expires: 60 * 5, // seconds -> 5minutes
			Conditions
		});

		return json(post);
	} catch (err) {
		console.error(err);
		error(400, 'No able to get a presigned post URL.');
	}
};
