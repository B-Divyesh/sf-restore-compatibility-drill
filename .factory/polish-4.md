# Polish 4 — cumulative finding closure

**Released candidate repaired:** `d76174a32e71a73a6a60ceb8e3e8963ea14964a2`

**Adversarial report:** `f8dceea794f2d70340d51b122100d81605b4a0a3`

**Implementation commit:** `c6191d1fe1df0c01e62a7af49514f4edf97e1923`

**Deployment:** `bd3b534d-de82-4f26-891d-4648abb4e948`

**Live URL:** <https://restore-compatibility-drill.sociobot.in>

Every current and earlier finding is closed. No severity was deferred.

## Review 4 finding

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-4-1 — successful receipt signing was not proved | Expanded the sole `@claim:signed-receipt` test to complete a successful controlled-runtime drill, assert `status: pass` and `HMAC-SHA256`, and verify the receipt with its key. The same test still verifies a failed preflight receipt and rejects a changed receipt. The manifest now states this full sandbox. | `@claim:signed-receipt signs successful and failed receipts and detects a changed receipt`; clean-clone claim pass in `.factory/evidence/polish-4-clean-claims.txt`; signed-receipt copy in `.factory/evidence/polish-4-live/cold-home-desktop.png`; live `/` and `/?demo=1` passed the production suite. |

## Review 3 findings

| Finding | Closure retained | Evidence |
| --- | --- | --- |
| F-3-1 — one-click demo opened idle | The landing action still enters a fresh automatic replay. The completed schema, role, table, signature, and pass proof ends at 687.17 px in the first 390×844 viewport. | `@claim:sample-demo runs the bundled sample to a signed pass result`; `.factory/evidence/polish-4-live/cold-demo-mobile.png`; cold live `/` → `/?demo=1` in one click. |
| F-3-2 — dump-format test covered only one format | The one claim still exercises plain SQL plus custom, tar, and directory archives through the real binary. | `@claim:dump-formats restores plain SQL and every documented pg_dump archive format`; `.factory/evidence/polish-4-live/cold-home-desktop.png`; live GitHub source link returned 200. |
| F-3-3 — JSON output claim absent | `json-output` remains registered and proves one parseable stdout line for pass, compatibility failure, and startup error. | `@claim:json-output emits one valid JSON line for pass, compatibility failure, and startup error`; `.factory/evidence/polish-4-live/cold-home-mobile.png`; live README source returned 200. |
| F-3-4 — duplicate demo canonicals and sitemap gap | `/demo` still normalizes to canonical `/?demo=1`, and the sitemap lists that URL once. | `every route sets its title, metadata, canonical URL, heading, and legal links`; `the canonical demo is listed once in the sitemap`; `.factory/evidence/polish-4-live/cold-demo-mobile.png`; live `/demo` returned 200 and normalized in Chromium. |
| F-3-5 — landing used unexplained HMAC jargon | Landing copy still says “a signature you can verify”; the technical algorithm remains in the README signing section. | `.factory/copy-audit.md`; `@claim:signed-receipt`; `.factory/evidence/polish-4-live/cold-home-desktop.png`; cold live `/` contains no `HMAC`. |
| F-3-6 — third desktop fact was clipped | The three first-screen facts still finish inside the 1440×900 viewport. | `all three product facts fit in the cold desktop first screen`; `.factory/evidence/polish-4-live/cold-home-desktop.png`; production test passed against live `/`. |

## Review 2 findings

| Finding | Closure retained | Evidence |
| --- | --- | --- |
| F-2-1 — schema readiness absent | Repeatable `--expect-schema`, `pg_namespace` checking, receipt rows, and present/missing outcomes remain. | `@claim:schema-readiness reports present and missing required schemas`; `.factory/evidence/polish-4-live/cold-demo-mobile.png`; live demo shows `restore_ready`. |
| F-2-2 — fixed 2 GB temporary disk | `--data-tmpfs-size` remains bounded from 512 MB through 64 GB and reaches the runtime and receipt. | `@claim:data-tmpfs-size sends a bounded selected disk size to the runtime and receipt`; `.factory/evidence/polish-4-live/cold-home-desktop.png`; live `/#install` shows the 8 GB path. |
| F-2-3 — CLI demo claim absent | The CLI demo still copies the sample into its own directory and completes the controlled real run without changing the source. | `@claim:cli-demo copies and runs the bundled sample in its isolated output directory`; `.factory/evidence/polish-4-live/cold-demo-mobile.png`; live `/?demo=1` keeps the replay/real-CLI distinction. |
| F-2-4 — default signing-key behavior unproved | The adjacent default key, Unix `0600` mode, and receipt verification remain independently tested. | `@claim:default-signing-key creates the adjacent Unix key with private permissions`; `.factory/evidence/polish-4-live/cold-home-desktop.png`; live receipt-signing copy remains reachable through the source link. |
| F-2-5 — Podman support unproved | A controlled executable named `podman` still receives the full isolation arguments. | `@claim:podman-runtime selects Podman with the same isolation boundary`; `.factory/evidence/polish-4-live/cold-home-mobile.png`; live install/source links returned 200. |

## Review 1 findings

| Finding | Closure retained | Evidence |
| --- | --- | --- |
| F-1-1 — no usable public install path | The visible GitHub link and complete clone, directory, and locked-install commands remain. | `@claim:install-from-site public instructions install a working command from a clean clone`; `.factory/evidence/polish-4-live/cold-home-desktop.png`; live GitHub link returned 200. |
| F-1-2 — demo persistence assurance untested | Demo state remains memory-only. Reset and reload restart it; localStorage, sessionStorage, IndexedDB, and OPFS stay empty. | `@claim:demo-no-persistence reset and reload discard all browser replay state`; `.factory/evidence/polish-4-live/cold-demo-mobile.png`; cold live `/?demo=1` storage inspection was empty before and after reset/reload. |
| F-1-3 — unlisted “without Docker” claim | The first-screen outcome remains the literal “Open a browser replay of the sample drill.” | `@claim:sample-demo`; `.factory/evidence/polish-4-live/cold-home-mobile.png`; cold live `/` showed the literal outcome beside the action. |
| F-1-4 — overlong README sentence | The development instructions remain split into two short sentences. | `.factory/copy-audit.md`; clean-clone `npm test`; `.factory/evidence/polish-4-live/cold-home-desktop.png`; live public source returned 200. |
| F-1-5 — unexplained tmpfs | README still defines tmpfs as a temporary memory disk and supplies a bounded sizing option. | `@claim:isolated-container` and `@claim:data-tmpfs-size`; `.factory/evidence/polish-4-live/cold-home-desktop.png`; live `/#install` showed the larger-backup example. |
| F-1-6 — ambiguous Copy labels | Both visible controls still name the install or drill command and meet the phone touch-target baseline. | `mobile controls meet the 44px touch target baseline`; `.factory/evidence/polish-4-live/cold-home-mobile.png`; live `/#install` labels are “Copy install command” and “Copy drill command.” |

## Earlier verification findings

| Finding | Closure retained | Evidence |
| --- | --- | --- |
| Verification P0 — unavailable paid checkout | Restore Drill remains a free CLI with no checkout, billing request, paid route, or purchase claim. | `@claim:free-cli @regression:unavailable-checkout`; `.factory/evidence/polish-4-live/cold-home-mobile.png`; cold live request inspection stayed same-origin. |
| Verification P2 — mutable fingerprinted assets | Fingerprinted assets retain one-year immutable caching. | `@regression:immutable-static-assets`; `.factory/evidence/polish-4-live/home/verify.json`; live `assets/index-txjFCPkn.js` returned `public, max-age=31536000, immutable`. |

## Final acceptance evidence

- All 19 exact claim commands passed independently from clean clone `/tmp/restore-drill-polish-4-clean.apFRLB/repo`.
- Clean-clone `npm test` passed 5 Rust tests and 32 Playwright tests. The suite covers browser, accessibility, privacy, offline, keyboard, mobile, focus, routing, metadata, and 404 behavior.
- `npm run build`, formatting, Clippy with warnings denied, `cargo package --no-verify`, dependency audit, and diff checks passed.
- Production `npm test` passed all 32 tests after deployment.
- Cold demo inspection recorded one origin, empty browser stores, no console errors, automatic replay, and an offline reload.
- Every rendered live link returned 200 or resolved to a valid same-page fragment. Known routes returned 200; the unknown route returned 404.
- Worker verification passed `/` and `/?demo=1` with correct titles, `lang`, one `h1`, one `main`, complete alt text, labelled buttons, and no console errors.
- Lighthouse scored 100 in Performance, Accessibility, Best Practices, and SEO; LCP was 0.9 s, CLS 0, and TBT 50 ms.
- Local and live SHA-256 hashes match for HTML, JavaScript, CSS, and the original risograph hero asset.

The catalog description is now: “Prove a Postgres backup restores into its intended version before an outage” (75 characters).
