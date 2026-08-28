import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const repo = resolve(import.meta.dirname, '..');
const publicRepo = 'https://github.com/B-Divyesh/sf-restore-compatibility-drill.git';

test('@claim:sample-demo runs the bundled sample to a signed pass result', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).first().click();
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page.getByLabel('Demo mode')).toContainText('Demo — sample data, nothing is saved');
  await expect(page.getByRole('button', { name: 'Reset demo' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Start for real' })).toHaveAttribute('href', '/#install');
  await expect(page.getByText('PASS in 4.7s')).toBeVisible();
  await expect(page.getByText('Expected schema restore_ready exists.')).toBeVisible();
  await expect(page.getByText('Receipt signature verified with the local key.')).toBeVisible();
  for (const value of ['restore_ready', 'restore_reader', 'public.restore_probe', 'Signature verified']) {
    const box = await page.locator('.demo-proof').getByText(value, { exact: true }).boundingBox();
    expect(box, value).not.toBeNull();
    expect(box!.y, value).toBeGreaterThanOrEqual(0);
    expect(box!.y + box!.height, value).toBeLessThanOrEqual(844);
  }
});

test('@claim:browser-privacy demo sends no sample data off-site', async ({ page }) => {
  const requests: Array<{ origin: string; type: string }> = [];
  page.on('request', request => requests.push({ origin: new URL(request.url()).origin, type: request.resourceType() }));
  await page.goto('/?demo=1');
  await expect(page.getByText('PASS in 4.7s')).toBeVisible();
  expect([...new Set(requests.map(request => request.origin))]).toEqual([new URL(page.url()).origin]);
  expect(requests.filter(request => ['font', 'websocket', 'eventsource'].includes(request.type))).toEqual([]);
  await expect(page.locator('script[src^="http"], link[rel="stylesheet"][href^="http"], link[rel="preload"][as="font"][href^="http"]')).toHaveCount(0);
});

test('@claim:demo-no-persistence reset and reload discard all browser replay state', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page.getByText('PASS in 4.7s')).toBeVisible();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('PASS in 4.7s')).toBeVisible();
  await expect(page.getByText('PASS in 4.7s')).toHaveCount(1);
  await page.getByRole('button', { name: 'Replay sample drill' }).click();
  await page.waitForTimeout(220);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('PASS in 4.7s')).toBeVisible();
  await expect(page.getByText('PASS in 4.7s')).toHaveCount(1);
  await page.reload();
  await expect(page.getByText('PASS in 4.7s')).toBeVisible();
  const storage = await page.evaluate(async () => {
    const databases = indexedDB.databases ? await indexedDB.databases() : [];
    const opfsEntries: string[] = [];
    if (navigator.storage.getDirectory) {
      const root = await navigator.storage.getDirectory();
      for await (const name of (root as unknown as { keys: () => AsyncIterableIterator<string> }).keys()) opfsEntries.push(name);
    }
    return {
      local: Object.keys(localStorage),
      session: Object.keys(sessionStorage),
      databases: databases.map(database => database.name),
      opfsEntries,
    };
  });
  expect(storage).toEqual({ local: [], session: [], databases: [], opfsEntries: [] });
});

test('@claim:install-from-site public instructions install a working command from a clean clone', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('/');
  const source = page.getByRole('link', { name: /Get the source on GitHub/ });
  await expect(source).toHaveAttribute('href', publicRepo.replace(/\.git$/, ''));
  await expect(page.locator('.command-block code').first()).toContainText(`git clone ${publicRepo}`);
  await expect(page.locator('.command-block code').first()).toContainText('cargo install --path . --locked');

  const temp = mkdtempSync(join(tmpdir(), 'restore-drill-install-'));
  const checkout = join(temp, 'sf-restore-compatibility-drill');
  const root = join(temp, 'installed');
  execFileSync('git', ['clone', '--quiet', '--no-local', repo, checkout]);
  execFileSync('cargo', ['install', '--path', '.', '--locked', '--root', root], { cwd: checkout, stdio: 'pipe' });
  const help = spawnSync(join(root, 'bin', 'restore-drill'), ['--help'], { encoding: 'utf8' });
  expect(help.status, help.stderr).toBe(0);
  expect(help.stdout).toContain('Restore a backup in an isolated disposable Postgres container');
});

test('@claim:free-cli @regression:unavailable-checkout does not advertise an unavailable purchase', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/');
  await expect(page.getByText('The CLI is free and writes signed JSON receipts.')).toBeVisible();
  await expect(page.locator('a[href*="/checkout"], a[href*="api.sociobot.in"]')).toHaveCount(0);
  expect(requests.some(url => url.includes('api.sociobot.in'))).toBe(false);
});

for (const route of ['/', '/?demo=1', '/demo', '/privacy', '/terms', '/missing-page']) {
  test(`accessibility smoke test ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter(item => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  });
}

test('routes work with history and restore heading focus', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Privacy' }).first().click();
  await expect(page).toHaveTitle('Privacy — Restore Drill');
  await expect(page.locator('h1')).toBeFocused();
  await page.goBack();
  await expect(page).toHaveTitle('Restore Drill — prove a Postgres backup restores');
  await expect(page.locator('h1')).toBeFocused();
});

test('every route sets its title, metadata, canonical URL, heading, and legal links', async ({ page }) => {
  const routes = [
    ['/', 'Restore Drill — prove a Postgres backup restores', 'Prove your Postgres backup restores'],
    ['/?demo=1', 'Demo — Restore Drill', 'Run a sample restore drill'],
    ['/demo', 'Demo — Restore Drill', 'Run a sample restore drill'],
    ['/privacy', 'Privacy — Restore Drill', 'Privacy at Restore Drill'],
    ['/terms', 'Terms — Restore Drill', 'Terms for Restore Drill'],
    ['/missing-page', 'Page not found — Restore Drill', 'This page was not restored'],
  ] as const;
  for (const [route, title, heading] of routes) {
    await page.goto(route);
    await expect(page).toHaveTitle(title);
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description?.length).toBeGreaterThan(20);
    expect(description?.length).toBeLessThanOrEqual(155);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', title);
    const canonical = route === '/?demo=1' || route === '/demo'
      ? 'https://restore-compatibility-drill.sociobot.in/?demo=1'
      : `https://restore-compatibility-drill.sociobot.in${route === '/missing-page' ? '/missing-page' : route}`;
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
    if (route === '/demo') await expect(page).toHaveURL(/\/\?demo=1$/);
    await expect(page.locator('footer a[href="/privacy"]')).toHaveCount(1);
    await expect(page.locator('footer a[href="/terms"]')).toHaveCount(1);
  }
});

test('the canonical demo is listed once in the sitemap', async () => {
  const sitemap = readFileSync(join(repo, 'site/public/sitemap.xml'), 'utf8');
  expect(sitemap).toContain('<loc>https://restore-compatibility-drill.sociobot.in/?demo=1</loc>');
  expect(sitemap).not.toContain('<loc>https://restore-compatibility-drill.sociobot.in/demo</loc>');
  expect(sitemap.match(/<loc>https:\/\/restore-compatibility-drill\.sociobot\.in\/\?demo=1<\/loc>/g)).toHaveLength(1);
});

test('static host configuration serves known routes and a designed HTTP 404', async ({ request }) => {
  const config = JSON.parse(readFileSync(join(repo, 'site/public/staticwebapp.config.json'), 'utf8')) as {
    navigationFallback?: unknown;
    routes: Array<{ route: string; rewrite?: string; statusCode?: number }>;
    responseOverrides: Record<string, { rewrite: string; statusCode: number }>;
  };
  expect(config.navigationFallback).toBeUndefined();
  expect(config.routes).toEqual(expect.arrayContaining([
    expect.objectContaining({ route: '/demo', rewrite: '/index.html' }),
    expect.objectContaining({ route: '/privacy', rewrite: '/index.html' }),
    expect.objectContaining({ route: '/terms', rewrite: '/index.html' }),
  ]));
  expect(config.routes.every(route => !(route.rewrite && route.statusCode))).toBe(true);
  expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html', statusCode: 404 });
  expect((await request.get('/404.html')).status()).toBe(200);
  if (process.env.PLAYWRIGHT_BASE_URL) {
    for (const route of ['/demo', '/privacy', '/terms']) expect((await request.get(route)).status()).toBe(200);
    expect((await request.get('/route-that-does-not-exist')).status()).toBe(404);
  }
});

test('keyboard skip link moves focus to the main landmark', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});

test('service worker keeps the demo available offline and includes the update lifecycle', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('/demo');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: 'Run a sample restore drill' })).toBeVisible();
  await context.setOffline(false);
  const worker = await page.request.get(new URL('/sw.js', page.url()).href);
  const source = await worker.text();
  expect(source).toContain('self.skipWaiting()');
  expect(source).toContain('self.clients.claim()');
  await context.close();
});

test('@regression:immutable-static-assets fingerprints the hero and configures immutable asset caching', async ({ page }) => {
  await page.goto('/');
  const image = page.locator('.hero-art img');
  await expect(image).toHaveAttribute('src', /\/assets\/restore-press-[A-Za-z0-9_-]+\.webp$/);
  const config = JSON.parse(readFileSync(join(repo, 'site/public/staticwebapp.config.json'), 'utf8')) as { routes: Array<{ route: string; headers?: Record<string, string> }> };
  expect(config.routes).toContainEqual({
    route: '/assets/*',
    headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
  if (process.env.PLAYWRIGHT_BASE_URL) {
    const assetUrl = new URL((await image.getAttribute('src'))!, page.url()).href;
    expect((await page.request.get(assetUrl)).headers()['cache-control']).toBe('public, max-age=31536000, immutable');
  }
});

test('390px layout has no horizontal page overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ['/', '/?demo=1', '/privacy', '/terms', '/missing-page']) {
    await page.goto(route);
    const width = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
    expect(width.scroll, route).toBeLessThanOrEqual(width.client);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  }
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Try it with sample data' }).first()).toBeVisible();
  await expect(page.getByText('Open a browser replay of the sample drill.')).toBeVisible();
});

test('all three product facts fit in the cold desktop first screen', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  for (const fact of await page.locator('.plain-facts li').all()) {
    const box = await fact.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.y + box!.height).toBeLessThanOrEqual(900);
  }
});

test('mobile controls meet the 44px touch target baseline', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ['/', '/?demo=1', '/privacy', '/terms', '/missing-page']) {
    await page.goto(route);
    for (const target of await page.locator('a, button').all()) {
      if (!(await target.isVisible())) continue;
      const box = await target.boundingBox();
      expect(box, `${route}: ${await target.textContent()}`).not.toBeNull();
      expect(box!.width, `${route}: ${await target.textContent()}`).toBeGreaterThanOrEqual(44);
      expect(box!.height, `${route}: ${await target.textContent()}`).toBeGreaterThanOrEqual(44);
    }
  }
});
