import { test, expect } from '@playwright/test';

test.describe('Boomerang Fu Web', () => {
  test('loads landing page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.bf-game-logo-boom').first()).toBeVisible();
    await expect(page.locator('.bf-game-logo-fu').first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Play' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Play Now' })).toBeVisible();
  });

  test('loads play menu from /play', async ({ page }) => {
    await page.goto('/play');
    await expect(page.locator('.bf-game-logo-boom').first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Select Game Mode' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Free-for-All' })).toBeVisible();
  });

  test('navigates to game and renders canvas', async ({ page }) => {
    await page.goto('/play');
    await page.getByRole('option', { name: 'Free-for-All' }).click();
    await page.getByRole('button', { name: 'Start Match' }).click();
    await expect(page.locator('[data-testid="game-canvas"] canvas')).toBeVisible({
      timeout: 15000,
    });
  });

  test('mode select flow', async ({ page }) => {
    await page.goto('/play');
    await expect(page.getByRole('heading', { name: 'Select Game Mode' })).toBeVisible();
    await page.getByRole('option', { name: 'Free-for-All' }).click();
    await expect(page.getByRole('heading', { name: 'Mode: Free-for-All' })).toBeVisible();
    await expect(page.getByText('Bot difficulty')).toBeVisible();
  });

  test('lobby shows arena select with many maps', async ({ page }) => {
    await page.goto('/play');
    await page.getByRole('option', { name: 'Free-for-All' }).click();
    const options = page.locator('label').filter({ hasText: 'Arena' }).locator('select option');
    await expect(options.count()).resolves.toBeGreaterThanOrEqual(52);
  });

  test('landing Play CTA routes to play', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Play' }).first().click();
    await expect(page).toHaveURL(/\/play$/);
    await expect(page.getByRole('heading', { name: 'Select Game Mode' })).toBeVisible();
  });
});
