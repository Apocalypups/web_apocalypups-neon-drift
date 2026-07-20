# Apocalypups — Rhythm & Rage (Website)

Marketing site for **Apocalypups: Rhythm & Rage**, with **Neon Drift** as the opening world.

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
python3 -m http.server 8765
# → http://localhost:8765
```

## Wishlist

Emails are stored in `localStorage` (`nd_wish`) only.
