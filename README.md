# Restore Drill

Prove a Postgres backup restores before an outage.

Restore Drill is for teams that rely on managed Postgres backups. It restores one backup into the exact disposable Postgres version you choose. It then checks extensions, roles, and critical tables before writing a signed JSON receipt.

The CLI is free and has no telemetry. The optional $49 Team Kit adds a weekly CI workflow, policy template, and incident runbook.

- Live site: <https://restore-compatibility-drill.sociobot.in>
- One-click browser demo: <https://restore-compatibility-drill.sociobot.in/demo>

## Safety boundary

Restore Drill does not accept a database connection string. It only starts a local Docker or Podman container with:

- no container network;
- no published port;
- a read-only backup mount; and
- database storage on a 2 GB tmpfs mount.

The CLI does not copy or upload the backup. Check your provider's terms before downloading a full backup. Use a sanitized backup when your policy requires it. Large backups may need more memory than the default tmpfs limit.

## Install

You need Rust 1.85 or newer and Docker or Podman.

```sh
cargo install --path .
```

The package starts at version `0.1.0` and builds one binary named `restore-drill`.

## Try the bundled backup

```sh
restore-drill demo --postgres 15
```

The command writes the sample backup, receipt, and signing key to a new directory under `/tmp`. It prints that directory before starting the real container restore. The sample creates one role and one table.

## Run a real drill

```sh
restore-drill run \
  --dump ./backup.sql \
  --postgres 15.8 \
  --expect-extension pgcrypto \
  --expect-role app_reader \
  --expect-table public.accounts \
  --receipt ./receipts/weekly.json
```

Repeat any `--expect-*` option to check more objects. Use `--runtime podman` when Podman is your local container command. Plain SQL is sent to `psql`; custom, tar, and directory pg_dump archives are sent to `pg_restore`.

Restore Drill reads a plain SQL header before it starts the container. A newer source major version fails the drill. It also explains why `transaction_timeout` from Postgres 17 cannot restore into an older target.

Run `restore-drill run --help` for every option. Use `--json` before the subcommand for one-line machine output.

## Receipt signing

Each started drill writes a JSON receipt and signs its contents with HMAC-SHA256. The default signing key sits beside the receipt at `.restore-drill-signing.key` with mode `0600` on Unix.

Set `--signing-key ./private/drill.key` to keep one stable key. Store that key separately from published receipts. An HMAC proves the receipt still matches your local key; it is not a third-party signature.

Verify a receipt:

```sh
restore-drill verify-receipt \
  --receipt ./receipts/weekly.json \
  --signing-key ./private/drill.key
```

## Exit codes

| Code | Meaning |
| --- | --- |
| `0` | Every check passed. |
| `2` | The restore or a compatibility check failed. |
| `3` | The drill could not run because of configuration or runtime trouble. |

The CLI never prompts, so it can run in CI.

## Develop and verify

```sh
npm install
npm test
npm run build
```

`npm test` runs Rust unit tests, builds the site, runs every claim test, checks routes at 390 px, and scans every page with axe. `npm run build` creates the release binary and the static site in `dist/site/`.

Run the site locally:

```sh
npm run dev
```

Build only one artifact:

```sh
npm run build:cli
npm run build:site
```

The factory deploys `dist/site/`. To check the Rust release package without publishing it:

```sh
cargo package
```

Registry credentials belong to the factory. Do not publish from a development checkout.

## Scope

Restore Drill does not store backups, host databases, or restore production. A passing receipt covers one backup, target version, and declared set of checks. Keep testing your provider's full recovery procedure.

## License

MIT. See [LICENSE](LICENSE).
