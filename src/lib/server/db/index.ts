import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { POSTGRES_URL } from '$env/static/private';

import * as schema from './schema';

if (!POSTGRES_URL) {
	throw new Error('POSTGRES_URL is not set');
}

const client = postgres(POSTGRES_URL);
export const db = drizzle({ client, schema });
