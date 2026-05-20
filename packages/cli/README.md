# @scrt-link/cli

CLI for [scrt.link](https://scrt.link) — create end-to-end encrypted, self-destructing secrets from the command line.

[scrt.link](https://scrt.link) is a secure secret-sharing platform. Secrets are encrypted on the client before being sent to the server. The server never sees the plaintext. Once viewed (or expired), secrets are permanently deleted.

## Installation

```bash
npm install -g @scrt-link/cli
```

## Usage

```bash
# Set your API key once (or pass --api-key per command)
export SCRT_LINK_API_KEY=ak_...

# Basic — prints the secret link to stdout
scrtlink "super-secret-password"

# With options
scrtlink "https://example.com" \
  --type redirect \
  --expires 1h \
  --views 5 \
  --note "Bitcoin wallet" \
  --password "unlock123"

# White-label instance
scrtlink "my secret" --host br3f.com
```

## Options

| Flag         | Description                       | Default     |
| ------------ | --------------------------------- | ----------- |
| `--type`     | `text` \| `redirect` \| `neogram` | `text`      |
| `--expires`  | `1h` \| `1d` \| `1w` \| `1m`      | `1w`        |
| `--views`    | View limit 1–1000                 | `1`         |
| `--note`     | Public note shown before reveal   | —           |
| `--password` | Password-protect the secret       | —           |
| `--host`     | Override API host (white-label)   | `scrt.link` |
| `--api-key`  | API key (overrides env var)       | —           |

The command prints the secret link to stdout, making it pipeable:

```bash
scrtlink "my secret" | pbcopy
echo "my secret" | xargs scrtlink
```

## API Key

Get your API key on [scrt.link](https://scrt.link) under Account → API. API access requires a paid plan.

## License

MIT
