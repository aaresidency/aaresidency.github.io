// Renders every route to static HTML after `vite build` + the SSR build.
// GitHub Pages serves /about from about.html with a 200, so no 404.html redirect is involved.
import { readFile, writeFile, rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const dist = resolve('dist')
const serverDir = resolve('dist-server')
const template = await readFile(resolve(dist, 'index.html'), 'utf8')
const { render, ROUTE_PATHS, LEGACY_REDIRECTS } = await import(pathToFileURL(resolve(serverDir, 'entry-server.js')).href)

// React 19 hoists <title>/<meta>/<link> to the front of the render output.
const hoisted = /^(?:<(?:link|meta)\b[^>]*>|<title>[\s\S]*?<\/title>)+/

// Tags Helmet re-emits per page; drop the shell's copies so they aren't duplicated.
const perPageTags = [
  /<title>[\s\S]*?<\/title>\s*/,
  /<meta name="description"[^>]*>\s*/,
  /<link rel="canonical"[^>]*>\s*/,
  /<meta property="og:(type|site_name|title|description|url|image)"[^>]*>\s*/g,
  /<meta name="twitter:(card|image)"[^>]*>\s*/g,
]
const shell = perPageTags.reduce((html, re) => html.replace(re, ''), template)

for (const path of ROUTE_PATHS) {
  const { html } = render(path)
  const head = html.match(hoisted)?.[0] ?? ''
  const body = html.slice(head.length)
  const page = shell
    .replace('</head>', () => `    ${head}\n  </head>`)
    .replace('<div id="root"></div>', () => `<div id="root">${body}</div>`)
  const file = path === '/' ? 'index.html' : `${path.slice(1)}.html`
  await writeFile(resolve(dist, file), page)
  console.log(`prerendered ${path} -> dist/${file}`)
}

// GitHub Pages can't send 301s, so old URLs get an instant meta-refresh stub pointing at the new route.
for (const [from, to] of Object.entries(LEGACY_REDIRECTS)) {
  const target = `https://aaresidency.com${to}`
  await writeFile(
    resolve(dist, from.slice(1)),
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Redirecting…</title>
    <meta name="robots" content="noindex" />
    <link rel="canonical" href="${target}" />
    <meta http-equiv="refresh" content="0; url=${to}" />
    <script>location.replace(${JSON.stringify(to)} + location.search + location.hash)</script>
  </head>
  <body><p>This page has moved to <a href="${to}">${target}</a>.</p></body>
</html>
`,
  )
  console.log(`redirect ${from} -> ${to}`)
}

await rm(serverDir, { recursive: true, force: true })
