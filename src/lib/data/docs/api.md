This documentation is intended for developers who want to interact with the service programmatically via the API. Since the product uses client-side encryption, it is strongly recommended to use the provided client module, as outlined below.

To use the API, you’ll need an active [subscription](/pricing) that unlocks this feature and allows you to generate an access (bearer) token from your [account page](/account).

## ⚠️ API Limitations

Due to the complexity of handling end-to-end encrypted files, **only text-based secrets** (Text, Redirect, Neogram) **are supported** via the API.

For convenience, the client module is available as an ESM module at `https://scrt.link/api/v1/client-module` - no need to install any NPM packages. See usage examples below.

## ⚒️ Client Module

The client module provides a simple and convenient way to interact with the scrt.link API.

### Basic Usage

```html
<script type="module">
	import { scrtLink } from 'https://scrt.link/api/v1/client-module';

	// Instantiate client with API key.
	const client = scrtLink('<your-api-key>');

	// Basic usage
	client.createSecret('Some confidential information…').then(console.log);
</script>
```

Example response:

```json
{
	"secretLink": "https://scrt.link/s#gOOei~kEkcYAAX-YJQnGooSXdSJg8MXkzk~2",
	"receiptId": "D0waygL3",
	"expiresIn": 86400000
}
```

### Advanced Options

```html
<script type="module">
	import { scrtLink } from 'https://scrt.link/api/v1/client-module';

	// Instantiate client with API key.
	const client = scrtLink('<your-api-key>');

	// Example with all options
	client
		.createSecret('https://example.com', {
			secretType: 'redirect' // text | redirect | neogram
			password: 'foobar123'
			expiresIn: 86400000,
		})
		.then(console.log);
</script>
```

## Contribute

Do you need help or want to contribute?  
The code is open-source on [Github](https://github.com/stophecom/scrt-link-v2).
