# essaykraft.app

The EssayKraft website: home, blog, changelog, support and privacy. Plain static HTML, CSS and JavaScript. No build step.

## Deploying

Cloudflare Pages is connected to this repo and serves it at https://essaykraft.app. A push to `main` is the whole deploy, and it goes live in under a minute. Cloudflare also runs the domain's DNS.

GitHub Pages is still on for this repo too, at `noahjackpage-afk.github.io/essaykraft-site/`. Every link is relative so both copies work. The one exception is `404.html`, which uses root paths for Cloudflare.

## Design

A sibling to sonetia.co.uk, aimed at academic writing. The page is laid out as a paper: a title page and abstract, five numbered sections with figures and margin notes, an index, an epigraph for the price, Appendix A for questions, and a references list that cites the app as the download link.

- Type: Newsreader (Google Fonts) for headlines and the page text, the system font for interface text. One accent: the blue caret from the app icon.
- `home.css`: tokens at the top. `html[data-midnight]` swaps them for true black. Anything that is a sheet of paper uses the `--sheet-*` tokens and stays white, as in the app.
- `site.js`: the wordmark's entrance, headlines that rise line by line, scroll reveals, the dock (reading position and the Midnight switch, with a circular View Transition), and three small models: sixteen citation styles on one source, a writing record that fills in, and a page you can type on to fill a 40-word target.
- Citation examples are hand-set to match each style's usual output for a book. If the app's output differs, change the `STYLES` table in `site.js`.
- `pages.css`: support, privacy and 404.
- `blog.css`: blog posts, the blog index (`blog/index.html`) and `changelog.html`. Loaded after `pages.css`.
- A new post: copy an existing one in `blog/`, then add it to the list and the `Blog` JSON-LD in `blog/index.html`, to `sitemap.xml` with its date as `lastmod`, and to the homepage index if it fits. Posts are written for search, so keep the short-answer box, the numbered sections and the `BlogPosting` JSON-LD.
- The changelog follows the App Store version history. Add each release at the top and move the Latest tag.
- `media/`: crops of the real iPad App Store screenshots (July 2026). Swap them for fresh Mac screenshots at the same 2400 and 1200 pixel widths.
- `og.png`: 1200 × 630 social preview, set in New York.

## Before changing copy

The Essayist comparison (`blog/essayist-alternative.html`) quotes Essayist’s UK App Store listing as of October 2026. Check it against the current listing when their price or features change.

Feature claims match EssayKraft 2.2 as listed on the App Store (ID 6789774290). The privacy policy text is unchanged from 26 July 2026 and only restyled.
