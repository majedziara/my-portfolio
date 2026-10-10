# SEO, performance, and accessibility verification

Verified locally on 2026-10-10 against the production build of Next.js 16.4.0 and React 19.2.8.

## Implemented

- Distinct titles, descriptions, canonical URLs, Open Graph metadata, and Twitter cards for all five public pages.
- A 1200 × 630 sharing image, custom favicon, SVG site icon, and Apple touch icon.
- Google verification using both the provided meta tag and the original HTML verification file.
- A sitemap containing the five public pages and a robots file excluding API routes.
- Person, WebSite, Service, and project structured data reflecting the portfolio content.
- Server-rendered page content and final statistics, with stable image dimensions and high-priority loading for the first visible image.
- A native scroll-snap project gallery with small JavaScript controls. All project descriptions are rendered in the initial HTML. Resume content is rendered on the server, with native keyboard-accessible scroll regions.
- Deferred mobile dialog loading, disabled automatic route prefetching, reduced-motion support, keyboard navigation, accessible form labels and status messages, focus indicators, and a skip link.
- Security response headers, bounded contact fields, server-side validation, and a reused MongoDB connection pool.

## Asset cleanup

Deleted 28 images without source references. Converted the three PNG project thumbnails to WebP, resized oversized project images, and optimized the portrait. The small thumbnail images are served directly to avoid resizing already compact previews. Existing PDF files were retained.

| Asset | Before | After |
| --- | ---: | ---: |
| Public assets | 18,419,156 bytes | 1,181,441 bytes |
| DIGO website preview | 9,041,114 bytes | 87,470 bytes |
| Najiz preview | 2,067,204 bytes | 50,154 bytes |
| Portrait | 112,966 bytes | 59,536 bytes |

The totals include the new sharing image and verification file. Public asset size fell by about 94%; this is an asset inventory measurement, not the transfer size of a single page.

## Checks

- `npm run lint`: passed.
- `npm run build`: passed; all five public pages, robots, sitemap, and icon routes are prerendered.
- Chrome checks: all public pages passed at widths of 320, 375, and 1280 pixels without horizontal page overflow or failed resource loads.
- Axe checks: no detected violations across the pages, open mobile navigation, and all resume tabs, using WCAG 2 A/AA, WCAG 2.1 A/AA, WCAG 2.2 AA, and best-practice rules.
- Verified page metadata, structured JSON, visible image loading, skip-link focus, navigation closing, gallery controls, and keyboard arrows.
- Verified production security headers and removal of the X-Powered-By header.
- Verified the original Google verification file, five sitemap URLs, robots rules, and rejection of invalid contact payloads.
- Verified homepage content and all project articles remain available with JavaScript disabled.
- Contact success and error states were tested with intercepted local responses; no real message was sent. The production database connection and real submission delivery still need a deployment check.

Automated accessibility checks cover detectable issues and do not establish complete WCAG conformance.

## Dependency security

`npm audit --omit=dev` reports **0 known vulnerabilities** in production dependencies.

The full audit still reports five entries from one development dependency chain: `eslint-config-next` → `@next/eslint-plugin-next` → `fast-glob` → `micromatch` → `braces`. The [braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) concerns deeply nested glob patterns. The proposed automatic fix downgrades the Next.js lint configuration to version 14, so it was not applied to this Next.js 16 project. Keep the lint configuration updated as a compatible upstream fix becomes available.

## Lighthouse results

These measurements were captured before restoring the original animations. They are historical results and do not describe the current animated version. The restored page reveals intentionally wait for the original animation timing, which can affect paint measurements.

Lighthouse 13.5.0 against the local production server. The resume page was remeasured after its final optimization; its mobile score is the median of three runs (91, 87, 89). Other rows use the final full-page audit for those routes.

| Page | Mobile performance | Desktop performance | Accessibility | Best practices | SEO |
| --- | ---: | ---: | ---: | ---: | ---: |
| `/` | 92 | 100 | 100 | 100 | 100 |
| `/services` | 95 | 100 | 100 | 100 | 100 |
| `/resume` | 89 | 100 | 100 | 100 | 100 |
| `/work` | 93 | 100 | 100 | 100 | 100 |
| `/contact` | 90 | 100 | 100 | 100 | 100 |

All measured runs had a cumulative layout shift of **0**. The homepage mobile run measured FCP at 0.8 s, LCP at 2.7 s, and total blocking time at 220 ms. Remaining performance findings are mainly framework JavaScript, CSS/font loading, and device-dependent execution time. The resume mobile runs ranged from 87 to 91.

Machine-readable scores are saved in [lighthouse-results.json](lighthouse-results.json). These are simulated local lab measurements, not field Core Web Vitals or guaranteed hosted scores.

## Animation restoration

Restored the screen transition with four staggered strips, the original page reveal timing (2.4 s delay, 0.4 s fade), portrait fades, 15 s reversing ring rotation and dash animation, five-second statistics counters, and the half-second alternating resume dot opacity. The animations run on initial loading and navigation. Reduced-motion preferences show content immediately with static decorations, and a no-JavaScript fallback keeps the content visible. Metadata, server-rendered content, image optimization, and accessible controls are retained.

The original Framer Motion and CountUp versions are pinned. Overrides retain the compatible original `motion-dom` and `motion-utils` versions because newer transitive releases failed to build with the original Framer Motion version.

After restoration, lint and production build passed. Chrome checks verified initial and route transitions, ring rotation and changing dash patterns, both resume dot groups, page reveals, and counters. Reduced-motion and no-JavaScript visibility checks passed. Responsive checks at 320, 375, and 1280 pixels and the accessibility checks above passed again with no browser errors or failed resource loads. Production dependencies still report zero known vulnerabilities.

## After deployment

Google Analytics uses measurement ID `G-T8HQENKS1N`. Its Google tag is loaded once from the root layout using `next/script` after hydration, and is enabled in production builds. Development sessions are excluded. Pageviews use GA4's automatic measurement, so no duplicate manual route events are emitted. In the web data stream's Enhanced measurement settings, enable **Page views → Page changes based on browser history events** to record Next.js client navigation. See [Google's SPA measurement guide](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications). After deployment, confirm visits and navigation in Realtime or DebugView.

The integration passed lint and production build. A Chrome check loaded the actual Google tag once, verified one automatic pageview per initial load, client navigation, and browser back, and confirmed one initialization across routes. Collection requests were intercepted locally so test visits were not sent to the live property.

Use the canonical domain in `lib/seo.js`, or configure `SITE_URL` and rebuild. For a different domain, also update the domain displayed in the sharing image.

In Google Search Console, click **Verify**, submit `/sitemap.xml`, inspect the public pages, and request indexing. The verification files are installed locally; ownership verification and indexing are completed through Search Console after deployment.

Recheck Lighthouse on the deployed URL. Local scores use simulated devices and depend on the machine, network, cache, and hosting. Vercel Analytics is enabled on Vercel deployments and is excluded from the local server.
