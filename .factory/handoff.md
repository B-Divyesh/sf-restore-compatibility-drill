# Restore Drill — perfection loop 4 handoff

## Outcome

All review-4 work and every earlier review/verification finding are closed. The repair is live at <https://restore-compatibility-drill.sociobot.in>.

- Implementation commit: `c6191d1fe1df0c01e62a7af49514f4edf97e1923`
- Azure deployment: `bd3b534d-de82-4f26-891d-4648abb4e948`
- Artifact class: Rust CLI plus static Vite landing/docs site
- Catalog: “Prove a Postgres backup restores into its intended version before an outage”

## What changed

- The `signed-receipt` claim now proves a successful drill receipt is signed with HMAC-SHA256 and verifies with its generated key.
- The same tagged test still proves signed preflight failures and tamper rejection.
- `.factory/claims.json` now describes the complete successful/failed/tampered sandbox.
- The copy audit was repeated for round 4, and the verb-first catalog description was refreshed.
- Every round 1–3 finding was rechecked in source, a clean clone, and cold production contexts.

The browser experience and its original risograph tactile-collage identity did not need replacement or visual restyling.

## Clean-clone verification

Fresh clone: `/tmp/restore-drill-polish-4-clean.apFRLB/repo` at `c6191d1fe1df0c01e62a7af49514f4edf97e1923`.

- All 19 exact `.factory/claims.json` commands passed independently.
- `npm test` passed 5 Rust tests and 32 Playwright tests.
- `npm run build` produced `target/release/restore-drill` and `dist/site/`.
- `cargo fmt --check` passed.
- `cargo clippy --all-targets -- -D warnings` passed.
- `cargo package --no-verify` produced `target/package/restore-drill-0.1.0.crate`.
- `npm audit --audit-level=high` found 0 vulnerabilities.
- `git diff --check` passed.

Claim results are recorded in `.factory/evidence/polish-4-clean-claims.txt`.

## Production verification

- `PLAYWRIGHT_BASE_URL=https://restore-compatibility-drill.sociobot.in npm test` passed all 32 tests after deployment.
- `/opt/fleet/lib/verify-url.sh` passed `/` and `/?demo=1`; both had no console errors, one `h1`, one `main`, `lang="en"`, complete alt text, and labelled buttons.
- Axe integration found no serious or critical issue on home, both demo paths, privacy, terms, or the designed 404.
- Cold 390×844 demo inspection reached the completed proof in one click. The proof ended at 687.17 px.
- The demo banner, Reset, and Start for real were present. Reset/reload left localStorage, sessionStorage, IndexedDB, and OPFS empty.
- The complete cold demo requested only `https://restore-compatibility-drill.sociobot.in` and reloaded offline after service-worker activation.
- History focus, skip-link focus, exact titles/canonicals, legal links, 44 px phone targets, and 390 px overflow checks passed.
- Home, canonical demo, alias, privacy, and terms returned 200. A cold unknown route returned HTTP 404 with the designed press-style recovery page.
- Every rendered internal/external link returned 200 or was a valid same-page fragment.
- Fingerprinted JavaScript returned `Cache-Control: public, max-age=31536000, immutable` with the expected security headers.
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 0.9 s, CLS 0, TBT 50 ms.
- JavaScript is 14.36 KB raw / 5.11 KB gzip; CSS is 12.35 KB raw / 3.52 KB gzip; hero WebP is 196.92 KB.
- SHA-256 matches local-to-live for `index.html`, JavaScript, CSS, and the hero asset.

Cold screenshots and worker reports are under `.factory/evidence/polish-4-live/`. The complete finding map is `.factory/polish-4.md`.

## Run and verify

```sh
npm ci
npm test
npm run build
```

Run one claim with `npm test -- --grep @claim:<id>`. Run the site with `npm run dev`. Install the CLI with the clone and Cargo commands in README.

## Known gaps and next steps

Known product gaps: none.

This worker has no Docker or Podman executable/socket. The real binary was therefore verified through the controlled runtime suite, including isolation, restore selection, cleanup, successful and failed signed receipts, and exit codes. Registry publication remains factory-owned and was not performed.
