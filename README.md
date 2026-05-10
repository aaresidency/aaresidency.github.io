# aaresidency.github.io

AA Residency Tirupati — static site built with [Eleventy](https://www.11ty.dev/).

## Local development

```bash
npm install
npm run serve
```

Open the URL shown in the terminal (usually `http://localhost:8080`).

## Production build

```bash
npm run build
```

Output is written to `_site/`.

## Analytics, experiments, and operations copy

Build-time values live in `src/_data/siteContext.js` and are baked into HTML at compile time (change env → rebuild to apply).

| Variable | Where to set (CI) | Purpose |
|----------|---------------------|---------|
| `GA_MEASUREMENT_ID` | GitHub Actions **secret** | Optional GA4 property ID (`G-XXXXXXXX`). When set, `gtag('config', …)` runs and homepage fires `experiment_exposure` for the hero test. |
| `HERO_VARIANT` | GitHub Actions **variable** `HERO_VARIANT` | `a` (default) or `b` — switches homepage hero headline and supporting copy. |
| `RATES_EFFECTIVE_ISO` | GitHub Actions **variable** | ISO date for `<time datetime>` (e.g. `2026-05-01`). Defaults if empty. |
| `RATES_EFFECTIVE_LABEL` | GitHub Actions **variable** | Human label shown next to rates notes (e.g. `May 2026`). Defaults if empty. |

Locally:

```bash
GA_MEASUREMENT_ID=G-XXXX HERO_VARIANT=b RATES_EFFECTIVE_ISO=2026-05-01 RATES_EFFECTIVE_LABEL="May 2026" npm run build
```

Engagement tracking: elements with `data-track-action` and forms with `data-track-form` report to `gtag` where loaded; form submits also emit `generate_lead`. On the homepage only, manual hero slider actions (dots, arrows, keyboard, swipe) emit `hero_slide_engagement`.

## GitHub Pages

The repository no longer contains hand-written HTML at the root: the live site is the **Eleventy build output** (`_site/`). You must deploy with Actions (or build locally and upload the built files somewhere).

1. In **Settings → Pages**, set **Build and deployment** source to **GitHub Actions** (not “Deploy from a branch”). If you leave “Deploy from branch” while `index.html` only exists inside `_site` after a local build, the site will not update from templates alone.
2. Push to `main` or `master`. The workflow runs `npm install`, `npm run build`, and publishes `_site` as the site root.
3. Custom domain `aaresidency.com` is preserved via the `CNAME` file copied into `_site` on each build.

Optional: run `npm install` locally, commit `package-lock.json`, and switch the workflow step to `npm ci` for faster, reproducible installs.

## Project layout

| Path | Purpose |
|------|---------|
| `src/*.njk` | Page templates and front matter (title, description, permalinks) |
| `src/_includes/base.njk` | Shared shell: gtag, nav, footer |
| `src/css/site.css` | Shared styles |
| `images/` | Static images (copied to `_site/images`) |
| `CNAME` | Custom domain for GitHub Pages |

## Forms

Booking and contact forms post to [Web3Forms](https://web3forms.com/). After changing the site URL or adding pages, update **Allowed redirect URLs** in the Web3Forms dashboard if required.
