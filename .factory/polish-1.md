# Polish 1 — cumulative finding closure

**Reviewed source:** `.factory/review-1.md` at `8b9f8a30cad86d87516b1d0dbf87d3144e6d9555`  
**Released candidate repaired:** `e4b2766a0eafa1494fb977a6fd29166d0a147241`  
**Live URL:** <https://restore-compatibility-drill.sociobot.in>

Every finding is closed. No severity was deferred.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 — no usable public install path | Added a visible public GitHub source link and the full `git clone`, `cd`, and locked Cargo install sequence to the site and README. Added Rust 1.85 to the package manifest. | `@claim:install-from-site`; clean local clone pass; real GitHub clone/install pass at `/tmp/restore-drill-public-install-polish-1.t3XSBt`; live install section in `.factory/evidence/live-home-final/screenshot-mobile.png`; source link checked live. |
| F-1-2 — demo persistence assurance untested | Added `demo-no-persistence` to `.factory/claims.json`. Reset cancels in-flight timers. The test runs, resets during and after playback, reloads, and inspects localStorage, sessionStorage, IndexedDB, and OPFS. | `@claim:demo-no-persistence` passed alone from the clean clone and passed live; demo banner and controls in `.factory/evidence/live-demo-final/screenshot-mobile.png`; live `/?demo=1`. |
| F-1-3 — unlisted “without Docker” claim | Replaced the sentence with the literal outcome: “Open a browser replay of the sample drill.” The CTA now opens `/?demo=1`. | `@claim:sample-demo` passed alone and live; first screen in `.factory/evidence/live-home-final/screenshot-mobile.png`; live `/` → `/?demo=1`. |
| F-1-4 — 23-word README sentence | Split it into “`npm test` runs unit tests and every claim test.” and “It checks routes at 390 px and scans pages with axe.” | `.factory/copy-audit.md`; README inspection; clean `npm test` passed. |
| F-1-5 — unexplained `tmpfs` | Rewrote the boundary as “a temporary memory disk (a 2 GB tmpfs mount)” and the later limit as “the temporary disk's 2 GB limit.” | `.factory/copy-audit.md`; README inspection; `@claim:isolated-container` passed from the clean clone. |
| F-1-6 — ambiguous visible Copy labels | Visible controls now read “Copy install command” and “Copy drill command.” Long commands wrap, and controls stack above code on phones. | Axe smoke `/` passed; 390 px layout test passed; `.factory/evidence/live-home-final/screenshot-mobile.png`; live install section. |
| Earlier verification P0 — unavailable paid checkout | The free CLI position remains intact; there is no checkout link, billing request, or paid claim. | `@claim:free-cli` passed alone and live; live request inspection stayed same-origin. |
| Earlier verification P2 — mutable asset cache | Fingerprinted assets retain the immutable one-year cache rule. | `@regression:immutable-static-assets`; live CSS/JS returned `public, max-age=31536000, immutable`. |

## Controller-required acceptance work

| Area | Change made | Evidence |
| --- | --- | --- |
| First screen | Kept the five-word job headline, 13-word audience sentence, one primary sample action, and three plain facts. Replaced the unlisted outcome claim. | Copy audit passes; 390×844 cold screenshot at `.factory/evidence/live-home-final/screenshot-mobile.png`. |
| One-click isolated sample | `/?demo=1` directly renders the populated sample, persistent banner, Reset demo, and Start for real. Demo data exists only in memory. | `@claim:sample-demo`, `@claim:demo-no-persistence`, and `@claim:browser-privacy`; live screenshot path above. |
| Claims | Expanded the manifest from 11 to 13 entries and strengthened the privacy scope. | All 13 exact manifest commands passed independently under `/tmp/restore-drill-clean-polish-1.LLr3PN/repo`. |
| Titles and metadata | Added per-route title, description, Open Graph/Twitter title, canonical URL, single `h1`, and legal links. | `every route sets its title, metadata, canonical URL, heading, and legal links`; live 15-test suite passed. |
| Routing, focus, and 404 | Kept History API navigation and focus/announcement behavior. Replaced catch-all 200 fallback with explicit route rewrites and a true 404 response override. | `routes work with history and restore heading focus`; `static host configuration serves known routes and a designed HTTP 404`; live missing URL returned HTTP 404. |
| Mobile and accessibility | Added 44 px targets, wrapped commands, stacked mobile copy controls, and verified every route at 390 px. | 6 route axe scans with zero serious/critical findings; mobile test; final home/demo screenshots. |
| Privacy and offline | No analytics, remote fonts, or third-party runtime requests. Demo reload works offline after first visit. | `@claim:browser-privacy`; service-worker offline test; worker `verify-url.sh`; live request trace. |
| Performance | Kept the original lightweight Vite/vanilla TypeScript delivery and original risograph assets. | Lighthouse 100/100/100/100; JS 4.86 KB gzip; CSS 3.25 KB gzip; hero 196,916 bytes. |

## Final live check

After the final deploy, the worker opened `/` and `/?demo=1` in cold desktop and 390×844 contexts. The final 15-test live suite passed. Worker verification reported no console errors. Home, demo, privacy, and terms returned 200; an unknown path returned 404. The deployed HTML, CSS, and JS matched the final local build byte-for-byte.
