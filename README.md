# scrt-link-v2

Version 2 - built with Svelte: [`sv`](https://github.com/sveltejs/cli).

## Developing

```bash
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open

# drizzle (ORM, DB):
# You will need to set POSTGRES_URL in your production environment
pnpm run db:start  # Start the docker container
pnpm run db:push # Update your database schema

# Lucia (auth):
# Run pnpm run db:push to update your database schema
# Visit /demo/lucia route to view the demo

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

## Building

To create a production version of your app:

```bash
pnpm run build
```
