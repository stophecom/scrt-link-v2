import {
	boolean,
	index,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	primaryKey,
	serial,
	smallint,
	text,
	timestamp,
	unique,
	uuid
} from 'drizzle-orm/pg-core';

import {
	InviteStatus,
	MembershipRole,
	ReadReceiptOptions,
	Role,
	SecretType,
	TierOptions
} from '../../data/enums';

export const subscriptionTier = pgEnum('subscription_tier', [
	TierOptions.CONFIDENTIAL,
	TierOptions.SECRET,
	TierOptions.TOP_SECRET,
	TierOptions.SECRET_SERVICE
]);

export const role = pgEnum('role', [Role.USER, Role.ADMIN]);

export const user = pgTable('user', {
	id: uuid('id').defaultRandom().primaryKey(),
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
	encryptionEnabled: boolean('encryption_enabled').default(false),
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

export const userEncryptionKey = pgTable('user_encryption_key', {
	id: uuid('id').defaultRandom().primaryKey(),
	userId: uuid('user_id')
		.notNull()
		.unique()
		.references(() => user.id, { onDelete: 'cascade' }),
	// PBKDF2 salt for deriving the Password-Derived Key (hex-encoded, 16 bytes)
	pdkSalt: text('pdk_salt').notNull(),
	// Stored so we can upgrade iterations per-user without global migration
	pdkIterations: integer('pdk_iterations').notNull().default(600000),
	// Master Key encrypted by PDK: base64(IV || ciphertext || authTag)
	encryptedMasterKey: text('encrypted_master_key').notNull(),
	// Master Key encrypted by Recovery Key (null until recovery is set up)
	recoveryEncryptedMasterKey: text('recovery_encrypted_master_key'),
	// SHA-256 hash of recovery key (for verification during recovery)
	recoveryKeyHash: text('recovery_key_hash'),
	// True if user uses a separate encryption passphrase (OAuth users)
	usesEncryptionPassphrase: boolean('uses_encryption_passphrase').notNull().default(false),
	createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { mode: 'date' })
		.notNull()
		.$onUpdate(() => new Date())
});

export const secretTypeEnum = pgEnum('secret_type_enum', [
	SecretType.TEXT,
	SecretType.FILE,
	SecretType.REDIRECT,
	SecretType.SNAP,
	SecretType.NEOGRAM
]);

export const organization = pgTable('organization', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	createdBy: uuid('created_by').references(() => user.id, { onDelete: 'set null' })
});

export const membershipRole = pgEnum('membership_role', [
	MembershipRole.MEMBER,
	MembershipRole.OWNER
]);

export const membership = pgTable(
	'membership',
	{
		userId: uuid('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		organizationId: uuid('organization_id')
			.notNull()
			.references(() => organization.id, {
				onDelete: 'cascade'
			}),
		role: membershipRole().default(MembershipRole.MEMBER)
	},
	(table) => [primaryKey({ columns: [table.userId, table.organizationId] })]
);

export const inviteStatus = pgEnum('invite_status', [
	InviteStatus.PENDING,
	InviteStatus.ACCEPTED,
	InviteStatus.REVOKED,
	InviteStatus.EXPIRED
]);

export const invite = pgTable(
	'invite',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		name: text('name'),
		email: text('email').notNull(),
		organizationId: uuid('organization_id').references(() => organization.id, {
			onDelete: 'cascade'
		}),
		membershipRole: membershipRole().default(MembershipRole.MEMBER),
		token: text('token').notNull(),
		status: inviteStatus().default(InviteStatus.PENDING),
		invitedByUserId: uuid('invited_by_user_id').notNull(),
		createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
		expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
		acceptedAt: timestamp('accepted_at', { mode: 'date' })
	},
	(table) => [unique().on(table.email, table.organizationId)]
);

export const whiteLabelSite = pgTable('white_label_site', {
	id: uuid('id').defaultRandom().primaryKey(),
	customDomain: text('custom_domain').unique(),
	published: boolean('published'),
	private: boolean('private'),
	name: text('name'),
	locale: text('locale'),
	theme: jsonb('theme'),
	messages: jsonb('messages'),
	enabledSecretTypes: secretTypeEnum().array().notNull().default([SecretType.TEXT]),
	logo: text('logo'),
	logoDarkMode: text('logo_dark_mode'),
	appIcon: text('app_icon'),
	ogImage: text('og_image'),
	createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { mode: 'date' })
		.notNull()
		.$onUpdate(() => new Date()),
	organizationId: uuid('organization_id').references(() => organization.id),
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
	meta: text('meta'),
	content: text('content'),
	publicNote: text('public_note'),
	passwordHash: text('password_hash'),
	passwordAttempts: smallint('password_attempts').notNull().default(0),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
	retrievedAt: timestamp('retrieved_at', { withTimezone: true, mode: 'date' }),
	userId: uuid('user_id').references(() => user.id, { onDelete: 'cascade' }),
	whiteLabelSiteId: uuid('white_label_site_id').references(() => whiteLabelSite.id, {
		onDelete: 'cascade'
	})
});

export const secretRequest = pgTable(
	'secret_request',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		// SHA-256 hash of the request ID (from URL) for lookup
		requestIdHash: text('request_id_hash').notNull().unique(),
		// RSA public key (JWK) — used by responder to encrypt
		publicKey: text('public_key').notNull(),
		// RSA private key wrapped with user's Master Key (AES-GCM)
		encryptedPrivateKey: text('encrypted_private_key').notNull(),
		// Request note encrypted with noteKey (key lives in URL hash)
		encryptedNote: text('encrypted_note'),
		// Same note encrypted with user's Master Key (for owner's dashboard)
		encryptedNoteForOwner: text('encrypted_note_for_owner'),
		// User-friendly tracking identifier
		receiptId: text('receipt_id'),
		// Response fields (nullable — filled when someone responds)
		wrappedResponseKey: text('wrapped_response_key'),
		encryptedResponseMeta: text('encrypted_response_meta'),
		encryptedResponseContent: text('encrypted_response_content'),
		// Lifecycle timestamps
		expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
		respondedAt: timestamp('responded_at', { withTimezone: true, mode: 'date' }),
		viewedAt: timestamp('viewed_at', { withTimezone: true, mode: 'date' }),
		// Relations
		userId: uuid('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		// Timestamps
		createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull()
	},
	(table) => [index('secret_request_user_id_idx').on(table.userId)]
);

export const apiKey = pgTable('api_key', {
	id: uuid('id').defaultRandom().primaryKey(),
	key: text('key').notNull(),
	description: text('description'),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	revoked: boolean('revoked').default(false),
	userId: uuid('user_id').references(() => user.id, { onDelete: 'cascade' })
});

export const scope = pgEnum('scope', ['global', 'user', 'whiteLabel']);
export const stats = pgTable('stats', {
	id: serial('id').primaryKey(),
	scope: scope(),
	totalSecrets: integer('total_secrets').default(1),
	whiteLabelSiteId: uuid('white_label_site_id')
		.unique()
		.references(() => whiteLabelSite.id),
	userId: uuid('user_id')
		.unique()
		.references(() => user.id, { onDelete: 'cascade' })
});

export type User = typeof user.$inferSelect;
export type UserEncryptionKey = typeof userEncryptionKey.$inferSelect;
export type Organization = typeof organization.$inferSelect;
export type Membership = typeof membership.$inferSelect;
export type Invite = typeof invite.$inferSelect;
export type UserSettings = typeof userSettings.$inferSelect;
export type Session = typeof session.$inferSelect;
export type EmailVerificationRequest = typeof emailVerificationRequest.$inferSelect;
export type Secret = typeof secret.$inferSelect;
export type APIKey = typeof apiKey.$inferSelect;
export type SecretRequest = typeof secretRequest.$inferSelect;
export type Stats = typeof stats.$inferSelect;
