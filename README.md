# essaykraft.app

The EssayKraft website: home, support and privacy. Plain static HTML, CSS and JavaScript. No build step.

## Deploying

Cloudflare Pages is connected to this repo and serves it at https://essaykraft.app. A push to `main` is the whole deploy, and it goes live in under a minute. Cloudflare also runs the domain's DNS.

GitHub Pages is still on for this repo too, at `noahjackpage-afk.github.io/essaykraft-site/`. Every link is relative so both copies work. The one exception is `404.html`, which uses root paths for Cloudflare.

## Design

A sibling to sonetia.co.uk, aimed at academic writing: paper, ink and one blue caret taken from the app icon.

- Type: Newsreader (Google Fonts) for headlines, the system font for body text.
- `index.html` and `home.css`: hero wordmark, the editor screenshot that grows as you scroll, then four numbered features (Citations, Sources, Authorship, Deadlines), a grid of smaller features, price, questions and download.
- `site.js`: the wordmark's entrance, scroll reveals, and three small app models redrawn in HTML: a citation that changes style, a writing record, and a word target. Each one plays only while it's on screen. With reduced motion they show their finished state.
- `pages.css`: support, privacy and 404.
- `media/`: crops of the real iPad App Store screenshots (July 2026). Swap them for fresh Mac screenshots at the same 2400 and 1200 pixel widths.
- `og.png`: 1200 × 630 social preview, set in New York.

## Before changing copy

Feature claims match EssayKraft 2.2 as listed on the App Store (ID 6789774290). The privacy policy text is unchanged from 26 July 2026 and only restyled.
