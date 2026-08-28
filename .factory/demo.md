# Demo

- Browser URL: `https://restore-compatibility-drill.sociobot.in/?demo=1` or `/?demo=1` locally. `/demo` opens the same replay and normalizes to the canonical URL.
- CLI command: `restore-drill demo --postgres 15`.
- Sample data: `examples/sample-backup.sql` declares Postgres 15.8. It creates the empty `restore_ready` schema, the `restore_reader` role, and `public.restore_probe` with one row.
- Browser reset: select **Reset demo**. A fresh replay starts immediately.
- CLI reset: delete the printed `/tmp/restore-drill-demo-<timestamp>` directory when finished.
- Browser storage namespace: none. Demo state lives in memory. Reset and reload each discard it and start a fresh replay.

The browser is a replay and does not claim to run Postgres. The CLI demo copies the sample into its own directory and performs the real container restore there.
