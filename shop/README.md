# MAISON IU — Shop (commerce layer)

Stage-1 storefront for MAISON IU. React + TypeScript + Tailwind v4 + shadcn
(Radix) primitives, **brand-skinned** (no default SaaS-shadcn look). Lives
beside the static luxury site in `site/shop/` and does not touch it.

## Stack decision

**Next.js 16 (App Router).** A store with catalogue → product → cart →
checkout → VIP → admin → Telegram mini-app needs SSR + per-page metadata for
SEO, a real router, and server actions for checkout/admin. Vite would mean
re-building all of that by hand. Product pages are pre-rendered (SSG),
the catalogue is server-rendered (reads `?category=`).

## How to run

```bash
cd site/shop
npm install
npm run dev      # http://localhost:3000
# or a production build:
npm run build && npm run start
```

Type-check + lint + build in one shot: `npm run build` (green).
Pure-logic tests: `node --test --experimental-strip-types tests/catalog.test.ts` (5/5).

## Structure

```
src/
  app/
    layout.tsx              fonts (Bodoni Moda / Inter / Pinyon Script) + SEO metadata
    page.tsx                → redirects to /catalog (stage-1 entry)
    catalog/page.tsx        server: hero + reads ?category=, renders <CatalogClient>
    product/[slug]/page.tsx SSG product page (generateStaticParams + metadata)
    globals.css             Tailwind v4 theme = MAISON IU tokens (from c3/base.css)
  components/
    ui/                     shadcn primitives, brand-recoloured: button, card, badge, select
    site/                   announce-bar, site-nav, site-footer, product-card, catalog-client
  lib/
    products.ts             typed placeholder catalogue (12 pieces, brand roster)
    catalog.ts              PURE filter / sort / brandsForCategory  <- QA target
    format.ts               PURE formatPriceUsd ($, no cents, POA)  <- QA target
    i18n.ts                 RU/EN dictionary scaffold (t(entry, locale))
tests/catalog.test.ts       node:test assertions for the pure layer
public/products/*.jpg       placeholder shots (watch/necklace/bracelet/ring/bag)
```

## Brand fidelity

- Palette pulled verbatim from `site/c3/base.css` (ivory/paper/cream, ink,
  ash, garnet `#7A2231`, champagne `#9A7E4E` = foil accents only). No gold in
  branding.
- Fonts: Pinyon Script wordmark (with `-webkit-text-stroke` so it never looks
  thin), Bodoni Moda headings, Inter body.
- shadcn semantic tokens (`--primary`, `--background`, `--border`, ...) are all
  remapped to brand values in `globals.css`, so components inherit the luxury
  skin instead of the default stone/gray.
- Mobile-first, `overflow-x: hidden` guard, verified **0px** horizontal
  overflow at 360 / 390 / 440.

## Public preview — recommended: Render Web Service (Next SSR)

Most reliable for a live, clickable preview (catalogue is SSR + dynamic).
`next start` binds to `0.0.0.0` and honours Render's `$PORT` automatically —
no hardcoded ports anywhere in the app.

```
Root Directory:  site/shop
Build Command:   npm install && npm run build
Start Command:   npm start          # = next start, listens on $PORT
Environment:     NODE_VERSION = 20 (or 22)   # avoid Node 26-only quirks in CI
```

No secrets/env required for stage 1. `dangerouslyAllowSVG` is enabled only for
our own `/products/placeholder.svg` fallback (CSP: `script-src 'none'; sandbox`).

**Alternative (b) — static export under `/shop` on the current static host:**
add `output: "export"` to `next.config.ts` and swap `catalog/page.tsx` to read
the category from a client hook instead of `searchParams` (filtering is already
client-side). Then `npm run build` emits `out/` → drop at `/shop`. Trade-off:
loses SSR metadata for `?category=` deep-links; product SSG pages still work.
Recommend (a) so SEO/SSR survive for later stages (cart/checkout/admin).

## Coexistence with the static luxury site

`home3.html` and the static site are untouched. Ship the shop **separately**
on `shop.maison-iu.*` (or `/shop` via a reverse-proxy rewrite) so the static
site stays a plain static deploy with an independent release cadence.

> Note: `site/` is not a git repo yet, so nothing was committed. `site/shop`
> is **ready to push** — `git init` at the deploy root (or add `site/shop` to
> the existing pipeline) and the Render config above builds as-is.

## Known limitations (stage 1)

- Catalogue data is placeholder (`lib/products.ts`), mapped to the 5 shipped
  shots (watch-twotone / necklace / bracelet / ring / bag). Every card also has
  an `onError` fallback to a neutral branded plinth (`ProductImage`), so no card
  can render blank.
- RU/EN is scaffolded (`lib/i18n.ts`) but not yet wired to a live toggle.
- Cart / checkout / VIP / admin / Telegram mini-app are next stages.
- Filters are client-side state (not URL-synced beyond initial `?category=`).
