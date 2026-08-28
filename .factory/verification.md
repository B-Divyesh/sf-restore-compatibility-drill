# Independent verification — FAIL

**Candidate:** `6b9e2e87ccc65d091f4ef195d20fba4e2f89283f`  
**Live URL:** https://restore-compatibility-drill.sociobot.in  
**Verified:** 2026-08-28 (fresh clean checkout)

## Decision

**FAIL — release blocking.** The live site advertises a $49 one-time Team Kit and its Buy link uses the required Sociobot billing URL, but the live checkout endpoint is not enabled:

```text
GET https://api.sociobot.in/api/v1/products/restore-compatibility-drill/checkout
HTTP 404
{"error":"enabled factory product","status":404}
```

This makes the advertised paid offering unavailable. The source handoff already says the factory must register the paid product before release; fresh live evidence confirms that requirement is still unmet.

## First-read test (cold live browser)

Pass. The first viewport says **“Prove your Postgres backup restores”**, identifies **teams needing a recovery answer before an outage**, and directs the visitor to **“Try it with sample data”** with the immediate outcome “See a complete drill without Docker.” The action is one click and lands on `/demo`.

## Required claim tests

Installed with `npm ci`, then ran every exact command declared in `.factory/claims.json` independently from the clean checkout. All passed; the final Playwright run recorded `test-results/.last-run.json` as `{"status":"passed","failedTests":[]}`.

| Claim ID | Result |
| --- | --- |
| `sample-demo` | PASS |
| `browser-privacy` | PASS |
| `paid-kit` | PASS (copy/link-shape only; this did **not** prove checkout availability) |
| `isolated-container` | PASS |
| `backup-local` | PASS |
| `newer-version` | PASS |
| `signed-receipt` | PASS |
| `dump-formats` | PASS |
| `ci-mode` | PASS |
| `no-production-url` | PASS |
| `no-telemetry` | PASS |

## Local build and CLI verification

- `npm test`: PASS — 4 Rust tests and 17 Playwright tests passed, including typecheck, all routes, claim tags, 390 px layout, and axe smoke tests.
- `npm run build`: PASS — release binary and `dist/site/` produced.
- `cargo package --allow-dirty --no-verify`: PASS; `target/package/restore-drill-0.1.0.crate` produced.
- `npm audit --audit-level=high`: PASS, 0 vulnerabilities.
- `git diff --check`: PASS.
- Clean consumer exercise: `cargo install --path . --root /tmp/restore-drill-consumer.*` installed the public `restore-drill` binary. `--help` exposed the three documented commands. An incompatible 17.6 dump aimed at 15.8 produced the signed JSON compatibility receipt and documented exit `2`; `--postgres latest` produced actionable JSON recovery output and exit `3`; `verify-receipt` accepted the signed failure receipt with exit `0`.
- The worker has neither Docker nor Podman, so a genuine Postgres image could not be started here. The complete suite exercised the real binary against a controlled container-runtime shim, including the exact `--network none`, tmpfs, read-only mount, `psql`/`pg_restore`, cleanup, receipt, and exit-code paths.

## Live deployment and browser QA

- Deployment matches the candidate byte-for-byte: live `index.html`, JS, CSS, hero image, and OG image SHA-256 values equal this build. The deployed JS asset is `index-BtHJN4Xg.js` and CSS is `index-CTTXoiNL.css`.
- Cold desktop load: no console or page errors; only same-origin document, JS, CSS, and hero requests.
- Demo: `/demo` has the persistent “Demo — sample data, nothing is saved” banner, Reset demo, Start for real, and produces the bundled PASS receipt replay. Demo requests stayed same-origin and wrote no localStorage keys.
- Accessibility: live `/`, `/demo`, `/team-kit`, `/privacy`, `/terms`, and `/missing-page` each had one `<main>`, one `<h1>`, correct title, and zero axe serious/critical findings. Keyboard testing showed the visible skip link and a `3px` blue focus ring; Enter activated the demo and completed it.
- Mobile: at 390×844, document width was 390 px (no horizontal overflow); primary CTA was 358×52.8 px.
- Reduced motion: demo completed with result rows at `0.00001s` animation duration.
- Offline: after service-worker installation, offline reload of live `/demo` retained the page and its heading. The service worker uses `skipWaiting` and `clients.claim` for updates.
- Lighthouse (live mobile, Chromium): Performance **97**, Accessibility **100**, Best Practices **100**, SEO **100**; LCP 1.80 s, CLS 0, TBT 164 ms.
- Bundle budget: 6.29 KB gzip JS and 3.57 KB gzip CSS; no downloaded fonts; 193 KB hero image. All are within the stated budgets.
- Security/privacy: live CSP permits only self plus `https://api.sociobot.in` for the optional license request; HSTS, `nosniff`, strict referrer policy, permissions policy, and frame protection were present. No analytics, fonts, or sample-data egress were observed. Invalid license recovery showed the expected message and only contacted the Sociobot endpoint.
- Rate limiting: a 40-request concurrent burst to the live product verification endpoint produced 10 HTTP 429 responses, each with `Retry-After: 4`; the earliest client-labelled request to receive 429 was #2 (concurrent burst ordering is nondeterministic). Other requests returned the expected 200 invalid-license response.

## Defects

### P0 — Team Kit checkout is unavailable (release blocker)

**Evidence:** `GET https://api.sociobot.in/api/v1/products/restore-compatibility-drill/checkout` returned the 404 response shown above. The landing page visibly offers this $49 purchase and the claims call it a one-time Team Kit.

**Required resolution:** Register and enable `restore-compatibility-drill` in the Sociobot billing engine, then verify the exact production checkout URL redirects to hosted checkout and a completed/returned license can be restored and verified on the live site. Re-run this verification afterward.

### P2 — Static assets are not cached immutably

**Evidence:** live hashed JS (`/assets/index-BtHJN4Xg.js`) and hero image both return `Cache-Control: public, must-revalidate, max-age=30`. The performance contract calls for long-lived immutable caching of hashed static assets. This is non-blocking beside the P0, but should be corrected in deployment configuration.

## No other blocking findings

The first-read and one-click demo requirements pass. The candidate’s deployed artifacts are exactly this commit, tests/builds pass, and the client-side/license verification, safety boundaries, rate limiting, responsive layout, accessibility, offline behavior, and privacy checks described above all passed. The failed decision is solely because the external paid-product registration is incomplete.
