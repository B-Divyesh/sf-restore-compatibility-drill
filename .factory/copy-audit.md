# Copy audit — perfection loop 1

Audited 28 August 2026. Counts treat hyphenated terms, commands, and version tokens as one word. No sentence exceeds 22 words or uses a banned plain-words term.

## First screen

| Copy | Words | Result |
| --- | ---: | --- |
| A recovery check you can keep | 6 | Pass |
| Prove your Postgres backup restores | 5 | Pass |
| For teams that need a recovery answer before an outage, not during one. | 13 | Pass |
| Open a browser replay of the sample drill. | 8 | Pass; replaces the unlisted “without Docker” claim |
| Runs Postgres in a disposable local container. | 7 | Pass; `isolated-container` |
| Keeps your backup on your machine. | 6 | Pass; `backup-local` |
| The CLI is free and writes signed JSON receipts. | 9 | Pass; `free-cli`, `signed-receipt` |

The primary action is “Try it with sample data.” It opens `/?demo=1` in one click. The visible outcome explains that the page is a browser replay.

## Product preview and process

| Copy | Words | Result |
| --- | ---: | --- |
| A risograph database press turns backup pages into a checked and sealed restore receipt. | 14 | Pass; image alt text |
| Rehearse the restore. | 3 | Pass |
| Keep the receipt. | 3 | Pass |
| Sample restore drill | 3 | Pass; heading |
| Ready to restore the bundled sample backup. | 7 | Pass |
| A browser replay of the bundled restore-drill demo run. | 8 | Pass; `sample-demo` |
| Use the CLI for a real restore. | 7 | Pass |
| One receipt records the evidence | 5 | Pass; heading |
| The JSON receipt includes the backup hash, target version, checks, duration, and HMAC signature. | 14 | Pass; `signed-receipt` |
| How the drill works | 4 | Pass; heading |
| Name the target. | 3 | Pass |
| Choose an exact Postgres version and expected extensions, roles, and tables. | 11 | Pass |
| Restore in isolation. | 3 | Pass |
| The CLI mounts your backup read-only. | 6 | Pass; `backup-local` |
| The container has no network or published port. | 8 | Pass; `isolated-container` |
| Keep the result. | 3 | Pass |
| Pass or fail, the CLI writes a signed JSON receipt with the next step. | 14 | Pass; `signed-receipt` |

## Install and boundaries

| Copy | Words | Result |
| --- | ---: | --- |
| Run your first real drill | 5 | Pass; heading |
| Clone the public source, build the single Rust binary, then point it at a local backup file. | 16 | Pass; `install-from-site` |
| Get the source on GitHub | 5 | Pass; link names its destination |
| Copy install command | 3 | Pass; button names its result |
| Copy drill command | 3 | Pass; button names its result |
| This is not another backup service | 6 | Pass; heading |
| It does not connect to production. | 6 | Pass; `no-production-url` |
| It does not upload or retain your backup. | 8 | Pass; `backup-local` |
| It does not replace provider recovery procedures. | 7 | Pass |
| It does prove one backup against one declared target. | 9 | Pass |
| Restore Drill — prove a Postgres backup restores. | 7 | Pass; footer |

## Demo, legal, and 404 copy

| Copy | Words | Result |
| --- | ---: | --- |
| Demo — sample data, nothing is saved | 7 | Pass; `demo-no-persistence` |
| This replay uses the backup bundled with the CLI. | 9 | Pass; `sample-demo` |
| It does not read or save your files. | 8 | Pass; `demo-no-persistence` |
| The browser demo stores no sample data. | 7 | Pass; `demo-no-persistence` |
| Its replay state disappears on reload. | 6 | Pass; `demo-no-persistence` |
| The browser demo sends no sample data off-site. | 8 | Pass; `browser-privacy` |
| This site has no analytics, advertising scripts, or third-party fonts. | 10 | Pass; `browser-privacy` |
| This page was not restored | 5 | Pass; 404 heading |
| The address does not match a page in this build. | 10 | Pass |

## README fixes checked

| Copy | Words | Result |
| --- | ---: | --- |
| database storage on a temporary memory disk (a 2 GB tmpfs mount). | 12 | Pass; defines `tmpfs` |
| Large backups may need more than the temporary disk's 2 GB limit. | 11 | Pass |
| `npm test` runs unit tests and every claim test. | 9 | Pass |
| It checks routes at 390 px and scans pages with axe. | 11 | Pass |

## Terminology table

| Concept | One term used |
| --- | --- |
| The Postgres export being tested | backup |
| One execution of the compatibility test | drill |
| The disposable database release | target |
| The machine-readable result | receipt |
| Browser example state | demo |
| Local secret used for HMAC | signing key |

## Catalog description

“Prove a Postgres backup restores before an outage” — 8 words, 48 characters, starts with a verb.
