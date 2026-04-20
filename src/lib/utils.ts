export const dropUndefinedValuesFromObject = <T extends Record<string, string | null | undefined>>(
	obj: T
): Partial<T> =>
	Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>;

// Zod v4's default email regex isn't /v-flag compatible (zod#4795) — forwarding it
// to <input pattern="..."> triggers a browser compile error.
export const stripPattern = <T extends { pattern?: string } | undefined>(
	constraints: T
): Omit<NonNullable<T>, 'pattern'> => {
	if (!constraints) return {} as Omit<NonNullable<T>, 'pattern'>;
	const rest = { ...constraints };
	delete rest.pattern;
	return rest;
};
