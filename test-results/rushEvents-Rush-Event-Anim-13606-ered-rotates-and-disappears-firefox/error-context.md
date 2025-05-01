# Test info

- Name: Rush Event Animations >> Black hole animation appears, is centered, rotates, and disappears
- Location: /Users/shanesweeney/Documents/GitHub/Cosmic-Clicker/tests/rushEvents.spec.ts:16:3

# Error details

```
Error: locator.waitFor: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.rush-blackhole') to be detached
    56 × locator resolved to visible <div class="rush-blackhole fixed inset-0 pointer-events-none z-40 flex items-center justify-center">…</div>

    at /Users/shanesweeney/Documents/GitHub/Cosmic-Clicker/tests/rushEvents.spec.ts:22:21
```

# Page snapshot

```yaml
- main:
  - heading "Cosmic Clicker" [level=1]
  - button:
    - img
  - button:
    - img
  - img
  - text: "0"
  - img
  - text: "0/sec Click Power: 4"
  - img
- button:
  - img
- text: Click Power
- button:
  - img
- text: Passive Income
- button:
  - img
- text: Event Chance
- button:
  - img
- text: "Bulk Purchase:"
- button "1x"
- button "5x"
- button "10x"
- button "25x"
- img
- heading "Stellar Enhancement" [level=4]
- text: Lvl 0
- paragraph: Harness stellar energy to enhance your clicking power
- paragraph: "Current: +0 per click"
- paragraph: "After 1x: +2 per click"
- text: "Cost (1x): 15"
- img
- heading "Gravitational Amplifier" [level=4]
- text: Lvl 0
- paragraph: Amplify your clicks with gravitational force
- paragraph: "Current: +0 per click"
- paragraph: "After 1x: +5 per click"
- text: "Cost (1x): 100"
- img
- heading "Supernova Boost" [level=4]
- text: Lvl 0
- paragraph: Channel the power of supernovas into your clicks
- paragraph: "Current: +0 per click"
- paragraph: "After 1x: +15 per click"
- text: "Cost (1x): 500"
- img
- heading "Cosmic Resonance" [level=4]
- text: Lvl 0
- paragraph: Harmonize with the universe for enhanced clicking power
- paragraph: "Current: +0 per click"
- paragraph: "After 1x: +50 per click"
- text: "Cost (1x): 2.50K"
- img
- heading "Quantum Alignment" [level=4]
- text: Lvl 0
- paragraph: Align quantum particles for maximum click efficiency
- paragraph: "Current: +0 per click"
- paragraph: "After 1x: +200 per click"
- text: "Cost (1x): 10.00K"
- heading "Rush Events" [level=2]
- button "×"
- heading "Active Events" [level=3]
- list:
  - listitem:
    - img
    - text: "Black Hole Rift Time left: 3s"
- heading "Possible Events" [level=3]
- list:
  - listitem:
    - img "Meteor"
    - text: "Meteor Shower A flurry of meteors increases all production! Chance: 0.5% Multiplier: 2x Duration: 30s"
  - listitem:
    - img
    - text: "Black Hole Rift A black hole rift supercharges your stardust gain! Chance: 0.5% Multiplier: 4x Duration: 30s"
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | // Helper to trigger events in dev mode
   4 | async function triggerEvent(page, eventId) {
   5 |   await page.goto('/');
   6 |   // Wait for the dev buttons to appear
   7 |   await page.waitForSelector('button:text("Trigger Black Hole Rift")');
   8 |   if (eventId === 'blackHoleRift') {
   9 |     await page.click('button:text("Trigger Black Hole Rift")');
  10 |   } else if (eventId === 'meteorShower') {
  11 |     await page.click('button:text("Trigger Meteor Shower")');
  12 |   }
  13 | }
  14 |
  15 | test.describe('Rush Event Animations', () => {
  16 |   test('Black hole animation appears, is centered, rotates, and disappears', async ({ page }) => {
  17 |     await page.goto('/');
  18 |     await page.click('button:text("Trigger Black Hole Rift")');
  19 |     const blackhole = page.locator('.rush-blackhole');
  20 |     await expect(blackhole).toBeVisible();
  21 |     // Optionally: check for rotation via style or screenshot diff
> 22 |     await blackhole.waitFor({ state: 'detached', timeout: 35000 });
     |                     ^ Error: locator.waitFor: Test timeout of 30000ms exceeded.
  23 |   });
  24 |
  25 |   test('Meteor shower animation appears, meteors animate, and disappears', async ({ page }) => {
  26 |     await page.goto('/');
  27 |     await page.click('button:text("Trigger Meteor Shower")');
  28 |     const meteor = page.locator('.rush-meteor');
  29 |     await expect(meteor.first()).toBeVisible({ timeout: 5000 });
  30 |     await meteor.first().waitFor({ state: 'detached', timeout: 35000 });
  31 |   });
  32 | }); 
```