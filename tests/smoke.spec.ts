import { test, expect } from '@playwright/test';

test.describe('Boomerang Fu Web', () => {
  test('loads landing page', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Food fighters/i })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Play Free' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Play Now' })).toBeVisible();
  });

  test('loads play menu from /play', async ({ page }) => {
    await page.goto('/play');
    await expect(page.getByRole('heading', { name: 'Boomerang Fu Web' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Menu' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Select Game Mode' })).toBeVisible();
  });

  test('navigates to game and renders canvas', async ({ page }) => {
    await page.goto('/play');
    await page.getByRole('button', { name: 'Play' }).click();
    await expect(page.locator('[data-testid="game-canvas"] canvas')).toBeVisible({
      timeout: 15000,
    });
  });

  test('mode select flow', async ({ page }) => {
    await page.goto('/play');
    await expect(page.getByRole('heading', { name: 'Select Game Mode' })).toBeVisible();
    await page.getByRole('button', { name: 'Free-for-All' }).click();
    await expect(page.getByText('Mode: Free-for-All')).toBeVisible();
    await expect(page.getByText('Bot difficulty')).toBeVisible();
  });

  test('lobby shows arena select with many maps', async ({ page }) => {
    await page.goto('/play');
    await page.getByRole('button', { name: 'Free-for-All' }).click();
    const options = page.locator('label').filter({ hasText: 'Arena' }).locator('select option');
    await expect(options.count()).resolves.toBeGreaterThanOrEqual(52);
  });

  test('landing Play CTA routes to play', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Play Free' }).click();
    await expect(page).toHaveURL(/\/play$/);
    await expect(page.getByRole('heading', { name: 'Select Game Mode' })).toBeVisible();
  });
});
