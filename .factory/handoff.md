# Restore Drill — polish 5 handoff

## Outcome

The review-5 repair is complete and deployed. The one remaining claim-contract
gap is closed: the public-install claim now uses the public GitHub repository,
checks out the exact public `main` SHA it resolved, runs the published locked
install command, and starts the installed binary. No finding remains open.

## What changed

- Replaced the local checkout used by `@claim:install-from-site` with the
  linked public GitHub checkout, detached at the SHA returned by `git ls-remote`.
- Kept the existing visible GitHub link and exact clone/install instructions in
  sync with the test.
- Updated the claim sandbox description, round-5 copy audit, and verb-first
  catalog description.
- Added the complete cumulative closure record in [polish-5.md](polish-5.md).

## Exact verification

- Repair commit: `c627fc57d8c7ab1f6ab561901516940693b55133`.
- Public `main` resolved to that same SHA after push.
- Fresh public clone: `/tmp/restore-drill-polish5-clean.UgMCAu/repo`.
- All 19 exact `.factory/claims.json` commands passed independently; see
  [polish-5-clean-claims.txt](evidence/polish-5-clean-claims.txt).
- Clean clone: `npm test` passed 5 Rust tests and 32 Playwright tests.
- Clean clone: `npm run build`, `cargo fmt --check`,
  `cargo clippy --all-targets -- -D warnings`, `cargo package --no-verify`,
  `npm audit --omit=dev --audit-level=high`, and `git diff --check` passed.
- Deployment: `5efd42a0-7885-4bc6-8dbc-8a9b1fac6544` through the static work-order
  configuration.
- Production: `PLAYWRIGHT_BASE_URL=https://restore-compatibility-drill.sociobot.in npm test`
  passed all 32 tests; output is in
  [production-suite.log](evidence/polish-5-live/production-suite.log).
- The worker verifier cold-opened home and demo with zero console errors,
  route-specific titles, `lang="en"`, one h1, one main landmark, labelled
  controls, and complete image alt text. Reports and screenshots are in
  [polish-5-live](evidence/polish-5-live/).
- Cold live route checks: `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms`
  returned 200; `/missing-page` returned the designed 404.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.893 s, CLS 0, TBT 33 ms.

## Run and deploy

Run `npm ci && npm test`. Build the release with `npm run build`; it writes the
binary to `target/release/restore-drill` and the static site to `dist/site/`.
The factory deploys `dist/site/`.

## Known gaps

None.
