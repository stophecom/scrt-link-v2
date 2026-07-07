# @scrt-link/extension

Browser extension (Chrome + Firefox, MV3/MV2) that creates an encrypted,
one-time-view secret link in one click via [scrt.link](https://scrt.link).

It's a thin UI over [`@scrt-link/client`](../../packages/client) — all
client-side encryption and the API call live there. The extension only adds the
popup UI and API-key storage. See [SPEC.md](./SPEC.md) for scope and decisions.

## Auth

The extension authenticates with a personal **API key** (created at
`scrt.link/account/api`). There is no anonymous mode. API access requires a plan
that includes it, so the extension is effectively a feature for those plans.

## Development

```bash
# from repo root
pnpm --filter @scrt-link/extension dev          # Chrome, with HMR
pnpm --filter @scrt-link/extension dev:firefox   # Firefox
```

`wxt dev` launches a browser with the extension loaded. To load a production
build manually instead:

```bash
pnpm --filter @scrt-link/extension build
# Chrome: chrome://extensions → enable Developer mode → Load unpacked →
#         select apps/extension/.output/chrome-mv3
```

## Build / package

```bash
pnpm --filter @scrt-link/extension build          # → .output/chrome-mv3
pnpm --filter @scrt-link/extension build:firefox  # → .output/firefox-mv2
pnpm --filter @scrt-link/extension zip            # store-ready .zip
pnpm --filter @scrt-link/extension check          # svelte-check / types
```
