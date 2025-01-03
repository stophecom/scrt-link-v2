import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
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

export const userInsertSchema = createInsertSchema(user); // Not used atm

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type EmailVerificationRequest = typeof emailVerificationRequest.$inferSelect;
