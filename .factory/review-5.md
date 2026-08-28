# Adversarial first-read review 5 — FAIL

**Reviewed:** 2026-08-28  
**Live URL:** <https://restore-compatibility-drill.sociobot.in>  
**Commit reviewed:** `a9a8ed093b174f7077c4b434fc2abc3bf0dadb7e`

## Verdict

**FAIL.** The live product is clear, tryable, and honest about its browser replay. All currently registered claim commands pass. One registered claim is not tested through the public acquisition path it promises, so the claims contract does not fully prove that a visitor can install from the GitHub source linked by the site. `PASS` requires zero findings.

## Cold first read

At 390×844 and 1440×900, before scrolling, I understood: this is a local CLI that proves a Postgres backup can restore before an outage; it is for teams that need a recovery answer before an outage; click **Try it with sample data** first. The adjacent text, **“Open a browser replay of the sample drill,”** explains the result. Both cold loads returned 200 with no console errors.

## Findings

### F-5-1 — P1 — the public-install claim test does not install the public source

**Location / exact quote:** `.factory/claims.json`, `install-from-site`: “The public install instructions produce a working restore-drill command from a fresh directory.” In `tests/site.spec.ts`, the tagged test declares `const publicRepo = 'https://github.com/B-Divyesh/sf-restore-compatibility-drill.git';` and verifies that URL, but installs using `git clone --quiet --no-local repo`, where `repo` is the local test checkout.

**Verification:** The public GitHub link currently returns 200 and `refs/heads/main` currently resolves to `a9a8ed093b174f7077c4b434fc2abc3bf0dadb7e`. The exact registered command passed from a clean clone. Its installation step still clones the local fixture, not the URL shown to a visitor. A stale public branch, missing tracked install file, or public-source packaging regression would therefore pass `@claim:install-from-site`.

**Why a visitor is misled:** The install action asks a visitor to trust the public GitHub source. The test proves only that the review checkout is installable, which is a different route.

**Concrete fix:** Have the tagged test clone `publicRepo` into a fresh temporary directory and run the published `cargo install --path . --locked` command there. For deterministic CI, first assert that `git ls-remote` resolves the reviewed commit, then clone that immutable commit. Keep the existing link assertion.

## Copy audit

The required complete sentence-by-sentence inventory, including every landing and README sentence, word count, terminology table, button labels, and flags, is in [copy-audit.md](copy-audit.md). I rechecked it against the live landing page and current README.

- All landing and README prose is at most 22 words. The longest landing sentence is 16 words: “The JSON receipt records the backup, target version, checks, duration, and a signature you can verify.” The longest README sentence is 17 words: “The browser demo starts a memory-only replay and shows a signed sample receipt without a second click.”
- No banned marketing word, generic marketing adjective, inconsistent term, unclear heading, or non-result-naming visible button was found.
- `tmpfs` is defined as a temporary memory disk. HMAC is explained as a local-key integrity check, not a third-party signature. The technical language is proportionate to a Postgres CLI audience.
- The primary first-screen action is result-naming. **Copy install command**, **Copy drill command**, **Replay sample drill**, **Reset demo**, and **Start for real** name their results or destinations.

No copy finding is added this round.

## Demo and sandbox verification

- One tap on the first-screen action opened `/?demo=1` and immediately showed realistic proof: Postgres 15.8 → 15, `restore_ready`, `restore_reader`, `public.restore_probe`, and “Signature verified.”
- The persistent banner read **“Demo — sample data, nothing is saved”** and provided **Reset demo** and **Start for real**. Reset started one fresh replay. localStorage, sessionStorage, IndexedDB, and OPFS stayed empty before and after reset.
- The fresh demo context made requests only to `https://restore-compatibility-drill.sociobot.in`. It reloaded offline after service-worker activation.
- The page calls itself a browser replay and directs people to the CLI for a real restore; it does not claim to run Postgres in the browser.
- `restore-drill demo --postgres 15` was run from a fresh temporary directory. It created its separate `/tmp/restore-drill-demo-*` workspace and then said “Start Docker or Podman, then run the same drill again.” This container has neither runtime. The controlled-runtime `cli-demo` claim test passed separately.

## Claims

All 19 exact `.factory/claims.json` commands passed independently in a clean clone at `/tmp/restore-review5-clean.60lS41/repo`.

| Claim id | Result |
| --- | --- |
| sample-demo | PASS |
| browser-privacy | PASS |
| demo-no-persistence | PASS |
| install-from-site | PASS; see F-5-1 |
| free-cli | PASS |
| isolated-container | PASS |
| data-tmpfs-size | PASS |
| backup-local | PASS |
| newer-version | PASS |
| signed-receipt | PASS |
| default-signing-key | PASS |
| schema-readiness | PASS |
| cli-demo | PASS |
| podman-runtime | PASS |
| dump-formats | PASS |
| json-output | PASS |
| ci-mode | PASS |
| no-production-url | PASS |
| no-telemetry | PASS |

Each manifest id has exactly one tagged test. `PLAYWRIGHT_BASE_URL=https://restore-compatibility-drill.sociobot.in npm test` also passed against production. No additional live claim-like sentence lacks a relevant manifest entry; F-5-1 concerns whether the installation test proves the public-source wording of its existing entry.

## Earlier finding regression check

Every prior review, polish document, and handoff was read. The following remains fixed in both source and live behavior: F-1-1 through F-1-6 (install path, demo persistence, CTA wording, concise README, tmpfs explanation, copy-button names); F-2-1 through F-2-5 (schema check, disk sizing, CLI demo, default key, Podman); F-3-1 through F-3-6 (automatic demo, dump formats, JSON output, canonical demo, HMAC wording, desktop facts); F-4-1 (successful receipt-signature proof); and Verification P0/P2 (no checkout and immutable assets). F-5-1 is new and does not re-open F-1-1: the public source is currently usable, but the regression test does not prove it.

## Structure and visual review

- `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms` returned 200. The unknown URL returned a designed HTTP 404 with a return-home action.
- Every checked route had one `<h1>`, one `<main>`, route-specific title, meta description, canonical, Open Graph/Twitter metadata, favicon, skip link, and consistent header/footer with Privacy and Terms.
- Back navigation restored focus to the page heading. The first Tab reaches the skip link. Production axe scans passed. Crawled internal/external links returned 200 or were valid same-page fragments.
- The warm paper, registration colors, clipped cards, stamped terminal, and original risograph artwork form a product-specific recovery-drill identity rather than a generic SaaS template.

## Missed leverage

No AI feature is warranted. Deterministic local restore checks and receipts are the core job; an AI or sync feature would expand the safety boundary without improving it. The brief’s useful leverage—isolated checks, receipts, CI output, and bundled sample data—is already present.

## What would make this perfect

Make `@claim:install-from-site` clone and install the exact public GitHub source that the visitor is directed to. With that proof added, this review found no remaining product, copy, demo, privacy, routing, accessibility, or visual-system work.
