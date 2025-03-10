// Create a function to get an enum value from a string
export function getEnumFromString<T extends Record<string, string>>(
	enumObj: T,
	value: string
): T[keyof T] | undefined {
	// Check if the value exists in the enum
	const enumValues = Object.values(enumObj) as string[];
	if (!enumValues.includes(value)) {
		return undefined;
	}

	// Find the key that corresponds to the value
	const keys = Object.keys(enumObj) as Array<keyof T>;
	for (const key of keys) {
		if (enumObj[key] === value) {
			return enumObj[key];
		}
	}

	return undefined;
}
