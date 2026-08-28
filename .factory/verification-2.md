# Independent verification 2 — PASS

**Candidate:** `ea421c2dfa3eaf8d58a7a49b02b6d19c66eb3f0d`  
**Live URL:** <https://restore-compatibility-drill.sociobot.in>  
**Verified:** 2026-08-28 from a clean checkout

## Decision

**PASS.** This candidate resolves the earlier deployment-only failure by removing the unavailable paid checkout and presenting the CLI honestly as free. The deployed HTML, JS, and CSS match the candidate build byte-for-byte.

No release-blocking defects were found. The only verification limitation is that this worker has no `docker`, `podman`, or Docker socket, so I could not perform a real Postgres-container restore here. The shipped integration suite exercises the real CLI with a controlled container-runtime shim, including the isolation arguments, read-only mount, restore command selection, cleanup, receipts, and exit codes; the packaged public CLI was additionally exercised independently below. A Docker/Podman release-host smoke run remains a prudent operational follow-up, not a failed observed product behavior.

## Cold first-read test

**PASS.** A cold live desktop browser showed:

- What it does: “Prove your Postgres backup restores.”
- Who it is for: “For teams that need a recovery answer before an outage, not during one.”
- What to click first: the visible **Try it with sample data** action, with “See a complete drill without Docker.” beside it.

That action reaches `/demo` in one click. The demo has the persistent “Demo — sample data, nothing is saved” banner, Reset demo and Start for real controls, and replays the bundled sample to `PASS in 4.7s` with an HMAC-SHA256 receipt message.

## Required claim tests

`.factory/claims.json` is present. After `npm ci`, I ran every command listed in that manifest independently from this clean checkout through the product test/demo entry point; all passed. The subsequent complete `npm test` run also passed all 11 claim tags.

| Claim ID | Result |
| --- | --- |
| `sample-demo` | PASS |
| `browser-privacy` | PASS |
| `free-cli` | PASS |
| `isolated-container` | PASS |
| `backup-local` | PASS |
| `newer-version` | PASS |
| `signed-receipt` | PASS |
| `dump-formats` | PASS |
| `ci-mode` | PASS |
| `no-production-url` | PASS |
| `no-telemetry` | PASS |

## Local artifact and CLI QA

- `npm ci`: PASS.
- `npm test`: PASS — 4 Rust unit tests, TypeScript check, site build, and 18 Playwright tests.
- `npm run build`: PASS — release binary plus `dist/site/`.
- `cargo fmt --check` and `git diff --check`: PASS.
- `cargo package`: PASS — produced `target/package/restore-drill-0.1.0.crate`.
- Clean consumer: extracted that crate to a new temporary directory, installed with `cargo install --path <extracted-crate> --root <fresh-root>`, and ran the installed public binary. `--help` exposes `run`, `demo`, and `verify-receipt`.
- Boundary/recovery: the installed binary processed the bundled PostgreSQL 17.6 incompatible dump targeting 15.8 without invoking its unavailable runtime, wrote a signed JSON failure receipt, and returned exit `2`. `verify-receipt` accepted it (exit `0`). Invalid `--postgres '15;bad'` returned actionable JSON and exit `3`. The auto-created HMAC key was mode `0600`.
- The repository’s controlled-runtime integration test passed the normal plain-SQL path, including `--network none`, no published port, the 2 GB tmpfs mount, a read-only backup mount, and an unchanged input backup; it also passed the custom archive/`pg_restore` path.

## Live browser, accessibility, privacy, and PWA QA

- Live deployment matching: SHA-256 values for live `index.html`, `assets/index-LiP3Q1ia.js`, and `assets/index-BCWMSXL5.css` exactly match `dist/site/` built from this candidate.
- Live cold load requested only same-origin document, JS, CSS, and hero image, with no console or page errors. The complete demo flow remained same-origin.
- Live axe scans had **0 serious/critical findings** on `/`, `/demo`, `/privacy`, `/terms`, and `/missing-page`; each has one `<main>` and one `<h1>`.
- Keyboard: Tab reaches Skip to content with a visible `rgb(21, 93, 130) solid 3px` focus ring; Enter moves focus to `<main>`. Browser-route changes focus the page heading.
- Mobile at 390×844: `scrollWidth === clientWidth === 390`; the primary heading and CTA are visible. Desktop and mobile screenshots were visually inspected.
- Reduced motion: `/demo` reaches the complete result under `prefers-reduced-motion: reduce` without delayed row animation.
- PWA: a live `/demo` visit registered an active service worker; after reload, offline reload retained “Run a sample restore drill”. The worker includes `skipWaiting()` and `clients.claim()`.
- The worker-provided `verify-url.sh` is not present in this clean candidate, so I performed its requested checks directly with live Playwright/curl: title, `lang=en`, main landmark, image alt, labels, and console were all clean.

## Deployment policy, performance, and privacy

- Response headers on the live document and static assets include HSTS, `X-Content-Type-Options: nosniff`, strict-origin-when-cross-origin referrer policy, restrictive permissions policy, and a self-only CSP (`connect-src 'self'`).
- Fingerprinted static JS uses `Cache-Control: public, max-age=31536000, immutable`; the HTML uses a short 30-second revalidation cache.
- Live mobile Lighthouse: **100 Performance**, **100 Accessibility**; LCP **1.8 s**, CLS **0**, transferred total **202 KiB**.
- Production build sizes: JS 11.74 KB (4.46 KB gzip), CSS 10.60 KB (3.19 KB gzip), hero WebP 196.92 KB. All stated JS/CSS/image budgets pass; no fonts download.
- The browser demo has no storage namespace because its state is in-memory and disappears on reload. It sends no sample data off-site. Static inspection and the lockfile show no HTTP client or telemetry dependency in the CLI, and the CLI has no connection-string option.
- There are no server-side product/API endpoints, product unlock calls, or sign-in flow in this candidate. Therefore a rate-limit burst and Entra-tenant verification are not applicable.

## Defects by severity

None found.

## Evidence locations

- Live desktop screenshot: `/tmp/restore-drill-live-desktop.png`
- Live mobile screenshot: `/tmp/restore-drill-live-mobile.png`
- Mobile Lighthouse JSON: `/tmp/restore-drill-lighthouse-2.json`
- Installed-CLI preflight receipt/key: `/tmp/restore-drill-public-cli-llAcQs/`

