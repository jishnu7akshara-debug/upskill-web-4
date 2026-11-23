# upskill web 4 — VECTR Applied Tech Academy

Edgy, wireframe-style landing site. Static HTML/CSS/JS, relative paths, no build step.

- **Palette (60-30-10):** Ink `#0B0B0C` · Bone `#E9E6DF` · Signal orange `#FF4F1A` (+ Steel `#8A8F98`)
- **Type:** Big Shoulders Display (condensed, outline variants) · IBM Plex Sans · IBM Plex Mono
- **Wireframe/edgy system:** visible column guides, ruled cells and borders, chamfered (notched) corners via clip-path, figure labels (FIG.01…), section indices (§01…), mono HUD details
- **Loader:** "boot sequence" — 12×7 block grid lights up (with random signal-orange blocks), typed boot log, giant 000% counter; blocks then drop away in random order
- **Motion:** crosshair cursor with live X/Y coordinates, grayscale photos with a colour spotlight that follows the cursor, 6-band shutter reveal on every image, hard line-drop hero title, scan-wipe section headings, scroll-linked kinetic type rows, viewfinder video (REC, running timecode, scanlines, letterbox that opens on scroll), curriculum tabs with sliding ink bar and clip-reveal modules, broken-grid lab with per-tile parallax, outcome bars that fill, mentor rows that invert on hover, glitch nav hover
- Works without the CDN (loader, shutters, bars, counters and tabs run on plain JS/CSS)

## Replace before launch
Brand, phone, email, address, fees, dates, outcome figures and mentor names are placeholders. Wire `form()` in `js/main.js` (marked TODO). Swap in the client's own photos/video.

## Deploy
Vercel ("Other", no build) or Netlify drag-and-drop — `vercel.json` / `netlify.toml` included.
