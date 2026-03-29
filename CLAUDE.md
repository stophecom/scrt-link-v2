# CLAUDE.md - scrt-link-v2

## Project Overview

**scrt.link** is a secure secret-sharing platform. Users create encrypted secrets (text, files) that can be shared via one-time links. The platform supports end-to-end encryption, team workspaces, white-label deployments, Stripe subscriptions, and a public API.

## Tech Stack

- **Framework**: SvelteKit 2 (Svelte 5) with TypeScript strict mode
- **Styling**: Tailwind CSS 4 + shadcn-svelte (bits-ui)
- **Database**: PostgreSQL via Drizzle ORM
- **Forms**: sveltekit-superforms + Zod 4 + formsnap
- **Auth**: Custom session-based (Lucia pattern) + Google OAuth (Arctic)
- **i18n**: Paraglide.js (7 locales: en, de, fr, es, pt, ru, zh-CN)
- **Email**: Resend + svelte-email-tailwind templates
- **Payments**: Stripe subscriptions
- **Storage**: AWS S3 + Imgix CDN
- **Testing**: Vitest (unit/browser) + Playwright (e2e)
- **Package manager**: pnpm (monorepo)
- **Deployment**: Vercel (primary) or Docker

## Monorepo Structure

```
packages/core/     # Shared crypto & key management utilities (@scrt-link/core)
packages/client/   # Public npm client module for API
src/               # Main SvelteKit application
```

## Key Commands

```bash
pnpm run dev            # Dev server (port 5173)
pnpm run db:start       # Start Postgres in Docker (port 5433)
pnpm run db:push        # Apply schema changes
pnpm run db:studio      # Drizzle Studio (port 4983)
pnpm test:unit          # Vitest unit tests
pnpm test:e2e           # Playwright e2e tests
pnpm check              # Svelte type checking
pnpm build              # Production build
```

## Architecture

### Directory Layout

- `src/lib/server/db/schema.ts` - Database schema (Drizzle)
- `src/lib/server/auth.ts` - Session validation & auth logic
- `src/lib/server/form/actions.ts` - All server form action handlers
- `src/lib/validators/formSchemas.ts` - Zod schemas for all forms
- `src/lib/components/ui/` - shadcn-svelte UI components
- `src/lib/components/forms/` - Form components (signin, password, etc.)
- `src/lib/client/key-manager.ts` - In-memory master key store (browser)
- `packages/core/src/key-management.ts` - Crypto functions (PBKDF2, AES-GCM, wrap/unwrap)

### Route Groups

- `(app)/(default)/` - Main app pages with full navbar/layout
- `(app)/(minimal)/` - Auth pages (login, signup, set-password) with minimal layout
- `api/v1/` - REST API endpoints
- `white-label/` - Custom domain routes

### Form Handling Pattern

1. Define Zod schema in `formSchemas.ts` (functions for i18n)
2. Server action in `actions.ts`: validate with `superValidate()`, operate, return `{ form }` or `message()`
3. Client uses `superForm()` with `zod4Client()` validators
4. For async crypto before submit: use `dataType: 'json'` + `onSubmit` with `jsonData()`
5. Set `applyAction: false` when using `dataType: 'json'` (superforms bug with message updates)

### Authentication

- Session tokens (30-day, SHA-256 hashed) stored in `auth-session` cookie
- `event.locals.user` and `event.locals.session` set in `hooks.server.ts`
- Route protection via `-guard.*` files (svelte-guard)
- Email verification with OTP codes

### Zero-Knowledge Encryption

- Password -> PBKDF2 (600k iterations) -> PDK (never stored)
- PDK wraps Master Key (AES-GCM) -> stored encrypted on server
- Recovery Key (32 bytes, Crockford base32) also wraps Master Key
- Master key held in memory only (`key-manager.ts`), cleared on tab close
- Password changes re-wrap MK with new PDK (MK never changes)

### i18n

- Import messages: `import { m } from '$lib/paraglide/messages.js'`
- Usage: `m.message_key()` or `m.message_key({ param: value })`
- Redirects: use `redirectLocalized()` from `$lib/i18n`

### Rate Limiting

- Use `isRateLimited(event)` helper from `$lib/server/rate-limit`
- Automatically skipped in development mode
- Returns `message(form, { status: 'error', ... })` on limit

## Database

Key tables: `user`, `user_encryption_key`, `session`, `organization`, `membership`, `secret`, `api_key`, `white_label_site`

Schema changes: edit `schema.ts` then `pnpm run db:push`

## Testing

- Unit tests: `*.spec.ts` (Node), `*.browser.spec.ts` (Chromium via Vitest browser)
- E2E tests: `e2e/` directory with Playwright
- CI: GitHub Actions on Vercel preview deployments

## Environment

Key env vars: `POSTGRES_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `RESEND_API`, `PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `PUBLIC_S3_ENDPOINT`, `S3_ACCESS_KEY`

Adapters: Vercel (default) or Node (`ADAPTER=node` for Docker)
