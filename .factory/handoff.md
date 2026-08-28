# Perfection loop 2 handoff — Restore Drill

## Outcome

All findings in `.factory/review-2.md`, `.factory/review-1.md`, `.factory/polish-1.md`, and the earlier verification reports are resolved. Restore Drill now checks required schemas, supports a bounded configurable temporary database disk, and has registered tests for its real CLI demo, default signing-key permissions, and Podman path.

No known product gaps or deferred findings remain.

## Shipped changes

- Added repeatable `--expect-schema` checks against `pg_namespace`, with distinct receipt results and present/missing tests.
- Added `--data-tmpfs-size` to `run` and `demo`, defaulting to `2g` and accepting `512m` through `64g`.
- Added `data_tmpfs_size` to receipt schema v2 while retaining receipt-v1 deserialization.
- Extended the bundled SQL and browser replay with the empty `restore_ready` readiness schema.
- Expanded `.factory/claims.json` from 13 to 18 claims with real tests for all five review-2 findings.
- Updated README, demo documentation, changelog, site copy, catalog description, and the complete copy audit.
- Strengthened production tests to check real live route status and immutable asset headers instead of assuming Azure exposes its consumed config file.
- Preserved the existing risograph tactile-collage visual system and static CLI/docs deployment class.

## Exact verification evidence

- Implementation commit: `ab56739b276d720213e90f6365c815275b5bdde8`.
- Production-test commit: `d820d2be462210c101b8f5e76cfabc9e253476f7`.
- Live URL: <https://restore-compatibility-drill.sociobot.in>.
- Deployment ID: `c6a0aeec-a6ac-4af6-8596-14b74237ec1d`.

Final fresh clone `/tmp/restore-drill-polish-2-final.IvzR0z/repo` at `0e1b5cc4157791f4a35992e00bb3ed5c8097f886`:

- `npm ci`: passed; 0 vulnerabilities.
- Every one of the 18 exact commands in `.factory/claims.json`: passed separately.
- `npm test`: passed 5 Rust tests and 28 Playwright tests.
- `npm run build`: passed; produced the release binary and `dist/site/`.
- `cargo fmt --check`: passed.
- `cargo package --locked`: passed; packaged 10 files, 51.6 KiB raw / 15.4 KiB compressed, then verified the crate build.
- `npm audit --audit-level=high`: passed with 0 vulnerabilities.
- `git diff --check`: passed.

Fresh public GitHub clone `/tmp/restore-drill-polish-2-public.kVNY3C/repo`:

- Checked out `d820d2be462210c101b8f5e76cfabc9e253476f7`.
- `cargo install --path . --locked` installed `restore-drill` successfully.
- `restore-drill run --help` exposed `--expect-schema` and `--data-tmpfs-size`.
- `restore-drill demo --help` exposed `--data-tmpfs-size` and `--output-dir`.

Final live verification:

- `PLAYWRIGHT_BASE_URL=https://restore-compatibility-drill.sociobot.in npx playwright test`: all 28 passed.
- Six route scans (`/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, unknown route) had zero serious or critical axe violations.
- Worker `/opt/fleet/lib/verify-url.sh` passed `/` and `/?demo=1`: correct titles, `lang=en`, one `h1`, main landmark, alt text, labelled buttons, and no console errors.
- `/`, `/demo`, `/privacy`, and `/terms` returned 200; an unknown route returned 404.
- Live demo completed with the schema pass, Reset restored the first frame, browser storage stayed empty, and requests stayed same-origin.
- Offline `/demo` reload passed after service-worker activation.
- Live JS returned `Cache-Control: public, max-age=31536000, immutable`; security headers and self-only CSP were present.
- Local and live SHA-256 values match for `index.html` (`98c03f7…`), JS (`0e2df93…`), and CSS (`276bfa9…`).
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.8 s, CLS 0, TBT 0 ms.
- Production sizes: JS 13.68 KB raw / 4.97 KB gzip; CSS 10.94 KB raw / 3.25 KB gzip; hero WebP 196.92 KB.
- Cold screenshots were visually inspected at `.factory/evidence/polish-2-live-home/` and `.factory/evidence/polish-2-live-demo/`.

The worker has no Docker or Podman daemon, so real image startup was not available in this environment. The suite runs the shipped binary against controlled executables and verifies exact runtime arguments, restore selection, queries, receipts, cleanup, exit codes, and unchanged backup bytes.

## Run and verify

```sh
npm ci
npm test
npm run build
cargo fmt --check
cargo package --locked
```

Deployable static output is `dist/site/`. The factory owns registry publication; do not publish the crate from a worker checkout.
