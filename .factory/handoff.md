# Review 2 handoff — Restore Drill

## Outcome

Independent review completed without product-code changes. `.factory/review-2.md` records a **FAIL** with five findings: missing explicit schema readiness, a fixed unconfigurable 2 GB database disk, and three unregistered CLI/security/runtime claims.

## Verification performed

- Cold live contexts at 390×844 and 1440×900: clear first screen, no console errors, no mobile horizontal overflow.
- One-click `/?demo=1`: realistic populated sample, persistent demo banner, Reset, same-origin requests, empty browser storage, and sample replay completion.
- CLI demo from a temporary directory: printed isolated sample/receipt/key paths; the unavailable local Docker/Podman runtime produced its documented exit-3 next step.
- Fresh local clone: `npm ci` and all 13 exact `.factory/claims.json` commands passed.
- Repository quality checks: `npm test` (4 Rust + 23 Playwright tests), `npm run build`, and `cargo fmt --check` passed.
- Fresh public GitHub clone: `cargo install --path . --locked` succeeded and `restore-drill --help` worked.
- Live route, metadata, footer, link, 404, focus, privacy, offline, accessibility, and visual-identity checks were completed as detailed in the review.

## How to verify

```sh
npm ci
npm test
npm run build
cargo fmt --check
```

Read [.factory/review-2.md](review-2.md) for exact evidence and required fixes.

## Known gaps / next steps

Implement F-2-1 through F-2-5, add their claim tests, deploy, and repeat the full cold/live/clean-clone review. No production code was modified in this review commit.
