# Landing page copy audit

Audited 28 August 2026. Counts treat hyphenated terms and prices as one word. Interface labels and headings are listed after the sentences. No sentence exceeds 22 words. No copy uses a banned word from the plain-words contract.

## First screen

| Copy | Words | Result |
| --- | ---: | --- |
| Prove your Postgres backup restores | 5 | Pass |
| For teams that need a recovery answer before an outage, not during one. | 13 | Pass |
| See a complete drill without Docker. | 6 | Pass |
| Runs Postgres in a disposable local container. | 7 | Pass |
| Keeps your backup on your machine. | 6 | Pass |
| $49 once for team runbooks; the CLI stays free. | 9 | Pass |

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

## Install, boundaries, and price

| Copy | Words | Result |
| --- | ---: | --- |
| Build the single Rust binary, then point it at a local backup file. | 13 | Pass |
| It does not connect to production. | 6 | Pass |
| It does not upload or retain your backup. | 8 | Pass |
| It does not replace provider recovery procedures. | 7 | Pass |
| It does prove one backup against one declared target. | 9 | Pass |
| The CLI stays free. | 4 | Pass |
| The Team Kit adds a CI workflow, policy template, and incident runbook. | 12 | Pass |
| Sociobot and Dodo are the merchant of record. | 8 | Pass |
| Read the terms and privacy notice. | 6 | Pass |
| Team Kit active. | 3 | Pass |
| Your weekly workflow and runbook are ready to copy. | 9 | Pass |

## License feedback

| Copy | Words | Result |
| --- | ---: | --- |
| Checking this license. | 3 | Pass |
| License verified. | 2 | Pass |
| The Team Kit is active. | 5 | Pass |
| This license is not active. | 5 | Pass |
| Check the token or buy a license. | 7 | Pass |
| The license server could not be reached. | 7 | Pass |
| Your last verified access is unchanged. | 6 | Pass |

## Headings and action labels

Headings: “A recovery check you can keep,” “Sample restore drill,” “One receipt records the evidence,” “How the drill works,” “Run your first real drill,” “This is not another backup service,” and “Put the drill on a weekly schedule.”

Actions: “Try it with sample data,” “Copy,” “Buy the Team Kit,” “Have a license?”, “Verify license,” and “Open the Team Kit.” Each action names its result.

## Terminology table

| Concept | One term used |
| --- | --- |
| The Postgres export being tested | backup |
| One execution of the compatibility test | drill |
| The disposable database release | target |
| The machine-readable result | receipt |
| Browser example state | demo |
| Paid workflow and runbook bundle | Team Kit |
| Local secret used for HMAC | signing key |

## Catalog description

“Prove a Postgres backup restores before an outage” — 8 words, 48 characters, starts with a verb.
