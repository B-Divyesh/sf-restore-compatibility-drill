# Demo

- Browser URL: `https://restore-compatibility-drill.sociobot.in/?demo=1` or `/?demo=1` locally. `/demo` remains a direct alias.
- CLI command: `restore-drill demo --postgres 15`.
- Sample data: `examples/sample-backup.sql` declares Postgres 15.8, creates `restore_reader`, and creates `public.restore_probe` with one row.
- Browser reset: select **Reset demo**. The replay returns to its untouched first frame.
- CLI reset: delete the printed `/tmp/restore-drill-demo-<timestamp>` directory when finished.
- Browser storage namespace: none. Demo state lives in memory, Reset restores the first frame, and reload discards the replay.

The browser is a replay and does not claim to run Postgres. The CLI demo performs the real container restore with the same bundled sample.
