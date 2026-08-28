# Polish 3 — cumulative finding closure

**Released candidate repaired:** `b8afebcee8f1a5e03bdaa1a478cd0509b266fba9`

**Adversarial report:** `40916fdfa206fe56501bac7430e261d1116c42e7`

**Implementation commit:** `c04e2d8cf830ebc36a6d67c4c06ac3f505fe42c9`

**Deployment:** `bb4c9bc7-f981-4029-8f4f-2069eb92e9cb`
**Live URL:** <https://restore-compatibility-drill.sociobot.in>

Every current and earlier finding is closed. No severity was deferred.

## Review 3 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-3-1 — one-click demo was idle | `/?demo=1` now starts a fresh replay on entry. A compact signed sample receipt puts the Postgres versions, schema, role, table, signature, and pass state in the first phone viewport. Reset starts a clean replay; Start for real lands on the install section. | `@claim:sample-demo runs the bundled sample to a signed pass result`; `@claim:demo-no-persistence`; `.factory/evidence/polish-3-live/cold-demo-mobile.png`; live `/?demo=1`; `cold-check.json` records proof rows ending at 666.17 px in a 390×844 viewport. |
| F-3-2 — dump-format proof covered only custom format | The one tagged claim now runs plain SQL, custom, tar, and directory fixtures through the real binary. It asserts `psql` versus `pg_restore` and each read-only mounted input path. | `@claim:dump-formats restores plain SQL and every documented pg_dump archive format`; clean-clone claim pass; `.factory/evidence/polish-3-live/cold-home-desktop.png`; live install and source links returned 200. |
| F-3-3 — one-line JSON output was unlisted | Added `json-output` to `.factory/claims.json`. Its test proves exactly one parseable JSON stdout line for pass, compatibility failure, and startup error outcomes. | `@claim:json-output emits one valid JSON line for pass, compatibility failure, and startup error`; clean-clone claim pass; `.factory/evidence/polish-3-live/cold-home-mobile.png`; live README source link returned 200. |
| F-3-4 — duplicate demo canonicals and incomplete sitemap | `/?demo=1` is the single canonical. `/demo` uses `replaceState` to normalize to it. Both render paths declare the same exact canonical, and the sitemap lists that canonical once. | `every route sets its title, metadata, canonical URL, heading, and legal links`; `the canonical demo is listed once in the sitemap`; `.factory/evidence/polish-3-live/cold-demo-mobile.png`; live `/demo` normalized to `/?demo=1`. |
| F-3-5 — unexplained HMAC jargon on the landing page | Replaced the landing sentence with “a signature you can verify,” removed the algorithm label from the landing receipt preview, and kept the precise mechanism in the README signing section. | `.factory/copy-audit.md`; `@claim:signed-receipt`; `.factory/evidence/polish-3-live/cold-home-desktop.png`; live `cold-check.json` records `landingHasHmac: false`. |
| F-3-6 — third desktop fact was clipped | Reduced the desktop headline cap and hero vertical padding without changing the collage direction. Added a bounding-box regression for all three facts. | `all three product facts fit in the cold desktop first screen`; `.factory/evidence/polish-3-live/cold-home-desktop.png`; live fact rows end at 771.94 px in a 1440×900 viewport. |

## Earlier review findings

| Finding | Closure retained | Evidence |
| --- | --- | --- |
| F-1-1 — no usable public install path | The GitHub source link, full clone/install sequence, and Rust 1.85 requirement remain visible and working. | `@claim:install-from-site`; clean public clone installed `restore-drill --help`; `.factory/evidence/polish-3-live/cold-home-desktop.png`; live GitHub link returned 200. |
| F-1-2 — demo persistence assurance untested | Demo data remains memory-only. Reset and reload start clean replays; localStorage, sessionStorage, IndexedDB, and OPFS remain empty. | `@claim:demo-no-persistence`; `.factory/evidence/polish-3-live/cold-demo-mobile.png`; live `cold-check.json` records empty browser stores. |
| F-1-3 — unlisted “without Docker” claim | The first-screen outcome remains the literal “Open a browser replay of the sample drill.” | `@claim:sample-demo`; `.factory/evidence/polish-3-live/cold-home-mobile.png`; live first screen inspected cold. |
| F-1-4 — overlong README sentence | The development instructions remain split into short sentences. | `.factory/copy-audit.md`; clean `npm test`; `.factory/evidence/polish-3-live/cold-home-desktop.png`; live source link returned 200. |
| F-1-5 — unexplained tmpfs | README still defines tmpfs as a temporary memory disk and gives a bounded sizing command. | `@claim:isolated-container`; `@claim:data-tmpfs-size`; `.factory/evidence/polish-3-live/cold-home-desktop.png`; live install section checked. |
| F-1-6 — ambiguous Copy controls | Both visible controls still name their result and remain at least 44 px at phone width. | `mobile controls meet the 44px touch target baseline`; `.factory/evidence/polish-3-live/cold-home-mobile.png`; live `/#install` checked. |
| F-2-1 — schema readiness absent | Repeatable `--expect-schema`, `pg_namespace` checks, receipt rows, and sample schema remain intact. | `@claim:schema-readiness`; `.factory/evidence/polish-3-live/cold-demo-mobile.png`; live sample shows `restore_ready`. |
| F-2-2 — fixed 2 GB temporary disk | `--data-tmpfs-size` remains bounded from 512 MB to 64 GB and reaches the runtime and receipt. | `@claim:data-tmpfs-size`; `.factory/evidence/polish-3-live/cold-home-desktop.png`; live install section shows the 8 GB path. |
| F-2-3 — real CLI demo unlisted | `cli-demo` remains registered and proves the copied sample, key, receipt, expected checks, and unchanged source. | `@claim:cli-demo`; `.factory/evidence/polish-3-live/cold-demo-mobile.png`; live browser copy retains the replay/real-CLI distinction. |
| F-2-4 — default key behavior unlisted | The adjacent default key and Unix `0600` permissions remain independently tested. | `@claim:default-signing-key`; `.factory/evidence/polish-3-live/cold-home-desktop.png`; live source link returned 200. |
| F-2-5 — Podman support unlisted | Podman selection remains registered and tested against the full isolation boundary. | `@claim:podman-runtime`; `.factory/evidence/polish-3-live/cold-home-mobile.png`; live safety copy checked. |
| Verification P0 — unavailable checkout | Restore Drill remains a free CLI with no checkout, billing call, paid route, or purchase promise. | `@claim:free-cli @regression:unavailable-checkout`; `.factory/evidence/polish-3-live/cold-home-mobile.png`; live request log stayed same-origin. |
| Verification P2 — mutable fingerprinted assets | Fingerprinted assets retain one-year immutable caching. | `@regression:immutable-static-assets`; `.factory/evidence/polish-3-live/artifact-and-links.json`; live JS and CSS returned `public, max-age=31536000, immutable`. |

## Controller acceptance areas

| Area | Evidence |
| --- | --- |
| First screen and copy | Five-word job headline, 13-word audience sentence, one sample action, outcome text, and three facts fit at 390×844 and 1440×900. `.factory/copy-audit.md` has no overlong or banned copy. |
| Demo sandbox | One click enters the memory-only canonical demo. The banner, Reset demo, Start for real, complete sample proof, and automatic replay all work. |
| Claims | `.factory/claims.json` has 19 entries. Each ID occurs in exactly one tagged test. All 19 exact commands passed independently from a clean public clone. |
| Routing and metadata | Home, canonical demo, alias, privacy, terms, and designed HTTP 404 have route titles, descriptions, one `h1`, legal links, heading focus, and exact canonicals. |
| Mobile and accessibility | Six route axe scans report no serious or critical finding. Every phone control is at least 44×44 px. The skip link, reduced motion, and focus treatments pass. |
| Privacy and offline | The full demo remains same-origin and leaves all browser data stores empty. The service worker cache is versioned `restore-drill-v3`; offline demo reload passes. |
| Performance | Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.805 s, CLS 0, TBT 36 ms. JS is 14.36 KB raw / 5.11 KB gzip; CSS is 12.35 KB raw / 3.52 KB gzip. |
| Visual identity | Warm paper, offset riso inks, original restore-press art, stamped checks, clipped paper, and the press terminal remain unchanged in direction. |

## Final live check

The deployed HTML, JavaScript, and CSS match the local build byte-for-byte. Worker URL verification found no console errors and valid title, language, landmarks, alt text, and button labels. The production Playwright run passed all 32 tests. All crawled internal and external links returned 200, and an unknown route returned 404.

Evidence files: `.factory/evidence/polish-3-live/cold-check.json`, `.factory/evidence/polish-3-live/artifact-and-links.json`, `.factory/evidence/polish-3-live/lighthouse.json`, and the three cold screenshots in that directory.
