export type SendEmailParams = {
	to: string | string[];
	subject: string;
	html: string;
	replyTo?: string;
};

export type AudienceContact = {
	email: string;
};

export interface EmailProvider {
	/** Send one transactional email. Failures are logged, not thrown. */
	send(params: SendEmailParams): Promise<void>;

	/**
	 * Marketing-list ops. OPTIONAL — undefined for providers without a CRM
	 * (e.g. raw SMTP). Callers must null-check the result.
	 */
	audiences?: {
		add(contact: AudienceContact): Promise<void>;
		remove(contact: AudienceContact): Promise<void>;
	};
}
