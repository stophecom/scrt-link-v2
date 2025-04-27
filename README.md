# scrt-link-v2

Version 2 - built with [Svelte](https://github.com/sveltejs/cli).

Live: [scrt.link](scrt.link)

## Developing

```bash

# 1. Install dependencies
pnpm install

# 2. Start DB (via Docker)
pnpm run db:start

# 3. Start sveltekit
pnpm run dev

# Run tests (unit and e2e)
pnpm test
```

## Database

Using Drizzle with Postgres.
Runs in Docker locally.

```bash
# You will need to set POSTGRES_URL in your production environment
# Reminder to myself: Using 5433 as port to not have conflict with local Postgres: https://stackoverflow.com/a/76448218

pnpm run db:start  # Start the docker container
pnpm run db:push # Update your database schema

# Local DB with Docker
docker compose up

```

## Building

To create a production version of your app:

```bash
pnpm run build

```

## Cron

We use Vercel Cron to cleanup secrets and files.
See `src/routes/api/v1/cron/+server.ts` for more info.

You can trigger the cron job locally with:

```bash
curl --request POST \
     --url 'http://localhost:5173/api/v1/cron' \
     --header 'Authorization: Bearer CRON_SECRET'

```

## UI / Components

https://www.shadcn-svelte.com/

```bash
# Install component (e.g. form)
pnpm dlx shadcn-svelte@latest add form
```

## Translations / i18n

Translations are done with [Paraglide.js by Inlang](https://inlang.com/m/gerre34r/library-inlang-paraglideJs)

```bash
# See project.inlang/settings.json for configurations
# Edit your messages in messages/en.json
# Consider installing the Sherlock IDE Extension
pnpm machine-translate # Machine translate missing keys

```

### Usage

```ts
import { m } from '$lib/paraglide/messages.js';

// Sherlock IDE Extensions helps managing strings
const someString = m.elegant_muddy_wren_value();
```

## Authentication

Implementation based on [Lucia](https://v2.lucia-auth.com/database-adapters/postgres/)

The following login methods are available:

- Email & Password (with email verification & password reset)
- OAuth with Google

### Google OAuth Client

Redirect URI: `/login/google/callback`

## Subscriptions

We use Stripe as payment provider.

- [Client Side (ES Module)](https://www.npmjs.com/package/@stripe/stripe-js)
- [Server (Node.js)](https://www.npmjs.com/package/stripe)

```bash
# Stripe CLI
# Test webhooks
stripe login
stripe listen --forward-to localhost:5173/api/v1/webhooks

# Trigger event
stripe trigger payment_intent.succeeded

```

## Transactional Emails

- Delivered via [resend](https://resend.com/)
- Email templates with [svelte-email-tailwind](https://github.com/steveninety/svelte-email-tailwind)
- Structure:

```bash
📦 Project
├── 📂 src
│ └── 📂 lib
│   └── 📂 emails # Email templates
│
├── 📂 routes
│ └── 📂 admin
│   └── 📂 email-previews # Preview emails (Only works on localhost )
│
└── 📜 vite.config.ts # Tailwind setup
```

## Workflows / E2E Testing

In order to ship with confidence we run a set of tests during and after the deployment.
See `playwright-tests-published.yml` for more info.

## API

Since all secrets need to be encrypted on the client, the API relies on proper client-side handling. Therefore, API validation is not very strict.

### Authentication

You can get an API key (bearer token) on the account page. (With proper access rights - see plans.)

### Endpoints

> /api/v1/secrets

Used to create secrets programmatically. To interact with the API, use the client-module. (See below)

```bash
# example.http
# IMPORTANT. The following is just for documentation purposes. Use the client-module to interact with the API.

# Post Secret
POST http://scrt.link/api/v1/secrets HTTP/1.1
Content-Type: application/json
Authorization: Bearer {{apiAccessToken}}

{
  "secretIdHash": "480bda04dbf90e580fe1124ff050ad1481509478521dc12242173294d9fec4be",
  "publicKey": "-----BEGIN PUBLIC KEY-----\nMHYwEAYHKoZIzj0CAQYFK4EEACIDYgAEbR5G6VDGfn8kPSE7y8MHY9PaWdgej1zz8nv6mN202pgOzuOzh221LoSFRprLhPqn9ykO+ZmvEMYVZa6+Wfk5GhEZpHl4QtJOGxH8rLhKqbLTJiBsLyXK0xm1u2N/UO1X\n-----END PUBLIC KEY-----",
  "meta": "XYZ", # Encrypted
  "content": "XYZ", # Encrypted
  "password": "my-secret-password", # Optional. Can be omitted.
  "expiresIn": 3600000 # Time in ms.
}

```

### Client Module

Usage in Node.js / Browser:

```html
<script type="module">
	import { scrtLink } from 'https://scrt.link/api/v1/client-module';

	// Instantiate client with API key.
	const client = scrtLink('ak_NcOWw69xw7XDjMK6QSYrw4LDlMOKYMK2F8Oqw4hoeMKiwrk5FcOLY1pqwqscdcOQ');

	// Basic usage
	client.createSecret('Some confidential information…').then(console.log);

	// With options
	client
		.createSecret('https://example.com', {
			secretType: 'redirect' // text | redirect | neogram
			password: 'foobar123'
			expiresIn: 86400000,
		})
		.then(console.log);
</script>
```

Example response:

```json
{
	"secretLink": "https://scrt.link/s#gOOei~kEkcYAAX-YJQnGooSXdSJg8MXkzk~2",
	"receiptId": "D0waygL3",
	"expiresIn": 86400000,
	"expiresAt": "2025-04-24T16:15:52.172Z"
}
```

#### Development

```bash
# The esm module is built during deployment as part of postbuild and saved in the /static folder.
# If you need to make adjustments, see $lib/client/client-module.ts
# Build the module locally with:
esbuild src/lib/client/client-module.ts --bundle --format=esm --minify --outfile=static/client-module.js

# For vercel:
esbuild src/lib/client/client-module.ts --bundle --format=esm --minify --outfile=.vercel/output/static/client-module.js

# Shortcut
pnpm build-client-module

```

## User image handling

We store images (logo, app icons) for white-label sites on S3 and serve optimized images via [imagx](https://dashboard.imgix.com/).

```bash
# Imgix image CDN
PUBLIC_IMGIX_CDN_URL="scrt-link.imgix.net"
```

## Error Handling

We use SvelteKit recommendation: https://svelte.dev/docs/kit/errors
Expected errors are returned with `error(404, 'Some message')` and might be shown to users. For internal errors (mostly unexpected) we use `throw new Error()`.

## Stack

- SvelteKit
- Tailwind CSS
- PostgreSQL (Database)
- Drizzle (ORM)
- Inlang/Paraglide (i18n)
- Resend (Email)

## Infrastructure

- Website and Postgres on [Vercel](https://vercel.com)
- S3 Object Storage with [flow.swiss](https://flow.swiss)
- Emails with [Resend](https://resend.com)

## License

[MIT](https://opensource.org/license/mit/) (Code)

[CC BY-NC-ND](https://creativecommons.org/licenses/by-nc-nd/4.0/) (Creatives)
