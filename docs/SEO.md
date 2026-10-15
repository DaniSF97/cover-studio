# SEO strategy

The reference for search-engine work on the public site. Terms in **bold** are defined in
[`CONTEXT.md`](../CONTEXT.md). The keyword map itself lives in code (see "Keyword map"), not here.

## Goal and measurement

Organic traffic must produce, in this order: **exports** (people making a Cover), awareness of the
project, then GitHub stars. The main KPI is the number of exports per entry page.

- GA4 (`NEXT_PUBLIC_GA_ID`, set in production) records the session's entry page (Landing,
  Use-case page, Feature page, Guide, Comparison page) and attaches it to the export event.
- Google Search Console (property on the subdomain, plus a domain property on `roosveltkn.com`)
  and Bing Webmaster Tools (imported from GSC) give queries, impressions and positions.

## Personas

- **Maker / indie hacker** launching a product (Product Hunt, X, LinkedIn). Primary.
- **Open-source maintainer** who wants a README banner and a repository social preview. Primary.
- **Developer building a portfolio**. Secondary.

Not targeted: marketers and designers (served by Canva and Figma), and anyone looking for App Store
/ Play Store screenshots (a product non-goal; the Landing says so explicitly).

## Languages

English is the priority market: keyword research and content start in English. French pages exist
only where French search demand exists, and are written from French keyword research, not
translated. Research showed that French-speaking developers search in English for GitHub, Open
Graph and Product Hunt, so these **Use-case pages** have no French version.

`hreflang` is declared only between pages that really exist in both languages. `x-default` points
to the English version.

## Page types and plan

Search terms ("mockup", "banner", "social preview") are used in page copy; the product keeps its
own vocabulary (a **Cover**).

| Page | Type | EN target | FR target | Phase |
|---|---|---|---|---|
| Landing | **Landing** | screenshot mockup generator (variant: app screenshot mockup generator) | générateur de mockup gratuit | 1 |
| GitHub social preview | **Use-case page** | github social preview image generator | — | 1 |
| README banner | **Use-case page** (Export format: Cover) | github readme banner generator | — | 1 |
| Website mockup from URL | **Feature page** | website mockup generator from url | mockup site web | 1 |
| Product Hunt gallery | **Use-case page** | product hunt gallery image generator | — | 2 |
| Open Graph image | **Use-case page**, angle "from screenshots or a URL", not an OG API | open graph image generator | — | 2 |
| Size guides (GitHub, README, Product Hunt, Open Graph) | **Guide** | "… size" queries | taille image opengraph, image readme github | 2 |
| LinkedIn and X image sizes | **Guide** (no Use-case page: "generator" queries go to AI tools) | linkedin / x post image size | taille image post linkedin, taille image twitter | 3 |
| Shots.so alternative | **Comparison page** (factual, no disparagement) | shots.so alternative | — | 3 |

Dropped: portfolio thumbnail (dominated by Upwork/Behance), Chrome Web Store tiles (too close to
the store-screenshot non-goal). Main SEO rival: Screenhance, which runs the same
one-page-per-Destination model.

A **Use-case page** answers a transactional intent on the page itself: it embeds the screenshot
import block of the Landing with the Destination's Export format preselected, then sends the user
to the editor. The SEO content (exact dimensions, platform rules, real Covers, a page-specific FAQ)
comes below the action block.

## URLs

- Use-case and Feature pages are flat: `/en/github-social-preview`, `/fr/mockup-site-web`.
- Guides live under `/{locale}/guides/{slug}`.
- Slugs are written in the page's language.
- The editor stays `noindex, follow`.

## Keyword map and cannibalisation

One keyword cluster belongs to exactly one URL. Every indexable page is declared in the registry
(`lib/pages.ts`) with its primary keyword, secondary keywords, related sister pages, the page a
Guide supports, and its `updatedAt` date. A unit test (`tests/unit/pages.test.ts`) fails when two
pages share a primary keyword, when a page's primary keyword is another page's secondary, or when a
sister page, a supported page or a translation pair does not exist. The registry also drives the
sitemap, canonicals, hreflang, the Landing's Destinations section and the footer links.

- The Landing keeps the generic term and never names a Destination in its title.
- A Guide targets a question, never the transactional query of the page it supports.
- In French, the Landing takes "générateur de mockup" and the Feature page takes "mockup site web".

## Internal linking (cocoon)

Links that matter for the cocoon are in the page body:

- **Landing → every Use-case and Feature page**, through a "Destinations" section.
- **Use-case page → Landing and its own Guides**, and to sister pages only when they are
  semantically close (README ↔ GitHub social preview, Open Graph ↔ LinkedIn), declared in the
  registry.
- **Guide → the page it supports**, with a contextual link in the first paragraph, and to sibling
  Guides of the same silo only. A test checks that no Guide links outside its silo.
- **A French Guide links only to French pages.** When its topic's Use-case page exists only in
  English, it points to the French Landing.
- Anchors are descriptive and varied, never the exact keyword everywhere.
- The footer lists Use-case pages for crawling. It does not count as part of the cocoon.

## Writing without footprint

- Claude drafts, the maintainer rewrites the intro and adds first-hand experience, and nothing
  ships without the maintainer's review.
- Every page carries at least one original element: real Covers generated with Cover Studio,
  dimensions tested on the platform, captures of the real rendering (GitHub preview, Product Hunt
  gallery).
- Page structures vary. Not every page gets the same H2 template.
- No generic AI phrasing and no keyword stuffing.
- French pages are written in French, not translated.

No author identity is exposed: no about page, no `Person` schema and no bylines. The existing
footer credit stays as it is. The author in structured data is the "Cover Studio" Organization.

## Technical

- **Headings**: one H1 per page carrying the primary keyword naturally, H2 per section, no skipped
  levels, no headings used for styling. The Landing H1 is rewritten around its generic term.
- **Root `/`**: it redirects (Vercel by `Accept-Language`, then client-side). Its canonical points
  to `/en`, and `x-default` points to `/en` on every page.
- **Canonicals**: each indexable page is self-canonical.
- **Sitemap**: lists every indexable page with its real `updatedAt` from the registry (not the
  build date), its `hreflang` alternates when a pair exists, and no `changeFrequency` or `priority`.
- **Structured data**:
  - Use-case and Feature pages: `WebPage` + `BreadcrumbList` + an `@id` reference to the existing
    `SoftwareApplication`, plus `FAQPage` when the page has its own FAQ.
  - Guides: `Article` (author = Organization, `datePublished`, `dateModified`) + `BreadcrumbList`.
- **Images**: WebP, descriptive `alt`, meaningful file names, and an Open Graph image per page
  made with Cover Studio itself.
- **Formats**: Use-case and Feature pages are typed TypeScript data with keys in
  `messages/*.json` (checked by `pnpm i18n:check`). Guides are MDX files per locale
  (`content/guides/{locale}/*.mdx`).

## Pruning

Review every quarter, starting three months after a page is published, using GSC:

- Impressions but few clicks: rework the title and meta description.
- Almost no impressions: merge into the closest page, with a 301 in `vercel.json` (the static
  export cannot redirect by itself).
- Two pages ranking for the same query: cannibalisation. Merge them, or redistribute keywords in the
  registry.
