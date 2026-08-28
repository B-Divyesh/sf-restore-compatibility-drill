# Adversarial first-read review 2 — FAIL

**Reviewed:** 2026-08-28  
**Live URL:** <https://restore-compatibility-drill.sociobot.in>  
**Source reviewed:** `7330c4731fee4b481160137fd7620e66a71816cd`

## Verdict

**FAIL.** The landing page is clear, the browser replay is immediate and isolated, the public installation route works, and all declared claim tests pass. However, the core CLI does not explicitly check schema readiness required by the brief, cannot be configured for backups larger than its fixed 2 GB database disk, and several visitor-facing CLI assurances have no matching claim entry. `PASS` requires zero findings.

## Findings

### F-2-1 — BLOCKING — the CLI does not check schema readiness named in the product brief

**Location / exact evidence:** `.factory/brief.json` defines the smallest useful product as one that “checks extensions/roles/schema readiness”. The live landing page says “Choose an exact Postgres version and expected extensions, roles, and tables.” The `run` command exposes `--expect-extension`, `--expect-role`, and `--expect-table`, but no `--expect-schema`. `src/main.rs` queries `pg_extension`, `pg_roles`, and `pg_tables`; it never queries `pg_namespace`.

**Why this matters:** a table check only proves schemas that happen to contain a selected table. A team cannot declare that an empty-but-required schema exists, or receive a distinct schema-readiness failure. This leaves part of the stated recovery compatibility job unverified.

**Concrete fix:** add repeatable `--expect-schema <name>`, query `pg_namespace` after restore, include schema checks in the receipt and bundled sample, and add a `schema-readiness` claims entry with a tagged controlled-runtime test for both pass and missing-schema outcomes.

### F-2-2 — P1 — backups above the fixed 2 GB database disk have no usable path

**Location / exact quote:** README, **Safety boundary**: “Large backups may need more than the temporary disk's 2 GB limit.” Source: `Container::start` hard-codes `--tmpfs /var/lib/postgresql/data:rw,noexec,nosuid,size=2g`; neither `run --help` nor `demo --help` offers a size option.

**Why this matters:** the warning tells a recovery team about a likely failure but gives no way to run its legitimate large backup. The brief explicitly calls out large-data cost. A compatibility drill that cannot be sized for the backup in hand is incomplete for that common case.

**Concrete fix:** add a bounded `--data-tmpfs-size` option (default `2g`), show the selected limit in the receipt, document a sizing example, and add a claim test that asserts the selected value reaches the container runtime. If the intended product limit is truly 2 GB, state that as a hard supported limit rather than suggesting the user can meet a larger requirement.

### F-2-3 — P2 — the real CLI demo behaviour is an unlisted claim

**Location / exact quote:** README, **Try the bundled backup**: “The command writes the sample backup, receipt, and signing key to a new directory under `/tmp`.” `.factory/demo.md` also says “The CLI demo performs the real container restore with the same bundled sample.”

**Verification:** `.factory/claims.json` has `sample-demo`, but its claim and tagged test exercise only the **browser** replay. No claim says that `restore-drill demo` writes its files, uses the bundled sample, or performs the real run. Manual execution from a temporary directory printed an output directory and receipt/key paths; it then returned exit `3` with the documented actionable Docker/Podman error because neither runtime is installed in this sandbox. That observation is not a repeatable claim test.

**Why this matters:** the browser replay is explicitly not the real restore. Visitors who rely on the documented CLI demo need the main sample path to be covered independently.

**Concrete fix:** add `cli-demo` to `claims.json` and a tagged test that invokes `restore-drill demo --output-dir <temp>` with the controlled runtime, asserts the copied sample, pass receipt, signing key, and expected checks, then verifies the source sample remains unchanged.

### F-2-4 — P2 — the advertised default signing-key location and permissions are unlisted

**Location / exact quote:** README, **Receipt signing**: “The default signing key sits beside the receipt at `.restore-drill-signing.key` with mode `0600` on Unix.”

**Verification:** `signed-receipt` creates and verifies a receipt only with an explicitly supplied key path. The four Rust unit tests do not cover `sibling_key_path` or the Unix mode. No `claims.json` entry covers this visitor-facing storage/security assurance.

**Why this matters:** the claim tells an operator where a secret exists and what protects it. A regression here could expose or lose the key while every declared test still passes.

**Concrete fix:** add a `default-signing-key` claim and tagged Unix test that omits `--signing-key`, checks the adjacent filename and `0600` mode, and verifies the receipt with that key. If portability prevents the permission guarantee, qualify the copy by platform and document the alternative.

### F-2-5 — P2 — documented Podman support is unlisted and not exercised

**Location / exact quote:** README, **Run a real drill**: “Use `--runtime podman` when Podman is your local container command.”

**Verification:** no manifest entry names Podman. The controlled-runtime tests use an executable named `fake-docker`; they do not exercise the documented `podman` selection.

**Why this matters:** Docker and Podman differ enough in local environments that this is an operational compatibility assertion, not merely a command spelling note.

**Concrete fix:** add a `podman-runtime` claim and test the real binary with a controlled executable named `podman`, asserting the same no-network, no-port, tmpfs, and read-only-mount arguments.

## Cold first-read result

Fresh Chromium contexts opened `/` at 390×844 and 1440×900 before scrolling. No console or page errors occurred; the mobile page had no horizontal overflow.

| Question | First-screen answer |
| --- | --- |
| What does it do? | “Prove your Postgres backup restores.” |
| For whom? | “For teams that need a recovery answer before an outage, not during one.” |
| What should I click first? | **Try it with sample data**; the adjacent text says “Open a browser replay of the sample drill.” |

The first-read requirement passes. The headline has five words, the audience sentence has 13, and the primary action plus all three facts are visible at 390 px.

## Copy audit

Counts treat hyphenated terms, commands, and version tokens as one word. The inventory covers every prose sentence and sentence-like heading on the landing page and README. Navigation labels, command/JSON examples, and table cell values are listed separately because they are not sentences. No sentence exceeds 22 words. No banned marketing adjective was found. `tmpfs`, HMAC, and `pg_dump` are technical terms, but their nearby audience/context or definitions make them acceptable here. The remaining claim-coverage flags are F-2-3 through F-2-5.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| A recovery check you can keep | 6 | Pass |
| Prove your Postgres backup restores | 5 | Pass |
| For teams that need a recovery answer before an outage, not during one. | 13 | Pass |
| Try it with sample data | 5 | Pass — result-naming action |
| Open a browser replay of the sample drill. | 8 | Pass — `sample-demo` |
| Runs Postgres in a disposable local container. | 7 | Pass — `isolated-container` |
| Keeps your backup on your machine. | 6 | Pass — `backup-local` |
| The CLI is free and writes signed JSON receipts. | 9 | Pass — `free-cli`, `signed-receipt` |
| A risograph database press turns backup pages into a checked and sealed restore receipt. | 14 | Pass — image alt text |
| Rehearse the restore. | 3 | Pass |
| Keep the receipt. | 3 | Pass |
| Sample restore drill | 3 | Pass |
| Ready to restore the bundled sample backup. | 7 | Pass |
| A browser replay of the bundled restore-drill demo run. | 8 | Pass — `sample-demo` |
| Use the CLI for a real restore. | 7 | F-2-3: CLI demo/real-run evidence is not independently claimed |
| One receipt records the evidence | 5 | Pass |
| The JSON receipt includes the backup hash, target version, checks, duration, and HMAC signature. | 14 | Pass — `signed-receipt` |
| How the drill works | 4 | Pass |
| Name the target. | 3 | Pass |
| Choose an exact Postgres version and expected extensions, roles, and tables. | 11 | F-2-1: schema expectation is absent |
| Restore in isolation. | 3 | Pass |
| The CLI mounts your backup read-only. | 6 | Pass — `backup-local` |
| The container has no network or published port. | 8 | Pass — `isolated-container` |
| Keep the result. | 3 | Pass |
| Pass or fail, the CLI writes a signed JSON receipt with the next step. | 14 | Pass — `signed-receipt` |
| Local install | 2 | Pass |
| Run your first real drill | 5 | Pass |
| Clone the public source, build the single Rust binary, then point it at a local backup file. | 16 | Pass — `install-from-site` |
| Get the source on GitHub | 5 | Pass — destination-naming link |
| Copy install command | 3 | Pass — result-naming button |
| Copy drill command | 3 | Pass — result-naming button |
| This is not another backup service | 6 | Pass |
| It does not connect to production. | 5 | Pass — `no-production-url` |
| It does not upload or retain your backup. | 8 | Pass — `backup-local` |
| It does not replace provider recovery procedures. | 7 | Pass — scope limitation |
| It does prove one backup against one declared target. | 9 | Pass — scope limitation |
| Restore Drill — prove a Postgres backup restores. | 7 | Pass |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Prove a Postgres backup restores before an outage. | 8 | Pass |
| Restore Drill is for teams that rely on managed Postgres backups. | 11 | Pass |
| It restores one backup into the exact disposable Postgres version you choose. | 11 | Pass — controlled-runtime coverage |
| It then checks extensions, roles, and critical tables before writing a signed JSON receipt. | 14 | F-2-1: schema remains uncheckable |
| The CLI is free and has no telemetry. | 8 | Pass — `free-cli`, `no-telemetry` |
| Restore Drill does not accept a database connection string. | 8 | Pass — `no-production-url` |
| It only starts a local Docker or Podman container with: | 10 | Pass — isolation boundary; Podman detail is F-2-5 |
| The CLI does not copy or upload the backup. | 8 | Pass — `backup-local` |
| Check your provider's terms before downloading a full backup. | 9 | Pass — advice |
| Use a sanitized backup when your policy requires it. | 9 | Pass — advice |
| Large backups may need more than the temporary disk's 2 GB limit. | 11 | F-2-2 |
| You need Rust 1.85 or newer and Docker or Podman. | 9 | Pass — install prerequisite |
| The package starts at version `0.1.0` and builds one binary named `restore-drill`. | 11 | Pass — `install-from-site` |
| The command writes the sample backup, receipt, and signing key to a new directory under `/tmp`. | 16 | F-2-3 |
| It prints that directory before starting the real container restore. | 10 | F-2-3 |
| The sample creates one role and one table. | 8 | F-2-3 |
| Repeat any `--expect-*` option to check more objects. | 8 | Pass — CLI option behavior |
| Use `--runtime podman` when Podman is your local container command. | 10 | F-2-5 |
| Plain SQL is sent to `psql`; custom, tar, and directory pg_dump archives are sent to `pg_restore`. | 15 | Pass — `dump-formats` |
| Restore Drill reads a plain SQL header before it starts the container. | 10 | Pass — `newer-version` |
| A newer source major version fails the drill. | 8 | Pass — `newer-version` |
| It also explains why `transaction_timeout` from Postgres 17 cannot restore into an older target. | 14 | Pass — `newer-version` |
| Run `restore-drill run --help` for every option. | 6 | Pass — instruction |
| Use `--json` before the subcommand for one-line machine output. | 8 | Pass — instruction |
| Each started drill writes a JSON receipt and signs its contents with HMAC-SHA256. | 12 | Pass — `signed-receipt` |
| The default signing key sits beside the receipt at `.restore-drill-signing.key` with mode `0600` on Unix. | 15 | F-2-4 |
| Set `--signing-key ./private/drill.key` to keep one stable key. | 9 | Pass — instruction |
| Store that key separately from published receipts. | 7 | Pass — advice |
| An HMAC proves the receipt still matches your local key; it is not a third-party signature. | 15 | Pass — `signed-receipt` |
| Every check passed. | 3 | Pass — exit-code table |
| The restore or a compatibility check failed. | 7 | Pass — exit-code table |
| The drill could not run because of configuration or runtime trouble. | 10 | Pass — exit-code table |
| The CLI never prompts, so it can run in CI. | 9 | Pass — `ci-mode` |
| `npm test` runs unit tests and every claim test. | 9 | Pass |
| It checks routes at 390 px and scans pages with axe. | 11 | Pass |
| `npm run build` creates the release binary and the static site in `dist/site/`. | 12 | Pass |
| The factory deploys `dist/site/`. | 5 | Pass |
| To check the Rust release package without publishing it: | 9 | Pass — lead-in |
| Registry credentials belong to the factory. | 5 | Pass — policy |
| Do not publish from a development checkout. | 7 | Pass — instruction |
| Restore Drill does not store backups, host databases, or restore production. | 10 | Pass — scope limitation |
| A passing receipt covers one backup, target version, and declared set of checks. | 13 | Pass — scope limitation |
| Keep testing your provider's full recovery procedure. | 7 | Pass — advice |
| MIT. | 1 | Pass |
| See LICENSE. | 2 | Pass |

The non-sentence list fragments are: “no container network” (3), “no published port” (3), “a read-only backup mount” (4), and “database storage on a temporary memory disk (a 2 GB tmpfs mount)” (12). Buttons and links are result-naming or unambiguous in their navigation context; no generic “Copy” button remains.

## Demo and sandbox verification

- The landing CTA reaches `/?demo=1` in one click. Before running it, the page already displays an actual bundled Postgres 15.8 sample, target, extension, role, and table.
- The persistent banner says **Demo — sample data, nothing is saved** and includes **Reset demo** plus **Start for real**. After the run showed `PASS in 4.7s`, Reset restored “Ready to restore the bundled sample backup.”
- In a fresh 390 px context, the complete browser flow used only `https://restore-compatibility-drill.sociobot.in`. `localStorage` and `sessionStorage` stayed empty before and after the run. The declared persistence test additionally checks IndexedDB and OPFS.
- The service-worker test in the passing suite loads `/demo`, waits for activation, goes offline, reloads, and sees the demo heading.
- `restore-drill demo --postgres 15` was run from a temporary working directory. It printed a separate `/tmp/restore-drill-demo-*` path and receipt/key paths. It returned the documented exit `3` with “Start Docker or Podman” because no container runtime exists in this sandbox. F-2-3 records the missing repeatable claim coverage for the successful runtime path.

## Claims verification

Every exact command in `.factory/claims.json` ran from a new local clone at `/tmp/restore-drill-review-2.kyF2F1/repo`; all 13 passed. The subsequent root `npm test` passed 4 Rust unit tests and 23 Playwright tests; `npm run build` produced `dist/site/`; `cargo fmt --check` passed.

| Claim | Result |
| --- | --- |
| `sample-demo` | Pass |
| `browser-privacy` | Pass |
| `demo-no-persistence` | Pass |
| `install-from-site` | Pass |
| `free-cli` | Pass |
| `isolated-container` | Pass |
| `backup-local` | Pass |
| `newer-version` | Pass |
| `signed-receipt` | Pass |
| `dump-formats` | Pass |
| `ci-mode` | Pass |
| `no-production-url` | Pass |
| `no-telemetry` | Pass |

The public acquisition route was also checked independently: a fresh clone from the GitHub URL displayed on the landing page installed successfully with `cargo install --path . --locked`, and `restore-drill --help` exposed `run`, `demo`, and `verify-receipt`.

## History check

Read `.factory/review-1.md`, `.factory/polish-1.md`, `.factory/verification.md`, `.factory/verification-2.md`, and the preceding handoff. Each earlier review finding is actually closed in the live product and source.

| Earlier finding | Live/code confirmation |
| --- | --- |
| F-1-1 — usable install path | Fixed: visible GitHub link, complete clone/install command, fresh public clone/install succeeds. |
| F-1-2 — demo persistence evidence | Fixed: `demo-no-persistence` claim and test reset/reload all browser stores. |
| F-1-3 — “without Docker” unlisted claim | Fixed: CTA now says “Open a browser replay of the sample drill.” |
| F-1-4 — overlong README sentence | Fixed: split into 9- and 11-word sentences. |
| F-1-5 — unexplained tmpfs | Fixed: README defines it as a temporary memory disk. |
| F-1-6 — ambiguous Copy controls | Fixed: visible **Copy install command** and **Copy drill command** labels. |
| Earlier unavailable checkout P0 | Fixed: free CLI wording; no checkout or billing request. |
| Earlier mutable static assets P2 | Fixed in source configuration; fingerprinted assets are emitted. |

No earlier finding regressed. F-2-1 through F-2-5 are newly found requirements/proof gaps.

## Structure, accessibility, and identity check

- `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms` returned 200. An unknown route returned a designed 404 with **Return home**.
- Every route had `lang="en"`, one `main`, one `h1`, a route-specific title, description, canonical URL, Open Graph image, favicon, consistent header/footer, Privacy, and Terms. Browser History navigation moved focus to the new `h1` both forward and back.
- Crawled product and external links returned 200. The 404 page's skip-link fragment naturally retains that route's 404 response but moves within the already loaded page; it is not a navigable dead end.
- The passing local suite scanned all routes with axe and found no serious or critical violations. No console/page error was observed in the cold contexts or demo run.
- The warm paper, blunt display type, terminal card, original risograph press art, offset-ink rules, and press-style 404 match `.factory/design.md` and are visibly distinct from a generic SaaS template.
- No AI feature is present. That is appropriate: the brief's value is deterministic restore verification, and an AI step would be decorative rather than an expected capability.

## What would make this perfect

Add explicit schema checks, make the temporary database disk configurable for legitimate larger backups, and turn the CLI demo/default-key/Podman assertions into individually declared, repeatable claims. Then rerun this entire review from a clean clone and cold live browser contexts.
