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

test('@claim:paid-kit shows the one-time price and keeps the CLI free', async ({ page }) => {
  await page.goto('/');
  const paid = page.locator('.paid');
  await expect(paid).toContainText('$49');
  await expect(paid).toContainText('one time');
  await expect(paid).toContainText('The CLI stays free.');
  await expect(paid.getByRole('link', { name: 'Buy the Team Kit' })).toHaveAttribute('href', /api\.sociobot\.in\/api\/v1\/products\/restore-compatibility-drill\/checkout/);
});

test('a returned license is stored, stripped from the URL, and opens the Team Kit', async ({ page }) => {
  await page.route('https://api.sociobot.in/**', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null }),
  }));
  await page.goto('/?license=test-license');
  await expect(page).toHaveURL('http://127.0.0.1:4173/');
  await expect(page.locator('#team-kit')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('sb_license:restore-compatibility-drill'))).toBe('test-license');
  await page.getByRole('link', { name: 'Open the Team Kit' }).click();
  await expect(page).toHaveURL(/\/team-kit$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Schedule your restore drill' })).toBeVisible();
});

for (const route of ['/', '/demo', '/team-kit', '/privacy', '/terms', '/missing-page']) {
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

test('390px layout has no horizontal page overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const width = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(width.scroll).toBeLessThanOrEqual(width.client);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
