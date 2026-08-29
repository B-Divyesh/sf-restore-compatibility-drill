# Adversarial first-read review 7 — PASS

**Reviewed:** 2026-08-29

**Live URL:** <https://restore-compatibility-drill.sociobot.in>

**Source reviewed:** `39f0e8e2a61104766792e24786cec4fd35178bd1`

## Verdict

**PASS.** No blocking, major, minor, copy, claim, demo, privacy, routing,
accessibility, visual, or missed-leverage finding remains. Every declared claim
test passed independently from a clean public clone, and no claim was left
untested. This round has zero findings.

## Cold first-read result

Fresh Chromium contexts opened the live home page at 390×844 and 1440×900
before scrolling.

| Question | My first-read answer | Exact first-screen evidence |
| --- | --- | --- |
| What does it do? | It proves whether a Postgres backup restores. | “Prove your Postgres backup restores” |
| For whom? | Teams that need a recovery answer before an outage. | “For teams that need a recovery answer before an outage, not during one.” |
| What should I click first? | Open the supplied sample replay. | **Try it with sample data** and “Open a browser replay of the sample drill.” |

The primary action and all three facts fit in both initial viewports. The phone
page has no horizontal overflow. The home page produced no console or page
error. The first-read blocking gate passes.

## Findings

None.

## Copy audit

Counts use visible whitespace-delimited words. Hyphenated words stay together;
words inside command spans are counted as displayed. Commands, receipt JSON,
URLs, and table numbers are not prose sentences. No sentence exceeds 22 words.
No banned marketing adjective, unexplained marketing claim, inconsistent term,
context-free heading, mood heading, or empty slogan was found.

### Landing page sentences and headings

| Copy | Words | Result |
| --- | ---: | --- |
| Local Postgres restore drill | 4 | Pass; literal product label |
| Prove your Postgres backup restores | 5 | Pass; job-naming h1 |
| For teams that need a recovery answer before an outage, not during one. | 13 | Pass; audience and situation |
| Open a browser replay of the sample drill. | 8 | Pass; states the action result |
| Runs Postgres in a disposable local container. | 7 | Pass; `isolated-container` |
| Keeps your backup on your machine. | 6 | Pass; `backup-local` |
| The CLI is free and writes signed JSON receipts. | 9 | Pass; `free-cli`, `signed-receipt` |
| A risograph database press turns backup pages into a checked and sealed restore receipt. | 14 | Pass; image-purpose alt text |
| Rehearse the restore. | 3 | Pass; describes the product action |
| Keep the receipt. | 3 | Pass; states the retained result |
| Sample restore drill | 3 | Pass; preview heading |
| Ready to restore the bundled sample backup. | 7 | Pass; preview state |
| A browser replay of the bundled `restore-drill demo` run. | 9 | Pass; honest replay label |
| Use the CLI for a real restore. | 7 | Pass; distinguishes replay from product |
| One receipt records the evidence | 5 | Pass; section heading |
| The JSON receipt records the backup, target version, checks, duration, and a signature you can verify. | 16 | Pass; `signed-receipt` |
| How the drill works | 4 | Pass; section heading |
| Name the target. | 3 | Pass |
| Choose a Postgres version, temporary disk size, and expected schemas, extensions, roles, and tables. | 14 | Pass; `data-tmpfs-size`, `schema-readiness` |
| Restore in isolation. | 3 | Pass |
| The CLI mounts your backup read-only. | 6 | Pass; `backup-local` |
| The container has no network or published port. | 8 | Pass; `isolated-container` |
| Keep the result. | 3 | Pass |
| Pass or fail, the CLI writes a signed JSON receipt. | 10 | Pass; `signed-receipt` |
| Local install | 2 | Pass; section label |
| Run your first real drill | 5 | Pass; section heading |
| Clone the public source, build the single Rust binary, then point it at a local backup file. | 17 | Pass; `install-from-site` |
| For a larger backup, set `--data-tmpfs-size 8g` to give Postgres an 8 GB temporary disk. | 15 | Pass; `data-tmpfs-size` |
| This is not another backup service | 6 | Pass; boundary heading |
| It does not connect to production. | 6 | Pass; `no-production-url` |
| It does not upload or retain your backup. | 8 | Pass; `backup-local` |
| It does not replace provider recovery procedures. | 7 | Pass; scope limit |
| It does prove one backup against one declared target. | 9 | Pass; scope limit |
| Restore Drill — prove a Postgres backup restores. | 8 | Pass; footer one-liner |

Landing actions and dynamic states:

| Label or message | Words | Result |
| --- | ---: | --- |
| Try it with sample data | 5 | Pass; result-naming primary action |
| Get the source on GitHub | 5 | Pass; destination-naming link |
| Copy install command | 3 | Pass; result-naming button |
| Copy drill command | 3 | Pass; result-naming button |
| Install command copied. | 3 | Pass; announced status |
| Drill command copied. | 3 | Pass; announced status |
| Your browser blocked clipboard access. | 5 | Pass; states the cause |
| Select the command and copy it manually. | 7 | Pass; states the recovery step |

### README sentences

| Copy | Words | Result |
| --- | ---: | --- |
| Prove a Postgres backup restores before an outage. | 8 | Pass |
| Restore Drill is for teams that rely on managed Postgres backups. | 11 | Pass |
| It restores one backup into the exact disposable Postgres version you choose. | 12 | Pass |
| It then checks schemas, extensions, roles, and critical tables before writing a signed JSON receipt. | 15 | Pass |
| The CLI is free and has no telemetry. | 8 | Pass; `free-cli`, `no-telemetry` |
| The browser demo starts a memory-only replay and shows a signed sample receipt without a second click. | 17 | Pass; `sample-demo`, `demo-no-persistence` |
| Restore Drill does not accept a database connection string. | 9 | Pass; `no-production-url` |
| It only starts a local Docker or Podman container with: | 10 | Pass; `isolated-container`, `podman-runtime` |
| The CLI does not copy or upload the backup. | 9 | Pass; `backup-local` |
| Check your provider's terms before downloading a full backup. | 9 | Pass; instruction |
| Use a sanitized backup when your policy requires it. | 9 | Pass; instruction |
| Set `--data-tmpfs-size 8g` when Postgres needs an 8 GB temporary disk. | 11 | Pass; `data-tmpfs-size` |
| Accepted sizes range from `512m` to `64g`. | 7 | Pass; `data-tmpfs-size` |
| You need Rust 1.85 or newer and Docker or Podman. | 10 | Pass; `rust-1-85-install`, runtime prerequisite |
| The package starts at version `0.1.0` and builds one binary named `restore-drill`. | 12 | Pass; `install-from-site` |
| The command writes the sample backup, receipt, and signing key to a new directory under `/tmp`. | 16 | Pass; `cli-demo` |
| It prints that directory before starting the real container restore. | 10 | Pass; `cli-demo` |
| The sample creates one schema, one role, and one table. | 10 | Pass; `cli-demo`, `schema-readiness` |
| Repeat any `--expect-*` option to check more objects. | 8 | Pass; option behavior |
| Use `--runtime podman` when Podman is your local container command. | 10 | Pass; `podman-runtime` |
| Plain SQL is sent to `psql`; custom, tar, and directory pg_dump archives are sent to `pg_restore`. | 16 | Pass; `dump-formats` |
| Restore Drill reads a plain SQL header before it starts the container. | 12 | Pass; `newer-version` |
| A newer source major version fails the drill. | 8 | Pass; `newer-version` |
| It also explains why `transaction_timeout` from Postgres 17 cannot restore into an older target. | 14 | Pass; `newer-version` |
| Run `restore-drill run --help` for every option. | 7 | Pass; instruction |
| Use `--json` before the subcommand for one-line machine output. | 9 | Pass; `json-output` |
| Each started drill writes a JSON receipt and signs its contents with HMAC-SHA256. | 13 | Pass; `signed-receipt` |
| The default signing key sits beside the receipt at `.restore-drill-signing.key` with mode `0600` on Unix. | 15 | Pass; `default-signing-key` |
| Set `--signing-key ./private/drill.key` to keep one stable key. | 8 | Pass; custom-key path exercised |
| Store that key separately from published receipts. | 7 | Pass; instruction |
| An HMAC proves the receipt still matches your local key; it is not a third-party signature. | 16 | Pass; defines the technical term |
| Every check passed. | 3 | Pass; exit-code meaning |
| The restore or a compatibility check failed. | 7 | Pass; exit-code meaning |
| The drill could not run because of configuration or runtime trouble. | 11 | Pass; exit-code meaning |
| The CLI never prompts, so it can run in CI. | 10 | Pass; `ci-mode` |
| `npm test` runs unit tests and every claim test. | 9 | Pass; verified from the clean clone |
| It checks routes at 390 px and scans pages with axe. | 11 | Pass; verified from the clean clone |
| `npm run build` creates the release binary and the static site in `dist/site/`. | 13 | Pass; verified from the clean clone |
| The factory deploys `dist/site/`. | 4 | Pass; repository handoff statement |
| To check the Rust release package without publishing it: | 9 | Pass; command lead-in |
| Registry credentials belong to the factory. | 6 | Pass; repository policy |
| Do not publish from a development checkout. | 7 | Pass; instruction |
| Restore Drill does not store backups, host databases, or restore production. | 11 | Pass; scope limit |
| A passing receipt covers one backup, target version, and declared set of checks. | 13 | Pass; scope limit |
| Keep testing your provider's full recovery procedure. | 7 | Pass; instruction |
| MIT. | 1 | Pass; matches `LICENSE` |
| See LICENSE. | 2 | Pass; linked file exists |

README list fragments are **no container network** (3), **no published port**
(3), **a read-only backup mount** (4), and **database storage on a temporary
memory disk (a 2 GB tmpfs mount by default)** (14).

README headings are **Restore Drill**, **Safety boundary**, **Install**, **Try
the bundled backup**, **Run a real drill**, **Receipt signing**, **Exit codes**,
**Develop and verify**, **Scope**, and **License**. Each names its section
without context. The action lead-ins **Verify a receipt**, **Run the site
locally**, and **Build only one artifact** are also literal.

Terminology stays consistent: **backup** is the Postgres export, **drill** is
one compatibility run, **target** is the disposable Postgres version,
**temporary disk** is tmpfs-backed database storage, **schema** is a Postgres
namespace, **receipt** is the JSON result, **demo** is the browser sample, and
**signing key** is the local HMAC secret.

## Demo and sandbox behavior

- The landing action reaches canonical `/?demo=1` in one click.
- The first 390×844 demo viewport already shows Postgres 15.8 → 15,
  `restore_ready`, `restore_reader`, `public.restore_probe`, and **Signature
  verified**. The replay starts automatically and reaches **PASS in 4.7s**
  without another click.
- The persistent banner says **Demo — sample data, nothing is saved** and shows
  **Reset demo** plus **Start for real**. Reset and reload each start one fresh
  replay.
- Live localStorage, sessionStorage, IndexedDB, and OPFS were empty after the
  full replay, Reset, and reload. Production requests stayed on
  `https://restore-compatibility-drill.sociobot.in`; no analytics, advertising,
  remote font, WebSocket, or event-source request occurred.
- The service-worker test loaded the demo, switched the context offline, and
  reloaded the demo successfully.
- `restore-drill demo --postgres 15 --output-dir <temp>` copied the bundled
  sample, wrote its receipt and key only under the selected temporary output,
  and left the source sample unchanged. This worker has no Docker or Podman, so
  the manual run returned documented exit 3 with **Start Docker or Podman**.
  The successful real orchestration passed separately through the controlled
  runtime in `@claim:cli-demo`.

## Claims verification

The public repository was cloned into
`/tmp/restore-drill-review7-clean.q03sgD/repo` and detached at `39f0e8e`. Every
exact `test` command from `.factory/claims.json` was run independently. Each ID
occurs on exactly one tagged test.

| Claim ID | Result | Observable evidence |
| --- | --- | --- |
| `sample-demo` | PASS | One click; realistic phone proof; signed pass replay |
| `browser-privacy` | PASS | Same-origin request log; no remote fonts or tracking |
| `demo-no-persistence` | PASS | Reset/reload; localStorage, sessionStorage, IndexedDB, OPFS empty |
| `install-from-site` | PASS | Resolved public main, cloned it, installed, ran help |
| `rust-1-85-install` | PASS | Locked build and help with Rust 1.85.0 |
| `free-cli` | PASS | Free wording; no checkout or billing link/request |
| `isolated-container` | PASS | No network, no port, tmpfs runtime arguments |
| `data-tmpfs-size` | PASS | 8 GB reaches runtime/receipt; invalid bounds rejected |
| `backup-local` | PASS | Read-only mount; source bytes unchanged |
| `newer-version` | PASS | 17.6→15.8 and `transaction_timeout` stop before runtime |
| `signed-receipt` | PASS | Pass/fail receipts verify; changed receipt rejected |
| `default-signing-key` | PASS | Adjacent key, Unix `0600`, receipt verifies |
| `schema-readiness` | PASS | Present and missing schema produce distinct results |
| `cli-demo` | PASS | Copied sample, receipt/key, real controlled run, source unchanged |
| `podman-runtime` | PASS | Selected Podman receives full isolation arguments |
| `dump-formats` | PASS | Plain SQL, custom, tar, and directory formats exercised |
| `json-output` | PASS | Exactly one JSON line for pass, failure, and startup error |
| `ci-mode` | PASS | Closed-input run completes with documented exit code |
| `no-production-url` | PASS | No URL option; parser rejects it; no network client dependency |
| `no-telemetry` | PASS | No telemetry option or HTTP client dependency |

The live sample, privacy, and persistence claim tests also passed against
production. Cross-checking the live landing page and README found no unlisted
product claim. Advice, legal text, and repository-development statements were
verified directly and do not expand the runtime product contract.

The full clean-clone `npm test` passed 5 Rust tests and 36 Playwright tests.
`npm run build` passed and produced the release CLI plus `dist/site/`.
Production JavaScript is 15.05 KB raw / 5.27 KB gzip.

## Earlier finding regression check

Every `review-1.md` through `review-6.md`, every `polish-1.md` through
`polish-6.md`, and the prior handoff were read. Each earlier finding was checked
again in live behavior and source rather than accepted from its closure note.

| Earlier ID | Current live/code confirmation |
| --- | --- |
| F-1-1 | Public GitHub link and full locked install remain; public clone/install claim passes. |
| F-1-2 | Demo state remains memory-only; Reset/reload and all browser-store assertions pass. |
| F-1-3 | The CTA outcome says it opens a browser replay; no “without Docker” claim remains. |
| F-1-4 | README development text remains split; no sentence exceeds 22 words. |
| F-1-5 | README defines tmpfs as a temporary memory disk. |
| F-1-6 | Visible controls remain **Copy install command** and **Copy drill command**. |
| F-2-1 | `--expect-schema`, `pg_namespace`, receipt rows, sample schema, and pass/fail tests remain. |
| F-2-2 | `--data-tmpfs-size` remains bounded from 512 MB to 64 GB and reaches runtime/receipt. |
| F-2-3 | `cli-demo` proves the isolated copy and controlled real run. |
| F-2-4 | Default adjacent key location, Unix `0600`, and verification remain tested. |
| F-2-5 | A controlled executable named `podman` receives all isolation arguments. |
| F-3-1 | The canonical demo starts automatically with realistic proof in the first phone viewport. |
| F-3-2 | The tagged claim covers plain SQL plus custom, tar, and directory archives. |
| F-3-3 | Pass, compatibility failure, and startup error each emit one JSON line. |
| F-3-4 | `/demo` normalizes to `/?demo=1`; one canonical is listed once in the sitemap. |
| F-3-5 | Landing copy says “a signature you can verify”; HMAC is defined only in technical docs. |
| F-3-6 | All three facts fit in the 1440×900 and 390×844 cold screens. |
| F-4-1 | The receipt claim verifies successful and failed receipts and rejects a changed receipt. |
| F-5-1 | The install test clones the public GitHub head, detaches it, installs, and runs help. |
| F-6-1 | The unsupported “with the next step” qualifier remains absent. |
| F-6-2 | `rust-1-85-install` builds the locked graph with Rust 1.85.0. |
| F-6-3 | The first-screen label remains the literal “Local Postgres restore drill.” |
| F-6-4 | Copy actions retain their names; success is announced and denial gives cause plus recovery. |
| F-6-5 | The designed 404 says “Error 404” and “Page not found.” |
| Verification P0 | Product remains free; no checkout, paid route, billing API call, or purchase promise exists. |
| Verification P2 | Fingerprinted assets retain `public, max-age=31536000, immutable`. |

No earlier finding is half-fixed, unfixed, or regressed.

## Structure, accessibility, links, and visual identity

- `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms` return 200. An unknown
  path returns a designed HTTP 404 with **Return home**.
- Every route has `lang="en"`, one `<main>`, one `<h1>`, a route-specific title,
  plain meta description, exact canonical URL, Open Graph/Twitter metadata,
  favicon, apple-touch icon, consistent header/footer, Privacy, and Terms.
- Titles follow the required pattern: **Restore Drill — prove a Postgres backup
  restores**, **Demo — Restore Drill**, **Privacy — Restore Drill**, **Terms —
  Restore Drill**, and **Page not found — Restore Drill**.
- Deep links load directly. History back/forward restores the route and focuses
  its h1. The route announcer and skip link work.
- Every rendered product, GitHub, and Param Factory link returned 200. Same-page
  fragments resolve to existing targets. No dead link was found.
- Six live route scans had no serious or critical axe violation. Keyboard,
  44 px touch targets, visible focus, reduced motion, and 390 px overflow tests
  passed. The only console resource message observed was Chromium's expected
  top-level 404 response on the deliberately missing route; no application
  exception occurred.
- Security headers include the matching CSP, `frame-ancestors` as a response
  header, Referrer-Policy, Permissions-Policy, and X-Content-Type-Options.
- The warm paper palette, riso red/blue/yellow registration, original press
  collage, offset rules, clipped cards, stamp controls, and terminal receipt
  match `.factory/design.md`. The result is visibly specific to restore
  rehearsal rather than a generic SaaS template.

## Missed leverage

No missed-leverage finding. The brief's expected import/export loop is present:
a local backup is the input and a signed JSON receipt is the output. CI-safe
JSON, documented exit codes, configurable checks, Docker/Podman selection, and
the bundled sample cover automation. Sync would weaken the local data boundary.
An AI step is not warranted for deterministic restore verification and would
weaken the evidentiary result. No decorative AI or embedded provider key exists.

## What would make this perfect

Nothing was identified. Preserve the current claim-to-test mapping and rerun
the complete clean-clone, cold-browser, privacy, and history checks after any
future product change.
