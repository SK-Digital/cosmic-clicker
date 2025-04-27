# Cosmic Clicker Project Memory

## File Structure (as of roadmap creation)

- .bolt/ — (unknown, possibly build or config)
- dist/ — Build output
- public/
  - click-sound.mp3 — Click sound effect
  - nebula-background.svg — Nebula background image
- src/
  - App.tsx — Main app entry
  - main.tsx — React entry point
  - index.css — Global styles
  - vite-env.d.ts — Vite/TypeScript types
  - components/
    - Background.tsx — Animated background (stars, meteors)
    - ClickFeedback.tsx — Click feedback animation
    - GalaxyClicker.tsx — Main clicker button and animation
    - Game.tsx — Main game layout and panel arrangement
    - RushEventAnimation.tsx — Rush event visual effects
    - StarParticles.tsx — Star/falling particle animation
    - StardustCounter.tsx — Stardust and passive income display
    - StatsPanel.tsx — Game stats and upgrade levels
    - UpgradeItem.tsx — Single upgrade display
    - UpgradesPanel.tsx — Upgrades tab/panel
  - context/
    - GameContext.tsx — Game state, upgrades, events
  - utils/
    - (gameUtils and other helpers)
- index.html — Main HTML entry
- package.json — Project dependencies
- package-lock.json — Dependency lockfile
- tailwind.config.js — Tailwind CSS config
- vite.config.ts — Vite config
- tsconfig*.json — TypeScript configs
- roadmap.md — Project roadmap and goals
- memory.md — (this file)

## Key Notes
- Main gameplay is in `src/components/Game.tsx` and `GalaxyClicker.tsx`.
- Upgrades and rush events are managed in `GameContext.tsx`.
- Visual/UI issues (e.g., weird box) may be caused by containers in `Game.tsx`, `GalaxyClicker.tsx`, or background overlays.
- Rush events and event chance upgrades are planned for future milestones.
- All major changes should be committed to the [SK-Digital/cosmic-clicker](https://github.com/SK-Digital/cosmic-clicker) repo.

---

Update this file whenever the file structure or major project details change. 