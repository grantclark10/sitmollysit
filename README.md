# Sit Molly Sit!

Custom AI pet portrait store. Astro (static) on Cloudflare Pages, with Pages Functions, D1, R2, KV, Lemon Squeezy, Resend and Turnstile.

> Status: phase 1 of 7 (scaffold, brand system, home page). The full setup guide (Lemon Squeezy, webhooks, Resend, Cloudflare Access, deployment) gets written as those phases land.

## Local development

```bash
npm install
cp .dev.vars.example .dev.vars
npm run dev       # astro build + wrangler pages dev (Miniflare) on http://localhost:8788
npm run dev:ui    # astro dev with HMR, for UI work only (no Pages Functions)
npm run check     # astro check + tsc --noEmit
```

## Placeholder assets to replace

- `src/assets/logo.svg`: generated placeholder wordmark (DM Sans 600, 0.18em tracking, macron over the O). Swap in the master SVG.
- `src/assets/pets/*.jpg`: cropped from screenshots of the old Shopify site. Replace them with the original exports at the same filenames (the hero is `harvey.jpg`, the bespoke panel is `murphy.jpg`).
- Animated Portrait images: these are studio photos for now. Real animated-feature examples are needed (see `TODO` in `src/data/products.ts`).
- Prices and Lemon Squeezy variant IDs: the `TODO_` constants at the top of `src/data/products.ts`.

## Fonts

DM Sans variable (latin subset, SIL OFL) is self-hosted at `public/fonts/`. The site makes no Google Fonts requests.
