# Cosmic Clicker Roadmap

## Current State Review

Cosmic Clicker is a clicker/idle game where players collect stardust by clicking and through passive upgrades. The game features:
- A central clicker button with particle/star animations
- Stardust counter and passive income display
- Upgrade system (click and passive upgrades)
- Rush event animation component (meteor shower, black hole)
- Stats panel for resources and upgrades
- Background with stars and meteors
- Basic sound effect for clicks

### Issues/Observations
- **Visual Bug:** There is a weird box or overlay present in the UI (potentially from a container or background effect)
- **Falling Star Animation:** The current star/particle animation is basic and could be visually improved
- **Rush Events:** Rush event system exists but is limited; not fully integrated as a gameplay feature
- **Upgrades:** No upgrades for rush event chance or max level, and limited upgrade diversity
- **Progression:** No achievements, limited sense of progression, and no settings menu
- **Audio:** Only a single click sound, no music or sound variety

## Goals & Improvements

### 1. Visual/UI Improvements
- [ ] **Fix the weird box/overlay**: Audit containers and overlays for unintended backgrounds or borders
- [ ] **Enhance falling star/particle animation**: Add more dynamic, visually appealing effects (e.g., trails, glow, color variation)
- [ ] **Polish background and UI elements**: Improve gradients, panel transparency, and overall polish

### 2. Rush Events System
- [ ] **Add a Rush Events tab/panel**: Display current/active rush events and their effects
- [ ] **Implement rush event logic**: Rush events give a temporary multiplier to production (click and/or passive)
- [ ] **Rush event animation**: Show a clear, exciting animation when a rush event is active
- [ ] **Display event chance**: Show the current chance for a rush event to occur next to the stardust counter/clicker

### 3. Upgrades Expansion
- [ ] **Event Chance Upgrades**: New upgrades with a max level that increase the chance of rush events
- [ ] **Upgrade diversity**: Add more upgrade types (e.g., event duration, event multiplier, achievement boosts)
- [ ] **Upgrade UI**: Show max level, effects, and lock upgrades when maxed

### 4. Progression & Features
- [ ] **Achievements system**: Track and reward milestones (e.g., total clicks, stardust earned, upgrades bought)
- [ ] **Sound effects & music**: Add background music, more sound effects, and a mute option
- [ ] **Settings menu**: Allow toggling music, sound, and visual effects
- [ ] **Save/load improvements**: Ensure all new features are saved and loaded correctly

## Milestones

### Milestone 1: Visual & UI Polish
- Fix box/overlay bug
- Improve falling star animation
- Polish background and panels

### Milestone 2: Rush Events & Upgrades
- Add rush events tab/panel
- Implement rush event logic and animation
- Add event chance upgrades and display

### Milestone 3: Progression & Audio
- Add achievements system
- Add music and sound effects
- Implement settings menu

---

## Github Repository
- Repository created: [SK-Digital/cosmic-clicker](https://github.com/SK-Digital/cosmic-clicker)
- All major changes will be committed with clear messages and pushed to this repository.

## File Structure (as of roadmap creation)

- `src/components/` — UI components (Clicker, Upgrades, Rush Events, etc.)
- `src/context/` — Game state management
- `public/` — Static assets (sounds, images)
- `index.html` — Main HTML entry
- `package.json` — Project dependencies

---

**This roadmap will be updated as features are added and the project evolves.** 