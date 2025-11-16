# Movie-Style Intro Implementation

## Overview
Implemented a movie-style intro sequence for the HeroScene with scroll locking and smooth transition to scroll-based navigation.

## Features

### ✅ Implemented
1. **Scroll Lock During Intro**: Page scroll is completely disabled during the intro animation
2. **Timer-Based Progress**: Intro plays for configured duration (default: 2 minutes)
3. **Smooth Unlock**: Scroll automatically unlocks when intro completes
4. **No Replay on Scroll Back**: Scene stays in finished state when user scrolls back to top
5. **Configurable Duration**: Easy to adjust intro timing via config file
6. **No Persistence**: Intro replays on every page refresh (as requested)

## Architecture

### 1. Intro Controller Hook (`useIntroController.ts`)
- Manages intro state machine: `playing` → `complete`
- Timer-based progress (0-1 over configured duration)
- RAF-based animation loop for smooth progress
- Exposes `completeIntro()` and `resetIntro()` methods

### 2. Lenis Provider Updates (`LenisProvider.tsx`)
- Added `scrollLocked` prop to control scroll state
- Exposes `useLenis()` hook with `stopScroll()` and `startScroll()` methods
- Automatically locks/unlocks Lenis smooth scroll
- Also controls `body` overflow to prevent native scroll

### 3. HeroScene Dual-Mode Progress (`HeroScene.tsx`)
**Intro Mode (Scroll Locked)**:
- Uses `introState.progress` from intro controller
- Progress runs 0 → 1 over configured duration
- Calls `onIntroComplete()` when reaching 1.0

**Scroll Mode (Scroll Unlocked)**:
- Uses scroll-based progress from `useScene` hook
- **Critical Feature**: When scrolled back to top (progress = 0), stays at 1.0 (finished state)
- This prevents the intro from "replaying" when user navigates back up

### 4. Configuration (`intro.config.ts`)
```typescript
export const INTRO_CONFIG = {
  duration: 120000, // 2 minutes (configurable)
  autoUnlock: true,
};
```

**Runtime Override** (for debugging):
```javascript
// In browser console:
setIntroDuration(30000); // Set to 30 seconds
```

### 5. Page Integration (`page.tsx`)
- Wraps app in intro controller
- Passes intro state to HeroScene
- Connects scroll lock to Lenis provider

## File Structure

```
moksha-labs-site/portfolio/src/
├── hooks/
│   └── useIntroController.ts          # NEW - Intro state management
├── config/
│   └── intro.config.ts                # NEW - Configurable settings
├── components/providers/
│   ├── LenisProvider.tsx              # MODIFIED - Added scroll lock
│   └── Providers.tsx                  # MODIFIED - Pass scroll lock state
├── app/
│   ├── layout.tsx                     # MODIFIED - Moved Providers to page
│   └── page.tsx                       # MODIFIED - Integrated intro controller
└── storyboard/scenes/01-hero/
    └── HeroScene.tsx                  # MODIFIED - Dual-mode progress
```

## Usage

### Current Setup (2 minute intro)
The intro is currently configured to run for 2 minutes. On page load:
1. Scroll is locked
2. HeroScene animation plays (timer-based)
3. After 2 minutes, scroll automatically unlocks
4. User can now scroll down/up
5. When scrolling back to top, scene stays in finished state (no replay)

### Adjusting Duration
Edit `src/config/intro.config.ts`:
```typescript
export const INTRO_CONFIG = {
  duration: 60000, // 1 minute
  autoUnlock: true,
};
```

Or override at runtime in console:
```javascript
setIntroDuration(30000); // 30 seconds for testing
```

## Technical Details

### Progress Handoff (Intro → Scroll)
When intro completes:
1. Intro controller sets `phase: 'complete'`
2. This triggers `scrollLocked: false`
3. Lenis provider unlocks scroll
4. HeroScene switches from `introState.progress` to `scrollProgress`
5. Both should be at 1.0 at handoff moment for seamless transition

### Preventing Replay
```typescript
// In HeroScene progress calculation
if (scrollProgress === 0 && introCompleteRef.current) {
  currentProgress = 1.0; // Stay at finished state
} else {
  currentProgress = scrollProgress;
}
```

This ensures that when user scrolls back to the top, the scene doesn't reset to beginning.

### RAF Loop Architecture
All canvas components (Mountains, Water, Sky, etc.) read from `progressRef.current` in their RAF loops. This provides:
- Smooth 60fps animation during intro
- No discrete jumps when transitioning to scroll
- Continuous updates regardless of React render throttling

## Future Enhancements (Not Implemented Yet)

Based on user responses, these are NOT currently implemented but could be added:

1. **Skip Button**: Allow users to skip intro
2. **Progress Indicator**: Visual timer/progress bar
3. **Session Persistence**: Remember "intro watched" state
4. **Mobile Optimization**: Shorter intro on mobile devices
5. **Scroll Preview**: Visual feedback when scroll is locked

## Testing

### Test Intro Flow
1. Refresh page
2. Verify scroll is locked (try scrolling - should do nothing)
3. Wait for intro to complete (2 minutes by default)
4. Verify scroll unlocks automatically
5. Scroll down to other scenes
6. Scroll back to top
7. Verify HeroScene stays in finished state (doesn't replay)

### Quick Testing (Console)
```javascript
// Set to 10 seconds for quick testing
setIntroDuration(10000);

// Then refresh page
location.reload();
```

## Notes

- Intro replays on every refresh (no persistence as requested)
- Scroll is completely disabled during intro (not just visually - wheel events ignored)
- Other scenes (About Us, Our Work, etc.) are unaffected - they use normal scroll
- HeroScene is the only scene with special dual-mode behavior
- Configuration is centralized in `intro.config.ts` for easy adjustments

