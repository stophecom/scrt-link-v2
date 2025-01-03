import crypto from 'crypto';

// Collection of crypto helper functions
// These helpers only run on the server. (Node.js > 20)
// See web-crypto.ts for browser tools

// Function to hash a password using scrypt
export function hashPassword(password: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const salt = crypto.randomBytes(16); // Generate a random salt
		const iterations = 64; // Number of iterations for derived key length
		crypto.scrypt(password, salt, iterations, (err, derivedKey) => {
			if (err) {
				return reject(err);
			}
			const hash = `${salt.toString('hex')}:${iterations}:${derivedKey.toString('hex')}`;
			resolve(hash);
		});
	});
}

// Function to verify a password against a hash
export function verifyPassword(password: string, hash: string): Promise<boolean> {
	return new Promise((resolve, reject) => {
		const [saltHex, iterations, keyHex] = hash.split(':');
		const salt = Buffer.from(saltHex, 'hex');
		const originalKey = Buffer.from(keyHex, 'hex');

		crypto.scrypt(password, salt, parseInt(iterations, 10), (err, derivedKey) => {
			if (err) {
				return reject(err);
			}
			resolve(crypto.timingSafeEqual(originalKey, derivedKey)); // Prevent timing attacks
		});
	});
}

//
export const generateOtp = (size: number = 6) => {
	const randomBytes = crypto.randomBytes(4); // 4 bytes = 32 bits
	const randomInt = parseInt(randomBytes.toString('hex'), 16);
	// Limit to a X-digit number using modulus
	const sixDigitCode = randomInt % Math.pow(10, size);
	// Ensure it's zero-padded to always be X digits
	return sixDigitCode.toString().padStart(size, '0');
};

// export const base64UrlEncode = () => {
// 	const encoder = new TextEncoder();
// };

export const generateBase64Token = (byteLength = 32) => {
	const array = new Uint8Array(byteLength);
	crypto.getRandomValues(array);
	return base64UrlSafeEncode(base64Encode(arrayBufferToString(array.buffer)));
};

// Function to manually encode binary string to Base64
function base64Encode(str: string) {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	let encoded = '';
	let buffer;

	for (let i = 0; i < str.length; i += 3) {
		buffer = (str.charCodeAt(i) << 16) | (str.charCodeAt(i + 1) << 8) | str.charCodeAt(i + 2);
		encoded += chars[(buffer >> 18) & 63];
		encoded += chars[(buffer >> 12) & 63];
		encoded += chars[(buffer >> 6) & 63];
		encoded += chars[buffer & 63];
	}

	if (str.length % 3 === 1) {
		encoded = encoded.slice(0, -2) + '==';
	} else if (str.length % 3 === 2) {
		encoded = encoded.slice(0, -1) + '=';
	}

	return encoded;
}

export function base64Decode(encodedStr: string) {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	let decoded = '';
	let buffer;

	// Remove any Base64 padding ('=')
	encodedStr = encodedStr.replace(/=/g, '');

	for (let i = 0; i < encodedStr.length; i += 4) {
		buffer =
			(chars.indexOf(encodedStr.charAt(i)) << 18) |
			(chars.indexOf(encodedStr.charAt(i + 1)) << 12) |
			(chars.indexOf(encodedStr.charAt(i + 2)) << 6) |
			chars.indexOf(encodedStr.charAt(i + 3));

		decoded += String.fromCharCode((buffer >> 16) & 255);
		decoded += String.fromCharCode((buffer >> 8) & 255);
		decoded += String.fromCharCode(buffer & 255);
	}

	// Remove padding byte if exists
	return decoded.slice(
		0,
		decoded.length - (encodedStr.endsWith('==') ? 2 : encodedStr.endsWith('=') ? 1 : 0)
	);
}

function base64UrlSafeEncode(base64string: string) {
	return base64string.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// URL-safe Base64 Decoding
export function base64UrlSafeDecode(urlSafeBase64: string) {
	let base64 = urlSafeBase64.replace(/-/g, '+').replace(/_/g, '/');
	const padding = base64.length % 4;
	if (padding === 2) {
		base64 += '==';
	} else if (padding === 3) {
		base64 += '=';
	}
	return base64;
}

export const arrayBufferToString = (buffer: ArrayBuffer) =>
	String.fromCharCode(...new Uint8Array(buffer));

export const stringToArrayBuffer = (str: string) => {
	const uint8Array = Uint8Array.from(str, (c) => c.charCodeAt(0));
	return uint8Array.buffer;
};
