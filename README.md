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
