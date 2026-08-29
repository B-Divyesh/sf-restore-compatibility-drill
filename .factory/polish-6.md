# Polish 6 — cumulative finding closure

**Released candidate repaired:** `9c03cc6000ee7c515153eeec4d06568349e6f604`

**Adversarial report:** `77ca3941a4f72e1a8fbad578e2adfd0f73a1fbab`

**Implementation commit:** `18bca79ada9437e6cc1f7b44b9e0bd6c87f5f182`

**Deployment:** `4ad1d411-56fc-4b93-866e-248a8663dd99`

**Live URL:** <https://restore-compatibility-drill.sociobot.in>

Every finding from reviews 1–6 and both earlier verification reports is closed. No severity is deferred.

## Review 6 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-6-1 — passing receipts did not contain a promised next step | Removed the unsupported qualifier. The workflow now says, “Pass or fail, the CLI writes a signed JSON receipt.” | `landing and 404 use literal task and error wording`; `@claim:signed-receipt`; [cold home](evidence/polish-6-live/cold-home-mobile.png); live `/` contains no “next step.” |
| F-6-2 — Rust 1.85 minimum was unlisted and untested | Added `rust-1-85-install` to the claims manifest. Its clean-checkout test installs Rust 1.85.0, builds the locked graph in a fresh target, and runs `restore-drill --help`. | `@claim:rust-1-85-install builds the locked CLI with the documented minimum toolchain`; [public clean-claim summary](evidence/polish-6-clean-public/summary.txt); public `main` resolved to `18bca79`. |
| F-6-3 — first-screen slogan used a second product term | Replaced “A recovery check you can keep” with the literal label “Local Postgres restore drill.” | `landing and 404 use literal task and error wording`; [cold home](evidence/polish-6-live/cold-home-mobile.png); live `/`. |
| F-6-4 — clipboard feedback replaced the action and gave no recovery | Copy buttons always retain their action names. Associated live regions announce success. A denied clipboard shows an alert explaining the cause and manual-copy step. | `copy controls keep their action names and announce success`; `clipboard denial keeps the action and gives an associated recovery step`; [forced denial](evidence/polish-6-live/clipboard-error-mobile.png); live `/#install`. |
| F-6-5 — 404 used print/restore metaphor as its label and heading | Kept the offset-risograph 404 art while changing the words to “Error 404” and “Page not found.” | `landing and 404 use literal task and error wording`; metadata/route test; [cold 404](evidence/polish-6-live/cold-404-desktop.png); live unknown route returned HTTP 404. |

## Earlier review findings

| Finding | Cumulative change retained | Evidence |
| --- | --- | --- |
| F-1-1 — no usable public install path | The site links GitHub and shows the full clone, directory, and locked-install sequence. | `@claim:install-from-site`; public clean clone at `18bca79`; live `/#install`. |
| F-1-2 — demo persistence was untested | Browser replay state remains memory-only; Reset and reload create fresh runs and all browser stores stay empty. | `@claim:demo-no-persistence`; [cold demo](evidence/polish-6-live/cold-demo-mobile.png); [cold audit](evidence/polish-6-live/cold-audit.json). |
| F-1-3 — unlisted “without Docker” wording | The first-screen outcome literally says it opens a browser replay. | `@claim:sample-demo`; [cold home](evidence/polish-6-live/cold-home-mobile.png); live `/`. |
| F-1-4 — README sentence exceeded 22 words | Development verification remains split into short sentences. | [copy audit](copy-audit.md); clean full suite. |
| F-1-5 — `tmpfs` was unexplained | README defines it as a temporary memory disk and gives a bounded sizing path. | `@claim:isolated-container`; `@claim:data-tmpfs-size`; live `/#install`. |
| F-1-6 — copy controls had ambiguous visible labels | Visible labels name the install and drill commands at every state. | Mobile target test; clipboard success/denial tests; [forced denial](evidence/polish-6-live/clipboard-error-mobile.png). |
| F-2-1 — schema readiness was absent | Repeatable `--expect-schema`, `pg_namespace` checks, receipt rows, and sample schema remain. | `@claim:schema-readiness`; [cold demo](evidence/polish-6-live/cold-demo-mobile.png). |
| F-2-2 — temporary disk was fixed at 2 GB | Bounded `--data-tmpfs-size` accepts 512 MB–64 GB and reaches the runtime and receipt. | `@claim:data-tmpfs-size`; live `/#install`. |
| F-2-3 — CLI demo behavior was unlisted | The CLI demo copies its sample to a separate directory and completes the controlled real drill there. | `@claim:cli-demo`; [public clean-claim summary](evidence/polish-6-clean-public/summary.txt). |
| F-2-4 — default signing-key behavior was unlisted | Adjacent key location, Unix `0600`, and verification remain tested. | `@claim:default-signing-key`; public clean claim. |
| F-2-5 — Podman support was unlisted | A controlled executable named `podman` receives the same isolation arguments. | `@claim:podman-runtime`; public clean claim. |
| F-3-1 — one-click demo opened idle | Canonical `/?demo=1` starts automatically and shows versions, schema, role, table, signature, and pass evidence in the first phone viewport. | `@claim:sample-demo`; proof ends at 666 px in [cold audit](evidence/polish-6-live/cold-audit.json); [cold demo](evidence/polish-6-live/cold-demo-mobile.png). |
| F-3-2 — dump-format proof covered one format | One claim exercises plain SQL plus custom, tar, and directory archives. | `@claim:dump-formats`; public clean claim. |
| F-3-3 — one-line JSON output was unlisted | Pass, compatibility failure, and startup error each produce one parseable JSON line. | `@claim:json-output`; public clean claim. |
| F-3-4 — demo canonicals conflicted | `/demo` normalizes to canonical `/?demo=1`; the sitemap lists that canonical once. | Exact metadata/canonical and sitemap tests; production suite. |
| F-3-5 — landing used unexplained HMAC jargon | Landing copy says “a signature you can verify”; the technical README defines HMAC. | [copy audit](copy-audit.md); live `/`. |
| F-3-6 — third desktop fact was clipped | All three facts remain inside the cold 1440×900 screen and the 390×844 phone screen. | Desktop first-screen test; live phone facts end at 771 px in [cold audit](evidence/polish-6-live/cold-audit.json). |
| F-4-1 — successful signature proof was absent | The receipt claim verifies pass and failure receipts and rejects tampering. | `@claim:signed-receipt`; public clean claim. |
| F-5-1 — install test used a local fixture | The claim resolves public `main`, clones that GitHub commit, installs it, and runs help. | `@claim:install-from-site`; public clean clone resolved `18bca79`. |
| Verification P0 — unavailable checkout | Restore Drill remains free with no checkout, billing call, or purchase promise. | `@claim:free-cli`; production request audit stayed same-origin. |
| Verification P2 — mutable fingerprinted assets | Fingerprinted assets keep the one-year immutable cache rule. | `@regression:immutable-static-assets`; [artifact and route evidence](evidence/polish-6-live/artifact-routes.txt). |

## Controller acceptance evidence

- All 20 exact claim commands passed independently from public clean clone
  `/tmp/restore-drill-polish6-public.VMtX29/repo` at `18bca79`. See
  [summary.txt](evidence/polish-6-clean-public/summary.txt).
- A separate clean clone passed `npm test`: 5 Rust tests and 36 Playwright
  tests. It also passed `npm run build`. See [full-suite.log](evidence/polish-6-clean-local/full-suite.log)
  and [build.log](evidence/polish-6-clean-local/build.log).
- Formatting, Clippy with warnings denied, `cargo package --locked --no-verify`,
  dependency audit, manifest/tag cardinality, and diff checks passed.
- The post-deploy production suite passed all 36 browser tests, including six
  axe route scans, keyboard/focus, mobile, privacy, offline, metadata, and HTTP
  404 coverage. See [production-suite.log](evidence/polish-6-live/production-suite.log).
- Worker URL verification found correct titles, `lang`, one `h1`, one `main`,
  complete alt text, labelled buttons, and no console errors on `/` and
  `/?demo=1`. See [home verify](evidence/polish-6-live/home/verify.json) and
  [demo verify](evidence/polish-6-live/demo/verify.json).
- Lighthouse mobile scored Performance 100, Accessibility 100, Best Practices
  100, and SEO 100. LCP was 1.9 s, CLS 0, and TBT 30 ms. See
  [lighthouse.json](evidence/polish-6-live/lighthouse.json).
- Live HTML, JavaScript, and CSS hashes match the deployed local artifact.
  Known routes return 200; an unknown route returns 404. See
  [artifact-routes.txt](evidence/polish-6-live/artifact-routes.txt).

The catalog description is now “Prove a Postgres backup restores into its
intended version before an outage” (75 characters, verb first).
