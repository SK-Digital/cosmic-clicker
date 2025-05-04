import { test, expect } from '@playwright/test';

test.describe('Prestige System', () => {
  test('Prestige button appears and modal opens', async ({ page }) => {
    // Set up state before app loads
    await page.addInitScript(() => {
      const state = {
        stardust: 1_000_000,
        totalStardustEarned: 1_000_000,
        clickPower: 1,
        passiveIncome: 0,
        lastSaved: Date.now(),
        lastTick: Date.now(),
        upgrades: {},
        activeEvents: [],
        eventChance: 0,
        achievements: {},
        totalClicks: 0,
        totalUpgradesBought: 0,
        totalEventsTriggered: 0,
        prestigeCount: 0,
        prestigeCurrency: 0,
      };
      localStorage.setItem('cosmicClickerGameState', JSON.stringify(state));
    });
    await page.goto('/');
    // Open prestige modal
    await page.locator('button[title="Prestige"]').click();
    await expect(page.locator('[data-testid="prestige-modal"]')).toBeVisible();
    await expect(page.locator('[data-testid="prestige-cosmic-shards"]')).toBeVisible();
    await expect(page.locator('[data-testid="prestige-confirm-btn"]')).toBeEnabled();
  });

  test('Prestiging resets progress and increases prestige count/currency', async ({ page }) => {
    // Set up state before app loads
    await page.addInitScript(() => {
      const state = {
        stardust: 1_000_000,
        totalStardustEarned: 1_000_000,
        clickPower: 1,
        passiveIncome: 0,
        lastSaved: Date.now(),
        lastTick: Date.now(),
        upgrades: {},
        activeEvents: [],
        eventChance: 0,
        achievements: {},
        totalClicks: 0,
        totalUpgradesBought: 0,
        totalEventsTriggered: 0,
        prestigeCount: 0,
        prestigeCurrency: 0,
      };
      localStorage.setItem('cosmicClickerGameState', JSON.stringify(state));
    });
    await page.goto('/');
    // Open prestige modal and confirm
    await page.locator('button[title="Prestige"]').click();
    await page.locator('[data-testid="prestige-confirm-btn"]').click();
    // Modal should close, stats should reset, prestige count/currency should increase
    await expect(page.locator('[data-testid="prestige-modal"]')).not.toBeVisible();
    // Open modal again to check stats
    await page.locator('button[title="Prestige"]').click();
    await expect(page.locator('[data-testid="prestige-count"]')).toHaveText('1');
    await expect(page.locator('[data-testid="prestige-cosmic-shards"]')).toHaveText('1');
  });
}); 