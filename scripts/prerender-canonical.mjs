// Post-build: write dist/<path>.html for every page in the sitemap, each with its
// own canonical + og:url, so crawlers that don't run JS (WhatsApp, Facebook, etc.)
// see the right URL. Netlify serves /about from about.html before the SPA fallback.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'

const SITE_URL = 'https://www.gaiapetnutrition.co.il'
const DIST = 'dist'

const html = readFileSync(join(DIST, 'index.html'), 'utf8')
const sitemap = readFileSync(join(DIST, 'sitemap.xml'), 'utf8')

const homeCanonical = `<link rel="canonical" href="${SITE_URL}/" />`
const homeOgUrl = /(<meta property="og:url"\s+content=")[^"]*(" \/>)/
if (!html.includes(homeCanonical) || !homeOgUrl.test(html)) {
  throw new Error('prerender-canonical: canonical/og:url tags not found in dist/index.html')
}

const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map(m => m[1])
  .filter(url => url.startsWith(SITE_URL))
  .map(url => url.slice(SITE_URL.length))
  .filter(path => path && path !== '/')

for (const path of paths) {
  const url = SITE_URL + path
  const page = html
    .replace(homeCanonical, `<link rel="canonical" href="${url}" />`)
    .replace(homeOgUrl, `$1${url}$2`)
  const file = join(DIST, `${path.slice(1)}.html`)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, page)
}

console.log(`prerender-canonical: wrote ${paths.length} pages`)
