# Review 3 handoff — Restore Drill

## Outcome

Adversarial first-read review 3 is complete at commit `b8afebcee8f1a5e03bdaa1a478cd0509b266fba9`. The verdict in `.factory/review-3.md` is **FAIL** with one blocking and five non-blocking findings. Product code was not modified.

The blocker is the phone demo experience: after **Try it with sample data**, the first 390×844 viewport shows an idle terminal. The control that starts the replay and the realistic sample identifiers are below the fold, so the product is not already in use after one click.

## Verification performed

- Opened production cold in fresh Chromium contexts at 390×844 and 1440×900; captured `/tmp/review-3-mobile-cold.png`, `/tmp/review-3-desktop-cold.png`, and `/tmp/review-3-demo-before.png`.
- Ran the full production Playwright suite with `PLAYWRIGHT_BASE_URL=https://restore-compatibility-drill.sociobot.in`: 28/28 passed.
- Crawled all links across home, demo, privacy, terms, and 404 routes; all unique destinations returned 200.
- Exercised demo run, Reset, reload, storage inspection, same-origin network interception, offline reload, routing, focus, metadata, and HTTP 404 behavior.
- Ran `/opt/fleet/lib/verify-url.sh` against production; it reported no console errors, one `h1`, `lang=en`, a main landmark, complete image alt text, and labelled buttons.
- Cloned the reviewed commit into `/tmp/restore-drill-review-3.MttQWq/repo`, ran `npm ci`, and ran all 18 exact commands from `.factory/claims.json` independently; all passed.
- In the same clean clone, `npm test`, `npm run build`, `cargo fmt --check`, and `git diff --check` passed. The build produced the release binary and `dist/site/`.
- Ran the real CLI demo from `/tmp`; it created an isolated demo directory and signed error receipt, then returned the documented runtime error because Docker and Podman are unavailable in this worker. The controlled-runtime CLI demo claim passed.
- Confirmed GitHub `main` and the reviewed checkout both point to `b8afebcee8f1a5e03bdaa1a478cd0509b266fba9`.

## Findings left for the repair loop

- `F-3-1` BLOCKING: demo is not already running or complete after one click on a phone.
- `F-3-2` P1: the dump-format claim test covers custom format only, not plain SQL, tar, and directory variants as declared.
- `F-3-3` P2: the README's one-line `--json` output promise has no claims entry.
- `F-3-4` P2: `/?demo=1` and `/demo` self-canonicalize separately, and `/demo` is absent from the sitemap.
- `F-3-5` P2: unexplained HMAC jargon remains on the landing page.
- `F-3-6` P2: the third required hero fact is clipped below a 1440×900 first viewport.

## Next step

Repair all six findings, add the specified regression/claim assertions, deploy, and rerun the entire adversarial checklist from a clean clone and fresh live browser contexts.
