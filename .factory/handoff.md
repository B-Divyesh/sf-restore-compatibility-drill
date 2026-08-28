# Perfection loop 1 handoff — Restore Drill

## Outcome

All findings in `.factory/review-1.md` are resolved. The repaired CLI site is deployed at <https://restore-compatibility-drill.sociobot.in>. The public one-click sandbox is <https://restore-compatibility-drill.sociobot.in/?demo=1>.

Implementation commit `812698f85680a923e1f2035ca0fbf3553d57014e` added the real install path, demo isolation tests, route metadata, HTTP 404 behavior, copy fixes, and mobile refinements. The final follow-up commit contains the live-aware verifier and this evidence.

## What changed

- Added a visible GitHub source link and complete clone/install commands to the site and README.
- Added `@claim:install-from-site`. It clones into a fresh directory, installs with Cargo, and runs `restore-drill --help`.
- Changed the main sample link to `/?demo=1`. `/demo` remains a supported alias.
- Kept demo state in memory only. Reset now cancels an active replay as well as clearing a completed replay.
- Added `@claim:demo-no-persistence`, covering Reset, reload, localStorage, sessionStorage, IndexedDB, and OPFS.
- Expanded `browser-privacy` to reject third-party requests, fonts, analytics, advertising scripts, WebSockets, and event streams.
- Replaced the unlisted “without Docker” sentence with “Open a browser replay of the sample drill.”
- Split the long README test sentence, explained `tmpfs`, and made both copy buttons name their command.
- Added route-specific titles, descriptions, Open Graph/Twitter titles, canonicals, heading checks, focus restoration, and legal-link checks.
- Removed the catch-all 200 rewrite. Known routes rewrite explicitly; unknown routes use the designed `404.html` and return HTTP 404.
- Preserved the risograph tactile-collage identity. Mobile command controls now stack above wrapped commands, and navigation/legal/demo controls meet 44 px targets.
- Added `.factory/catalog-description.txt`, refreshed `.factory/copy-audit.md`, and documented the demo contract.

## Exact verification evidence

### Clean clone and claims

Clean checkout: `/tmp/restore-drill-clean-polish-1.LLr3PN/repo` at `812698f85680a923e1f2035ca0fbf3553d57014e`.

- `npm ci`: pass, 0 vulnerabilities.
- Every one of the 13 commands in `.factory/claims.json`: pass independently.
- `npm test`: pass — 4 Rust tests and 23 Playwright tests.
- `npm run build`: pass — release binary and `dist/site/` produced.
- `cargo fmt --check`: pass.
- `cargo package --allow-dirty --no-verify`: pass — 47.7 KiB unpacked, 14.5 KiB compressed.
- `npm audit --audit-level=high`: pass, 0 vulnerabilities.
- Public GitHub acquisition: a fresh remote clone at `/tmp/restore-drill-public-install-polish-1.t3XSBt` installed successfully. The installed `restore-drill --help` exposed `run`, `demo`, and `verify-receipt`.

The worker has no Docker or Podman daemon. The integration suite therefore uses the controlled runtime shim to exercise the real binary, isolation flags, read-only mount, restore selection, receipt, and exit-code paths.

### Live browser, accessibility, privacy, and offline

- Factory deploy ID: `17929615-13bc-4da3-8de2-21ae9ad6cb7d`.
- Worker verifier: pass on `/`, `/?demo=1`, `/privacy`, and `/terms`; zero console/page errors, `lang=en`, one `h1`, one `main`, no missing alt text, no unlabeled buttons.
- Live Playwright: 15/15 production browser tests passed. This includes every browser claim, axe scans on six routes, keyboard/focus behavior, route metadata, 390 px layout, and offline service-worker reload.
- Live HTTP: `/`, `/?demo=1`, `/privacy`, and `/terms` return 200. `/missing-polish-final` returns 404 with the designed Restore Drill page.
- Demo privacy: the full run stayed same-origin. Reset/reload left localStorage, sessionStorage, IndexedDB, and OPFS empty.
- Screenshot evidence: `.factory/evidence/live-home-final/screenshot-mobile.png` and `.factory/evidence/live-demo-final/screenshot-mobile.png`.

### Performance and deployed-artifact match

- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.9 s, CLS 0, TBT 30 ms. JSON: `/tmp/restore-drill-lighthouse-polish-1.json`.
- Production assets: JS 13,368 bytes (4.86 KB gzip), CSS 10,944 bytes (3.25 KB gzip), hero WebP 196,916 bytes. No downloaded fonts.
- `index.html`, CSS, and JS on the live origin match `dist/site/` byte-for-byte. SHA-256: index `172617132e95ff0abbb33856c2fa03d98c2f28180b96b2ee7122ecc829a0a0cc`; CSS `276bfa98a60ee76ed6f74dec824934e37fb4f629541a2711d8def2d615bb72db`; JS `0da5a01af3f6798f2b73ab2af28e2eeef57a7caa1dec3fd4c756467a50e83a18`.
- Live fingerprinted CSS and JS return `Cache-Control: public, max-age=31536000, immutable`.

## Run and verify

```sh
npm ci
npm test
npm run build
```

Run browser tests against production:

```sh
PLAYWRIGHT_BASE_URL=https://restore-compatibility-drill.sociobot.in npx playwright test tests/site.spec.ts
```

## Known gaps and next steps

No product or review findings remain open. Registry publishing remains a factory action; the repository is ready for `cargo package` and must not publish from the worker.
