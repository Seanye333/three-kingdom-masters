# Officer portraits

Drop a hand-drawn portrait image here named by the officer's **id**, as WebP:

    public/portraits/<officerId>.webp

e.g. `cao-cao.webp`, `zhuge-liang.webp`, `hist-bai-qi.webp`.

The game (`OfficerPortrait`) loads `portraits/<id>.webp` automatically; any
officer without an image falls back to the procedural SVG silhouette, so you can
add portraits incrementally — a few, a faction, or the whole roster.

Recommended: square images, ~256×256 or larger, face/bust framed. The component
crops to a square (`object-fit: cover`) and draws a force-coloured border.

Find an officer's id in `src/game/data/officers.ts` (Three Kingdoms) or
`src/game/data/historicalOfficers.ts` (cross-over generals, `hist-…`).
