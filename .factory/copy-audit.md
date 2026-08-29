# Copy audit — perfection loop 6

Re-audited 29 August 2026. Counts treat hyphenated terms, commands, and version tokens as one word. No sentence exceeds 22 words or uses a banned plain-words term.

## First screen

| Copy | Words | Result |
| --- | ---: | --- |
| Local Postgres restore drill | 4 | Pass; literal product label |
| Prove your Postgres backup restores | 5 | Pass |
| For teams that need a recovery answer before an outage, not during one. | 13 | Pass |
| Try it with sample data | 5 | Pass; primary action |
| Open a browser replay of the sample drill. | 8 | Pass; `sample-demo` |
| Runs Postgres in a disposable local container. | 7 | Pass; `isolated-container` |
| Keeps your backup on your machine. | 6 | Pass; `backup-local` |
| The CLI is free and writes signed JSON receipts. | 9 | Pass; `free-cli`, `signed-receipt` |

The first screen says what the product does, who needs it, what to do first, and what that action opens. The primary action enters isolated `/?demo=1` in one click.

## Landing page after the first screen

| Copy | Words | Result |
| --- | ---: | --- |
| A risograph database press turns backup pages into a checked and sealed restore receipt. | 14 | Pass; image alt text |
| Rehearse the restore. | 3 | Pass |
| Keep the receipt. | 3 | Pass |
| Sample restore drill | 3 | Pass; heading |
| Ready to restore the bundled sample backup. | 7 | Pass |
| A browser replay of the bundled restore-drill demo run. | 8 | Pass; `sample-demo` |
| Use the CLI for a real restore. | 7 | Pass; `cli-demo` |
| One receipt records the evidence | 5 | Pass; heading |
| The JSON receipt records the backup, target version, checks, duration, and a signature you can verify. | 16 | Pass; `signed-receipt` |
| How the drill works | 4 | Pass; heading |
| Name the target. | 3 | Pass |
| Choose a Postgres version, temporary disk size, and expected schemas, extensions, roles, and tables. | 14 | Pass; `data-tmpfs-size`, `schema-readiness` |
| Restore in isolation. | 3 | Pass |
| The CLI mounts your backup read-only. | 6 | Pass; `backup-local` |
| The container has no network or published port. | 8 | Pass; `isolated-container` |
| Keep the result. | 3 | Pass |
| Pass or fail, the CLI writes a signed JSON receipt. | 10 | Pass; `signed-receipt` |
| Local install | 2 | Pass; eyebrow |
| Run your first real drill | 5 | Pass; heading |
| Clone the public source, build the single Rust binary, then point it at a local backup file. | 16 | Pass; `install-from-site` |
| Get the source on GitHub | 5 | Pass; destination-naming link |
| Copy install command | 3 | Pass; result-naming button |
| Copy drill command | 3 | Pass; result-naming button |
| Install command copied. | 3 | Pass; announced success status |
| Drill command copied. | 3 | Pass; announced success status |
| Your browser blocked clipboard access. | 5 | Pass; failure cause |
| Select the command and copy it manually. | 7 | Pass; recovery step |
| For a larger backup, set `--data-tmpfs-size 8g` to give Postgres an 8 GB temporary disk. | 14 | Pass; `data-tmpfs-size` |
| This is not another backup service | 6 | Pass; heading |
| It does not connect to production. | 6 | Pass; `no-production-url` |
| It does not upload or retain your backup. | 8 | Pass; `backup-local` |
| It does not replace provider recovery procedures. | 7 | Pass; scope statement |
| It does prove one backup against one declared target. | 9 | Pass; scope statement |
| Restore Drill — prove a Postgres backup restores. | 7 | Pass; footer |

## Demo, legal, and 404 routes

| Copy | Words | Result |
| --- | ---: | --- |
| Demo — sample data, nothing is saved | 7 | Pass; `demo-no-persistence` |
| Run a sample restore drill | 5 | Pass; heading |
| This replay starts with the backup bundled with the CLI. | 10 | Pass; `sample-demo` |
| It does not read or save your files. | 8 | Pass; `demo-no-persistence` |
| Signed sample receipt | 3 | Pass; demo result heading |
| Postgres 15.8 → 15 | 4 | Pass; sample backup and target |
| Signature verified | 2 | Pass; `signed-receipt` |
| Starting the bundled sample replay. | 5 | Pass; automatic demo state |
| Isolation: no network · no published port · temporary data disk | 10 | Pass; `isolated-container` |
| Starting disposable postgres:15… | 3 | Pass; automatic demo state |
| Disposable Postgres accepted connections. | 4 | Pass; automatic demo result |
| Expected extension plpgsql exists. | 4 | Pass; automatic demo result |
| The backup restored without a database error. | 7 | Pass; automatic demo result |
| Expected role restore_reader exists. | 4 | Pass; automatic demo result |
| Expected schema restore_ready exists. | 4 | Pass; `schema-readiness` |
| Expected table public.restore_probe exists. | 4 | Pass; automatic demo result |
| Receipt signature verified with the local key. | 7 | Pass; `signed-receipt` |
| PASS in 4.7s | 3 | Pass; `sample-demo` |
| Replay sample drill | 3 | Pass; action label |
| Reset demo | 2 | Pass; action label |
| Start for real | 3 | Pass; action label points to install |
| What this sample checks | 4 | Pass; heading |
| Privacy at Restore Drill | 4 | Pass; heading |
| The CLI reads the backup path you provide. | 8 | Pass; `backup-local` |
| It mounts that path read-only in a local container. | 9 | Pass; `backup-local` |
| The browser demo stores no sample data. | 7 | Pass; `demo-no-persistence` |
| Its replay state disappears on reload. | 6 | Pass; `demo-no-persistence` |
| The browser demo sends no sample data off-site. | 8 | Pass; `browser-privacy` |
| This site has no analytics, advertising scripts, or third-party fonts. | 10 | Pass; `browser-privacy` |
| Clear this site's storage to remove any browser data. | 9 | Pass; instruction |
| Terms for Restore Drill | 4 | Pass; heading |
| The CLI source is provided under the MIT License. | 9 | Pass |
| Use sanitized backups when policy requires them. | 7 | Pass; instruction |
| Check provider terms before downloading a full backup. | 8 | Pass; instruction |
| A passed drill records one test. | 6 | Pass; limitation |
| It does not guarantee every recovery path or future backup will pass. | 11 | Pass; limitation |
| The software is provided without warranty under the MIT License. | 10 | Pass |
| Error 404 | 2 | Pass; literal error label |
| Page not found | 3 | Pass; literal 404 heading |
| The address does not match a page in this build. | 10 | Pass |
| Return home | 2 | Pass; action |

## README

| Copy | Words | Result |
| --- | ---: | --- |
| Prove a Postgres backup restores before an outage. | 8 | Pass |
| Restore Drill is for teams that rely on managed Postgres backups. | 11 | Pass |
| It restores one backup into the exact disposable Postgres version you choose. | 11 | Pass |
| It then checks schemas, extensions, roles, and critical tables before writing a signed JSON receipt. | 15 | Pass; `schema-readiness` |
| The CLI is free and has no telemetry. | 8 | Pass; `free-cli`, `no-telemetry` |
| The browser demo starts a memory-only replay and shows a signed sample receipt without a second click. | 17 | Pass; `sample-demo`, `demo-no-persistence` |
| Restore Drill does not accept a database connection string. | 8 | Pass; `no-production-url` |
| It only starts a local Docker or Podman container with: | 10 | Pass; `isolated-container`, `podman-runtime` |
| The CLI does not copy or upload the backup. | 8 | Pass; `backup-local` |
| Check your provider's terms before downloading a full backup. | 9 | Pass; instruction |
| Use a sanitized backup when your policy requires it. | 9 | Pass; instruction |
| Set `--data-tmpfs-size 8g` when Postgres needs an 8 GB temporary disk. | 10 | Pass; `data-tmpfs-size` |
| Accepted sizes range from `512m` to `64g`. | 7 | Pass; `data-tmpfs-size` |
| You need Rust 1.85 or newer and Docker or Podman. | 9 | Pass; `rust-1-85-install` and runtime prerequisite |
| The package starts at version `0.1.0` and builds one binary named `restore-drill`. | 11 | Pass; `install-from-site` |
| The command writes the sample backup, receipt, and signing key to a new directory under `/tmp`. | 16 | Pass; `cli-demo` |
| It prints that directory before starting the real container restore. | 10 | Pass; `cli-demo` |
| The sample creates one schema, one role, and one table. | 10 | Pass; `cli-demo`, `schema-readiness` |
| Repeat any `--expect-*` option to check more objects. | 8 | Pass |
| Use `--runtime podman` when Podman is your local container command. | 10 | Pass; `podman-runtime` |
| Plain SQL is sent to `psql`; custom, tar, and directory pg_dump archives are sent to `pg_restore`. | 15 | Pass; `dump-formats` |
| Restore Drill reads a plain SQL header before it starts the container. | 10 | Pass; `newer-version` |
| A newer source major version fails the drill. | 8 | Pass; `newer-version` |
| It also explains why `transaction_timeout` from Postgres 17 cannot restore into an older target. | 14 | Pass; `newer-version` |
| Run `restore-drill run --help` for every option. | 6 | Pass; instruction |
| Use `--json` before the subcommand for one-line machine output. | 8 | Pass; instruction |
| Each started drill writes a JSON receipt and signs its contents with HMAC-SHA256. | 12 | Pass; `signed-receipt` |
| The default signing key sits beside the receipt at `.restore-drill-signing.key` with mode `0600` on Unix. | 15 | Pass; `default-signing-key` |
| Set `--signing-key ./private/drill.key` to keep one stable key. | 9 | Pass; instruction |
| Store that key separately from published receipts. | 7 | Pass; instruction |
| An HMAC proves the receipt still matches your local key; it is not a third-party signature. | 15 | Pass; `signed-receipt` |
| Every check passed. | 3 | Pass; exit code |
| The restore or a compatibility check failed. | 7 | Pass; exit code |
| The drill could not run because of configuration or runtime trouble. | 10 | Pass; exit code |
| The CLI never prompts, so it can run in CI. | 9 | Pass; `ci-mode` |
| `npm test` runs unit tests and every claim test. | 9 | Pass |
| It checks routes at 390 px and scans pages with axe. | 11 | Pass |
| `npm run build` creates the release binary and the static site in `dist/site/`. | 12 | Pass |
| The factory deploys `dist/site/`. | 5 | Pass |
| To check the Rust release package without publishing it: | 9 | Pass; lead-in |
| Registry credentials belong to the factory. | 5 | Pass |
| Do not publish from a development checkout. | 7 | Pass; instruction |
| Restore Drill does not store backups, host databases, or restore production. | 10 | Pass; scope statement |
| A passing receipt covers one backup, target version, and declared set of checks. | 13 | Pass; scope statement |
| Keep testing your provider's full recovery procedure. | 7 | Pass; instruction |
| MIT. | 1 | Pass |
| See LICENSE. | 2 | Pass |

List fragments are “no container network” (3), “no published port” (3), “a read-only backup mount” (4), and “database storage on a temporary memory disk (a 2 GB tmpfs mount by default)” (14). Commands and receipt JSON are code, not prose.

## Metadata

All route titles are 60 characters or fewer. All descriptions are 155 characters or fewer. Titles name the route and product; descriptions state literal behavior without banned words.

## Terminology

| Concept | One term used |
| --- | --- |
| The Postgres export being tested | backup |
| One execution of the compatibility test | drill |
| The disposable database release | target |
| Temporary container database storage | temporary disk |
| A named Postgres namespace | schema |
| The machine-readable result | receipt |
| Browser example state | demo |
| Local HMAC secret | signing key |

## Catalog description

“Prove a Postgres backup restores into its intended version before an outage” — 12 words, 75 characters, starts with a verb.
