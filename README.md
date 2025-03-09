# scrt-link-v2

Version 2 - built with [Svelte](https://github.com/sveltejs/cli).

Live: [v2.scrt.link](v2.scrt.link)

> [!WARNING]  
> This is work-in-progress.

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
     --header 'Authorization: Bearer API_SECRET_KEY'

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
# Edit your messages in messages/en.json
# Consider installing the Sherlock IDE Extension
# Visit /demo/paraglide route to view the demo
pnpm inlang:machine-translate # Machine translate missing keys
pnpm inlang:lint
pnpm inlang:editor # Opens visual editor
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

## Error Handling

We use SvelteKit recommendation: https://svelte.dev/docs/kit/errors
Expected errors are returned with `error(404, 'Some message')` and might be shown to users. For internal errors (mostly unexpected) we use `throw new Error()`.

## Stack

- SvelteKit
- Tailwind CSS
- PostgreSQL (Database)
- Drizzle (ORM)
- Inlang/Paraglide (i18n)

## Infrastructure

- Website and Postgres on [Vercel](https://vercel.com)
- S3 Object Storage with [flow.swiss](https://flow.swiss)
- Emails with [Resend](https://resend.com)

## License

[MIT](https://opensource.org/license/mit/) (Code)

[CC BY-NC-ND](https://creativecommons.org/licenses/by-nc-nd/4.0/) (Creatives)
