# Restore Drill — review 6 handoff

## Outcome

Adversarial review 6 is complete with a **FAIL** verdict. Product code was not
modified. The full report is in [review-6.md](review-6.md).

## What was done

- Cold-opened the live home page in fresh 390×844 and 1440×900 contexts.
- Exercised the one-click replay, Reset, reload, storage isolation, request
  boundary, offline reload, and clipboard failure state.
- Ran the CLI demo from a fresh temporary directory and compared the bundled
  sample hash before and after.
- Ran all 19 exact claim commands independently from a clean clone.
- Ran the complete 32-test suite against production and built both artifacts.
- Crawled every rendered link and checked metadata, routes, 404 behavior,
  history focus, accessibility coverage, cache policy, and visual identity.
- Rechecked every finding from reviews 1–5 and both earlier verification
  reports in the live product and current source.
- Audited every landing-page and README sentence, heading, and action label.

## Verification

- Clean clone: `/tmp/restore-review6-claims.WbYCPz/repo` at `9c03cc6`.
- All 19 `.factory/claims.json` commands: PASS.
- `PLAYWRIGHT_BASE_URL=https://restore-compatibility-drill.sociobot.in npm test`:
  PASS — 5 Rust tests and 32 Playwright tests.
- `npm run build`: PASS — release CLI and `dist/site/` produced.
- Live route/link crawl: known routes and links passed; unknown route returned
  the designed HTTP 404.
- Browser demo traffic: same-origin only; localStorage, sessionStorage,
  IndexedDB, OPFS, and cookies empty.
- Real CLI demo: reached the documented actionable exit 3 because this worker
  has no Docker or Podman; the source sample hash was unchanged. The
  controlled-runtime CLI demo claim passed.

## Findings left for repair

- F-6-1: remove or implement the landing promise that every receipt contains a
  next step.
- F-6-2: register and test the Rust 1.85 minimum, or remove the exact version.
- F-6-3: replace or remove the first-screen slogan “A recovery check you can
  keep.”
- F-6-4: keep copy buttons action-named and provide announced, actionable
  clipboard failure text.
- F-6-5: replace the 404 press/restore metaphor with literal 404 copy.

## Next step

Repair all five findings, deploy, and rerun the entire adversarial checklist
from a clean clone and fresh live browser contexts.
