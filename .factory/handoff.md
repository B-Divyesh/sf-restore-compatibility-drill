# Restore Drill v0.1.0 repair handoff

## Repair summary

This repair resolves the release-blocking verification finding from candidate `6b9e2e87ccc65d091f4ef195d20fba4e2f89283f`.

The factory billing product was not enabled: on 28 August 2026, `GET https://api.sociobot.in/api/v1/products/restore-compatibility-drill/checkout` returned `404 {"error":"enabled factory product","status":404}`. Billing registration is factory-controlled and this repository has no registration authority or script. Rather than deploy a purchase action that fails, the product is now honestly free: the unavailable Team Kit, checkout URL, license flow, related sitemap entry, payment copy, and billing CSP exceptions were removed. The researched CLI job, browser demo, privacy boundary, and all restore behavior remain intact.

The secondary cache finding is also repaired. The hero image now builds as a fingerprinted Vite asset and `staticwebapp.config.json` gives `/assets/*` `Cache-Control: public, max-age=31536000, immutable`.

## Regression coverage

- `@regression:unavailable-checkout` asserts that the landing page calls the CLI free, contains no checkout/API link, and makes no Sociobot billing request.
- `@regression:immutable-static-assets` asserts that the hero URL is fingerprinted under `/assets/` and that the production SWA configuration sets the exact immutable cache header.
- Keyboard regression: Skip to content receives focus and moves focus to `<main>`.
- Service-worker regression: `/demo` reloads while offline after first visit; the generated worker includes `skipWaiting` and `clients.claim`.

## How to run

```sh
npm ci
npm test
npm run build
cargo package --allow-dirty --no-verify
```

The deploy root is `dist/site/`. The local browser demo is `/demo`; the real CLI sample is `cargo run -- demo --postgres 15` on a machine with Docker or Podman.

## Verification evidence

- Clean dependency install: `npm ci` passed; `npm audit --audit-level=high` reported 0 vulnerabilities.
- Full suite: `npm test` passed: 4 Rust unit tests, TypeScript checking, site build, and 18 Playwright tests. It includes every `.factory/claims.json` tag, desktop, 390 px mobile, keyboard, axe serious/critical scans, privacy egress, offline, and update-lifecycle checks.
- Production build: `npm run build` passed. Current static assets: 11.7 KB JS (4.46 KB gzip), 10.6 KB CSS (3.19 KB gzip), and a 196,916-byte hero image.
- Package/consumer: `cargo package --allow-dirty --no-verify` produced `target/package/restore-drill-0.1.0.crate`. A clean `cargo install --path . --root /tmp/restore-drill-consumer.*` installed `restore-drill`; its incompatible 17.6-to-15.8 run returned exit 2 with the signed compatibility receipt, and `verify-receipt` returned valid with exit 0.
- Local production preview: factory `verify-url.sh` returned HTTP 200 in 573 ms, no browser errors, one `h1`, a `main` landmark, `lang=en`, no missing image alt text, and no unlabeled buttons.
- `git diff --check` passed.

## Known limit

This worker has no Docker or Podman executable. The existing integration tests exercise the real CLI through a controlled runtime shim and verify isolation flags, read-only mount, restore command selection, cleanup, receipts, and exit codes. Run `restore-drill demo --postgres 15` once on a Docker or Podman release host for the real container smoke test.
