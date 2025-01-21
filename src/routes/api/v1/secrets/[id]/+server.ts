import type { RequestHandler } from '@sveltejs/kit';
import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { secret } from '$lib/server/db/schema';

export const POST: RequestHandler = async ({ params }) => {
	const secretId = params.id;

	if (!secretId) {
		error(400, 'No secret id provided.');
	}

	const [result] = await db.select().from(secret).where(eq(secret.secretIdHash, secretId));

	if (!result) {
		error(400, `No secret for id ${secretId}.`);
	}

	if (result?.retrievedAt) {
		error(410, {
			message: `This secret has already been accessed and therefore no longer exists.`
		});
	}

	return json({ isPasswordProtected: !!result.passwordHash });
};

// export const DELETE: RequestHandler = async ({ params }) => {
// 	const alias = params.alias;

// 	if (!alias) {
// 		error(400, 'No alias provided.');
// 	}

// 	const secret = await prisma.secret.findUnique({ where: { alias: alias } });

// 	if (!secret) {
// 		error(400, `No secret for alias ${alias}.`);
// 	}

// 	if (!secret?.retrievedAt) {
// 		await prisma.secret.update({
// 			where: { alias: alias },
// 			data: {
// 				retrievedAt: new Date()
// 			}
// 		});
// 	} else {
// 		error(410, {
// 			message: `This link has already been accessed - the file no longer exists.`
// 		});
// 	}

// 	return new Response(JSON.stringify({ fileReference: secret.fileReference }));
// };
