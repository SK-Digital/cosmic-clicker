# Test info

- Name: Prestige System >> Prestiging resets progress and increases prestige count/currency
- Location: /Users/shanesweeney/Documents/GitHub/Cosmic-Clicker/tests/prestige.spec.ts:34:3

# Error details

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('[data-testid="prestige-confirm-btn"]')
    - locator resolved to <button disabled data-testid="prestige-confirm-btn" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded shadow">Prestige</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
      - waiting 100ms
    55 × waiting for element to be visible, enabled and stable
       - element is not enabled
     - retrying click action
       - waiting 500ms

    at /Users/shanesweeney/Documents/GitHub/Cosmic-Clicker/tests/prestige.spec.ts:59:64
```

# Page snapshot

```yaml
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- img "Star"
- main:
  - heading "Cosmic Clicker" [level=1]
  - img "Stardust"
  - text: "0"
  - img
  - text: "0/sec Click Power: 1"
  - img "Clicker"
- button "Click Power":
  - img "Click Power"
- text: Click Power
- button "Passive Income":
  - img "Passive Income"
- text: Passive Income
- button "Event Chance":
  - img "Event Chance"
- text: Event Chance
- button:
  - img
- text: "Bulk Purchase:"
- button "1x"
- button "5x"
- button "10x"
- button "25x"
- img "Star"
- heading "Stellar Enhancement" [level=4]
- text: Lvl 0
- paragraph: Harness stellar energy to enhance your clicking power
- paragraph: "Current: +0.00 stardust/sec After 1x: +2.00 stardust/sec"
- text: "Cost (1x): 15"
- img "Orbit"
- heading "Gravitational Amplifier" [level=4]
- text: Lvl 0
- paragraph: Amplify your clicks with gravitational force
- paragraph: "Current: +0.00 stardust/sec After 1x: +5.00 stardust/sec"
- text: "Cost (1x): 100"
- img "Star"
- heading "Supernova Boost" [level=4]
- text: Lvl 0
- paragraph: Channel the power of supernovas into your clicks
- paragraph: "Current: +0.00 stardust/sec After 1x: +15.00 stardust/sec"
- text: "Cost (1x): 500"
- img "Star"
- heading "Cosmic Resonance" [level=4]
- text: Lvl 0
- paragraph: Harmonize with the universe for enhanced clicking power
- paragraph: "Current: +0.00 stardust/sec After 1x: +50.00 stardust/sec"
- text: "Cost (1x): 2.50K"
- img "Star"
- heading "Quantum Alignment" [level=4]
- text: Lvl 0
- paragraph: Align quantum particles for maximum click efficiency
- paragraph: "Current: +0.00 stardust/sec After 1x: +200.00 stardust/sec"
- text: "Cost (1x): 10.00K"
- heading "Rush Events" [level=2]
- button "×"
- heading "Active Events" [level=3]
- text: No active rush events.
- heading "Possible Events" [level=3]
- list:
  - listitem:
    - img "Meteor"
    - text: "Meteor Shower A flurry of meteors increases all production! Chance: 0.5% Multiplier: 2x Duration: 30s"
  - listitem:
    - img "Black Hole"
    - text: "Black Hole Rift A black hole rift supercharges your stardust gain! Chance: 0.5% Multiplier: 4x Duration: 30s"
- heading "Prestige Prestige" [level=3]:
  - img "Prestige"
  - text: Prestige
- text: "Prestige Count: 0 Cosmic Shards: 0 Stardust Multiplier: 1.0x Next Prestige: 0 Cosmic Shards Earn 1 Cosmic Shard for every 1,000,000 total stardust earned (sqrt scaling). All progress except achievements and cosmic shards will be reset."
- button "Prestige" [disabled]
- button "Cancel"
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Prestige System', () => {
   4 |   test('Prestige button appears and modal opens', async ({ page }) => {
   5 |     // Set up state before app loads
   6 |     await page.addInitScript(() => {
   7 |       const state = {
   8 |         stardust: 1_000_000,
   9 |         totalStardustEarned: 1_000_000,
  10 |         clickPower: 1,
  11 |         passiveIncome: 0,
  12 |         lastSaved: Date.now(),
  13 |         lastTick: Date.now(),
  14 |         upgrades: {},
  15 |         activeEvents: [],
  16 |         eventChance: 0,
  17 |         achievements: {},
  18 |         totalClicks: 0,
  19 |         totalUpgradesBought: 0,
  20 |         totalEventsTriggered: 0,
  21 |         prestigeCount: 0,
  22 |         prestigeCurrency: 0,
  23 |       };
  24 |       localStorage.setItem('cosmicClickerGameState', JSON.stringify(state));
  25 |     });
  26 |     await page.goto('/');
  27 |     // Open prestige modal
  28 |     await page.locator('button[title="Prestige"]').click();
  29 |     await expect(page.locator('[data-testid="prestige-modal"]')).toBeVisible();
  30 |     await expect(page.locator('[data-testid="prestige-cosmic-shards"]')).toBeVisible();
  31 |     await expect(page.locator('[data-testid="prestige-confirm-btn"]')).toBeEnabled();
  32 |   });
  33 |
  34 |   test('Prestiging resets progress and increases prestige count/currency', async ({ page }) => {
  35 |     // Set up state before app loads
  36 |     await page.addInitScript(() => {
  37 |       const state = {
  38 |         stardust: 1_000_000,
  39 |         totalStardustEarned: 1_000_000,
  40 |         clickPower: 1,
  41 |         passiveIncome: 0,
  42 |         lastSaved: Date.now(),
  43 |         lastTick: Date.now(),
  44 |         upgrades: {},
  45 |         activeEvents: [],
  46 |         eventChance: 0,
  47 |         achievements: {},
  48 |         totalClicks: 0,
  49 |         totalUpgradesBought: 0,
  50 |         totalEventsTriggered: 0,
  51 |         prestigeCount: 0,
  52 |         prestigeCurrency: 0,
  53 |       };
  54 |       localStorage.setItem('cosmicClickerGameState', JSON.stringify(state));
  55 |     });
  56 |     await page.goto('/');
  57 |     // Open prestige modal and confirm
  58 |     await page.locator('button[title="Prestige"]').click();
> 59 |     await page.locator('[data-testid="prestige-confirm-btn"]').click();
     |                                                                ^ Error: locator.click: Test timeout of 30000ms exceeded.
  60 |     // Modal should close, stats should reset, prestige count/currency should increase
  61 |     await expect(page.locator('[data-testid="prestige-modal"]')).not.toBeVisible();
  62 |     // Open modal again to check stats
  63 |     await page.locator('button[title="Prestige"]').click();
  64 |     await expect(page.locator('[data-testid="prestige-count"]')).toHaveText('1');
  65 |     await expect(page.locator('[data-testid="prestige-cosmic-shards"]')).toHaveText('1');
  66 |   });
  67 | }); 
```