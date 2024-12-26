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

# lucia (auth):
# Run pnpm run db:push to update your database schema
# Visit /demo/lucia route to view the demo

# paraglide (i18n):
# Edit your messages in messages/en.json
# Consider installing the Sherlock IDE Extension
# Visit /demo/paraglide route to view the demo

```

## Building

To create a production version of your app:

```bash
pnpm run build
```
