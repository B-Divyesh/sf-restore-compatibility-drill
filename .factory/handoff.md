# Restore Drill — perfection loop 3 handoff

## Outcome

All six review-3 findings and every earlier review/verification finding are closed. The repair is live at <https://restore-compatibility-drill.sociobot.in>.

- Implementation commit: `c04e2d8cf830ebc36a6d67c4c06ac3f505fe42c9`
- Azure deployment: `bb4c9bc7-f981-4029-8f4f-2069eb92e9cb`
- Artifact class: Rust CLI plus static Vite landing/docs site
- Catalog: “Prove a Postgres backup restores in its target version before an outage”

## What changed

- The canonical `/?demo=1` path now starts a fresh sample replay automatically.
- The first phone viewport shows the signed pass state, versions, schema, role, and table.
- Reset restarts an isolated in-memory replay. Start for real lands on the install section.
- The dump-format claim now covers plain SQL, custom, tar, and directory backups.
- A new `json-output` claim proves one valid JSON line for pass, fail, and error outcomes.
- `/demo` normalizes to `/?demo=1`; both use one canonical, which appears once in the sitemap.
- Landing-page HMAC jargon was replaced with plain words.
- Desktop hero geometry now keeps all three required facts above 900 px.
- Focus contrast, phone touch targets, transient animation contrast, and service-worker cache versioning were tightened.

The risograph tactile-collage identity and original generated art remain intact.

## Verification

Fresh public clone: `/tmp/restore-drill-polish-3-clean.ZjyMq9/repo` at `c04e2d8`.

- All 19 exact commands in `.factory/claims.json`: pass independently.
- `npm test`: 5 Rust tests and 32 Playwright tests pass.
- `npm run build`: pass; creates `target/release/restore-drill` and `dist/site/`.
- `cargo fmt --check`: pass.
- `cargo clippy --all-targets -- -D warnings`: pass.
- `cargo package --no-verify`: pass; package is ready but was not published.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- `git diff --check`: pass.

Production verification:

- `PLAYWRIGHT_BASE_URL=https://restore-compatibility-drill.sociobot.in npm test`: 32/32 pass.
- `/opt/fleet/lib/verify-url.sh` on `/` and `/?demo=1`: pass with no console errors.
- Axe integration: zero serious or critical findings on home, both demo entry paths, privacy, terms, and 404.
- Lighthouse mobile: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.805 s, CLS 0, TBT 36 ms.
- Live HTML, JS, and CSS SHA-256 values match `dist/site/` exactly.
- JS: 14.36 KB raw / 5.11 KB gzip. CSS: 12.35 KB raw / 3.52 KB gzip. Hero WebP: 196.92 KB.
- Home, demo, privacy, and terms return 200. An unknown route returns 404.
- Every crawled link returns 200 or is a valid same-page fragment.
- Fingerprinted JS and CSS return one-year immutable cache headers.

Evidence is under `.factory/evidence/polish-3-local/` and `.factory/evidence/polish-3-live/`.

## Run and verify

```sh
npm ci
npm test
npm run build
```

Run one declared claim with `npm test -- --grep @claim:<id>`. Run the site with `npm run dev`. Install the CLI with the clone and Cargo commands in README.

## Known gaps and next steps

Known product gaps: none.

This worker has no Docker or Podman executable or socket. The real binary was therefore verified with the controlled runtime integration suite, including restore command selection, isolation, cleanup, receipts, and exit codes. Registry publication remains factory-owned and was not performed.
