---
name: translate-keys
description: Translate newly added keys in messages/en.json to all other locales (de, es, fr, pt, ru, zh-CN). Use after adding keys to en.json.
---

# translate-keys

Translate keys that exist in `messages/en.json` but are missing from one or more of the other locale files, writing the translations inline.

## Locales

English is the source of truth: `messages/en.json`.

Target locales to update:

- `messages/de.json` (German)
- `messages/es.json` (Spanish)
- `messages/fr.json` (French)
- `messages/pt.json` (Portuguese)
- `messages/ru.json` (Russian)
- `messages/zh-CN.json` (Simplified Chinese)

## Procedure

1. Read `messages/en.json` and get the list of keys in order.
2. For each target locale file:
   1. Read the file.
   2. Identify missing keys — any key that is in en.json but **absent, `null`, or empty string** in the target.
   3. If zero missing keys, skip this locale and report "up to date".
   4. Otherwise translate each missing value from English into the target language, following the preservation rules below.
   5. Build the final object by iterating **en.json's key order**: for each en.json key, use the target file's existing value if present, otherwise use the translated value. This preserves key order.
   6. Write the file as JSON with **tab indentation**, UTF-8, with a single trailing newline. Equivalent to `JSON.stringify(obj, null, '\t') + '\n'`.
3. Report a one-line summary per locale.

## Preservation rules (do NOT translate these)

- **Placeholders**: curly-brace tokens like `{emailAddress}`, `{number}`, `{amount}`, `{link}` — keep verbatim, same position within the sentence.
- **Markdown syntax**: preserve `**bold**`, `[link-text](/url)`, `` `inline` ``. Translate the visible text inside brackets; keep URLs, bold markers, and backticks exact.
- **HTML**: preserve tags like `<span class="gradient-text">…</span>`. Translate the text between the tags only; never alter attributes or tag names.
- **Escape sequences**: `\n`, `\t`, `\"` — keep exact, same positions.
- **Brand names and technical terms**: keep as-is — `scrt.link`, `scrt`, `Secret Request` / `Secret Requests` (product name), `AES-256`, `AES-256-GCM`, `RSA-2048`, `RSA-OAEP`, `PBKDF2`, `Stripe`, `Google`, `Resend`, `Paraglide`, `Vercel`, `GDPR`, `CCPA`.
- **Currency codes / ISO codes**: `USD`, `EUR`, `CHF`, etc.

## Translation style

- Match the tone of existing translations already in the same locale file. Before translating, scan a few existing entries to calibrate formality (e.g. German `du` vs. `Sie`, French `tu` vs. `vous`, Spanish `tú` vs. `usted`). Default to the register already used in that file.
- Prefer concise, UI-natural phrasings over literal translations. UI strings should read like the product speaks the user's language natively.
- Keep punctuation consistent with the target language (French thin-space before `:`/`!`/`?`, Spanish inverted `¿¡`, German `ß` where appropriate, CJK full-width punctuation).

## Never touch

- The `$schema` key at the top of each file — preserve as-is.
- Any non-empty value that already exists in a target locale — leave it alone.
- `messages/en.json` itself — it is read-only input.

## After running

Run `pnpm lint` to confirm JSON formatting still passes Prettier. Fix any drift before committing.
