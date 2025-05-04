# Cosmic Clicker: Phased Feature Plan

## Clicker Game Design Principles
- **Clarity:** UI should be clean, readable, and intuitive. All actions and upgrades must be easily understood.
- **Feedback:** Every click and purchase should provide immediate, satisfying feedback (visual, audio, animation).
- **Progression:** Players should always feel they are making progress, with clear short- and long-term goals.
- **Reward Loops:** Frequent small rewards (clicks, upgrades) and less frequent big rewards (events, achievements, prestige).
- **Accessibility:** Controls and visuals should be usable for all players, with scalable UI and colorblind-friendly palettes.
- **Minimal Friction:** Minimize unnecessary clicks, confirmations, or interruptions to the core loop.
- **Testing:** Each feature must be tested for usability, clarity, and fun before release.

## Phase 1: Core Gameplay & Visual Polish
**Features:**
- Central clicker button with feedback
- Stardust counter and passive income display
- Basic upgrades (click, passive)
- Meteor shower and black hole rush events
- Basic sound effect for clicks
- Visual polish: gradients, panel transparency, background

**Testing:**
- All UI elements are visible and readable on desktop and mobile
- Clicks and upgrades provide immediate feedback
- Rush events trigger and animate correctly
- No visual bugs or overlays

**Criteria for Success:**
- Player can play a satisfying clicker loop for 5+ minutes without confusion or UI issues
- All core features are visually polished and bug-free

## Phase 2: Rush Events & Upgrade Expansion
**Features:**
- Rush events tab/panel
- Event chance upgrades and display
- More upgrade types and diversity
- Event animations and overlays

**Testing:**
- Rush events can be triggered and end correctly
- Upgrades are clear, purchasable, and have visible effects
- Event chance is displayed and updates with upgrades

**Criteria for Success:**
- Rush events and upgrades are fun, clear, and bug-free
- All new features are covered by UI and E2E tests

## Phase 3: Progression, Achievements, and Audio
**Features:**
- Achievements system
- Prestige/rebirth system
- Lifetime stats box
- Sound effects for purchases, with volume control and settings menu

**Testing:**
- Achievements unlock and display correctly
- Prestige resets progress and grants bonuses
- Stats box updates in real time
- Sound settings persist and work across sessions

**Criteria for Success:**
- Players feel long-term progression and reward
- All new features are tested and bug-free

## Phase 4: Advanced Features & Polish
**Features:**
- More meta-upgrades and event types
- Visual polish and accessibility improvements
- Additional settings (colorblind, UI scale)
- Playwright/E2E test coverage for all features

**Testing:**
- All advanced features work as intended
- Accessibility and settings are effective
- 100% of major features covered by automated tests

**Criteria for Success:**
- Game is feature-complete, polished, and accessible
- All code is committed and pushed to GitHub after each phase

## [IN PROGRESS] Supabase Auth & Cloud Save
- Supabase project and `game_saves` table created.
- Supabase client utility and dependency added.
- .env setup for Supabase keys required.
- Next: Implement authentication UI/logic and refactor save/load system.

- Guest play is supported: users can play without an account, and their progress is saved locally.
- Users can create an account at any time; existing progress will be tied to their new account and synced to the cloud.

---

**Note:** This file must be referenced and followed for all future development. Each phase must be tested and meet criteria before moving to the next. All changes must be committed and pushed to GitHub in a timely and organized manner. 