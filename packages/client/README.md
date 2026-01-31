# @scrt-link/client

Client module for [scrt.link](https://scrt.link). This package allows you to create end-to-end encrypted secrets directly from your JavaScript/TypeScript applications.

## Features

- **Client-Side Encryption**: Secrets are encrypted in the browser/client before being sent to the server.
- **Zero-Knowledge**: The server never sees the master password or the unencrypted content.
- **Easy Integration**: Simple API for creating secrets.
- **TypeScript Support**: Full type definitions included.

## Installation

```bash
npm install @scrt-link/client
```

or

```bash
pnpm add @scrt-link/client
```

## Quick Start

```typescript
import { scrtLink, SecretType } from '@scrt-link/client';

// Initialize the client with your API key (Get an API key on https://scrt.link)
const client = scrtLink('your-api-key-here');

// Create a secret
const result = await client.createSecret('This is a secret message!', {
	secretType: SecretType.TEXT,
	publicNote: 'Optional public note',
	expiresIn: 3600 // 1 hour in seconds
});

console.log('Secret Link:', result.secretLink);
```

## API Reference

### `scrtLink(apiKey: string)`

Initializes the scrt.link client.

- `apiKey`: Your API key from scrt.link.

Returns an object with:

- `createSecret(content: string, options?: Options)`: A function to create a new secret.

### `createSecret(content: string, options?: Options)`

Creates a new secret.

- `content`: The string content to encrypt and share.
- `options` (optional):
  - `secretType`: `SecretType.TEXT` or `SecretType.URL`.
  - `password`: Optional password to further protect the secret.
  - `publicNote`: Optional note visible to anyone with the link.
  - `expiresIn`: Expiration time in seconds (default is 7 days).
  - `host`: Custom host if using a self-hosted instance.

## Security

This client uses the Web Crypto API to perform AES-GCM encryption on the client side. A master password is generated locally and used to encrypt the content. Only the encrypted content and a hash of a portion of the master password are sent to the server. The full master password is included in the URL fragment (`#`), which is never sent to the server by the browser.

## License

MIT
