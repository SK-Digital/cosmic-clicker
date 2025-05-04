# Supabase Migration Plan for Cosmic Clicker

## Goals
- Add user authentication (Supabase) with email/password and/or OAuth providers.
- Migrate game save state from localStorage to Supabase (cloud save).
- Support seamless login/logout, with local fallback/offline support.
- Prevent or reduce cheating/editing of game saves.
- Prepare for future features: leaderboards, user profiles, cloud sync.

---

## Migration Steps

### 1. **Supabase Project Setup**
- [ ] Create Supabase project and configure database.
- [ ] Set up `users` table (if needed) and `game_saves` table (user_id, save_data, updated_at).
- [ ] Configure API keys and environment variables for local/dev/prod.

### 2. **Authentication Integration**
- [ ] Add login page/component (email/password, OAuth optional).
- [ ] Add signup, login, logout, and password reset flows.
- [ ] Store user session securely (Supabase client/session).
- [ ] Add UI for login/logout and show user info in-game.

### 3. **Save State Refactor**
- [ ] Refactor game state management to:
  - [ ] On login: load save from Supabase (if exists), else create new.
  - [ ] On logout: optionally save to localStorage for offline.
  - [ ] On game progress: auto-save to Supabase (debounced/throttled).
  - [ ] On offline: use localStorage, sync to cloud on next login.
- [ ] Add migration logic to merge local save with cloud save (if needed).
- [ ] Ensure all game progress, achievements, prestige, etc. are included in save.

### 4. **Security & Anti-Cheat**
- [ ] Store saves server-side (not just in client-accessible storage).
- [ ] Validate save data on server (e.g., no negative stardust, impossible values).
- [ ] Add basic obfuscation or signing to save data (optional, for casual cheating).
- [ ] Prepare for future server-side validation (for leaderboards, etc.).

### 5. **Testing & Rollout**
- [ ] Manual and automated tests for login, save/load, and sync.
- [ ] Test offline/online transitions, multiple devices, and edge cases.
- [ ] Roll out to dev branch, then main after full test.
- [ ] Monitor for issues and iterate.

---

## Progress Checklist
- [ ] Supabase project created
- [ ] Auth integrated
- [ ] Save state refactored
- [ ] Security checks in place
- [ ] Manual/E2E tests passing
- [ ] Ready for production

---

## Notes & Decisions
- Record any schema changes, API endpoints, or important decisions here as you go.

---

*Update this file as you progress through the migration. Commit after each major step.* 