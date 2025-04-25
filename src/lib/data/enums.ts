export enum SecretType {
	TEXT = 'text',
	FILE = 'file',
	REDIRECT = 'redirect',
	SNAP = 'snap',
	NEOGRAM = 'neogram'
}

export enum ReadReceiptOptions {
	NONE = 'none',
	EMAIL = 'email',
	NTFY = 'ntfy'
}

export enum Role {
	USER = 'user',
	ADMIN = 'admin'
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
