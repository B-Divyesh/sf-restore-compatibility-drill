# Adversarial first-read review 4 — FAIL

**Reviewed:** 2026-08-28  
**Live URL:** <https://restore-compatibility-drill.sociobot.in>  
**Source / clean clone:** `d76174a32e71a73a6a60ceb8e3e8963ea14964a2`

## Verdict

**FAIL.** The product is clear on a phone, the one-click replay is honest and isolated, the public CLI path works, and all 19 declared commands pass. One receipt-integrity claim is broader than its sole declared test: the test proves a signed *failed* drill, but does not prove that a successful drill receipt is signed and verifiable. The product needs that observable test before it can pass with zero findings.

## Findings

### F-4-1 — P1 — the signed-receipt claim does not test a successful drill receipt

**Location / exact quote:** `.factory/claims.json`, `signed-receipt`: “Every started drill writes an HMAC-SHA256 signed JSON receipt, including a preflight failure.” The same assurance appears on the landing page as “Pass or fail, the CLI writes a signed JSON receipt with the next step.”

**Verification:** `tests/cli.spec.ts` test `@claim:signed-receipt signs a failure receipt and detects a changed receipt` runs only `examples/incompatible-backup.sql`, which ends in preflight exit `2`. It verifies that failed receipt and rejects a changed version. The successful controlled-runtime paths in `@claim:isolated-container`, `@claim:cli-demo`, and `@claim:json-output` assert `status: "pass"`, but do not verify the receipt signature or assert `HMAC-SHA256`.

**Why this matters:** the wording asks an operator to rely on receipt integrity for both pass and fail outcomes. A regression that omitted or malformed the success-path signature would leave every declared test passing while the landing claim was false for the most valuable outcome.

**Concrete fix:** extend the one tagged `@claim:signed-receipt` test with a successful controlled-runtime drill. Read its receipt, assert `signature.algorithm === "HMAC-SHA256"`, run `restore-drill verify-receipt` with its signing key, and assert `valid: true`. Keep the existing changed-receipt rejection and preflight-failure assertions.

## Cold first-read result

Fresh Chromium contexts opened `/` without scrolling at 390×844 and 1440×900. Both had no application console or page errors, no horizontal overflow, and showed the primary action plus all three facts.

| Question | First-screen answer in my words | Evidence |
| --- | --- | --- |
| What does it do? | It checks whether a Postgres backup restores before an outage. | “Prove your Postgres backup restores” |
| For whom? | Teams that need a recovery answer before an outage. | “For teams that need a recovery answer before an outage, not during one.” |
| What should I click first? | Try the supplied sample replay. | **Try it with sample data** → “Open a browser replay of the sample drill.” |

The first-read requirement passes. The job headline has five words, the audience sentence has 13 words, and the action names the immediate result.

## Copy audit

Counts treat hyphenated terms, version tokens, and command names as one word. Commands, JSON, navigation labels, and list fragments are not treated as prose sentences. No sentence exceeds 22 words. No banned marketing adjective, inconsistent product term, context-free heading, or non-result-naming visible button was found. The only copy-linked finding is F-4-1 above.

### Landing page

| Sentence or heading | Words | Result |
| --- | ---: | --- |
| A recovery check you can keep | 6 | Pass — eyebrow; clear in hero context |
| Prove your Postgres backup restores | 5 | Pass — job headline |
| For teams that need a recovery answer before an outage, not during one. | 13 | Pass — audience and situation |
| Try it with sample data | 5 | Pass — result-naming primary action |
| Open a browser replay of the sample drill. | 8 | Pass — `sample-demo` |
| Runs Postgres in a disposable local container. | 7 | Pass — `isolated-container` |
| Keeps your backup on your machine. | 6 | Pass — `backup-local` |
| The CLI is free and writes signed JSON receipts. | 9 | F-4-1 for the receipt-signing half; `free-cli` otherwise passes |
| A risograph database press turns backup pages into a checked and sealed restore receipt. | 14 | Pass — purposeful image alt text |
| Rehearse the restore. | 3 | Pass |
| Keep the receipt. | 3 | Pass |
| Sample restore drill | 3 | Pass — heading |
| Ready to restore the bundled sample backup. | 7 | Pass — preview state |
| A browser replay of the bundled restore-drill demo run. | 8 | Pass — `sample-demo` |
| Use the CLI for a real restore. | 7 | Pass — clear replay/CLI distinction |
| One receipt records the evidence | 5 | Pass — heading |
| The JSON receipt records the backup, target version, checks, duration, and a signature you can verify. | 16 | F-4-1 for successful-signature verification |
| How the drill works | 4 | Pass — heading |
| Name the target. | 3 | Pass |
| Choose a Postgres version, temporary disk size, and expected schemas, extensions, roles, and tables. | 14 | Pass — `data-tmpfs-size`, `schema-readiness` |
| Restore in isolation. | 3 | Pass |
| The CLI mounts your backup read-only. | 6 | Pass — `backup-local` |
| The container has no network or published port. | 8 | Pass — `isolated-container` |
| Keep the result. | 3 | Pass |
| Pass or fail, the CLI writes a signed JSON receipt with the next step. | 14 | F-4-1 |
| Local install | 2 | Pass — eyebrow |
| Run your first real drill | 5 | Pass — heading |
| Clone the public source, build the single Rust binary, then point it at a local backup file. | 16 | Pass — `install-from-site` |
| Get the source on GitHub | 5 | Pass — destination-naming link |
| Copy install command | 3 | Pass — result-naming button |
| Copy drill command | 3 | Pass — result-naming button |
| For a larger backup, set `--data-tmpfs-size 8g` to give Postgres an 8 GB temporary disk. | 14 | Pass — `data-tmpfs-size` |
| This is not another backup service | 6 | Pass — heading |
| It does not connect to production. | 6 | Pass — `no-production-url` |
| It does not upload or retain your backup. | 8 | Pass — `backup-local`, `no-telemetry` |
| It does not replace provider recovery procedures. | 7 | Pass — plain scope limit |
| It does prove one backup against one declared target. | 9 | Pass — plain scope limit |
| Restore Drill — prove a Postgres backup restores. | 7 | Pass — footer one-liner |

### README

| Sentence or heading | Words | Result |
| --- | ---: | --- |
| Prove a Postgres backup restores before an outage. | 8 | Pass |
| Restore Drill is for teams that rely on managed Postgres backups. | 11 | Pass |
| It restores one backup into the exact disposable Postgres version you choose. | 11 | Pass — controlled runtime coverage |
| It then checks schemas, extensions, roles, and critical tables before writing a signed JSON receipt. | 15 | F-4-1 for successful receipt signing |
| The CLI is free and has no telemetry. | 8 | Pass — `free-cli`, `no-telemetry` |
| The browser demo starts a memory-only replay and shows a signed sample receipt without a second click. | 17 | Pass — `sample-demo`, `demo-no-persistence` |
| Restore Drill does not accept a database connection string. | 8 | Pass — `no-production-url` |
| It only starts a local Docker or Podman container with: | 10 | Pass — `isolated-container`, `podman-runtime` |
| The CLI does not copy or upload the backup. | 8 | Pass — `backup-local`, `no-telemetry` |
| Check your provider's terms before downloading a full backup. | 9 | Pass — instruction |
| Use a sanitized backup when your policy requires it. | 9 | Pass — instruction |
| Set `--data-tmpfs-size 8g` when Postgres needs an 8 GB temporary disk. | 10 | Pass — `data-tmpfs-size` |
| Accepted sizes range from `512m` to `64g`. | 7 | Pass — `data-tmpfs-size` |
| You need Rust 1.85 or newer and Docker or Podman. | 9 | Pass — prerequisite |
| The package starts at version `0.1.0` and builds one binary named `restore-drill`. | 11 | Pass — `install-from-site` |
| The command writes the sample backup, receipt, and signing key to a new directory under `/tmp`. | 16 | Pass — `cli-demo` |
| It prints that directory before starting the real container restore. | 10 | Pass — `cli-demo` |
| The sample creates one schema, one role, and one table. | 10 | Pass — `cli-demo`, `schema-readiness` |
| Repeat any `--expect-*` option to check more objects. | 8 | Pass — CLI help behavior |
| Use `--runtime podman` when Podman is your local container command. | 10 | Pass — `podman-runtime` |
| Plain SQL is sent to `psql`; custom, tar, and directory pg_dump archives are sent to `pg_restore`. | 15 | Pass — `dump-formats` |
| Restore Drill reads a plain SQL header before it starts the container. | 10 | Pass — `newer-version` |
| A newer source major version fails the drill. | 8 | Pass — `newer-version` |
| It also explains why `transaction_timeout` from Postgres 17 cannot restore into an older target. | 14 | Pass — `newer-version` |
| Run `restore-drill run --help` for every option. | 6 | Pass — instruction |
| Use `--json` before the subcommand for one-line machine output. | 8 | Pass — `json-output` |
| Each started drill writes a JSON receipt and signs its contents with HMAC-SHA256. | 12 | F-4-1 |
| The default signing key sits beside the receipt at `.restore-drill-signing.key` with mode `0600` on Unix. | 15 | Pass — `default-signing-key` |
| Set `--signing-key ./private/drill.key` to keep one stable key. | 9 | Pass — instruction |
| Store that key separately from published receipts. | 7 | Pass — instruction |
| An HMAC proves the receipt still matches your local key; it is not a third-party signature. | 15 | F-4-1 for successful-receipt verification |
| Every check passed. | 3 | Pass — exit-code table |
| The restore or a compatibility check failed. | 7 | Pass — exit-code table |
| The drill could not run because of configuration or runtime trouble. | 10 | Pass — exit-code table |
| The CLI never prompts, so it can run in CI. | 9 | Pass — `ci-mode` |
| `npm test` runs unit tests and every claim test. | 9 | Pass |
| It checks routes at 390 px and scans pages with axe. | 11 | Pass |
| `npm run build` creates the release binary and the static site in `dist/site/`. | 12 | Pass |
| The factory deploys `dist/site/`. | 5 | Pass |
| To check the Rust release package without publishing it: | 9 | Pass — lead-in |
| Registry credentials belong to the factory. | 5 | Pass |
| Do not publish from a development checkout. | 7 | Pass — instruction |
| Restore Drill does not store backups, host databases, or restore production. | 10 | Pass — scope limit |
| A passing receipt covers one backup, target version, and declared set of checks. | 13 | Pass — scope limit |
| Keep testing your provider's full recovery procedure. | 7 | Pass — instruction |
| MIT. | 1 | Pass — license marker |
| See LICENSE. | 2 | Pass — link instruction |

The README list fragments are: “no container network” (3), “no published port” (3), “a read-only backup mount” (4), and “database storage on a temporary memory disk (a 2 GB tmpfs mount by default)” (14). `tmpfs` is defined in that final fragment.

## Demo and sandbox verification

- A fresh 390 px landing context reaches `/?demo=1` in one click.
- Within the first demo viewport, the replay shows **PASS**, a signed sample receipt, source/target versions, `restore_ready`, `restore_reader`, `public.restore_probe`, and **Signature verified**. This is realistic bundled sample data, not placeholder text.
- The persistent **Demo — sample data, nothing is saved** banner, **Reset demo**, and **Start for real** controls were visible. Reset immediately started a clean replay; reload did the same.
- Before reset, after reset, and after reload, `localStorage`, `sessionStorage`, IndexedDB, and OPFS entries were empty. The request interception recorded only `https://restore-compatibility-drill.sociobot.in`.
- The real `restore-drill demo --postgres 15 --output-dir <temp>` command was exercised in a new temporary directory. In this worker it correctly copied `sample-backup.sql`, wrote a receipt and signing key, then returned the actionable runtime error and exit `3` because Docker/Podman is absent. It did not touch the bundled sample.
- The clean-clone offline Playwright test passed after service-worker activation.

## Claims and clean-clone verification

A fresh public clone at `d76174a32e71a73a6a60ceb8e3e8963ea14964a2` was installed with `npm ci`. Every exact command in `.factory/claims.json` was run separately and passed: `sample-demo`, `browser-privacy`, `demo-no-persistence`, `install-from-site`, `free-cli`, `isolated-container`, `data-tmpfs-size`, `backup-local`, `newer-version`, `signed-receipt`, `default-signing-key`, `schema-readiness`, `cli-demo`, `podman-runtime`, `dump-formats`, `json-output`, `ci-mode`, `no-production-url`, and `no-telemetry`.

`npm test` then passed all 32 tests locally, and `PLAYWRIGHT_BASE_URL=https://restore-compatibility-drill.sociobot.in npm test` passed all 32 tests against production. `npm run build` passed and produced `target/release/restore-drill` and `dist/site`. The live JavaScript and CSS SHA-256 values matched the clean-clone production build.

No claim-like landing or README sentence lacks a relevant manifest entry. F-4-1 is not an unlisted claim: it is incomplete observable coverage for the existing `signed-receipt` entry.

## Earlier finding regression check

Every earlier review, polish report, verification report, and handoff was read. The following checks confirmed actual closure on the live site and in the current code:

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 public install path | Live install section links the public GitHub source and shows clone plus locked install; `install-from-site` passed from the fresh clone. |
| F-1-2 demo persistence | Live reset/reload left all browser stores empty; `demo-no-persistence` passed. |
| F-1-3 “without Docker” unlisted claim | The action outcome is now the literal browser-replay description and is covered by `sample-demo`. |
| F-1-4 overlong README sentence | The development instructions remain split; all audited prose is at most 22 words. |
| F-1-5 unexplained tmpfs | README defines it as a temporary memory disk. |
| F-1-6 ambiguous Copy buttons | The visible controls name **Copy install command** and **Copy drill command**. |
| F-2-1 schema readiness | `--expect-schema`, receipt checks, sample schema, and both controlled pass/fail cases are present. |
| F-2-2 fixed 2 GB disk | Bounded `--data-tmpfs-size` reaches the runtime and receipt; 8 GB is documented. |
| F-2-3 CLI demo claim | The CLI demo has its own claim and controlled-real-run test. |
| F-2-4 default signing key | Adjacent key and Unix `0600` behavior have a separate passing claim test. |
| F-2-5 Podman | A controlled executable literally named `podman` verifies the documented isolation arguments. |
| F-3-1 idle one-click demo | The cold one-click demo now begins automatically with completed sample proof in the first phone viewport. |
| F-3-2 dump-format coverage | Plain SQL, custom, tar, and directory fixtures are all tested. |
| F-3-3 JSON output | The one-line JSON behavior is manifest-listed and tested for pass, fail, and startup error. |
| F-3-4 duplicate demo canonical | `/demo` normalizes to `/?demo=1`; the sitemap lists only that canonical. |
| F-3-5 landing HMAC jargon | The landing says “a signature you can verify”; `HMAC` remains only in the technical README signing explanation. |
| F-3-6 clipped desktop fact | All three facts fit at 1440×900 in the fresh context. |
| Verification P0 unavailable checkout | The CLI is visibly free; no checkout or billing request/link is present. |
| Verification P2 mutable assets | The current fingerprinted JS and CSS return `Cache-Control: public, max-age=31536000, immutable`. |

## Structure, accessibility, and links

- Every checked route has a route-specific title, one h1, plain meta description, canonical, Open Graph/Twitter metadata, favicon, apple touch icon, `lang="en"`, header, footer, Privacy, and Terms.
- `/demo` deep-links and normalizes to `/?demo=1`. Browser history returns to the previous route and focuses the route h1. The skip link focuses `main`.
- An unknown path returned HTTP 404 and rendered the designed paper/press-style “This page was not restored” screen with a home link. Chromium reports the expected document-404 resource message for this true 404; no application exception occurred.
- Crawled internal routes, the public GitHub source link, and the Param Factory link all returned 200. Fragment links resolve on home.
- The six-route Axe suite passed with no serious or critical violations. Phone controls meet the 44 px baseline, reduced motion and offline demo reload pass, and the page has no horizontal overflow at 390 px.
- The warm paper, riso red/blue/yellow ink, original press art, clipped notes, stamp actions, and terminal card visibly match `.factory/design.md`; this is not a generic SaaS template.

## Missed leverage

No additional AI feature is expected. Compatibility checking is deterministic, and an AI interpretation would weaken the evidence trail. The brief’s obvious operational requirements—isolated restore, target selection, schema/extension/role/table checks, signed JSON receipts, CLI-safe JSON output, Podman support, and a repeatable sample—are present. No decorative AI feature or embedded provider key was found.

## What would make this perfect

Make the `signed-receipt` claim test prove and verify a successful receipt as well as its existing preflight-failure receipt and tamper rejection. Then rerun every declared claim command from a fresh clone and this full first-read review. With that single closure, no remaining finding is identified.
