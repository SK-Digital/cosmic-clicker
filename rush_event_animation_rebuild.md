# 🚀 Rush Event Animation Rebuild Progress

## 1. Plan & Design Goals

### Black Hole Rift
- Perfectly centered and sized to match the clicker (`w-64 h-64`).
- Black hole core: deep black, with a subtle purple/blue glow.
- Rotating accretion ring: thick, white, with a visible gap (using `strokeDasharray`), tightly hugging the core, and a subtle colored shadow.
- Sparkles icon centered in the middle.
- No faded glow or unnecessary overlays.
- Animation must disappear immediately after the event ends.

### Meteor Shower
- Meteors animate from top to bottom, with a glowing trail and head.
- Multiple meteors spawn at random horizontal positions.
- Meteors are visible and animate smoothly.
- Animation must disappear immediately after the event ends.

---

## 2. Implementation Steps

### A. Component Structure
- [x] Create a new `RushEventAnimation.tsx` component.
- [x] Accept `event` and `onComplete` props.
- [x] Render either the black hole or meteor animation based on `event.id`.

### B. Black Hole Animation
- [x] Use a `div` with `w-64 h-64 flex items-center justify-center`.
- [x] Center a black core (`bg-black`, with a purple/blue box-shadow).
- [x] Overlay a rotating SVG ring (white, thick, with a gap, using `strokeDasharray`).
- [x] Center the Sparkles icon.
- [x] Use a fast, smooth CSS rotation animation for the ring.
- [x] Remove the animation after the event ends (call `onComplete`).

**[x]** Black hole animation implemented.

- [x] Use a fixed overlay.

**[x]** Meteor animation implemented.

- [x] Spawn meteors at random `x` positions, animate their `y` from top to bottom.
- [x] Each meteor is an SVG with a glowing trail and head.
- [x] Remove all meteors and the animation after the event ends (call `onComplete`).

- [x] Ensure all timers/animation frames are cleaned up on unmount.
- [x] Ensure the animation is only visible during the event.

**[x]** Cleanup and state management complete.

- [x] Playwright tests written/updated.

**[x]** Playwright tests written/updated.