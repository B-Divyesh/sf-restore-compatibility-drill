# Adversarial first-read review 6 — FAIL

**Reviewed:** 2026-08-29

**Live URL:** <https://restore-compatibility-drill.sociobot.in>

**Source reviewed:** `9c03cc6000ee7c515153eeec4d06568349e6f604`

## Verdict

**FAIL.** The first screen is clear, the one-click replay works on a phone, all
19 declared claim commands pass from a clean clone, and the live structure is
sound. Five findings remain. Two visitor-facing assertions are not fully
represented by the claims contract, two pieces of copy use slogans or metaphor
instead of literal labels, and the clipboard failure gives no recovery step.
The required standard is zero findings.

## Findings

### F-6-1 — P1 — the landing page promises a next step that a passing receipt does not contain

**Location / exact quote:** landing page, **How the drill works**: “Pass or
fail, the CLI writes a signed JSON receipt with the next step.”

**Verification:** `signed-receipt` promises and tests signed pass and failure
receipts, but neither its claim text nor its assertions cover a next step. The
fresh claim run's passing receipt has no `next_step` field and every check has
`"remedy": null`. The normal pass output prints the result, receipt path, and
key path; it does not print a next step. Failure checks do carry remedies.

**Why a first-time visitor is misled:** “Pass or fail” applies the next-step
promise to both outcomes. An operator cannot rely on the promised guidance
after a pass, and this part of the sentence can regress without failing the
registered claim.

**Concrete fix:** either rewrite the sentence to **“Pass or fail, the CLI
writes a signed JSON receipt.”** or add a concrete next-step field for both pass
and failure receipts. If retained, add it to `signed-receipt` and assert the
field and displayed guidance for both outcomes.

### F-6-2 — P1 — the minimum Rust version is an unlisted quantitative claim

**Location / exact quote:** README, **Install**: “You need Rust 1.85 or newer
and Docker or Podman.”

**Verification:** `.factory/claims.json` has no minimum-toolchain claim. The
`install-from-site` test installs with this worker's Rust 1.98.0, not Rust
1.85. `Cargo.toml` declares `rust-version = "1.85"`, but no clean test compiles
the locked dependency graph with that minimum version.

**Why a first-time visitor is misled:** an operator may install the documented
minimum toolchain and discover that a dependency or edition feature needs a
newer compiler. The current green install test cannot detect that regression.

**Concrete fix:** add a `rust-1-85-install` claim and CI test that builds the
locked public checkout with Rust 1.85, then runs `restore-drill --help`.
Alternatively remove the exact minimum and say **“You need a current stable
Rust toolchain and Docker or Podman.”**

### F-6-3 — P2 — the first screen opens with a slogan and a second term for the product

**Location / exact quote:** first-screen eyebrow: “A recovery check you can
keep.”

**Why this fails the copy rule:** it is slogan-shaped and calls the whole
product a “recovery check,” while the rest of the page consistently calls the
run a “drill” and individual assertions “checks.” It does not add a concrete
fact beyond the headline and receipt copy.

**Concrete fix:** delete the eyebrow, or replace it with **“Local Postgres
restore drill.”**

### F-6-4 — P2 — the clipboard failure does not explain the cause or recovery

**Location / exact quote:** landing install controls, failure state: “Copy
failed.” The success state changes the still-clickable button to “Copied.”

**Verification:** forcing `navigator.clipboard.writeText` to reject on the live
page changes the focused button to `Copy failed`; it has no `aria-live` or
`aria-describedby` message. The source catches every clipboard error with only
`button.textContent = 'Copy failed'`.

**Why a first-time visitor is lost:** the message does not say that clipboard
access was blocked or tell the visitor to select the adjacent command. The
button also stops naming its action after either outcome.

**Concrete fix:** keep **“Copy install command”** or **“Copy drill command”** as
the button label. Announce **“Install command copied.”** in a status region on
success. On failure, show **“Your browser blocked clipboard access. Select the
command and copy it manually.”** in an alert associated with the command.

### F-6-5 — P2 — the 404 uses press lore instead of a literal page heading

**Location / exact quotes:** unknown routes show the eyebrow “This sheet missed
the press” and the h1 “This page was not restored.”

**Why a first-time visitor is lost:** both lines depend on the print/restore
metaphor. In a screen-reader heading list, “This page was not restored” can be
mistaken for a database-restore result rather than a missing URL.

**Concrete fix:** use the eyebrow **“Error 404”** and h1 **“Page not found.”**
Keep the existing risograph styling, explanation, and **Return home** action.

## Cold first-read result

Fresh Chromium contexts opened the live home page at 390×844 and 1440×900 with
service-worker state blocked. Neither context scrolled. Both returned 200,
showed no console/page error, and had no horizontal overflow.

| Question | Answer before scrolling |
| --- | --- |
| What does it do? | In my words: it checks that a Postgres backup restores into a disposable target and leaves a receipt. The exact h1 is “Prove your Postgres backup restores.” |
| For whom? | Teams relying on Postgres backups that want an answer before an outage. The exact sentence is “For teams that need a recovery answer before an outage, not during one.” |
| What should I click first? | **Try it with sample data.** The adjacent result text says “Open a browser replay of the sample drill.” |

The CTA and all three facts end above 771 px on the 390×844 screen and above
772 px on the 1440×900 screen. The mandatory first-read gate passes; F-6-3 is a
separate copy-quality finding.

## Copy audit

Counts use visible whitespace-delimited words; hyphenated terms and command
tokens count as one word. Code blocks, JSON, URLs, navigation destinations, and
table numbers are not prose sentences. No sentence exceeds 22 words, and no
banned marketing adjective appears.

### Landing page sentences, headings, and labels

| Copy | Words | Result |
| --- | ---: | --- |
| A recovery check you can keep | 6 | F-6-3 — slogan and inconsistent term |
| Prove your Postgres backup restores | 5 | Pass — job-naming h1 |
| For teams that need a recovery answer before an outage, not during one. | 13 | Pass |
| Try it with sample data | 5 | Pass — result-naming primary action |
| Open a browser replay of the sample drill. | 8 | Pass |
| Runs Postgres in a disposable local container. | 7 | Pass |
| Keeps your backup on your machine. | 6 | Pass |
| The CLI is free and writes signed JSON receipts. | 9 | Pass |
| A risograph database press turns backup pages into a checked and sealed restore receipt. | 14 | Pass — image alt text |
| Rehearse the restore. | 3 | Pass — describes the drill |
| Keep the receipt. | 3 | Pass — usable instruction |
| Sample restore drill | 3 | Pass — preview heading |
| Ready to restore the bundled sample backup. | 7 | Pass — preview state |
| A browser replay of the bundled `restore-drill demo` run. | 9 | Pass |
| Use the CLI for a real restore. | 7 | Pass |
| One receipt records the evidence | 5 | Pass — section heading |
| The JSON receipt records the backup, target version, checks, duration, and a signature you can verify. | 16 | Pass |
| How the drill works | 4 | Pass — section heading |
| Name the target. | 3 | Pass |
| Choose a Postgres version, temporary disk size, and expected schemas, extensions, roles, and tables. | 14 | Pass |
| Restore in isolation. | 3 | Pass |
| The CLI mounts your backup read-only. | 6 | Pass |
| The container has no network or published port. | 8 | Pass |
| Keep the result. | 3 | Pass |
| Pass or fail, the CLI writes a signed JSON receipt with the next step. | 14 | F-6-1 — unsupported for pass receipts |
| Local install | 2 | Pass — section label |
| Run your first real drill | 5 | Pass — section heading |
| Clone the public source, build the single Rust binary, then point it at a local backup file. | 17 | Pass |
| Get the source on GitHub | 5 | Pass — destination-naming link |
| For a larger backup, set `--data-tmpfs-size 8g` to give Postgres an 8 GB temporary disk. | 15 | Pass |
| This is not another backup service | 6 | Pass — boundary heading |
| It does not connect to production. | 6 | Pass |
| It does not upload or retain your backup. | 8 | Pass |
| It does not replace provider recovery procedures. | 7 | Pass |
| It does prove one backup against one declared target. | 9 | Pass |
| Restore Drill — prove a Postgres backup restores. | 8 | Pass — footer |

Landing action and state labels:

| Label | Words | Result |
| --- | ---: | --- |
| Try it with sample data | 5 | Pass |
| Get the source on GitHub | 5 | Pass — link destination |
| Copy install command | 3 | Pass |
| Copy drill command | 3 | Pass |
| Copied | 1 | F-6-4 — replaces the still-active button action with status text |
| Copy failed | 2 | F-6-4 — no reason or recovery step |

### README sentences

| Copy | Words | Result |
| --- | ---: | --- |
| Prove a Postgres backup restores before an outage. | 8 | Pass |
| Restore Drill is for teams that rely on managed Postgres backups. | 11 | Pass |
| It restores one backup into the exact disposable Postgres version you choose. | 12 | Pass |
| It then checks schemas, extensions, roles, and critical tables before writing a signed JSON receipt. | 15 | Pass |
| The CLI is free and has no telemetry. | 8 | Pass |
| The browser demo starts a memory-only replay and shows a signed sample receipt without a second click. | 17 | Pass |
| Restore Drill does not accept a database connection string. | 9 | Pass |
| It only starts a local Docker or Podman container with: | 10 | Pass |
| The CLI does not copy or upload the backup. | 9 | Pass |
| Check your provider's terms before downloading a full backup. | 9 | Pass |
| Use a sanitized backup when your policy requires it. | 9 | Pass |
| Set `--data-tmpfs-size 8g` when Postgres needs an 8 GB temporary disk. | 11 | Pass |
| Accepted sizes range from `512m` to `64g`. | 7 | Pass |
| You need Rust 1.85 or newer and Docker or Podman. | 10 | F-6-2 — unlisted minimum-version claim |
| The package starts at version `0.1.0` and builds one binary named `restore-drill`. | 12 | Pass |
| The command writes the sample backup, receipt, and signing key to a new directory under `/tmp`. | 16 | Pass |
| It prints that directory before starting the real container restore. | 10 | Pass |
| The sample creates one schema, one role, and one table. | 10 | Pass |
| Repeat any `--expect-*` option to check more objects. | 8 | Pass |
| Use `--runtime podman` when Podman is your local container command. | 10 | Pass |
| Plain SQL is sent to `psql`; custom, tar, and directory pg_dump archives are sent to `pg_restore`. | 16 | Pass |
| Restore Drill reads a plain SQL header before it starts the container. | 12 | Pass |
| A newer source major version fails the drill. | 8 | Pass |
| It also explains why `transaction_timeout` from Postgres 17 cannot restore into an older target. | 14 | Pass |
| Run `restore-drill run --help` for every option. | 7 | Pass |
| Use `--json` before the subcommand for one-line machine output. | 9 | Pass |
| Each started drill writes a JSON receipt and signs its contents with HMAC-SHA256. | 13 | Pass |
| The default signing key sits beside the receipt at `.restore-drill-signing.key` with mode `0600` on Unix. | 15 | Pass |
| Set `--signing-key ./private/drill.key` to keep one stable key. | 8 | Pass |
| Store that key separately from published receipts. | 7 | Pass |
| An HMAC proves the receipt still matches your local key; it is not a third-party signature. | 16 | Pass — jargon is defined in the sentence |
| Every check passed. | 3 | Pass |
| The restore or a compatibility check failed. | 7 | Pass |
| The drill could not run because of configuration or runtime trouble. | 11 | Pass |
| The CLI never prompts, so it can run in CI. | 10 | Pass |
| `npm test` runs unit tests and every claim test. | 9 | Pass |
| It checks routes at 390 px and scans pages with axe. | 11 | Pass |
| `npm run build` creates the release binary and the static site in `dist/site/`. | 13 | Pass |
| The factory deploys `dist/site/`. | 4 | Pass |
| To check the Rust release package without publishing it: | 9 | Pass |
| Registry credentials belong to the factory. | 6 | Pass |
| Do not publish from a development checkout. | 7 | Pass |
| Restore Drill does not store backups, host databases, or restore production. | 11 | Pass |
| A passing receipt covers one backup, target version, and declared set of checks. | 13 | Pass |
| Keep testing your provider's full recovery procedure. | 7 | Pass |
| MIT. | 1 | Pass |
| See LICENSE. | 2 | Pass |

README list fragments are **no container network** (3), **no published port**
(3), **a read-only backup mount** (4), and **database storage on a temporary
memory disk (a 2 GB tmpfs mount by default)** (14). README headings are:
**Restore Drill** (2), **Safety boundary** (2), **Install** (1), **Try the
bundled backup** (4), **Run a real drill** (4), **Receipt signing** (2), **Exit
codes** (2), **Develop and verify** (3), **Scope** (1), and **License** (1).
The command lead-ins **Verify a receipt** (3), **Run the site locally** (4), and
**Build only one artifact** (4) are also literal. None needs a copy finding.

Apart from F-6-3, terminology is consistent: **backup** is the export, **drill**
is one run, **target** is the disposable Postgres version, **temporary disk** is
the tmpfs-backed database storage, **schema** is a Postgres namespace,
**receipt** is the JSON result, **demo** is the sample experience, and **signing
key** is the local HMAC secret. Postgres, Docker, Podman, `pg_dump`, `psql`, and
`pg_restore` are proportionate technical terms for this CLI audience; `tmpfs`
and HMAC are defined where used.

## Demo and sandbox behavior

- The first-screen action reaches canonical `/?demo=1` in one click.
- The first 390×844 demo viewport already shows Postgres 15.8 → 15,
  `restore_ready`, `restore_reader`, `public.restore_probe`, and **Signature
  verified**. The last proof row ends at 666 px. The replay starts
  automatically and reaches **PASS in 4.7s** without another click.
- The persistent banner says **Demo — sample data, nothing is saved** and shows
  **Reset demo** and **Start for real**. Reset produces one fresh nine-row replay;
  reload also starts one fresh replay.
- localStorage, sessionStorage, IndexedDB, OPFS, and cookies remained empty.
  Cache Storage contained only the versioned `restore-drill-v3` application
  shell. The complete cold flow requested only
  `https://restore-compatibility-drill.sociobot.in`; there were no console or
  page errors.
- The offline replay test passed after service-worker activation. The public
  copy does not make an unlisted offline claim.
- The real CLI command was run from fresh directory
  `/tmp/restore-review6-cli-run.qvGujw`. It created a separate
  `/tmp/restore-drill-demo-1787968575` workspace, wrote its receipt and key,
  and left the bundled source hash unchanged. This worker has neither Docker
  nor Podman, so the live container step returned the documented exit 3 and
  actionable **Start Docker or Podman** message. The controlled-runtime
  `cli-demo` claim passed independently.

The browser demo requirement passes. It is clearly labelled as a replay and
does not imply that Postgres runs in the browser.

## Claims verification

The repository declares 19 claims. I cloned `9c03cc6` with `--no-local` into
`/tmp/restore-review6-claims.WbYCPz/repo`, ran `npm ci`, and ran every exact
`test` command from `.factory/claims.json` independently. Every command exited
zero.

| Claim id | Result |
| --- | --- |
| sample-demo | PASS |
| browser-privacy | PASS |
| demo-no-persistence | PASS |
| install-from-site | PASS |
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

The clean clone also passed `npm run build`, producing the release binary and
`dist/site/`. The complete production run
`PLAYWRIGHT_BASE_URL=https://restore-compatibility-drill.sociobot.in npm test`
passed 5 Rust tests and all 32 Playwright tests.

No listed test failed. F-6-1 identifies a qualifier absent from both the
registered claim and passing output. F-6-2 identifies a separate quantitative
README statement with no claims entry or minimum-version test.

## Earlier finding regression check

I read every `.factory/review-1.md` through `review-5.md`, every
`.factory/polish-1.md` through `polish-5.md`, both verification reports, and the
prior handoff. Each earlier numbered finding was checked against the live site
and current code.

| Earlier finding | Live and code result |
| --- | --- |
| F-1-1 — no usable install path | Fixed. The GitHub link and full clone/install sequence are live; the public-main clone/install claim passed. |
| F-1-2 — demo persistence untested | Fixed. Reset/reload and all browser-store assertions passed live and in the claim test. |
| F-1-3 — unlisted “without Docker” | Fixed. The outcome literally says it opens a browser replay. |
| F-1-4 — overlong README sentence | Fixed. No current landing or README sentence exceeds 22 words. |
| F-1-5 — unexplained tmpfs | Fixed. README defines tmpfs as a temporary memory disk. |
| F-1-6 — ambiguous default copy labels | Fixed. Default labels name the install and drill commands. F-6-4 concerns their post-activation error/status states. |
| F-2-1 — no schema readiness check | Fixed. `--expect-schema`, `pg_namespace`, receipt rows, sample data, and pass/failure tests are present. |
| F-2-2 — fixed 2 GB disk | Fixed. The bounded 512 MB–64 GB option reaches the runtime and receipt. |
| F-2-3 — CLI demo unlisted | Fixed. `cli-demo` is registered and its controlled-runtime test passes. |
| F-2-4 — default key unlisted | Fixed. Adjacent path, Unix 0600 mode, and verification pass. |
| F-2-5 — Podman unlisted | Fixed. A controlled `podman` executable receives the isolation arguments. |
| F-3-1 — demo opened idle | Fixed. The replay starts automatically and realistic proof is in the first phone viewport. |
| F-3-2 — incomplete dump formats | Fixed. Plain SQL, custom, tar, and directory fixtures all run in the tagged test. |
| F-3-3 — JSON output unlisted | Fixed. Pass, compatibility failure, and startup error each produce one JSON line. |
| F-3-4 — duplicate demo canonicals | Fixed. `/demo` normalizes to the one `/?demo=1` canonical, listed once in the sitemap. |
| F-3-5 — HMAC jargon on landing | Fixed. Landing uses “a signature you can verify”; README defines HMAC. |
| F-3-6 — desktop fact clipped | Fixed. All three facts end above 772 px in the 900 px viewport. |
| F-4-1 — successful signature proof absent | Fixed. The signed-receipt test verifies pass and failure receipts and rejects tampering. |
| F-5-1 — install test used local source | Fixed. The test resolves public `main`, clones GitHub, detaches that SHA, installs it, and runs help. |
| Verification P0 — unavailable paid checkout | Fixed. The product is free and has no checkout or billing request. |
| Verification P2 — mutable fingerprinted assets | Fixed. The live fingerprinted JS returns `public, max-age=31536000, immutable`. |

No earlier finding is reopened. F-6-1 through F-6-5 are new.

## Structure, accessibility, links, and identity

- `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms` returned 200. An unknown
  path returned a designed HTTP 404. F-6-5 concerns its words, not its routing.
- Each route has `lang="en"`, one `<main>`, one `<h1>`, a route-specific title,
  a description under 155 characters, exact canonical, Open Graph/Twitter
  metadata, SVG favicon, and 180×180 apple-touch icon. The Open Graph artwork
  is 1200×630.
- Titles follow the route pattern: **Restore Drill — prove a Postgres backup
  restores**, **Demo — Restore Drill**, **Privacy — Restore Drill**, **Terms —
  Restore Drill**, and **Page not found — Restore Drill**.
- Header and footer content is consistent across every route. Footer Privacy,
  Terms, Param Factory, version, and product description are present.
- Forward navigation and browser Back both move focus to the new h1. The skip
  link targets the main landmark. The live 32-test suite passed 390 px overflow,
  44 px targets, reduced motion, keyboard behavior, and axe serious/critical
  scans. Cold console inspection found no error.
- Every rendered link was crawled. `/`, `/?demo=1`, `/#install`, `/privacy`,
  `/terms`, the GitHub repository, and `https://sociobot.in` returned 200;
  `#main` and `#install` resolve to existing targets.
- The production JavaScript is 14.36 KB raw / 5.11 KB gzip. The paper palette,
  offset riso colors, clipped sheets, press terminal, original collage, and
  stamped interactions match `.factory/design.md` and are visibly distinct
  from a generic SaaS template.

## Missed leverage

No AI feature is warranted. Restore compatibility is a deterministic local
operation; generated advice would weaken the safety boundary. The CLI already
provides the useful implied leverage: a bundled demo, repeatable object checks,
machine-readable JSON, documented exit codes, and receipt export for CI or a
scheduler. Sync would require moving backup or receipt data beyond the local
boundary. No missed-leverage finding is added.

## What would make this perfect

Remove or implement the unsupported “next step” promise, register and test the
Rust 1.85 minimum, replace the hero and 404 slogans with literal labels, and
make clipboard feedback actionable and announced. Then rerun every claim and
the full cold live checklist. Only a round with zero findings should pass.
