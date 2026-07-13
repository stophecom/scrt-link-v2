import { brevoProvider } from './providers/brevo';
import type { AudienceContact, EmailProvider, SendEmailParams } from './types';

// The active email provider. Swap this line to change providers.
const provider: EmailProvider = brevoProvider;

/** Send a transactional email through the active provider. */
const sendTransactionalEmail = (params: SendEmailParams) => provider.send(params);

/** Add a contact to the marketing audience. No-op if the provider has no CRM. */
export const addContactToAudience = (contact: AudienceContact) => provider.audiences?.add(contact);

/** Remove a contact from the marketing audience. No-op if the provider has no CRM. */
export const removeContactFromAudience = (contact: AudienceContact) =>
	provider.audiences?.remove(contact);

export default sendTransactionalEmail;
