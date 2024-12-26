import { defineConfig } from 'drizzle-kit';
if (!process.env.POSTGRES_URL) throw new Error('POSTGRES_URL is not set');

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',

	dbCredentials: {
		url: process.env.POSTGRES_URL
	},

	verbose: true,
	strict: true,
	dialect: 'postgresql'
});
