# Restore Drill v0.1.0 handoff

## Independent verification addendum — **FAIL** (2026-08-28)

Candidate `6b9e2e87ccc65d091f4ef195d20fba4e2f89283f` was independently tested against https://restore-compatibility-drill.sociobot.in from a clean checkout. Local claims, tests, typecheck, release build, package, clean-consumer CLI flow, live deployment match, accessibility, mobile, offline, privacy, rate limiting, and Lighthouse checks passed.

**Release blocker:** the visible $49 Team Kit purchase link is unavailable. Fresh evidence:

```text
GET https://api.sociobot.in/api/v1/products/restore-compatibility-drill/checkout
HTTP 404
{"error":"enabled factory product","status":404}
```

The factory must register/enable the product in Sociobot billing, confirm this exact URL opens checkout, and have the verifier retest before release. The full evidence and secondary cache finding are in `.factory/verification.md`.

## What shipped

- A single Rust binary, `restore-drill`, with `run`, `demo`, and `verify-receipt` commands.
- Isolated Docker or Podman execution with no container network, no published port, tmpfs database storage, and a read-only backup mount.
- Plain SQL restore through `psql` and pg_dump archive or directory restore through `pg_restore`.
- Preflight detection for a newer plain-SQL source version and the Postgres 17 `transaction_timeout` mismatch.
- Post-restore checks for expected extensions, roles, and schema-qualified tables.
- A receipt for pass, compatibility fail, or runtime error. Receipts contain the backup hash, duration, checks, remedies, and an HMAC-SHA256 signature.
- A bundled real CLI sample at `examples/sample-backup.sql` and a browser replay at `/demo`.
- A static Vite site at `dist/site/` with `/`, `/demo`, `/team-kit`, `/privacy`, `/terms`, and a designed not-found route.
- The required Sociobot checkout and license verification flow. The $49 one-time Team Kit supplies a weekly workflow, policy checklist, and incident checklist after verification.
- An original 193 KB risograph hero plus a derived Open Graph image. The prompt and factory deployment are recorded in `.factory/assets/restore-press.prompt.json` and `.factory/design.md`.

## How to run

```sh
npm ci
npm test
npm run build
```

The exact static build command is `npm run build:site`; its deploy root is `dist/site/` and contains `index.html`.

Try the actual CLI sample on a machine with Docker:

```sh
cargo run -- demo --postgres 15
```

Check the publishable Rust archive without publishing:

```sh
cargo package
```

## Verification completed

- `npm test`: passed. This includes 4 Rust tests and 17 Playwright tests.
- Every entry in `.factory/claims.json`: passed from a fresh browser context or temp directory.
- `npm run typecheck`: passed.
- `npm run build`: passed; release binary is 1008 KB and static output is 532 KB total.
- `cargo package`: passed from the committed tree. The package allowlist contains only the Rust source, examples, and project docs.
- `npm audit --audit-level=high`: zero vulnerabilities.
- `git diff --check`: passed.
- Factory `verify-url.sh`: HTTP 200, 564 ms load, no console errors, one `h1`, one `main`, no missing alt text, and no unlabeled buttons.
- Axe: no serious or critical findings on home, demo, locked Team Kit, privacy, terms, or not-found routes.
- Mobile: the 390×844 test has no horizontal overflow and preserves the primary action.
- Production bundle: 6.29 KB JS gzip, 3.57 KB CSS gzip, no font files, and a 193 KB hero image.
- Lighthouse mobile: performance 98, accessibility 100, best practices 100, SEO 100; LCP 2.3 s, CLS 0, speed index 0.9 s, and total blocking time 10 ms. Lab INP was not reported.

## Known gaps and release notes

- This worker image has no Docker or Podman binary, so a live Postgres container could not run here. Integration tests execute the release logic against a controlled fake runtime and assert the exact isolation, mount, `psql`, `pg_restore`, query, cleanup, exit-code, and receipt behavior. Run `restore-drill demo --postgres 15` once on the release host as the final container smoke test.
- Source-version preflight reads plain SQL headers. Custom and directory archives rely on the live restore because their source metadata is not safely readable without starting the selected image.
- The 2 GB tmpfs limit is intentional for a small local drill. Large backups need a larger-memory runner and may exceed the default 20-minute timeout.
- HMAC receipts prove that a file still matches the holder's local key. They are not public-key attestations.
- The factory must register the paid product before release. The site uses the slug-based Sociobot production API and contains no product ID or payment-provider code.
