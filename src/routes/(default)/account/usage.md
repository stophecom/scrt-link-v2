## Client Module

The client module provides a simple and convenient way to interact with the scrt.link API.

### Basic Usage

```html
<script type="module">
	import { scrtLink } from 'https://scrt.link/api/v1/client-module';

	// Instantiate client with API key.
	const client = scrtLink('ak_NcOWw69xw7XDjMK6QSYrw4LDlMOKYMK2F8Oqw4hoeMKiwrk5FcOLY1pqwqscdcOQ');

	// Basic usage
	client.createSecret('Some confidential information…').then(console.log);
</script>
```

Example response:

```json
{
	"secretLink": "https://scrt.link/de/s#gOOei~kEkcYAAX-YJQnGooSXdSJg8MXkzk~2",
	"receiptId": "D0waygL3",
	"expiresIn": 86400000
}
```

### Advanced Options

```html
<script type="module">
	import { scrtLink } from 'https://scrt.link/api/v1/client-module';

	// Instantiate client with API key.
	const client = scrtLink('ak_NcOWw69xw7XDjMK6QSYrw4LDlMOKYMK2F8Oqw4hoeMKiwrk5FcOLY1pqwqscdcOQ');

	// Example with all options
	client
		.createSecret('https://example.com', {
			secretType: 'redirect' // text | redirect | neogram
			password: 'foobar123'
			expiresIn: 86400000,
			locale: 'de',
		})
		.then(console.log);
</script>
```
