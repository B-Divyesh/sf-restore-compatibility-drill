# Polish 2 — cumulative finding closure

**Released candidate repaired:** `7330c4731fee4b481160137fd7620e66a71816cd`  
**Adversarial report:** `c72213c1b5f3e4408a6cfec2ed39b8c58480fd1e`  
**Implementation commit:** `ab56739b276d720213e90f6365c815275b5bdde8`  
**Production-test commit:** `d820d2be462210c101b8f5e76cfabc9e253476f7`  
**Live URL:** <https://restore-compatibility-drill.sociobot.in>

Every current and earlier finding is closed. No severity was deferred.

## Review 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 — schema readiness absent | Added repeatable `--expect-schema`, identifier validation, a `pg_namespace` query, distinct schema receipt checks, and both present/missing outcomes. The bundled SQL now creates an empty `restore_ready` schema; CLI demo, browser sample, README, and landing workflow name it. | `@claim:schema-readiness reports present and missing required schemas`; `@claim:cli-demo`; Rust receipt-v1 compatibility test; screenshot `.factory/evidence/polish-2-live-demo/screenshot-mobile.png`; live `/?demo=1` showed `Schema restore_ready` and replayed its pass row. |
| F-2-2 — fixed 2 GB temporary disk | Added `--data-tmpfs-size` to `run` and `demo`, default `2g`, bounded `512m`–`64g`. The selected size reaches the runtime and receipt schema v2. README and the live install section give an 8 GB example. | `@claim:data-tmpfs-size sends a bounded selected disk size to the runtime and receipt`; Rust boundary cases; screenshot `.factory/evidence/polish-2-live-home/screenshot-desktop.png`; live `/` showed the 8 GB command directly below the drill command. |
| F-2-3 — real CLI demo unlisted and untested | Added `cli-demo` to `.factory/claims.json`. Its test invokes the real binary with the controlled runtime and an explicit output directory, then asserts the copied sample, pass receipt, signing key, schema/role/table checks, and unchanged source sample. | `@claim:cli-demo copies and runs the bundled sample in its isolated output directory`; screenshot `.factory/evidence/polish-2-live-demo/screenshot-mobile.png`; live `/?demo=1` retained the honest replay/real-CLI distinction. |
| F-2-4 — default signing key location and permissions unlisted | Added `default-signing-key` to the claims manifest. The test omits `--signing-key`, checks the adjacent filename and Unix `0600` mode, then verifies the receipt with that key. | `@claim:default-signing-key creates the adjacent Unix key with private permissions`; screenshot `.factory/evidence/polish-2-live-home/screenshot-desktop.png` shows the signed-receipt context; live `/` retained the signed JSON receipt explanation. |
| F-2-5 — Podman support unlisted and untested | Added `podman-runtime` to the claims manifest. Its test selects a controlled executable literally named `podman` and asserts no network, no published port, bounded tmpfs, and a read-only backup mount. | `@claim:podman-runtime selects Podman with the same isolation boundary`; screenshot `.factory/evidence/polish-2-live-home/screenshot-desktop.png` shows the isolation facts; public GitHub install at `d820d2b` exposes the documented runtime option. |

## Earlier review findings and regressions

| Finding | Closure retained | Evidence |
| --- | --- | --- |
| F-1-1 — no usable public install path | The visible GitHub link and full clone/install sequence remain. A fresh public GitHub clone installed the binary and exposed both new options. | `@claim:install-from-site`; public clone `/tmp/restore-drill-polish-2-public.kVNY3C/repo` at `d820d2b`; screenshot `.factory/evidence/polish-2-live-home/screenshot-mobile.png`; live `/#install`. |
| F-1-2 — demo persistence untested | Demo state remains memory-only; Reset cancels timers and reload returns the first frame. The test inspects localStorage, sessionStorage, IndexedDB, and OPFS. | `@claim:demo-no-persistence`; screenshot `.factory/evidence/polish-2-live-demo/screenshot-mobile.png`; live `/?demo=1` banner displayed Reset demo and Start for real. |
| F-1-3 — unlisted “without Docker” claim | First-screen outcome remains literal: “Open a browser replay of the sample drill.” | `@claim:sample-demo`; screenshot `.factory/evidence/polish-2-live-home/screenshot-mobile.png`; cold live `/` reached `/?demo=1` in one click. |
| F-1-4 — overlong README sentence | The development sentence remains split into two short sentences. | `.factory/copy-audit.md`; clean-clone `npm test`; public README at `d820d2b`. |
| F-1-5 — unexplained tmpfs | README still defines tmpfs as a temporary memory disk and now gives a bounded sizing path. | `@claim:isolated-container`; `@claim:data-tmpfs-size`; public README at `d820d2b`. |
| F-1-6 — ambiguous Copy controls | Visible labels remain “Copy install command” and “Copy drill command”; the mobile controls stack without overflow. | `390px layout has no horizontal page overflow`; screenshot `.factory/evidence/polish-2-live-home/screenshot-mobile.png`; live `/#install`. |
| Verification P0 — unavailable checkout | Product remains a free CLI with no checkout, billing call, or paid promise. | `@claim:free-cli @regression:unavailable-checkout`; live full flow made only same-origin requests. |
| Verification P2 — mutable static assets | The checked-in deployment rule remains immutable, and the live fingerprinted JS returned the required header. | `@regression:immutable-static-assets`; live `assets/index-oXHM39TZ.js` returned `Cache-Control: public, max-age=31536000, immutable`. |

## Controller acceptance areas

| Area | Final evidence |
| --- | --- |
| First screen | Five-word job headline, 13-word audience sentence, one sample action with a literal outcome, and three facts remain visible at 390×844. Screenshot: `.factory/evidence/polish-2-live-home/screenshot-mobile.png`. |
| One-click isolated sample | `/?demo=1` opens populated sample data with a persistent banner, Reset demo, and Start for real. `sample-demo`, `demo-no-persistence`, and `browser-privacy` passed locally and live. |
| Claims | `.factory/claims.json` has 18 entries. Every exact manifest command passed separately from final clean clone `/tmp/restore-drill-polish-2-final.IvzR0z/repo` at `0e1b5cc`. |
| Routing, titles, focus, 404, legal | The live 28-test suite passed route titles, metadata, canonical URLs, one `h1`, heading focus after history navigation, Privacy/Terms links, and an actual HTTP 404. |
| Mobile and accessibility | All six routes passed Playwright axe serious/critical scans. The 390 px overflow test passed. Worker verification found one `h1`, one main landmark, complete alt text, labelled buttons, and no console errors. |
| Privacy and offline | Demo traffic stayed same-origin, all browser stores stayed empty, and `/demo` reloaded offline after service-worker activation. |
| Performance | Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.8 s, CLS 0, TBT 0 ms. JS is 13.68 KB raw / 4.97 KB gzip; CSS is 10.94 KB raw / 3.25 KB gzip. |
| Visual identity | Cold desktop and mobile screenshots retain the warm paper, offset riso inks, original restore-press art, press terminal, clipped notes, and stamped actions from `.factory/design.md`. |

## Deployment and cold-live result

The work-order command built `dist/site` and deployed it with `/opt/fleet/lib/deploy-static.sh`. Azure deployment `c6a0aeec-a6ac-4af6-8596-14b74237ec1d` succeeded. Final live HTML, JS, and CSS SHA-256 hashes match the local artifact byte-for-byte. Worker `verify-url.sh` passed `/` and `/?demo=1` with no console errors. The final live Playwright run passed all 28 tests, and every reviewed finding was rechecked after deployment.
