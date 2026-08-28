import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('@claim:sample-demo runs the bundled sample to a signed pass result', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).first().click();
  await expect(page).toHaveURL(/\/demo$/);
  await page.getByRole('button', { name: 'Run sample drill' }).click();
  await expect(page.getByText('PASS in 4.7s')).toBeVisible();
  await expect(page.getByText('Receipt written with HMAC-SHA256.')).toBeVisible();
});

test('@claim:browser-privacy demo sends no sample data off-site', async ({ page }) => {
  const origins = new Set<string>();
  page.on('request', request => origins.add(new URL(request.url()).origin));
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Run sample drill' }).click();
  await expect(page.getByText('PASS in 4.7s')).toBeVisible();
  expect([...origins]).toEqual(['http://127.0.0.1:4173']);
});

test('@claim:free-cli @regression:unavailable-checkout does not advertise an unavailable purchase', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/');
  await expect(page.getByText('The CLI is free and writes signed JSON receipts.')).toBeVisible();
  await expect(page.locator('a[href*="/checkout"], a[href*="api.sociobot.in"]')).toHaveCount(0);
  expect(requests.some(url => url.includes('api.sociobot.in'))).toBe(false);
});

for (const route of ['/', '/demo', '/privacy', '/terms', '/missing-page']) {
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
  const worker = await page.request.get('http://127.0.0.1:4173/sw.js');
  const source = await worker.text();
  expect(source).toContain('self.skipWaiting()');
  expect(source).toContain('self.clients.claim()');
  await context.close();
});

test('@regression:immutable-static-assets fingerprints the hero and configures immutable asset caching', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.hero-art img')).toHaveAttribute('src', /\/assets\/restore-press-[A-Za-z0-9_-]+\.webp$/);
  const response = await page.request.get('http://127.0.0.1:4173/staticwebapp.config.json');
  const config = await response.json() as { routes: Array<{ route: string; headers?: Record<string, string> }> };
  expect(config.routes).toContainEqual({
    route: '/assets/*',
    headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
});

test('390px layout has no horizontal page overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const width = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(width.scroll).toBeLessThanOrEqual(width.client);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
