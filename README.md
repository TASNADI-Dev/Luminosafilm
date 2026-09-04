# Luminosafilm

Marketing site for Luminosafilm. Hungarian is the default locale; English lives under `/en/`.

## Stack

- **Astro 7** + TypeScript
- **Tailwind CSS 4** (`tailwind.config.mjs` is the theme source of truth)
- **React** (only for the embedded Sanity Studio)
- **Sanity** CMS (field-level `hu` / `en` localization)
- **FormSubmit** (contact form, AJAX)
- **Cloudflare R2** (static images via `asset()` in `src/lib/assets.ts`)
- **Cloudflare Pages** (hosting)

Node `>= 22.12.0`.

## Local setup

```sh
cp .env.example .env   # fill PUBLIC_SANITY_PROJECT_ID + PUBLIC_SANITY_DATASET
npm install
npm run dev            # http://localhost:4321/Luminosafilm/
```


| Command                       | What it does                 |
| ----------------------------- | ---------------------------- |
| `npm run dev`                 | Local Astro server           |
| `npm run build`               | Production build → `./dist/` |
| `npm run preview`             | Preview the build            |
| `cd studio && npm run dev`    | Standalone Sanity Studio     |
| `cd studio && npm run deploy` | Deploy hosted Studio         |


Embedded Studio is at `/admin`.

