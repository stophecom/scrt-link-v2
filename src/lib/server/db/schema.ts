import {
	boolean,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	serial,
	smallint,
	text,
	timestamp,
	uuid
} from 'drizzle-orm/pg-core';

import { ReadReceiptOptions, Role, TierOptions } from '../../data/enums';

export const subscriptionTier = pgEnum('subscription_tier', [
	TierOptions.CONFIDENTIAL,
	TierOptions.SECRET,
	TierOptions.TOP_SECRET,
	TierOptions.SECRET_SERVICE
]);

export const role = pgEnum('role', [Role.USER, Role.ADMIN]);

export const user = pgTable('user', {
	id: uuid('id').defaultRandom().primaryKey().unique(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash'),
	name: text('name'),
	picture: text('picture'),
	googleId: text('google_id'),
	stripeCustomerId: text('stripe_customer_id'),
	role: role().default(Role.USER),
	subscriptionTier: subscriptionTier().default(TierOptions.CONFIDENTIAL),
	preferences: jsonb('preferences'),
	emailVerified: boolean('email_verified'),
	createdAt: timestamp('created_att', { mode: 'date' }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { mode: 'date' })
		.notNull()
		.$onUpdate(() => new Date())
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
		.unique()
		.references(() => user.id, { onDelete: 'cascade' })
});

export const whiteLabelSite = pgTable('white_label_site', {
	id: uuid('id').defaultRandom().primaryKey(),
	customDomain: text('custom_domain').unique(),
	name: text('name'),
	locale: text('locale'),
	title: text('name').default('Share a secret'),
	lead: text('lead').default('…with a link that only works one time and then self-destructs.'),
	theme: jsonb('theme'),
	logo: text('logo').default(
		'https://public.blob.vercel-storage.com/eEZHAoPTOBSYGBE3/JRajRyC-PhBHEinQkupt02jqfKacBVHLWJq7Iy.png'
	),
	createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { mode: 'date' })
		.notNull()
		.$onUpdate(() => new Date()),
	userId: uuid('user_id')
		.notNull()
		.unique()
		.references(() => user.id, { onDelete: 'cascade' })
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: uuid('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
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
	userId: uuid('user_id').references(() => user.id, { onDelete: 'cascade' })
});

export const apiKey = pgTable('api_key', {
	id: uuid('id').defaultRandom().primaryKey(),
	key: text('key').notNull(),
	description: text('description'),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	revoked: boolean('revoked').default(false),
	userId: uuid('user_id').references(() => user.id, { onDelete: 'cascade' })
});

export const scope = pgEnum('scope', ['global', 'user']);
export const stats = pgTable('stats', {
	id: serial('id').primaryKey(),
	scope: scope(),
	totalSecrets: integer().default(1),
	userId: uuid('user_id')
		.unique()
		.references(() => user.id, { onDelete: 'cascade' })
});

export type User = typeof user.$inferSelect;
export type UserSettings = typeof userSettings.$inferSelect;
export type Session = typeof session.$inferSelect;
export type EmailVerificationRequest = typeof emailVerificationRequest.$inferSelect;
export type Secret = typeof secret.$inferSelect;
export type APIKey = typeof apiKey.$inferSelect;
export type Stats = typeof stats.$inferSelect;
