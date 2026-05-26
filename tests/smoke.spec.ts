import { test, expect } from '@playwright/test';

test.describe('Boomerang Fu Web', () => {
  test('loads main menu', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Boomerang Fu Web' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Menu' })).toBeVisible();
  });

  test('navigates to game and renders canvas', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Play' }).click();
    await expect(page.locator('[data-testid="game-canvas"] canvas')).toBeVisible({
      timeout: 15000,
    });
  });

  test('mode select flow', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Select Game Mode' })).toBeVisible();
    await page.getByRole('button', { name: 'Free-for-All' }).click();
    await expect(page.getByText('Mode: Free-for-All')).toBeVisible();
  });
});
