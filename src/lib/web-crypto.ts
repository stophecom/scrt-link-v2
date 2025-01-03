export const generateUuid = () => crypto.randomUUID();

export const createHash = async (message: string) => {
	const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(message));
	return Array.prototype.map
		.call(new Uint8Array(buffer), (x) => ('00' + x.toString(16)).slice(-2))
		.join('');
};
