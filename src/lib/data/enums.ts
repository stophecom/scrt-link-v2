import { SecretType } from '@scrt-link/core';

export { SecretType };

export enum ReadReceiptOptions {
	NONE = 'none',
	EMAIL = 'email',
	NTFY = 'ntfy'
}

// @todo Refactor names
export enum Role {
	USER = 'user',
	ADMIN = 'admin'
}
export enum MembershipRole {
	MEMBER = 'Member',
	OWNER = 'Owner'
}

export enum InviteStatus {
	PENDING = 'pending',
	ACCEPTED = 'accepted',
	EXPIRED = 'expired',
	REVOKED = 'revoked'
}

export enum TierOptions {
	CONFIDENTIAL = 'Confidential',
	SECRET = 'Secret',
	TOP_SECRET = 'Top Secret',
	SECRET_SERVICE = 'Secret Service'
}

export enum ThemeOptions {
	PINK = 'pink',
	PURPLE = 'purple',
	BLUE = 'blue',
	TEAL = 'teal'
}

export enum SupportedCurrency {
	USD = 'usd',
	EUR = 'eur',
	CHF = 'chf'
}
