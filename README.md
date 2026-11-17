# Earth Bound Roots

Website for Tavia Valdez's nonprofit, Earth Bound Roots: gentle grief gatherings in South Ogden, Utah (movement, breath, reiki, sound).
Two pages: the home page (`index.html`) and **Meet your practitioners** (`practitioners.html`).

## Run

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production files in dist/
npm run preview      # http://localhost:4173/earth-bound-roots/
```

## Change the words or add a gathering

Everything the site says is in `src/lib/content.js`. To add a gathering, copy the entry in `GATHERINGS`, change the date and details, and rebuild. Past gatherings drop off the page by themselves.

## The 3D bowl (recorded, Apple-style)

The opening scene (singing bowl, candles, embers) is a real Three.js scene, recorded once into pictures; visitors only see the pictures, so the page stays light. The recording also saves where the bowl is in each picture, so clicking it still plays a soft bowl tone (made in the browser, no audio files) and sends ripples out.

Re-record after changing `src/three/BowlScene.jsx`:

```bash
npm run dev -- --port 5191     # leave running
npm run capture                # or: npm run capture desktop / mobile
```

Uses the installed Google Chrome (playwright-core, no browser download). Output: `public/frames/desktop` (320 frames) and `public/frames/mobile` (240 frames), about 7 MB. Open `/?capture=1` to see the live scene.

## RSVP

Visitors can text or email Tavia directly, or fill in the form, which opens their own text or email app with the message written. Nothing is stored or sent by the site. A real form service can replace it later.

## Live site

https://yamaharoj.github.io/earth-bound-roots/ (GitHub Pages). Every push to `main` rebuilds and publishes it (`.github/workflows/deploy.yml`).
Fonts are bundled with the site (no Google Fonts), and the site has no cookies, tracking or analytics.
