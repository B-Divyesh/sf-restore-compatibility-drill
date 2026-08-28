# Adversarial first-read review 3 — FAIL

**Reviewed:** 2026-08-28

**Live URL:** <https://restore-compatibility-drill.sociobot.in>

**Source reviewed:** `b8afebcee8f1a5e03bdaa1a478cd0509b266fba9`

## Verdict

**FAIL.** The first screen explains the job, audience, and primary action, and all 18 declared claim commands pass from a clean clone. The one-click demo requirement does not pass on a 390 px phone: after the landing action, the first viewport shows an idle terminal, while the run control and realistic sample details remain below the fold. Five additional claim, structure, and copy findings remain. A pass requires zero findings and no untested claim.

## Findings

### F-3-1 — BLOCKING — the one-click demo opens an idle setup screen, not the product already in use

**Location / exact quote:** landing action **“Try it with sample data”** opens `/?demo=1`. The first demo frame says **“Ready to restore the bundled sample backup.”** The control that starts the replay is **“Run sample drill.”**

**Verification:** in a fresh 390×844 Chromium context, the terminal begins at `y=578`, the run control begins at `y=988`, and **What this sample checks** begins at `y=1252`. The first viewport therefore contains no running or completed check, no receipt result, and none of the realistic schema, role, or table values. Reaching `PASS in 4.7s` takes a second click after scrolling. The existing `@claim:sample-demo` test encodes those two clicks: it clicks the landing action and then clicks **Run sample drill**.

**Why this fails first use:** the supplied demo contract requires the first screen after one click to show the product being used with realistic sample data. On a phone, this screen looks like instructions before a demo rather than the demo itself. The review contract explicitly makes a missing or weak demo blocking.

**Concrete fix:** start the replay when `/?demo=1` or `/demo` opens, or render a completed realistic sample receipt in the first viewport with **Replay sample drill** available. Keep the persistent banner and Reset control. Change `@claim:sample-demo` to click only **Try it with sample data**, then assert that the schema, role, table, signed receipt, and pass result become visible at 390×844 without another activation.

### F-3-2 — P1 — the dump-format claim test covers only one of four advertised paths

**Location / exact quote:** README: **“Plain SQL is sent to `psql`; custom, tar, and directory pg_dump archives are sent to `pg_restore`.”** `.factory/claims.json` lists `dump-formats`: **“The CLI restores plain SQL directly and sends pg_dump archives through pg_restore.”**

**Verification:** the only `@claim:dump-formats` test is named **“sends a custom-format archive through pg_restore.”** It creates one `PGDMP` file and asserts one `pg_restore` invocation. It does not exercise plain SQL, tar archives, or directory-format archives under that claim tag. Another test happens to use plain SQL, but it is not the declared test for `dump-formats`; tar and directory formats are untested.

**Why this matters:** a team can rely on three archive variants named in the README, while the registered test proves only custom format. A passing claim command therefore does not prove the whole sentence.

**Concrete fix:** parameterize the single tagged claim test over plain SQL, custom, tar, and directory fixtures and assert `psql` versus `pg_restore` plus the mounted input path. Alternatively narrow both README and `claims.json` to the one archive format actually tested.

### F-3-3 — P2 — the one-line JSON-output claim is absent from the claims manifest

**Location / exact quote:** README, **Run a real drill**: **“Use `--json` before the subcommand for one-line machine output.”**

**Verification:** no entry in `.factory/claims.json` names JSON output or its one-line shape. Several tests parse JSON incidentally, but none is registered as the test for this visitor-facing sentence or asserts exactly one non-empty output line across documented outcomes.

**Why this matters:** CI users can rely on output framing. Extra stdout would break parsers even while all current claims remained green.

**Concrete fix:** add a `json-output` claim and one tagged test that asserts exactly one valid JSON line for pass, compatibility failure, and startup error. Otherwise remove **“one-line.”**

### F-3-4 — P2 — the two demo URLs declare separate canonicals and one is missing from the sitemap

**Location / exact evidence:** `/?demo=1` sets its canonical to `https://restore-compatibility-drill.sociobot.in/?demo=1`; `/demo` sets its canonical to `https://restore-compatibility-drill.sociobot.in/demo`. Both render the same demo. `site/public/sitemap.xml` lists `/?demo=1` but omits `/demo`.

**Why this matters:** the site presents duplicate demo pages as separate canonical documents, while the site-structure contract requires the sitemap to list every route. The existing metadata test only checks that a canonical starts with the site origin, so it misses the conflict.

**Concrete fix:** choose one public demo URL, point both entry paths to that canonical, and redirect or `replaceState` the alias. List the canonical demo URL in `sitemap.xml`. Add an assertion for the exact canonical and sitemap membership.

### F-3-5 — P2 — landing copy uses unexplained cryptographic jargon

**Location / exact quote:** **“The JSON receipt includes the backup hash, target version, checks, duration, and HMAC signature.”**

**Why this matters:** `HMAC` is not explained on the landing page and is unnecessary for deciding whether to try the product. A distracted visitor must decode implementation terminology before understanding the receipt.

**Concrete fix:** use **“The JSON receipt records the backup, target version, checks, duration, and a signature you can verify.”** Keep the precise HMAC-SHA256 mechanism in the README signing section.

### F-3-6 — P2 — the desktop first screen clips one of the three required plain facts

**Location / exact quote:** third hero fact: **“The CLI is free and writes signed JSON receipts.”**

**Verification:** at the requested 1440×900 cold desktop viewport, the three fact rows occupy `y=792–837`, `837–883`, and `883–929`. The third fact is cut off by the viewport bottom. The cold screenshot does not show it as a readable first-screen fact.

**Why this matters:** the supplied first-screen shape requires all three privacy/offline/price facts. The oversized desktop headline consumes enough height to hide the price fact until scrolling.

**Concrete fix:** reduce the desktop headline maximum size or hero vertical spacing so all three rows end above 900 px. Add a viewport assertion that each fact's bounding box is fully within the initial 1440×900 viewport.

## Cold first-read result

Fresh browser contexts opened `/` at 390×844 and 1440×900 before scrolling. No console or page errors occurred, and neither viewport had horizontal overflow.

| Question | Answer available before scrolling |
| --- | --- |
| What does it do? | **“Prove your Postgres backup restores.”** |
| For whom? | **“For teams that need a recovery answer before an outage, not during one.”** |
| What should I click first? | **“Try it with sample data”**, followed by **“Open a browser replay of the sample drill.”** |

All three questions are answerable, so the cold first-read gate itself passes. F-3-6 records the separate first-screen fact-layout defect.

## Demo and sandbox verification

- The landing action enters `/?demo=1` in one click, but F-3-1 records why the resulting first viewport is not an already-running or completed demo.
- The banner is persistent and says **“Demo — sample data, nothing is saved.”** It includes **Reset demo** and **Start for real**.
- After scrolling and selecting **Run sample drill**, the replay shows the Postgres 15.8 backup, Postgres 15 target, `plpgsql`, `restore_reader`, `restore_ready`, `public.restore_probe`, and an HMAC-SHA256 pass receipt.
- Reset returns **“Ready to restore the bundled sample backup.”** Reload does the same. Local storage, session storage, IndexedDB, and OPFS stayed empty. The service worker created its normal `restore-drill-v1` application cache; no replay state was stored there.
- The full browser flow requested only `https://restore-compatibility-drill.sociobot.in`. Offline `/demo` reload passed after service-worker activation.
- The real CLI demo was run from a temporary working directory. It created `/tmp/restore-drill-demo-1787931295`, wrote a signed error receipt and key, and returned documented exit `3` because this worker has neither Docker nor Podman. The clean claim test separately ran the shipped binary with the controlled runtime and passed.

## Claims verification

The repository declares 18 claims. I cloned the reviewed commit with `git clone --no-local` into `/tmp/restore-drill-review-3.MttQWq/repo`, ran `npm ci`, and invoked every exact `test` string independently. All commands returned zero.

| Claim ID | Result |
| --- | --- |
| `sample-demo` | Pass |
| `browser-privacy` | Pass |
| `demo-no-persistence` | Pass |
| `install-from-site` | Pass |
| `free-cli` | Pass |
| `isolated-container` | Pass |
| `data-tmpfs-size` | Pass |
| `backup-local` | Pass |
| `newer-version` | Pass |
| `signed-receipt` | Pass |
| `default-signing-key` | Pass |
| `schema-readiness` | Pass |
| `cli-demo` | Pass |
| `podman-runtime` | Pass |
| `dump-formats` | Pass, but incomplete coverage in F-3-2 |
| `ci-mode` | Pass |
| `no-production-url` | Pass |
| `no-telemetry` | Pass |

The public GitHub `main` ref matched the reviewed commit. The install link and all published acquisition links returned 200. F-3-2 and F-3-3 remain because a green command does not cover the complete dump-format sentence and no command is registered for the one-line JSON sentence.

The same clean clone also passed:

- `npm test`: 5 Rust tests and 28 Playwright tests passed.
- `npm run build`: produced the release binary and `dist/site/`.
- `cargo fmt --check` and `git diff --check`.
- Production sizes: 13.68 KB JavaScript (4.97 KB gzip), 10.94 KB CSS (3.25 KB gzip), and 196.92 KB hero WebP.

## Copy audit

Counts below use whitespace-delimited words; hyphenated terms remain one word. Repeated identical copy is listed once with its occurrence noted. Code blocks, JSON, URLs, and table numbers are not prose sentences. No sentence exceeds 22 words and no banned marketing adjective appears.

### Landing-page sentences and headings

| Copy | Words | Result |
| --- | ---: | --- |
| A recovery check you can keep | 6 | Pass |
| Prove your Postgres backup restores | 5 | Pass |
| For teams that need a recovery answer before an outage, not during one. | 13 | Pass |
| Open a browser replay of the sample drill. | 8 | Pass |
| Runs Postgres in a disposable local container. | 7 | Pass |
| Keeps your backup on your machine. | 6 | Pass |
| The CLI is free and writes signed JSON receipts. | 9 | Pass; layout issue F-3-6 |
| A risograph database press turns backup pages into a checked and sealed restore receipt. | 14 | Pass; image alt text |
| Rehearse the restore. | 3 | Pass |
| Keep the receipt. | 3 | Pass |
| Sample restore drill | 3 | Pass |
| Ready to restore the bundled sample backup. | 7 | F-3-1 in the post-click demo state |
| A browser replay of the bundled restore-drill demo run. | 9 | Pass |
| Use the CLI for a real restore. | 7 | Pass |
| One receipt records the evidence | 5 | Pass |
| The JSON receipt includes the backup hash, target version, checks, duration, and HMAC signature. | 14 | F-3-5: jargon |
| How the drill works | 4 | Pass |
| Name the target. | 3 | Pass |
| Choose a Postgres version, temporary disk size, and expected schemas, extensions, roles, and tables. | 14 | Pass |
| Restore in isolation. | 3 | Pass |
| The CLI mounts your backup read-only. | 6 | Pass |
| The container has no network or published port. | 8 | Pass |
| Keep the result. | 3 | Pass |
| Pass or fail, the CLI writes a signed JSON receipt with the next step. | 14 | Pass |
| Local install | 2 | Pass |
| Run your first real drill | 5 | Pass |
| Clone the public source, build the single Rust binary, then point it at a local backup file. | 17 | Pass |
| For a larger backup, set `--data-tmpfs-size 8g` to give Postgres an 8 GB temporary disk. | 15 | Pass |
| This is not another backup service | 6 | Pass |
| It does not connect to production. | 6 | Pass |
| It does not upload or retain your backup. | 8 | Pass |
| It does not replace provider recovery procedures. | 7 | Pass |
| It does prove one backup against one declared target. | 9 | Pass |
| Restore Drill — prove a Postgres backup restores. | 8 | Pass; footer |

### Landing-page action labels

| Label | Words | Result |
| --- | ---: | --- |
| Try it with sample data | 5 | Pass; appears twice, but the first path fails F-3-1 |
| Get the source on GitHub | 5 | Pass |
| Copy install command | 3 | Pass |
| Copy drill command | 3 | Pass |

### README sentences

| Copy | Words | Result |
| --- | ---: | --- |
| Prove a Postgres backup restores before an outage. | 8 | Pass |
| Restore Drill is for teams that rely on managed Postgres backups. | 11 | Pass |
| It restores one backup into the exact disposable Postgres version you choose. | 12 | Pass |
| It then checks schemas, extensions, roles, and critical tables before writing a signed JSON receipt. | 15 | Pass |
| The CLI is free and has no telemetry. | 8 | Pass |
| Restore Drill does not accept a database connection string. | 9 | Pass |
| It only starts a local Docker or Podman container with: | 10 | Pass |
| no container network | 3 | Pass; list fragment |
| no published port | 3 | Pass; list fragment |
| a read-only backup mount | 4 | Pass; list fragment |
| database storage on a temporary memory disk (a 2 GB tmpfs mount by default) | 14 | Pass; `tmpfs` is defined in place |
| The CLI does not copy or upload the backup. | 9 | Pass |
| Check your provider's terms before downloading a full backup. | 9 | Pass |
| Use a sanitized backup when your policy requires it. | 9 | Pass |
| Set `--data-tmpfs-size 8g` when Postgres needs an 8 GB temporary disk. | 11 | Pass |
| Accepted sizes range from `512m` to `64g`. | 7 | Pass |
| You need Rust 1.85 or newer and Docker or Podman. | 10 | Pass |
| The package starts at version `0.1.0` and builds one binary named `restore-drill`. | 12 | Pass |
| The command writes the sample backup, receipt, and signing key to a new directory under `/tmp`. | 16 | Pass |
| It prints that directory before starting the real container restore. | 10 | Pass |
| The sample creates one schema, one role, and one table. | 10 | Pass |
| Repeat any `--expect-*` option to check more objects. | 8 | Pass |
| Use `--runtime podman` when Podman is your local container command. | 10 | Pass |
| Plain SQL is sent to `psql`; custom, tar, and directory pg_dump archives are sent to `pg_restore`. | 16 | F-3-2: incomplete claim test |
| Restore Drill reads a plain SQL header before it starts the container. | 12 | Pass |
| A newer source major version fails the drill. | 8 | Pass |
| It also explains why `transaction_timeout` from Postgres 17 cannot restore into an older target. | 14 | Pass |
| Run `restore-drill run --help` for every option. | 7 | Pass |
| Use `--json` before the subcommand for one-line machine output. | 9 | F-3-3: unlisted claim |
| Each started drill writes a JSON receipt and signs its contents with HMAC-SHA256. | 13 | Pass; the signing section explains the mechanism |
| The default signing key sits beside the receipt at `.restore-drill-signing.key` with mode `0600` on Unix. | 15 | Pass |
| Set `--signing-key ./private/drill.key` to keep one stable key. | 8 | Pass |
| Store that key separately from published receipts. | 7 | Pass |
| An HMAC proves the receipt still matches your local key; it is not a third-party signature. | 16 | Pass; meaning is stated |
| Verify a receipt | 3 | Pass; command lead-in |
| Every check passed. | 3 | Pass |
| The restore or a compatibility check failed. | 7 | Pass |
| The drill could not run because of configuration or runtime trouble. | 11 | Pass |
| The CLI never prompts, so it can run in CI. | 10 | Pass |
| `npm test` runs unit tests and every claim test. | 9 | Pass |
| It checks routes at 390 px and scans pages with axe. | 11 | Pass |
| `npm run build` creates the release binary and the static site in `dist/site/`. | 13 | Pass |
| Run the site locally | 4 | Pass; lead-in |
| Build only one artifact | 4 | Pass; lead-in |
| The factory deploys `dist/site/`. | 4 | Pass |
| To check the Rust release package without publishing it: | 9 | Pass |
| Registry credentials belong to the factory. | 6 | Pass |
| Do not publish from a development checkout. | 7 | Pass |
| Restore Drill does not store backups, host databases, or restore production. | 11 | Pass |
| A passing receipt covers one backup, target version, and declared set of checks. | 13 | Pass |
| Keep testing your provider's full recovery procedure. | 7 | Pass |
| MIT. | 1 | Pass |
| See LICENSE. | 2 | Pass |

README section headings—**Restore Drill**, **Safety boundary**, **Install**, **Try the bundled backup**, **Run a real drill**, **Receipt signing**, **Exit codes**, **Develop and verify**, **Scope**, and **License**—remain understandable out of context. Commands and URLs are not prose sentences.

Terminology is otherwise consistent: **backup** is the Postgres export, **drill** is one compatibility run, **target** is the disposable Postgres version, **temporary disk** is tmpfs-backed database storage, **schema** is a Postgres namespace, **receipt** is the JSON result, **demo** is the sample experience, and **signing key** is the local HMAC secret.

## History check

I read `.factory/review-1.md`, `.factory/review-2.md`, `.factory/polish-1.md`, `.factory/polish-2.md`, the prior `.factory/handoff.md`, and both verification reports. Every earlier numbered finding remains fixed in the live site and current code.

| Earlier finding | Live and code confirmation |
| --- | --- |
| F-1-1 — no usable public install path | Fixed: the source link and full clone/install sequence are live; GitHub `main` matches this commit; `install-from-site` passes. |
| F-1-2 — demo persistence evidence absent | Fixed: `demo-no-persistence` passes; Reset/reload clear replay state and browser data stores remain empty. |
| F-1-3 — unlisted “without Docker” claim | Fixed: the outcome now says **“Open a browser replay of the sample drill.”** |
| F-1-4 — overlong README sentence | Fixed: the development statement remains split; no sentence exceeds 22 words. |
| F-1-5 — unexplained tmpfs | Fixed: README defines tmpfs as a temporary memory disk. |
| F-1-6 — ambiguous Copy labels | Fixed: the visible controls name the install and drill commands. |
| F-2-1 — schema readiness absent | Fixed: `--expect-schema`, `pg_namespace` checking, receipt rows, sample data, and pass/fail tests are present. |
| F-2-2 — fixed 2 GB disk | Fixed: `--data-tmpfs-size` accepts the documented bounded range and reaches the receipt/runtime. |
| F-2-3 — CLI demo unlisted | Fixed: `cli-demo` is registered and its exact command passes. |
| F-2-4 — default signing-key behavior unlisted | Fixed: `default-signing-key` verifies adjacent location, Unix `0600`, and signature verification. |
| F-2-5 — Podman support unlisted | Fixed: `podman-runtime` is registered and the selected runtime arguments are checked. |
| Verification P0 — unavailable Team Kit checkout | Fixed: the product is a free CLI and has no checkout, billing link, or Sociobot API request. |
| Verification P2 — mutable static caching | Fixed: the live fingerprinted JavaScript returns `Cache-Control: public, max-age=31536000, immutable`. |

F-3-1 through F-3-6 are new findings. No earlier ID is reopened.

## Structure, accessibility, links, and identity

- `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms` returned 200. An unknown route returned a designed HTTP 404 with **Return home**.
- Live routes have `lang="en"`, one `main`, one `h1`, route-specific titles, descriptions, Open Graph/Twitter metadata, favicon assets, and consistent header/footer legal links.
- History back/forward restored the route and focused the new `h1`. The skip link focused `main`.
- A crawl of every unique link found 200 responses for the product routes, GitHub source, and Sociobot/Param Factory destination. No dead link was found.
- All six route scans had zero serious or critical axe findings. The worker `verify-url.sh` found one `h1`, a main landmark, complete image alt text, labelled buttons, and no console errors.
- Reduced motion, keyboard activation, offline demo reload, 390 px overflow, and same-origin request checks passed.
- The warm paper palette, blunt display face, monospaced body, original risograph press art, clipped notes, offset inks, stamped controls, terminal card, and misprint 404 follow `.factory/design.md`. The result is distinct from a generic centered-hero/feature-card SaaS template.
- F-3-4 is the remaining canonical/sitemap structure defect; F-3-6 is the remaining first-screen layout defect.

## Missed leverage

No additional AI feature is justified. Restore compatibility is a deterministic database operation; model output would weaken rather than improve the pass/fail evidence. JSON export, CI-safe execution, configurable target checks, Docker/Podman selection, and a temporary sample workflow already cover the obvious import/export/automation expectations implied by the brief. No decorative AI or embedded provider key exists.

## What would make this perfect

Make the sample visibly run or show a completed realistic result immediately after the single landing click. Cover every advertised dump format in its declared test, register the one-line JSON promise, consolidate the demo canonical URL and sitemap, replace landing-page HMAC jargon, and fit all three facts in the initial desktop viewport. Then rerun the entire review from fresh browser contexts and a clean clone.
