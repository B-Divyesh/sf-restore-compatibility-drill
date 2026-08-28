# Adversarial first-read review 1 — FAIL

**Reviewed:** 2026-08-28

**Live URL:** <https://restore-compatibility-drill.sociobot.in>
**Commit reviewed:** `e4b2766a0eafa1494fb977a6fd29166d0a147241`

## Verdict

**FAIL.** The product is clear and its browser replay is tryable, but a first-time visitor cannot obtain or install the real CLI from the live site. The sole published install command only works inside an already-cloned source checkout, which the site does not link to or explain. There are also unlisted privacy/demo claims and copy-rule failures below. `PASS` requires zero findings.

## Findings

### F-1-1 — BLOCKING — the real CLI has no usable public install path

**Location / exact quote:** landing section **Run your first real drill**: “Build the single Rust binary, then point it at a local backup file.” The only command is `cargo install --path .`. The live page has no source-repository, release-download, or package-registry link. README **Install** repeats `cargo install --path .` without a clone/download instruction.

**Verification:** from a new empty temporary directory, running the exact published command returned exit `101` and `error: ... does not contain a Cargo.toml file. --path must point to a directory containing a Cargo.toml file.` The command succeeds only after a visitor already has this repository. The browser demo is honestly labelled a replay and therefore does not remedy the missing real-product handoff.

**Why this fails first use:** a visitor can understand and try the replay, but cannot proceed to the advertised real drill. This fails the end-to-end CLI job rather than merely a documentation preference.

**Concrete fix:** publish a real acquisition route. For example, add a visible **Get the source** link to the public repository and replace the instructions with:

```sh
git clone https://github.com/B-Divyesh/sf-restore-compatibility-drill.git
cd sf-restore-compatibility-drill
cargo install --path .
```

Alternatively provide a signed release binary or a published crate and use its install command. Add `@claim:install-from-site`, starting in a fresh temporary directory, that follows the published link/instructions and reaches `restore-drill --help`.

### F-1-2 — P1 — demo “nothing is saved” assurance is unlisted and lacks its required storage test

**Location / exact quote:** `/demo` says “This replay uses the backup bundled with the CLI. It does not read or save your files.” The persistent banner says “Demo — sample data, nothing is saved.” Privacy says “The browser demo stores no sample data. Its replay state disappears on reload.”

**Verification:** `.factory/claims.json` has `browser-privacy`, but its claim is only “The browser demo sends no sample data off-site” and its test only records request origins. It does not assert localStorage, sessionStorage, IndexedDB, OPFS, or that reset/reload discards replay state. Manual live inspection found localStorage and sessionStorage empty and Reset returned to the untouched frame, but that is not a registered, repeatable claim test.

**Why this matters:** visitors are asked to rely on a privacy boundary that the claims contract does not exercise. A later storage regression would pass every declared claim test.

**Concrete fix:** add a `demo-no-persistence` claims entry and a clean-context Playwright test that runs the demo, invokes Reset, reloads, and asserts that no demo key/data exists in localStorage, sessionStorage, IndexedDB, or OPFS. If the intended promise is only about user files, rewrite the copy to “This page is a recorded browser replay; it has no file picker.”

### F-1-3 — P2 — “without Docker” is an unlisted claim

**Location / exact quote:** the first-screen action outcome says “See a complete drill without Docker.”

**Verification:** no `.factory/claims.json` entry names or tests the absence of a Docker requirement for the browser demo. `sample-demo` proves a pass replay, not this stated constraint.

**Why this matters:** it is a decision-making claim beside the primary action. The claim policy requires a manifest entry and observable test, or its removal.

**Concrete fix:** either change the outcome to “Open a browser replay of the sample drill.” (covered by `sample-demo`) or add a `browser-demo-no-docker` claim whose isolated browser test loads and completes `/demo` with no container/runtime interaction.

### F-1-4 — P2 — README sentence exceeds the 22-word hard limit

**Location / exact quote:** README **Develop and verify**: “`npm test` runs Rust unit tests, builds the site, runs every claim test, checks routes at 390 px, and scans every page with axe.”

**Verification:** 23 words.

**Why this matters:** it bundles five separate outcomes and is harder to scan in the first-read documentation.

**Concrete fix:** “`npm test` runs unit tests and every claim test. It checks routes at 390 px and scans pages with axe.”

### F-1-5 — P2 — README leaves `tmpfs` unexplained

**Location / exact quote:** README **Safety boundary**: “database storage on a 2 GB tmpfs mount.”

**Verification:** `tmpfs` is not defined in the README. It is relevant to the safety boundary, not an incidental implementation detail.

**Why this matters:** a backup owner who is not a container specialist cannot tell whether database data is persistent or where the stated memory limit applies.

**Concrete fix:** “database storage on a temporary memory disk (a 2 GB tmpfs mount).”

### F-1-6 — P2 — visible copy controls do not name what they copy

**Location / exact quote:** landing **Run your first real drill** has two visible buttons labelled “Copy”.

**Verification:** their accessible names are better (`Copy install command` and `Copy drill command`), but the visible labels do not distinguish the result. This does not meet the result-naming button rule for sighted visitors.

**Why this matters:** at a glance, the two controls are indistinguishable, especially when a visitor returns to copy the second command.

**Concrete fix:** label them **Copy install command** and **Copy drill command** visibly.

## Cold first-read result

Fresh contexts were opened at 390×844 and 1440×900 before scrolling.

| Question | What a first-time visitor can answer from the first screen |
| --- | --- |
| What does it do? | It proves a Postgres backup restores. Exact headline: “Prove your Postgres backup restores”. |
| For whom? | Teams needing “a recovery answer before an outage, not during one.” |
| What should I click first? | **Try it with sample data**; its adjacent outcome is “See a complete drill without Docker.” |

The first-read requirement passes at both viewports: the CTA and all three product facts are visible at 390 px, there is no horizontal overflow, and no console/page errors were recorded. This does not offset F-1-1.

## Copy audit

Counts treat hyphenated terms, commands, and version tokens as one word. The inventory includes visible landing/README prose; command examples, JSON output, navigation labels, and table values are separately assessed as code/labels rather than sentences. No banned marketing adjective was found. F-1-4 through F-1-6 are the flags from this audit.

### Landing page sentences

| Copy | Words | Result |
| --- | ---: | --- |
| A recovery check you can keep | 6 | Pass |
| Prove your Postgres backup restores | 5 | Pass |
| For teams that need a recovery answer before an outage, not during one. | 13 | Pass |
| See a complete drill without Docker. | 6 | F-1-3: unlisted claim |
| Runs Postgres in a disposable local container. | 7 | Pass |
| Keeps your backup on your machine. | 6 | Pass |
| The CLI is free and writes signed JSON receipts. | 9 | Pass |
| A risograph database press turns backup pages into a checked and sealed restore receipt. | 14 | Pass (image alt) |
| Rehearse the restore. | 3 | Pass |
| Keep the receipt. | 3 | Pass |
| Sample restore drill | 3 | Pass |
| Ready to restore the bundled sample backup. | 7 | Pass |
| Try it with sample data | 5 | Pass |
| A browser replay of the bundled restore-drill demo run. | 7 | Pass |
| Use the CLI for a real restore. | 7 | Pass |
| One receipt records the evidence | 5 | Pass |
| The JSON receipt includes the backup hash, target version, checks, duration, and HMAC signature. | 14 | Pass |
| How the drill works | 4 | Pass |
| Name the target. | 3 | Pass |
| Choose an exact Postgres version and expected extensions, roles, and tables. | 11 | Pass |
| Restore in isolation. | 3 | Pass |
| The CLI mounts your backup read-only. | 6 | Pass |
| The container has no network or published port. | 8 | Pass |
| Keep the result. | 3 | Pass |
| Pass or fail, the CLI writes a signed JSON receipt with the next step. | 14 | Pass |
| Run your first real drill | 5 | Pass, but F-1-1 blocks the route to it |
| Build the single Rust binary, then point it at a local backup file. | 13 | F-1-1 |
| This is not another backup service | 6 | Pass |
| It does not connect to production. | 6 | Pass |
| It does not upload or retain your backup. | 8 | Pass |
| It does not replace provider recovery procedures. | 7 | Pass |
| It does prove one backup against one declared target. | 9 | Pass |
| Restore Drill — prove a Postgres backup restores. | 7 | Pass (footer) |

Visible action labels are **Try it with sample data** (result-naming) and two **Copy** controls (F-1-6). Headings are understandable in context; the product-specific risograph wording is decorative only, not the sole explanation of a task.

### README sentences

| Copy | Words | Result |
| --- | ---: | --- |
| Prove a Postgres backup restores before an outage. | 8 | Pass |
| Restore Drill is for teams that rely on managed Postgres backups. | 11 | Pass |
| It restores one backup into the exact disposable Postgres version you choose. | 11 | Pass |
| It then checks extensions, roles, and critical tables before writing a signed JSON receipt. | 14 | Pass |
| The CLI is free and has no telemetry. | 8 | Pass |
| Restore Drill does not accept a database connection string. | 8 | Pass |
| It only starts a local Docker or Podman container with: | 10 | Pass |
| no container network | 3 | Pass (list fragment) |
| no published port | 3 | Pass (list fragment) |
| a read-only backup mount | 4 | Pass (list fragment) |
| database storage on a 2 GB tmpfs mount | 9 | F-1-5 jargon |
| The CLI does not copy or upload the backup. | 8 | Pass |
| Check your provider's terms before downloading a full backup. | 9 | Pass |
| Use a sanitized backup when your policy requires it. | 9 | Pass |
| Large backups may need more memory than the default tmpfs limit. | 10 | F-1-5 jargon |
| You need Rust 1.85 or newer and Docker or Podman. | 9 | Pass |
| The package starts at version `0.1.0` and builds one binary named `restore-drill`. | 11 | Pass |
| The command writes the sample backup, receipt, and signing key to a new directory under `/tmp`. | 16 | Pass |
| It prints that directory before starting the real container restore. | 10 | Pass |
| The sample creates one role and one table. | 8 | Pass |
| Repeat any `--expect-*` option to check more objects. | 8 | Pass |
| Use `--runtime podman` when Podman is your local container command. | 10 | Pass |
| Plain SQL is sent to `psql`; custom, tar, and directory pg_dump archives are sent to `pg_restore`. | 15 | Pass for the CLI audience |
| Restore Drill reads a plain SQL header before it starts the container. | 10 | Pass |
| A newer source major version fails the drill. | 8 | Pass |
| It also explains why `transaction_timeout` from Postgres 17 cannot restore into an older target. | 14 | Pass |
| Run `restore-drill run --help` for every option. | 6 | Pass |
| Use `--json` before the subcommand for one-line machine output. | 8 | Pass |
| Each started drill writes a JSON receipt and signs its contents with HMAC-SHA256. | 12 | Pass; HMAC is defined below |
| The default signing key sits beside the receipt at `.restore-drill-signing.key` with mode `0600` on Unix. | 15 | Pass |
| Set `--signing-key ./private/drill.key` to keep one stable key. | 9 | Pass |
| Store that key separately from published receipts. | 7 | Pass |
| An HMAC proves the receipt still matches your local key; it is not a third-party signature. | 15 | Pass |
| Every check passed. | 3 | Pass (exit-code meaning) |
| The restore or a compatibility check failed. | 7 | Pass (exit-code meaning) |
| The drill could not run because of configuration or runtime trouble. | 10 | Pass (exit-code meaning) |
| The CLI never prompts, so it can run in CI. | 9 | Pass |
| `npm test` runs Rust unit tests, builds the site, runs every claim test, checks routes at 390 px, and scans every page with axe. | 23 | F-1-4 |
| `npm run build` creates the release binary and the static site in `dist/site/`. | 12 | Pass |
| The factory deploys `dist/site/`. | 5 | Pass |
| To check the Rust release package without publishing it: | 9 | Pass (lead-in) |
| Registry credentials belong to the factory. | 5 | Pass |
| Do not publish from a development checkout. | 7 | Pass |
| Restore Drill does not store backups, host databases, or restore production. | 10 | Pass |
| A passing receipt covers one backup, target version, and declared set of checks. | 13 | Pass |
| Keep testing your provider's full recovery procedure. | 7 | Pass |
| MIT. | 1 | Pass |
| See LICENSE. | 2 | Pass |

Terminology is otherwise consistent: **backup**, **drill**, **target**, **receipt**, and **demo** retain one meaning.

## Demo and sandbox verification

- The hero reaches `/demo` in one click. The first demo screen already shows the bundled Postgres 15.8 sample, expected role/table/extension, and a runnable restore replay.
- The persistent banner, **Reset demo**, and **Start for real** were present. Completing the demo produced `PASS in 4.7s`; Reset restored “Ready to restore the bundled sample backup.”
- In a fresh live context, the complete flow requested only `https://restore-compatibility-drill.sociobot.in`; localStorage and sessionStorage remained empty. After service-worker installation, `/demo` reloaded while offline. These observed results support the product but do not replace F-1-2's required manifest/test coverage.
- `restore-drill demo --postgres 15` was run from a temporary directory. It printed `/tmp/restore-drill-demo-…`, receipt/key paths, and an actionable error because neither `docker` nor `podman` exists in this worker (exit 3). This is an environment limitation; the controlled-runtime claim tests cover the real orchestration arguments.

## Claims verification

`.factory/claims.json` contains 11 entries. Every exact listed command was run independently from a fresh clone at `e4b2766`; all passed. The subsequent clean-clone `npm test` passed 4 Rust tests and 18 Playwright tests, and `npm run build` produced the release binary and `dist/site/`.

| Claim | Result |
| --- | --- |
| `sample-demo` | Pass |
| `browser-privacy` | Pass |
| `free-cli` | Pass |
| `isolated-container` | Pass |
| `backup-local` | Pass |
| `newer-version` | Pass |
| `signed-receipt` | Pass |
| `dump-formats` | Pass |
| `ci-mode` | Pass |
| `no-production-url` | Pass |
| `no-telemetry` | Pass |

The claim test results do not remove F-1-2 or F-1-3: those visitor-facing statements have no matching manifest entry.

## History check

Read `.factory/verification.md`, `.factory/verification-2.md`, and the prior `.factory/handoff.md`; there are no earlier `review-*` or `polish-*` files.

| Earlier finding | Live and code confirmation |
| --- | --- |
| Paid Team Kit checkout was unavailable (P0) | Fixed. The live page calls the CLI free, contains no Team Kit/checkout link, and makes no Sociobot billing request. |
| Fingerprinted static assets were not immutable (P2) | Fixed. Live `assets/restore-press-BTJzVAyz.webp` returned `Cache-Control: public, max-age=31536000, immutable`; the source configuration contains the matching `/assets/*` rule. |

No earlier finding regressed. F-1-1 is a newly observed real-use gap, not a reappearance of the removed purchase flow.

## Structure, accessibility, and identity checks

- `/`, `/demo`, `/privacy`, `/terms`, and `/missing-page` loaded directly with a single `h1` and `main`; titles, canonical URLs, Open Graph image, favicon, and meta description were present. Navigation/back restored the new heading focus in the local automated test. All crawled internal links and the Param Factory link returned 200.
- The designed client-side 404 is visually product-specific and provides **Return home**. The static fallback serves it as HTTP 200, so no broken link was observed in the intended SPA routing.
- Browser console/page errors: none. Existing axe coverage passed serious/critical scans for all five routes. The skip link and 390 px no-overflow checks passed in the clean suite.
- The warm paper, offset ink layers, original risograph hero art, press-like terminal, and misprint 404 follow `.factory/design.md` and are recognisably distinct from a generic SaaS template.
- No AI feature is present. The brief is a local restore verifier, so an AI feature would be decorative rather than expected. The actual missing leverage is the ordinary acquisition/install path in F-1-1.

## What would make this perfect

Publish and link a real installation path, add tests for each explicit demo privacy/runtime assurance (or remove the assurances), and make the three minor copy changes in F-1-4 through F-1-6. Then rerun this entire review from a fresh clone and a cold live browser context.
