# Restore Drill — polish 6 handoff

## Outcome

Perfection-loop round 6 is complete. All findings from reviews 1–6 and both
earlier verification reports are closed in source and on the live site.

- Implementation commit: `18bca79ada9437e6cc1f7b44b9e0bd6c87f5f182`
- Deployment: `4ad1d411-56fc-4b93-866e-248a8663dd99`
- Live site: <https://restore-compatibility-drill.sociobot.in>
- Canonical demo: <https://restore-compatibility-drill.sociobot.in/?demo=1>

## What changed

- Replaced the first-screen slogan with “Local Postgres restore drill.”
- Removed the unsupported promise that every passing receipt has a next step.
- Added a registered Rust 1.85 minimum-toolchain claim and real locked build.
- Kept copy-button action names stable and added associated success/status and
  actionable clipboard-denial messages.
- Rewrote the designed 404 to use “Error 404” and “Page not found” while
  preserving the product's offset-risograph identity.
- Updated the copy audit, claims manifest, catalog description, regression
  coverage, build stamp, and cumulative polish record.

The canonical one-click demo remains isolated and automatic. Its persistent
banner, Reset demo, Start for real, realistic receipt, same-origin boundary,
empty storage, and offline reload all pass.

## Exact verification

- Every one of the 20 `.factory/claims.json` commands passed independently
  from public clean clone `/tmp/restore-drill-polish6-public.VMtX29/repo` at
  `18bca79`. See [clean claim summary](evidence/polish-6-clean-public/summary.txt).
- A separate clean clone at `/tmp/restore-drill-polish6-clean.unp7Pn/repo`
  passed `npm test` (5 Rust tests and 36 Playwright tests) and `npm run build`.
  See [full suite](evidence/polish-6-clean-local/full-suite.log) and
  [build output](evidence/polish-6-clean-local/build.log).
- Formatting and package checks passed: `cargo fmt --check`, Clippy with
  warnings denied, `cargo package --locked --no-verify`, dependency audit,
  claims/tag cardinality, and `git diff --check`.
- Production `npm test` passed all 36 browser tests after deployment. Coverage
  includes routes, exact titles and metadata, canonical URLs, heading focus,
  true HTTP 404 behavior, legal links, phone layout, 44 px targets, reduced
  motion, axe, keyboard, privacy, offline, demo reset, and clipboard denial.
  See [production suite](evidence/polish-6-live/production-suite.log).
- Cold production audit: no console errors; one request origin; empty
  localStorage, sessionStorage, IndexedDB, and OPFS; all three facts end by
  771 px; demo proof ends by 666 px in a 390×844 viewport. See
  [cold audit](evidence/polish-6-live/cold-audit.json), [home](evidence/polish-6-live/cold-home-mobile.png),
  [demo](evidence/polish-6-live/cold-demo-mobile.png), [clipboard denial](evidence/polish-6-live/clipboard-error-mobile.png),
  and [404](evidence/polish-6-live/cold-404-desktop.png).
- Worker URL checks found one `h1`, one `main`, `lang="en"`, complete alt text,
  labelled buttons, and zero console errors on home and demo.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.9 s, CLS 0, TBT 30 ms.
- Production JavaScript is 15.05 KB raw / 5.27 KB gzip. CSS is 12.59 KB raw /
  3.60 KB gzip. Live HTML, JS, and CSS SHA-256 hashes match `dist/site/`.

## Run and package

```sh
npm ci
npm test
npm run build
cargo package --locked --no-verify
```

`npm run build` produces the release CLI and `dist/site/`. Registry
credentials remain factory-owned; do not publish from this checkout.

## Known gaps and next steps

No product or review gaps remain. This worker has no Docker or Podman daemon,
so real container orchestration was verified with the controlled runtime used
by the CLI integration claims. The shipped demo command still detects an
absent runtime and returns the documented actionable exit code.
