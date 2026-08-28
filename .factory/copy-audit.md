# Landing page copy audit

Audited 28 August 2026. Counts treat hyphenated terms as one word. No sentence exceeds 22 words or uses a banned plain-words term.

## First screen

| Copy | Words | Result |
| --- | ---: | --- |
| Prove your Postgres backup restores | 5 | Pass |
| For teams that need a recovery answer before an outage, not during one. | 13 | Pass |
| See a complete drill without Docker. | 6 | Pass |
| Runs Postgres in a disposable local container. | 7 | Pass |
| Keeps your backup on your machine. | 6 | Pass |
| The CLI is free and writes signed JSON receipts. | 9 | Pass |

The primary action is “Try it with sample data.” It opens `/demo` in one click.

## Product preview and process

| Copy | Words | Result |
| --- | ---: | --- |
| Ready to restore the bundled sample backup. | 7 | Pass |
| A browser replay of the bundled restore-drill demo run. | 9 | Pass |
| Use the CLI for a real restore. | 7 | Pass |
| Rehearse the restore. | 3 | Pass |
| Keep the receipt. | 3 | Pass |
| The JSON receipt includes the backup hash, target version, checks, duration, and HMAC signature. | 14 | Pass |
| Choose an exact Postgres version and expected extensions, roles, and tables. | 11 | Pass |
| The CLI mounts your backup read-only. | 6 | Pass |
| The container has no network or published port. | 8 | Pass |
| Pass or fail, the CLI writes a signed JSON receipt with the next step. | 14 | Pass |

## Install and boundaries

| Copy | Words | Result |
| --- | ---: | --- |
| Build the single Rust binary, then point it at a local backup file. | 13 | Pass |
| It does not connect to production. | 6 | Pass |
| It does not upload or retain your backup. | 8 | Pass |
| It does not replace provider recovery procedures. | 7 | Pass |
| It does prove one backup against one declared target. | 9 | Pass |

## Headings and action labels

Headings: “A recovery check you can keep,” “Sample restore drill,” “One receipt records the evidence,” “How the drill works,” “Run your first real drill,” and “This is not another backup service.”

Actions: “Try it with sample data” and “Copy.” Each action names its result.

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
