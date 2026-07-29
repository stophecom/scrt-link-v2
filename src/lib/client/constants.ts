import { MB } from '$lib/data/units';

export const TRIAL_PERIOD_DAYS = 7;
export const SECRET_REQUEST_RETENTION_PERIOD_IN_DAYS = 30;

/** Size a file is sliced into before encryption and upload. */
export const CHUNK_SIZE = 64 * MB;

/**
 * Upper bound accepted by the presigned-POST endpoint. Encryption adds a salt, an
 * IV and an auth tag per chunk, so the ciphertext is a little larger than the
 * plaintext slice — 1 MB of headroom covers it comfortably.
 */
export const MAX_ENCRYPTED_CHUNK_SIZE = CHUNK_SIZE + 1 * MB;
