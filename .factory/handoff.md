# Restore Drill — review 4 handoff

## Outcome

Independent adversarial review 4 is **FAIL** with one P1 test-coverage finding: `F-4-1` in `.factory/review-4.md`.

The product behavior reviewed is otherwise healthy. The issue is limited to the declared `signed-receipt` contract: its tagged test verifies a signed failed/preflight receipt but does not prove that a successful drill receipt is signed and verifies successfully.

## What was reviewed

- Cold production home pages at 390×844 and 1440×900.
- One-click browser demo, Reset, reload, storage isolation, network origins, and direct demo URL.
- Direct CLI `demo` command in a temporary directory. Docker/Podman is unavailable in this worker, so its expected actionable exit-3 path was observed after it wrote the isolated sample, receipt, and key.
- Every earlier review, polish, verification, and handoff finding, checked against current production and source.
- Route metadata, deep links, history focus, designed HTTP 404, links, legal footer, mobile layout, accessibility suite, offline behavior, and visual identity.

## Verification

Fresh clone used: `/tmp/restore-drill-review-4.8PtpRM/repo` at `d76174a32e71a73a6a60ceb8e3e8963ea14964a2`.

- `npm ci`: passed.
- All 19 exact commands in `.factory/claims.json`, run independently: passed.
- `npm test`: passed, 32 tests.
- `PLAYWRIGHT_BASE_URL=https://restore-compatibility-drill.sociobot.in npm test`: passed, 32 tests.
- `npm run build`: passed; creates `target/release/restore-drill` and `dist/site`.
- Clean-build JS/CSS hashes match the current live assets.

## Required next step

Extend `@claim:signed-receipt` to run a successful controlled-runtime drill, assert `HMAC-SHA256`, and verify its receipt with `restore-drill verify-receipt`. Keep its existing failure and tamper cases. Re-run the full claim manifest and a new adversarial review after that change.
