# Polish 5 — cumulative finding closure

**Released candidate repaired:** `a9a8ed093b174f7077c4b434fc2abc3bf0dadb7e`
**Adversarial report:** `791903b370fbb80eba7c37ec535427852939969c`
**Repair commit:** `c627fc57d8c7ab1f6ab561901516940693b55133`
**Deployment:** `5efd42a0-7885-4bc6-8dbc-8a9b1fac6544`
**Live URL:** <https://restore-compatibility-drill.sociobot.in>

Every finding from reviews 1–5 and both earlier verification reports is closed.
No blocking, major, minor, copy, claim, routing, visual, privacy, or quality item
is deferred.

## Finding-by-finding closure

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the visible GitHub source link and complete clone, directory, and locked-install sequence. | `@claim:install-from-site`; [home desktop](evidence/polish-5-live/home/screenshot-desktop.png); live source ref `c627fc5`. |
| F-1-2 | Kept the memory-only demo, reset behavior, persistent banner, and browser-store assertions. | `@claim:demo-no-persistence`; [demo mobile](evidence/polish-5-live/demo/screenshot-mobile.png); live `/?demo=1`. |
| F-1-3 | Kept the literal CTA outcome, “Open a browser replay of the sample drill.” | `@claim:sample-demo`; [home mobile](evidence/polish-5-live/home/screenshot-mobile.png); live `/`. |
| F-1-4 | Kept the README development instructions split into short sentences. | [copy audit](copy-audit.md); clean-clone `npm test`; live GitHub README at `c627fc5`. |
| F-1-5 | Kept `tmpfs` defined as a temporary memory disk and documented the bounded size option. | `@claim:isolated-container`, `@claim:data-tmpfs-size`; [home desktop](evidence/polish-5-live/home/screenshot-desktop.png); live source README. |
| F-1-6 | Kept visible result-naming labels for both copy controls and their mobile layout. | `mobile controls meet the 44px touch target baseline`; [home mobile](evidence/polish-5-live/home/screenshot-mobile.png); live `/#install`. |
| F-2-1 | Kept repeatable `--expect-schema`, `pg_namespace` checking, receipt rows, and the sample schema. | `@claim:schema-readiness`; [demo mobile](evidence/polish-5-live/demo/screenshot-mobile.png); live `/?demo=1`. |
| F-2-2 | Kept bounded `--data-tmpfs-size` from 512 MB through 64 GB in the CLI, runtime, receipt, and docs. | `@claim:data-tmpfs-size`; [home desktop](evidence/polish-5-live/home/screenshot-desktop.png); live `/#install`. |
| F-2-3 | Kept the CLI demo’s copied, isolated sample path and its real controlled-runtime proof. | `@claim:cli-demo`; [demo desktop](evidence/polish-5-live/demo/screenshot-desktop.png); live `/?demo=1` labels the browser path as a replay. |
| F-2-4 | Kept the adjacent default signing key, Unix `0600` permission, and receipt verification coverage. | `@claim:default-signing-key`; [home desktop](evidence/polish-5-live/home/screenshot-desktop.png); live source README. |
| F-2-5 | Kept Podman runtime selection under the same no-network, no-port, tmpfs, and read-only-mount boundary. | `@claim:podman-runtime`; [home mobile](evidence/polish-5-live/home/screenshot-mobile.png); live source README. |
| F-3-1 | Kept automatic sample replay on canonical demo entry, with pass, schema, role, table, and signature proof in the first phone viewport. | `@claim:sample-demo`; [demo mobile](evidence/polish-5-live/demo/screenshot-mobile.png); live `/?demo=1`. |
| F-3-2 | Kept one claim test covering plain SQL plus custom, tar, and directory pg_dump archives. | `@claim:dump-formats`; [home desktop](evidence/polish-5-live/home/screenshot-desktop.png); live source README. |
| F-3-3 | Kept the registered one-line JSON test for pass, compatibility failure, and startup failure. | `@claim:json-output`; [home mobile](evidence/polish-5-live/home/screenshot-mobile.png); live source README. |
| F-3-4 | Kept `/?demo=1` as the one canonical demo URL; `/demo` normalizes to it and the sitemap lists it once. | `every route sets its title, metadata, canonical URL, heading, and legal links`; [demo desktop](evidence/polish-5-live/demo/screenshot-desktop.png); live `/demo`. |
| F-3-5 | Kept the plain landing phrase “a signature you can verify”; technical HMAC detail stays in the README. | [copy audit](copy-audit.md); [home desktop](evidence/polish-5-live/home/screenshot-desktop.png); live `/`. |
| F-3-6 | Kept the reduced hero scale and spacing that place all three facts in the cold 1440×900 screen. | `all three product facts fit in the cold desktop first screen`; [home desktop](evidence/polish-5-live/home/screenshot-desktop.png); live `/`. |
| F-4-1 | Kept successful and failed receipt signing verification plus tamper rejection in the one receipt claim test. | `@claim:signed-receipt`; [demo desktop](evidence/polish-5-live/demo/screenshot-desktop.png); live source README. |
| F-5-1 | Replaced the local-fixture installation with public GitHub `ls-remote`, a public clone, detached checkout of that resolved SHA, the published locked install, and `restore-drill --help`. | `@claim:install-from-site`; [clean-claim evidence](evidence/polish-5-clean-claims.txt); live public `main` resolved to `c627fc5`. |
| Verification P0 | Kept the product free and removed all checkout, billing, and unavailable purchase behavior. | `@claim:free-cli`; [home mobile](evidence/polish-5-live/home/screenshot-mobile.png); live `/` requests stayed same-origin. |
| Verification P2 | Kept fingerprinted assets and the immutable one-year cache policy. | `@regression:immutable-static-assets`; [home desktop](evidence/polish-5-live/home/screenshot-desktop.png); live asset header test in production suite. |

## Verification and live recheck

- All 19 exact claim commands passed independently from clean public clone
  `/tmp/restore-drill-polish5-clean.UgMCAu/repo`; details are in
  [polish-5-clean-claims.txt](evidence/polish-5-clean-claims.txt).
- Clean-clone `npm test` passed 5 Rust tests and 32 Playwright tests. It covers
  browser behavior, axe scans, keyboard, mobile, routing, metadata, privacy,
  offline replay, and the designed 404.
- Clean-clone `npm run build`, `cargo fmt --check`, Clippy with warnings denied,
  `cargo package --no-verify`, `npm audit --omit=dev --audit-level=high`, and
  `git diff --check` all passed.
- After deployment, `PLAYWRIGHT_BASE_URL=https://restore-compatibility-drill.sociobot.in npm test`
  passed all 32 tests. Its output is in
  [production-suite.log](evidence/polish-5-live/production-suite.log).
- The worker verifier cold-opened `/` and `/?demo=1` without console errors.
  Their reports and screenshots are under [polish-5-live](evidence/polish-5-live/).
- Cold live checks returned 200 for `/`, `/?demo=1`, `/demo`, `/privacy`, and
  `/terms`; `/missing-page` returned the designed HTTP 404 shown in
  [cold-404-desktop.png](evidence/polish-5-live/cold-404-desktop.png).
- Lighthouse mobile report: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; LCP 1.893 s, CLS 0, TBT 33 ms. See
  [lighthouse.json](evidence/polish-5-live/lighthouse.json).

The catalog description is now “Prove a Postgres backup restores before an
outage” (8 words, 49 characters, verb first).
