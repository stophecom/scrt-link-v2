import {
	boolean,
	integer,
	pgEnum,
	pgTable,
	serial,
	smallint,
	text,
	timestamp,
	uuid
} from 'drizzle-orm/pg-core';

import { ReadReceiptOptions } from '../../data/schemaEnums';

export const user = pgTable('user', {
	id: uuid('id').defaultRandom().primaryKey().unique(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash'),
	name: text('name'),
	picture: text('picture'),
	googleId: text('google_id'),
	emailVerified: boolean('email_verified')
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: uuid('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const emailVerificationRequest = pgTable('email_verification_request', {
	id: uuid('id').defaultRandom().primaryKey(),
	email: text('email').notNull(),
	codeHash: text('code_hash').notNull(),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const secret = pgTable('secret', {
	id: uuid('id').defaultRandom().primaryKey(),
	secretIdHash: text('secret_id_hash').notNull().unique(),
	receiptId: text('receipt_id'),
	publicKey: text('public_key').notNull(),
	meta: text('meta').notNull(),
	content: text('content').notNull(),
	passwordHash: text('password_hash'),
	passwordAttempts: smallint('password_attempts').notNull().default(0),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
	retrievedAt: timestamp('retrieved_at', { withTimezone: true, mode: 'date' }),
	userId: uuid('user_id').references(() => user.id)
});

// Check secretSettings for reference
export const readReceipt = pgEnum('read_receipt', [
	ReadReceiptOptions.NONE,
	ReadReceiptOptions.EMAIL,
	ReadReceiptOptions.NTFY
]);

export const userSettings = pgTable('user_settings', {
	id: uuid('id').defaultRandom().primaryKey(),
	ntfyEndpoint: text('ntfy_endpoint'),
	email: text('email'),
	readReceipt: readReceipt().default(ReadReceiptOptions.NONE),
	userId: uuid('user_id')
		.notNull()
		.references(() => user.id)
});

export const scope = pgEnum('scope', ['global', 'user']);
export const stats = pgTable('stats', {
	id: serial('id').primaryKey().unique(),
	scope: scope(),
	totalSecrets: integer().default(1),
	userId: uuid('user_id')
		.unique()
		.references(() => user.id)
});

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type EmailVerificationRequest = typeof emailVerificationRequest.$inferSelect;
export type Secret = typeof secret.$inferSelect;
export type UserSettings = typeof userSettings.$inferSelect;
export type Stats = typeof stats.$inferSelect;
