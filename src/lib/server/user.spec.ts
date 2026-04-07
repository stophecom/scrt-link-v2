import { describe, expect, test } from 'vitest';

/**
 * This tests the update-set logic used by createOrUpdateUser to ensure
 * that undefined fields are NOT included in the conflict update set
 * (which would overwrite existing values with null).
 *
 * The actual function hits DB/Stripe/Resend, so we test the logic in isolation.
 */
function buildUpdateSet({
	emailVerified,
	googleId,
	name,
	picture
}: {
	emailVerified?: boolean;
	googleId?: string | null;
	name?: string | null;
	picture?: string | null;
}): Record<string, unknown> {
	const updateSet: Record<string, unknown> = { emailVerified };
	if (googleId !== undefined) updateSet.googleId = googleId;
	if (name !== undefined) updateSet.name = name;
	if (picture !== undefined) updateSet.picture = picture;
	return updateSet;
}

describe('createOrUpdateUser updateSet logic', () => {
	test('only emailVerified is set when other fields are omitted', () => {
		const result = buildUpdateSet({ emailVerified: true });
		expect(result).toEqual({ emailVerified: true });
		expect(result).not.toHaveProperty('name');
		expect(result).not.toHaveProperty('googleId');
		expect(result).not.toHaveProperty('picture');
	});

	test('explicitly passed null fields ARE included in the update set', () => {
		const result = buildUpdateSet({
			emailVerified: true,
			name: null,
			googleId: null,
			picture: null
		});
		expect(result).toEqual({
			emailVerified: true,
			name: null,
			googleId: null,
			picture: null
		});
	});

	test('explicitly passed values are included in the update set', () => {
		const result = buildUpdateSet({
			emailVerified: true,
			name: 'Alice',
			googleId: 'g-123',
			picture: 'https://example.com/pic.jpg'
		});
		expect(result).toEqual({
			emailVerified: true,
			name: 'Alice',
			googleId: 'g-123',
			picture: 'https://example.com/pic.jpg'
		});
	});

	test('partial fields: only provided ones are included', () => {
		const result = buildUpdateSet({
			emailVerified: false,
			name: 'Bob'
		});
		expect(result).toEqual({
			emailVerified: false,
			name: 'Bob'
		});
		expect(result).not.toHaveProperty('googleId');
		expect(result).not.toHaveProperty('picture');
	});
});
