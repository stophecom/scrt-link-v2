import { S3Client } from '@aws-sdk/client-s3';

import { S3_ACCESS_KEY, S3_SECRET_KEY } from '$env/static/private';
import { PUBLIC_S3_ENDPOINT } from '$env/static/public';
// Using this as a function to re-initialize the config every time.
// Repeatedly using "createPresignedPost" with "getSignedUrl" led to invalid signed url:
// e.g. https://development.os.zhr1.flow.swiss/development/...

// All config options:  https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/s3clientconfig.html
export const s3Client = new S3Client({
	endpoint: { hostname: PUBLIC_S3_ENDPOINT, path: '', protocol: 'https:' }, // For some reason the ":" is required
	region: 'zrh1', // This needs to be set, but can be anything really b/c we use custom endpoint. E.g. us-east-1
	credentials: {
		accessKeyId: S3_ACCESS_KEY,
		secretAccessKey: S3_SECRET_KEY
	}
});
