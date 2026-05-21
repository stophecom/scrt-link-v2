Create end-to-end encrypted secrets directly from your terminal. The `scrtlink` CLI is built on top of the [scrt.link API](/api-documentation) and uses the same client-side encryption as the web app — the server never sees your plaintext.

To use the CLI, you'll need an active [subscription](/pricing) and an API key from your [account page](/account/api).

## Installation

```bash
npm install -g @scrt-link/cli
```

## Quick Start

```bash
# Set your API key once
export SCRT_LINK_API_KEY=ak_...

# Create a secret — prints the link to stdout
scrtlink "super-secret-password"
```

## Usage

```bash
scrtlink <secret> [options]
```

### Options

| Flag         | Description                                     | Default     |
| ------------ | ----------------------------------------------- | ----------- |
| `--type`     | `text` \| `redirect` \| `neogram`               | `text`      |
| `--expires`  | `1h` \| `1d` \| `1w` \| `1m`                    | `1w`        |
| `--views`    | View limit 1–1000                               | `1`         |
| `--note`     | Public note shown to recipient before reveal    | —           |
| `--password` | Password-protect the secret                     | —           |
| `--host`     | Override API host (white-label instances)       | `scrt.link` |
| `--api-key`  | API key — overrides `SCRT_LINK_API_KEY` env var | —           |

### Examples

```bash
# Redirect secret that expires in 1 hour
scrtlink "https://example.com" --type redirect --expires 1h

# Password-protected secret, viewable up to 5 times
scrtlink "my secret" --password "unlock123" --views 5

# Add a note the recipient sees before revealing
scrtlink "my secret" --note "Your one-time credentials"

# Pipe the link directly to clipboard (macOS)
scrtlink "my secret" | pbcopy
```

## API Key

Set the `SCRT_LINK_API_KEY` environment variable to avoid passing `--api-key` on every command:

```bash
# Add to your shell profile (~/.zshrc, ~/.bashrc, etc.)
export SCRT_LINK_API_KEY=ak_...
```

Or pass it inline for a single command:

```bash
scrtlink "my secret" --api-key ak_...
```

## White-label

Point the CLI at your own scrt.link instance with `--host`:

```bash
scrtlink "my secret" --host yourdomain.com
```

## Secret Types

| Type       | Description                                   |
| ---------- | --------------------------------------------- |
| `text`     | Plain text secret (default)                   |
| `redirect` | A URL — recipient is redirected after reveal  |
| `neogram`  | Self-destructing message with animated reveal |
