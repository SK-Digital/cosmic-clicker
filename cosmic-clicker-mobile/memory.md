# memory.md — Cosmic Clicker Mobile

## Project Structure (as of core clicker logic phase)

- assets/
  - icons/   # All icons copied from ../public/icons in the web project
- src/
  - context/
    - GameContext.tsx   # Game state, reducer, context, and now local persistence
  - components/
  - screens/
  - utils/
- app/
  - (tabs)/
    - index.tsx         # Main Game screen, now shows clicker UI and upgrades
    - _layout.tsx
  - _layout.tsx         # App root, now wraps in GameProvider
- constants/
- hooks/
- scripts/
- package.json
- README.md
- memory.md (this file)

## Key Changes (Core Clicker Logic Phase)
- Added `src/context/GameContext.tsx` with game state, reducer, and helpers for clicker logic.
- Added local persistence using AsyncStorage in `GameContext.tsx` (loads on mount, saves on state change).
- Added `LOAD_STATE` action to reducer for restoring state from storage.
- Updated `app/(tabs)/index.tsx` to show the main clicker UI (stardust, click button, upgrades).
- Wrapped app in `GameProvider` in `app/_layout.tsx` for context access.
- All icon assets are now available in `assets/icons/` (copied from web project's public/icons).

## Recent Changes

### Bulk Buy Logic for Upgrades (2024-06-09)
- The `BUY_UPGRADE` action in `src/context/GameContext.tsx` now supports a `bulkAmount` parameter, allowing the purchase of multiple upgrade levels at once.
- The reducer calculates the total cost for the requested number of levels (using exponential cost scaling) and only purchases as many as the player can afford (up to the selected bulk amount and any max level cap).
- The upgrade buy button in `src/components/UpgradesPanel.tsx` now dispatches the `bulkAmount` selected by the user, enabling bulk purchases from the UI.
- This matches the website's bulk buy upgrade feature and improves UX.

### Upgrades Panel Refactor (2024-06-09)
- The UpgradesPanel is now a full-width, edge-to-edge sliding bottom sheet (not a modal), with rounded top corners and a drag handle at the top for visual feedback.
- This matches modern mobile UX for bottom sheets and improves usability and visual polish.

## File Structure (relevant to upgrades)
- `src/context/GameContext.tsx`: Game state, reducer, and actions (including upgrades logic)
- `src/components/UpgradesPanel.tsx`: Upgrades panel UI, including bulk buy controls and upgrade purchase buttons

## Next Steps
- Expand upgrades, meta-upgrades, and UI polish.
- Implement cloud save/auth in a future phase.
- Begin porting/adapting StardustCounter, GalaxyClicker, and UpgradesPanel to match the web UI. 