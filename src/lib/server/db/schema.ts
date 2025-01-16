import { boolean, pgTable, smallint, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

export const user = pgTable('user', {
	id: uuid('id').defaultRandom().primaryKey(),
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
	publicKey: text('public_key').notNull(),
	meta: text('meta').notNull(),
	content: text('content').notNull(),
	passwordHash: text('password_hash'),
	passwordAttempts: smallint('password_attempts'),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
	retrievedAt: timestamp('retrieved_at', { withTimezone: true, mode: 'date' })
});

export const userInsertSchema = createInsertSchema(user); // Not used atm

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type EmailVerificationRequest = typeof emailVerificationRequest.$inferSelect;
export type Secret = typeof secret.$inferSelect;
