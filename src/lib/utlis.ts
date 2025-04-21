export const dropUndefinedValuesFromObject = <T extends Record<string, string | null | undefined>>(
	obj: T
): Partial<T> =>
	Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>;
