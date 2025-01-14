# scrt-link-v2

Version 2 - built with Svelte: [`sv`](https://github.com/sveltejs/cli).

> [!WARNING]  
> This is work-in-progress.

## Developing

```bash
pnpm run dev

# drizzle (ORM, DB):
# You will need to set POSTGRES_URL in your production environment
pnpm run db:start  # Start the docker container
pnpm run db:push # Update your database schema

# Local DB with Docker
docker compose up

# Run tests (unit and e2e)
pnpm test
```

## Building

To create a production version of your app:

```bash
pnpm run build
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

Following examples from [Lucia](https://v2.lucia-auth.com/database-adapters/postgres/)

The following login methods are available:

- Email & Password
- OAuth with Google

### Google OAuth Client

Redirect URI: `/login/google/callback`

## Stack

- SvelteKit
- Tailwind CSS
- PostgreSQL (Database)
- Drizzle (ORM)

## Infrastructure

- Website and Postgres on [Vercel](https://vercel.com/)
- S3 Object Storage with [flow.swiss](https://flow.swiss)

## License

[MIT](https://opensource.org/license/mit/) (Code)

[CC BY-NC-ND](https://creativecommons.org/licenses/by-nc-nd/4.0/) (Creatives)
