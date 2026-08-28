# Restore Drill visual thesis

## Direction

Restore Drill uses a **risograph tactile collage**. Backup recovery is normally invisible until it fails. The visual system turns it into a physical rehearsal: torn paper layers are dumps, registration marks are checks, and overlapping ink shows where source and target versions agree or drift.

The interface is deliberately not a generic dashboard. It has an offset two-column editorial rhythm, thick rules, clipped paper corners, visible grain, and a terminal that reads like a stamped drill card.

## Palette

| Token | Value | Use |
| --- | --- | --- |
| `paper` | `#F4E8CD` | warm uncoated stock background |
| `paper-deep` | `#E6D3AE` | section changes and pasted layers |
| `ink` | `#18231F` | primary text and rules |
| `ink-muted` | `#4D5B54` | secondary copy |
| `riso-red` | `#B52A2A` | primary action and failed checks |
| `riso-blue` | `#155D82` | links, focus, and target container |
| `riso-yellow` | `#F2B632` | caution and registration marks |
| `pass` | `#1E6B4F` | passed checks, always with a word or mark |
| `night` | `#111916` | terminal surface |
| `night-text` | `#EADFC5` | terminal text |

All body-size text combinations meet WCAG AA. The thesis is single-mode because the paper-and-ink metaphor depends on a consistent substrate; the terminal supplies a dark treatment within it.

## Type

- Display: **Arial Black**, with `Arial` and sans-serif fallbacks. Its blunt, compressed forms resemble workshop labels.
- Body and utility: **Courier New**, with `Courier` and monospace fallbacks. It ties instructions to terminal output and keeps receipts scannable.
- No fonts are downloaded. System faces make the first load smaller and keep private environments offline-safe.

## Spacing and shape

- An 8 px base grid: 8, 16, 24, 32, 48, 64, 96.
- Copy measures at most 68 characters.
- Buttons and inputs are at least 44 px tall.
- Surfaces use square edges, 2 px ink rules, offset shadows, and one clipped corner. Pasted notes may rotate up to 1.25 degrees.
- Desktop sections alternate a 5/7 column collage. At 390 px they become one column; decorative scraps move behind content or disappear.

## Interaction grammar

- Primary actions depress by 3 px, like a stamp meeting paper.
- Focus uses a 3 px blue outline with a 3 px paper gap.
- Demo checks enter as individual stamped rows. No element loops.
- Route changes focus the page heading and announce its title.
- Errors use a red left rule plus a plain next step. Success never relies on green alone.

## Motion policy

One signature motion is **registration settling**: the red and blue print layers begin offset by 5 px and align over 240 ms when a sample drill starts. Check rows then appear over 180 ms. Under `prefers-reduced-motion: reduce`, layers are aligned immediately and results appear without translation or smooth scrolling.

## Original asset plan and provenance

- `site/public/restore-press.webp`: generated for this product with `/opt/fleet/lib/gen-image.sh`, using the factory `factory-image` deployment. Prompt asks for a text-free risograph cut-paper scene of a database dump passing through a blue disposable Postgres cylinder while red and yellow registration marks expose compatibility checks. The image is an original generated asset and will be optimized below 300 KB.
- `site/public/og.webp`: a 1200×630 crop/composition derived from that original art.
- Favicon and small marks are hand-authored geometric SVG. They depict two offset database cylinders and are not taken from an icon set.

No image contains essential text. The hero alt text explains its purpose.
