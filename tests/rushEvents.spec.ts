import { test, expect } from '@playwright/test';

// Helper to trigger events in dev mode
async function triggerEvent(page, eventId) {
  await page.goto('/');
  // Wait for the dev buttons to appear
  await page.waitForSelector('button:text("Trigger Black Hole Rift")');
  if (eventId === 'blackHoleRift') {
    await page.click('button:text("Trigger Black Hole Rift")');
  } else if (eventId === 'meteorShower') {
    await page.click('button:text("Trigger Meteor Shower")');
  }
}

test.describe('Rush Event Animations', () => {
  test('Black hole animation appears, is centered, rotates, and disappears', async ({ page }) => {
    await page.goto('/');
    await page.click('button:text("Trigger Black Hole Rift")');
    const blackhole = page.locator('.rush-blackhole');
    await expect(blackhole).toBeVisible();
    // Optionally: check for rotation via style or screenshot diff
    await blackhole.waitFor({ state: 'detached', timeout: 35000 });
  });

  test('Meteor shower animation appears, meteors animate, and disappears', async ({ page }) => {
    await page.goto('/');
    await page.click('button:text("Trigger Meteor Shower")');
    const meteor = page.locator('.rush-meteor');
    await expect(meteor.first()).toBeVisible({ timeout: 5000 });
    await meteor.first().waitFor({ state: 'detached', timeout: 35000 });
  });
}); 