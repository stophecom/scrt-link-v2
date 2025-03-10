// Collection of crypto helper functions
// These helpers only run in the Browser: crypto as in window.crypto
// See crypto.ts for server tools

// Create random bytes for Salt, Initialization Vector (IV), etc.
const getRandomBytes = (length = 16) => crypto.getRandomValues(new Uint8Array(length));

const blobToBase64 = async (blob: Blob) => {
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => {
			if (typeof reader.result === 'string') {
				resolve(reader.result);
			} else {
				reject('Failed to create base64 from blob.');
			}
		};
		reader.readAsDataURL(blob);
	});
};

export const encodeText = (text: string) => {
	const encoder = new TextEncoder();
	return encoder.encode(text);
};

export const decodeText = (data: ArrayBuffer) => {
	const decoder = new TextDecoder();
	return decoder.decode(data);
};

export const generateUuid = () => crypto.randomUUID();

export const generateRandomUrlSafeString = (length = 36) => {
	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	const numbers = '0123456789';
	const specialCharacters = '$~-_.'; // Technically more characters are allowed in the fragment identifier part of the URL.
	const charset = [...letters, ...numbers, ...specialCharacters];

	const values = getRandomBytes(length);
	return Array.from(values, (v) => charset[v % charset.length]).join('');
};

export const sha256Hash = async (message: string) => {
	const buffer = await crypto.subtle.digest('SHA-256', encodeText(message));
	return Array.prototype.map
		.call(new Uint8Array(buffer), (x) => ('00' + x.toString(16)).slice(-2))
		.join('');
};

export const binaryToBase64 = (arrayBuffer: ArrayBuffer) => {
	const arrayBufferToString = (buffer: ArrayBuffer) =>
		String.fromCharCode(...new Uint8Array(buffer));

	return btoa(arrayBufferToString(arrayBuffer));
};

export const base64ToBinary = (base64: string) => {
	const base64Decoded = atob(base64);

	const stringToArrayBuffer = (str: string) => {
		const uint8Array = Uint8Array.from(str, (c) => c.charCodeAt(0));
		return uint8Array.buffer;
	};

	return stringToArrayBuffer(base64Decoded);
};

export const encryptData = async (
	data: ArrayBuffer,
	cryptoKey: CryptoKey,
	salt: Uint8Array<ArrayBuffer>
) => {
	const iv = getRandomBytes();
	const result = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, data);

	const encryptedBlob = new Blob([salt, iv, result]); // Adding IV
	return encryptedBlob;
};

export const decryptData = async (data: Blob, password: string) => {
	const [salt, iv, body] = await Promise.all([
		data.slice(0, 16).arrayBuffer(), // Extracting Salt
		data.slice(16, 32).arrayBuffer(), // Extracting IV
		data.slice(32).arrayBuffer() // The actual body. e.g. file content
	]);

	// Derive the same key from the password and salt
	const passwordKey = await crypto.subtle.importKey('raw', encodeText(password), 'PBKDF2', false, [
		'deriveKey'
	]);

	const derivedKey = await crypto.subtle.deriveKey(
		{
			name: 'PBKDF2',
			salt: salt,
			iterations: 100000,
			hash: 'SHA-256'
		},
		passwordKey,
		{
			name: 'AES-GCM',
			length: 256
		},
		false,
		['decrypt']
	);

	const decryptedData = await crypto.subtle.decrypt(
		{
			name: 'AES-GCM',
			iv: iv
		},
		derivedKey,
		body
	);
	return decryptedData;
};

// Generate derived key from a password
export const generateKeyFromPassword = async (password: string) => {
	const salt = getRandomBytes();
	// Step 2: Derive a key from the password using PBKDF2
	const passwordKey = await crypto.subtle.importKey('raw', encodeText(password), 'PBKDF2', false, [
		'deriveKey'
	]);

	const cryptoKey = await crypto.subtle.deriveKey(
		{
			name: 'PBKDF2',
			salt: salt,
			iterations: 100000,
			hash: 'SHA-256'
		},
		passwordKey,
		{
			name: 'AES-GCM',
			length: 256
		},
		false,
		['encrypt']
	);

	return {
		cryptoKey,
		salt
	};
};

export const encryptString = async (text: string, password: string) => {
	const data = encodeText(text).buffer as ArrayBuffer;

	const { cryptoKey, salt } = await generateKeyFromPassword(password);
	const encryptedData = await encryptData(data, cryptoKey, salt);

	const encryptedDataBase64 = await blobToBase64(encryptedData);
	return encryptedDataBase64;
};

export const encryptFile = async (file: File | Blob, password: string) => {
	const data = await file.arrayBuffer();

	const { cryptoKey, salt } = await generateKeyFromPassword(password);

	return encryptData(data, cryptoKey, salt);
};

export const decryptString = async (base64DataUrl: string, password: string) => {
	const base64Response = await fetch(base64DataUrl);
	const blob = await base64Response.blob();

	const decryptedData = await decryptData(blob, password);
	const result = decodeText(decryptedData);

	return result;
};

// Not in use. Could be used to decrypt smaller files at once.
export const decryptFile = async (file: Blob, password: string, fileName: string) => {
	const decryptedData = await decryptData(file, password);

	return new File([decryptedData], fileName);
};

// Digital signature
// Generate public/private key pair
export const generateKeyPair = async () =>
	await crypto.subtle.generateKey(
		{
			name: 'ECDSA',
			namedCurve: 'P-384'
		},
		true,
		['sign', 'verify']
	);

// Export (public) key as PEM
const pemHeader = '-----BEGIN PUBLIC KEY-----';
const pemFooter = '-----END PUBLIC KEY-----';

export const exportPublicKey = async (key: CryptoKey) => {
	const exported = await crypto.subtle.exportKey('spki', key);
	const exportedAsBase64 = binaryToBase64(exported);
	const pemExported = `${pemHeader}\n${exportedAsBase64}\n${pemFooter}`;

	return pemExported;
};

export const importPublicKey = (pem: string) => {
	// fetch the part of the PEM string between header and footer
	const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);

	const binaryKey = base64ToBinary(pemContents);

	return crypto.subtle.importKey(
		'spki',
		binaryKey,
		{
			name: 'ECDSA',
			namedCurve: 'P-384'
		},
		true,
		['verify']
	);
};

// Create a signature using the private key
export const signMessage = async (message: string, privateKey: CryptoKey) => {
	const encoded = encodeText(message);
	const signature = await crypto.subtle.sign(
		{
			name: 'ECDSA',
			hash: { name: 'SHA-384' }
		},
		privateKey,
		encoded
	);
	const signatureAsBase64 = binaryToBase64(signature);
	return signatureAsBase64;
};

// Verify messsage signature
export const verifyMessageSignature = async (
	message: string,
	signature: string,
	publicKey: CryptoKey
) => {
	const encoded = encodeText(message);
	const signatureDecoded = base64ToBinary(signature);

	const result = await crypto.subtle.verify(
		{
			name: 'ECDSA',
			hash: { name: 'SHA-384' }
		},
		publicKey,
		signatureDecoded,
		encoded
	);

	return result;
};
