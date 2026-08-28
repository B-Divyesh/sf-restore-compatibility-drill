# Review 1 handoff — Restore Drill

## Outcome

Adversarial first-read review completed on 2026-08-28 and committed as `.factory/review-1.md`.

**Verdict: FAIL.** The live browser demo, claim suite, routing, privacy observation, mobile layout, and prior repair checks passed. The release remains blocked by `F-1-1`: the live site offers only `cargo install --path .`, which fails from a fresh directory and is not preceded by a clone, source link, release download, or package installation route.

Additional findings are `F-1-2` through `F-1-6`: two unlisted demo claims, one README sentence over the 22-word limit, unexplained `tmpfs`, and ambiguous visible Copy buttons.

## Verification performed

- Cold live browser checks at 390×844 and 1440×900, before scrolling.
- One-click `/demo` replay, completion, Reset, Start-for-real control, fresh-context storage inspection, same-origin network interception, and offline reload after service-worker installation.
- Every exact command listed in `.factory/claims.json`, independently from a fresh clone: all 11 passed.
- Clean-clone `npm test`: 4 Rust tests and 18 Playwright tests passed.
- Clean-clone `npm run build`: completed and produced the release binary and `dist/site/`.
- CLI demo command in a temporary directory. It printed its output directory and returned the expected actionable Docker/Podman-unavailable error in this worker.
- Route/title/metadata/link crawl, history review, source inspection, and the fresh-directory reproduction of the published install-command failure.

## How to verify after repair

```sh
npm ci
npm test
npm run build
```

For the release blocker, begin in a fresh temporary directory and follow exactly the acquisition/install instructions presented on the live site. Confirm `restore-drill --help` succeeds before treating the fix as complete. Then run all 11 claim commands from `.factory/claims.json` independently.

## Environment note

This review worker has no Docker or Podman executable. The actual CLI demo reached its documented graceful runtime failure; no product code was modified. Only this handoff and the review report were added/updated.
