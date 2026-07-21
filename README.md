# Apocalypups — Rhythm & Rage (Website)

Marketing site for **Apocalypups: Rhythm & Rage**, with **Neon Drift** as the opening world.

**Live:** https://apocalypups-neon-drift.shpdigital.workers.dev

Merging to `main` does **not** update Live by itself. Deploy is required:

```bash
npm run deploy
```

Or push to `main` after adding GitHub secrets `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` (workflow: `.github/workflows/deploy.yml`).

## Art

All key art lives in `assets/art/`:

| File | Use |
|---|---|
| `cover_front.*` | Hero full-bleed (cropped from packshot) |
| `Apocalypups_RhythmAndRage_CoverOnePager.*` | Full packaging showcase |
| `neon_city_sign.*` | Neon Drift world |
| `slayer.*` / `fang.*` / `bruce.*` / `slash.*` | Crew portraits |
| `scavenger.*` | Enemy section |

Prefer `.avif` with `.webp` fallback via `<picture>`.

## Run

```bash
npm install
npm run dev
# or: python3 -m http.server 8765 → http://localhost:8765
```

## Deploy (Cloudflare Workers)

```bash
npm run deploy
```

Static assets are served via Workers (`wrangler.jsonc` → `assets.directory`).

## Wishlist

Emails are stored in `localStorage` (`nd_wish`) only.
