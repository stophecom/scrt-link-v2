```html
<script type="module">
	import { scrtLink } from 'https://scrt.link/api/v1/client-module';

	// Instantiate client with API key.
	const client = scrtLink('<your-api-key>');

	// Basic usage
	client.createSecret('Some confidential information…').then(console.log);
</script>
```
