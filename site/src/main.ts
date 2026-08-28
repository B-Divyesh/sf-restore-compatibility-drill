import './style.css';
import heroArt from './restore-press.webp?url';

const PRODUCT = 'Restore Drill';
type Route = 'home' | 'demo' | 'privacy' | 'terms' | 'not-found';

const routeFromPath = (): Route => {
  if (location.pathname === '/') return 'home';
  if (location.pathname === '/demo') return 'demo';
  if (location.pathname === '/privacy') return 'privacy';
  if (location.pathname === '/terms') return 'terms';
  return 'not-found';
};

const escapeHtml = (value: string): string => value.replace(/[&<>'"]/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
}[char] ?? char));

const shell = (content: string, demo = false): string => `
  ${demo ? `<aside class="demo-banner" aria-label="Demo mode"><strong>Demo — sample data, nothing is saved</strong><span><button class="text-button" data-reset-demo>Reset demo</button><a href="/" data-link>Start for real</a></span></aside>` : ''}
  <header class="site-header">
    <a class="wordmark" href="/" data-link aria-label="Restore Drill home"><span aria-hidden="true" class="wordmark-mark">RD</span>${PRODUCT}</a>
    <nav aria-label="Main navigation">
      <a href="/demo" data-link>Demo</a>
      <a href="/#install">Install</a>
      <a href="/privacy" data-link>Privacy</a>
    </nav>
  </header>
  ${content}
  <footer>
    <p><strong>${PRODUCT}</strong> — prove a Postgres backup restores.</p>
    <nav aria-label="Footer navigation"><a href="/privacy" data-link>Privacy</a><a href="/terms" data-link>Terms</a><a href="https://sociobot.in" rel="external">Built by Param Factory <span class="sr-only">(external)</span></a></nav>
    <p class="build">v0.1.0 · build 2026.08.28</p>
  </footer>`;

const terminal = (interactive = false): string => `
  <section class="terminal-wrap" aria-labelledby="terminal-title">
    <div class="terminal-tape" aria-hidden="true"></div>
    <div class="terminal">
      <div class="terminal-head"><h2 id="terminal-title">Sample restore drill</h2><span>postgres:15</span></div>
      <div class="terminal-screen" role="region" aria-live="polite" aria-label="Recorded Restore Drill output">
        <p><span class="prompt">$</span> restore-drill demo --postgres 15</p>
        <div id="terminal-output" class="terminal-output">
          <p class="muted">Ready to restore the bundled sample backup.</p>
        </div>
      </div>
      ${interactive ? '<button class="button stamp-button" id="run-demo">Run sample drill</button>' : '<a class="button stamp-button" href="/demo" data-link>Try it with sample data</a>'}
    </div>
    <p class="caption">A browser replay of the bundled <code>restore-drill demo</code> run. Use the CLI for a real restore.</p>
  </section>`;

const homePage = (): string => shell(`
  <main id="main">
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">A recovery check you can keep</p>
        <h1 tabindex="-1">Prove your Postgres backup restores</h1>
        <p class="lede">For teams that need a recovery answer before an outage, not during one.</p>
        <div class="hero-action"><a class="button" href="/demo" data-link>Try it with sample data</a><span>See a complete drill without Docker.</span></div>
        <ul class="plain-facts" aria-label="Product facts">
          <li>Runs Postgres in a disposable local container.</li>
          <li>Keeps your backup on your machine.</li>
          <li>The CLI is free and writes signed JSON receipts.</li>
        </ul>
      </div>
      <figure class="hero-art">
        <img src="${heroArt}" width="1200" height="800" fetchpriority="high" alt="A risograph database press turns backup pages into a checked and sealed restore receipt." />
        <figcaption>Rehearse the restore. Keep the receipt.</figcaption>
      </figure>
    </section>

    <section class="preview-section" aria-label="Product preview">
      ${terminal(false)}
      <div class="receipt-note">
        <p class="stamp">SIGNED</p>
        <h2>One receipt records the evidence</h2>
        <p>The JSON receipt includes the backup hash, target version, checks, duration, and HMAC signature.</p>
        <pre><code>{
  "status": "pass",
  "postgres_target": "15",
  "backup_sha256": "2ee6…9a1c",
  "signature": {
    "algorithm": "HMAC-SHA256"
  }
}</code></pre>
      </div>
    </section>

    <section class="how" aria-labelledby="how-title">
      <p class="section-number">01—03</p>
      <h2 id="how-title">How the drill works</h2>
      <ol>
        <li><strong>Name the target.</strong><span>Choose an exact Postgres version and expected extensions, roles, and tables.</span></li>
        <li><strong>Restore in isolation.</strong><span>The CLI mounts your backup read-only. The container has no network or published port.</span></li>
        <li><strong>Keep the result.</strong><span>Pass or fail, the CLI writes a signed JSON receipt with the next step.</span></li>
      </ol>
    </section>

    <section id="install" class="install" aria-labelledby="install-title">
      <div>
        <p class="eyebrow">Local install</p>
        <h2 id="install-title">Run your first real drill</h2>
        <p>Build the single Rust binary, then point it at a local backup file.</p>
      </div>
      <div class="command-block">
        <button class="copy-button" data-copy="cargo install --path ." aria-label="Copy install command">Copy</button>
        <pre><code>cargo install --path .</code></pre>
        <button class="copy-button" data-copy="restore-drill run --dump backup.sql --postgres 15 --expect-extension pgcrypto --expect-table public.accounts" aria-label="Copy drill command">Copy</button>
        <pre><code>restore-drill run \\
  --dump backup.sql \\
  --postgres 15 \\
  --expect-extension pgcrypto \\
  --expect-table public.accounts</code></pre>
      </div>
    </section>

    <section class="boundaries" aria-labelledby="boundaries-title">
      <div><p class="section-number">BOUNDARY</p><h2 id="boundaries-title">This is not another backup service</h2></div>
      <ul>
        <li>It does not connect to production.</li>
        <li>It does not upload or retain your backup.</li>
        <li>It does not replace provider recovery procedures.</li>
        <li>It does prove one backup against one declared target.</li>
      </ul>
    </section>

  </main>`, false);

const demoPage = (): string => shell(`
  <main id="main" class="demo-page">
    <section class="page-intro"><p class="eyebrow">Browser sandbox</p><h1 tabindex="-1">Run a sample restore drill</h1><p>This replay uses the backup bundled with the CLI. It does not read or save your files.</p></section>
    ${terminal(true)}
    <section class="sample-sheet" aria-labelledby="sample-title">
      <div><p class="stamp blue">SAMPLE</p><h2 id="sample-title">What this sample checks</h2></div>
      <dl><div><dt>Backup</dt><dd>Postgres 15.8 plain SQL</dd></div><div><dt>Target</dt><dd>Postgres 15</dd></div><div><dt>Extension</dt><dd>plpgsql</dd></div><div><dt>Role</dt><dd>restore_reader</dd></div><div><dt>Table</dt><dd>public.restore_probe</dd></div></dl>
    </section>
  </main>`, true);

const legalPage = (kind: 'privacy' | 'terms'): string => {
  const privacy = kind === 'privacy';
  return shell(`<main id="main" class="legal-page"><article>
    <p class="eyebrow">Last updated 28 August 2026</p>
    <h1 tabindex="-1">${privacy ? 'Privacy at Restore Drill' : 'Terms for Restore Drill'}</h1>
    ${privacy ? `
      <h2>Your backup stays local</h2><p>The CLI reads the backup path you provide. It mounts that path read-only in a local container.</p>
      <h2>What the site stores</h2><p>The browser demo stores no sample data. Its replay state disappears on reload.</p>
      <h2>What the site sends</h2><p>The browser demo sends no sample data off-site.</p>
      <h2>What we do not collect</h2><p>This site has no analytics, advertising scripts, or third-party fonts.</p>
      <h2>Delete local data</h2><p>Clear this site's storage to remove any browser data.</p>
    ` : `
      <h2>License</h2><p>The CLI source is provided under the MIT License.</p>
      <h2>Safe use</h2><p>Use sanitized backups when policy requires them. Check provider terms before downloading a full backup.</p>
      <h2>No recovery guarantee</h2><p>A passed drill records one test. It does not guarantee every recovery path or future backup will pass.</p>
      <h2>Liability</h2><p>The software is provided without warranty under the MIT License.</p>
    `}
    <p><a href="/" data-link>Return to Restore Drill</a></p>
  </article></main>`);
};

const notFoundPage = (): string => shell(`<main id="main" class="not-found"><div class="misprint" aria-hidden="true">404</div><div><p class="eyebrow">This sheet missed the press</p><h1 tabindex="-1">This page was not restored</h1><p>The address does not match a page in this build.</p><a class="button" href="/" data-link>Return home</a></div></main>`);

const titles: Record<Route, string> = {
  home: 'Restore Drill — prove a Postgres backup restores',
  demo: 'Demo — Restore Drill',
  privacy: 'Privacy — Restore Drill',
  terms: 'Terms — Restore Drill',
  'not-found': 'Page not found — Restore Drill',
};

function render(focus = true): void {
  const route = routeFromPath();
  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app) return;
  document.title = titles[route];
  const canonical = `https://restore-compatibility-drill.sociobot.in${location.pathname}`;
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', canonical);
  document.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.setAttribute('content', canonical);
  app.innerHTML = route === 'home' ? homePage() : route === 'demo' ? demoPage() : route === 'privacy' ? legalPage('privacy') : route === 'terms' ? legalPage('terms') : notFoundPage();
  document.querySelector('main')?.setAttribute('tabindex', '-1');
  bindNavigation();
  bindCommon();
  if (route === 'demo') bindDemo();
  document.querySelector('#route-announcer')!.textContent = titles[route];
  if (focus) document.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function bindNavigation(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[data-link]').forEach(link => link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || link.target) return;
    event.preventDefault();
    history.pushState({}, '', link.href);
    render();
  }));
}

function bindCommon(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach(button => button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy ?? '');
      button.textContent = 'Copied';
    } catch {
      button.textContent = 'Copy failed';
    }
  }));
}

const demoFrames = [
  ['SETUP', 'Starting disposable postgres:15…'],
  ['PASS', 'Disposable Postgres accepted connections.'],
  ['PASS', 'Expected extension plpgsql exists.'],
  ['PASS', 'The backup restored without a database error.'],
  ['PASS', 'Expected role restore_reader exists.'],
  ['PASS', 'Expected table public.restore_probe exists.'],
  ['SIGNED', 'Receipt written with HMAC-SHA256.'],
  ['RESULT', 'PASS in 4.7s'],
];

function bindDemo(): void {
  const run = document.querySelector<HTMLButtonElement>('#run-demo');
  const output = document.querySelector<HTMLDivElement>('#terminal-output');
  const play = () => {
    if (!run || !output) return;
    run.disabled = true;
    run.textContent = 'Running sample…';
    output.innerHTML = '<p class="muted">Isolation: network none · no published port · tmpfs data</p>';
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    demoFrames.forEach((frame, index) => window.setTimeout(() => {
      const row = document.createElement('p');
      row.className = `result-line ${frame[0].toLowerCase()}`;
      row.innerHTML = `<strong>${escapeHtml(frame[0])}</strong> ${escapeHtml(frame[1])}`;
      output.append(row);
      if (index === demoFrames.length - 1) {
        run.disabled = false;
        run.textContent = 'Run sample again';
      }
    }, reduced ? 0 : 180 * (index + 1)));
  };
  run?.addEventListener('click', play);
  document.querySelector('[data-reset-demo]')?.addEventListener('click', () => {
    if (output) output.innerHTML = '<p class="muted">Ready to restore the bundled sample backup.</p>';
    if (run) { run.disabled = false; run.textContent = 'Run sample drill'; }
  });
}

window.addEventListener('popstate', () => render());
render(false);

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => undefined));
}
