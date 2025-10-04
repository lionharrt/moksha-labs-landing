# Scroll Phasing Patterns

**The Art of Single-Source-of-Truth Scroll Animation**

---

## 📖 Table of Contents

1. [Core Concept](#core-concept)
2. [The Problem](#the-problem)
3. [The Solution: Phase Mapping](#the-solution-phase-mapping)
4. [Implementation Pattern](#implementation-pattern)
5. [Real-World Example](#real-world-example)
6. [Common Mistakes](#common-mistakes)
7. [Best Practices](#best-practices)

---

## Core Concept

**One Scroll Value, Many Phases**

Award-winning scroll experiences require multiple animations to occur at different times during a single scroll journey. The key is to have **ONE source of truth** for scroll progress, then **map that value** to different phases for different elements.

### The Golden Rule

```
Never create multiple ScrollTriggers for elements that should be synchronized.
Always map a single scroll progress value to different phase ranges.
```

---

## The Problem

### ❌ Multiple Sources of Truth (WRONG)

```javascript
// BAD: Two separate ScrollTriggers
gsap.to(shape, {
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: '+=500vh',
    scrub: 1,
  },
  opacity: 0,
});

gsap.to(text, {
  scrollTrigger: {
    trigger: '#hero',  // Same trigger, but separate instance!
    start: 'top top',
    end: '+=500vh',
    scrub: 1,
  },
  opacity: 1,
});
```

**Problem:** These two ScrollTriggers can drift out of sync, causing janky animations where elements don't coordinate properly.

---

## The Solution: Phase Mapping

### ✅ Single Source, Mapped Phases (CORRECT)

```javascript
// GOOD: One ScrollTrigger, multiple mapped phases
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: '+=1000vh',  // Total scroll distance
    scrub: 1,
    pin: true,
    onUpdate: (self) => {
      // Single source of truth: 0-1
      const rawProgress = self.progress;
      
      // Map to shape phase (10-90% of scroll)
      let shapeProgress = 0;
      if (rawProgress < 0.1) {
        shapeProgress = 0;
      } else if (rawProgress < 0.9) {
        shapeProgress = (rawProgress - 0.1) / 0.8;  // Map 0.1-0.9 to 0-1
      } else {
        shapeProgress = 1;
      }
      
      // Update 3D element with mapped progress
      updateShape(shapeProgress);
    }
  }
});

// DOM animations use the same timeline
tl.to(shapeContainer, { opacity: 1, duration: 0.1 }, 0)      // 0-10%
  .to(textContainer, { opacity: 1, duration: 0.05 }, 0.9)   // 90-95%
  .to(textContainer, { opacity: 0, duration: 0.05 }, 0.95); // 95-100%
```

---

## Implementation Pattern

### Step 1: Define Your Phases

```javascript
// Example: Hero section with 1000vh of scroll
const PHASES = {
  SHAPE_FADE_IN: { start: 0, end: 0.1 },      // 0-10% (100vh)
  SHAPE_BREAK: { start: 0.1, end: 0.9 },      // 10-90% (800vh)
  TEXT_FADE_IN: { start: 0.9, end: 0.95 },    // 90-95% (50vh)
  TEXT_FADE_OUT: { start: 0.95, end: 1.0 },   // 95-100% (50vh)
};
```

### Step 2: Create Mapping Functions

```javascript
/**
 * Maps raw scroll progress to a specific phase progress
 * @param {number} rawProgress - 0-1 progress of entire scroll
 * @param {Object} phase - { start, end } range
 * @returns {number} - 0-1 progress within that phase
 */
function mapToPhase(rawProgress, phase) {
  if (rawProgress < phase.start) return 0;
  if (rawProgress > phase.end) return 1;
  
  const phaseLength = phase.end - phase.start;
  const progressInPhase = rawProgress - phase.start;
  return progressInPhase / phaseLength;
}

// Usage
const shapeBreakProgress = mapToPhase(rawProgress, PHASES.SHAPE_BREAK);
```

### Step 3: Apply to Elements

```javascript
// DOM elements via GSAP timeline
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: section,
    start: 'top top',
    end: '+=1000vh',
    scrub: 1,
    pin: true,
    onUpdate: (self) => {
      const raw = self.progress;
      
      // Pass mapped progress to 3D elements
      const shapeProgress = mapToPhase(raw, PHASES.SHAPE_BREAK);
      setShapeBreakProgress(shapeProgress);
    }
  }
});

// Add DOM animations using percentage positions
tl.to(shape, { opacity: 1, duration: 0.1 }, 0)
  .to(text, { opacity: 1, duration: 0.05 }, 0.9)
  .to(text, { opacity: 0, duration: 0.05 }, 0.95);
```

### Step 4: Connect to 3D (React Three Fiber)

```jsx
// Hero component
const [shapeBreakProgress, setShapeBreakProgress] = useState(0);

// Pass to 3D scene
<GeometricWireframe breakProgress={shapeBreakProgress} />

// 3D component uses it directly
function GeometricWireframe({ breakProgress }) {
  useFrame(() => {
    // breakProgress is already mapped to 0-1 for this phase
    mesh.position.x = originalX + direction * breakProgress * 10;
    mesh.rotation.y = breakProgress * Math.PI * 2;
  });
}
```

---

## Real-World Example

### Moksha Labs Hero Section

**Total Scroll:** 1000vh (10x viewport height)

**Phase Breakdown:**

| Phase | Scroll % | Scroll Distance | Duration | What Happens |
|-------|----------|-----------------|----------|--------------|
| 1. Shape Fade In | 0-10% | 100vh | `0.1` | Mandala fades in, scroll indicator fades out |
| 2. Shape Break | 10-90% | 800vh | `0.8` | Mandala breaks apart into pieces |
| 3. Text Fade In | 90-95% | 50vh | `0.05` | "Moksha Labs" text appears |
| 4. Text Fade Out | 95-100% | 50vh | `0.05` | Text disappears, ready for next section |

**Key Insight:** The shape gets 80% of the scroll journey to itself, creating a long, deliberate animation. Text appears only when shape is nearly gone.

### Code

```javascript
// Single ScrollTrigger with phase mapping
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: sectionRef.current,
    start: 'top top',
    end: '+=1000vh',
    scrub: 0.5,
    pin: true,
    onUpdate: (self) => {
      const raw = self.progress;
      
      // Map to shape break phase (10-90%)
      let breakProgress = 0;
      if (raw < 0.1) {
        breakProgress = 0;
      } else if (raw < 0.9) {
        breakProgress = (raw - 0.1) / 0.8;
      } else {
        breakProgress = 1;
      }
      
      setShapeBreakProgress(breakProgress);
    }
  }
});

// Shape opacity
tl.to(canvasContainer, { opacity: 1, duration: 0.1, ease: 'none' }, 0)
  
// Text animations
  .to([title, subtitle], { opacity: 1, y: 0, stagger: 0.02, duration: 0.05, ease: 'none' }, 0.9)
  .to([title, subtitle], { opacity: 0, y: -50, stagger: 0.02, duration: 0.05, ease: 'none' }, 0.95);
```

---

## Common Mistakes

### ❌ Mistake 1: Separate ScrollTriggers for Related Elements

```javascript
// WRONG
gsap.to(shape, {
  scrollTrigger: { trigger: '#hero', scrub: 1 },
  rotation: 360
});

gsap.to(text, {
  scrollTrigger: { trigger: '#hero', scrub: 1 },
  opacity: 1
});
```

**Fix:** Use one timeline with position parameters.

### ❌ Mistake 2: Time-Based Animation Instead of Scroll

```javascript
// WRONG - Animation runs on clock time, not scroll
useFrame((state) => {
  mesh.rotation.y = state.clock.elapsedTime;
});
```

**Fix:** Use scroll progress as the only animation driver.

### ❌ Mistake 3: Wrong Progress Mapping

```javascript
// WRONG - Direct multiplication doesn't account for phase offset
const textProgress = rawProgress * 0.1;  // Text appears immediately!

// CORRECT - Map the specific range
const textProgress = (rawProgress - 0.9) / 0.1;
```

### ❌ Mistake 4: Forgetting to Clamp

```javascript
// WRONG - Progress can go negative or > 1
const progress = (raw - 0.5) / 0.3;

// CORRECT - Always clamp to 0-1
const progress = Math.max(0, Math.min(1, (raw - 0.5) / 0.3));
```

---

## Best Practices

### 1. Start with a Timeline Diagram

```
0%        10%                                           90%   95%  100%
|---------|----------------------------------------------|-----|-----|
  Fade     Shape Breaking (80% of total scroll)          Text  Text
   In                                                      In   Out
```

### 2. Use Descriptive Phase Names

```javascript
const PHASES = {
  INTRO_FADE: { start: 0, end: 0.1 },
  MAIN_BREAK: { start: 0.1, end: 0.9 },
  TEXT_APPEAR: { start: 0.9, end: 0.95 },
  TEXT_EXIT: { start: 0.95, end: 1.0 },
};
```

### 3. Helper Function for Mapping

```javascript
/**
 * Universal phase mapper with clamping
 */
function mapPhase(raw, start, end) {
  if (raw < start) return 0;
  if (raw > end) return 1;
  return (raw - start) / (end - start);
}
```

### 4. Debug with Console Logs

```javascript
scrollTrigger: {
  onUpdate: (self) => {
    console.log('Raw:', self.progress.toFixed(3));
    console.log('Shape:', shapeProgress.toFixed(3));
    console.log('Text:', textProgress.toFixed(3));
  }
}
```

### 5. Adjust Scroll Speed with Multipliers

```javascript
// Lenis scroll speed
const lenis = new Lenis({
  wheelMultiplier: 0.3,  // Slower = more scroll needed
  duration: 2.0,         // Smoothness
});
```

### 6. Give Phases Room to Breathe

```javascript
// BAD - Phases too close together
TEXT_IN: { start: 0.88, end: 0.92 },   // Only 40vh
TEXT_OUT: { start: 0.92, end: 0.96 },  // Feels cramped

// GOOD - Generous spacing
TEXT_IN: { start: 0.7, end: 0.8 },   // 100vh
TEXT_HOLD: { start: 0.8, end: 0.9 },  // 100vh
TEXT_OUT: { start: 0.9, end: 1.0 },   // 100vh
```

### 7. Test Scroll Speed

```javascript
// Try different total scroll distances
end: '+=500vh',   // Fast, aggressive
end: '+=1000vh',  // Moderate, deliberate
end: '+=2000vh',  // Slow, cinematic
```

---

## Advanced: Multi-Element Coordination

When you have multiple 3D elements that need different timings:

```javascript
const [phase1Progress, setPhase1Progress] = useState(0);
const [phase2Progress, setPhase2Progress] = useState(0);
const [phase3Progress, setPhase3Progress] = useState(0);

scrollTrigger: {
  onUpdate: (self) => {
    const raw = self.progress;
    
    // Element 1: Animates 0-40%
    setPhase1Progress(mapPhase(raw, 0, 0.4));
    
    // Element 2: Animates 30-70% (overlaps!)
    setPhase2Progress(mapPhase(raw, 0.3, 0.7));
    
    // Element 3: Animates 60-100%
    setPhase3Progress(mapPhase(raw, 0.6, 1.0));
  }
}

// Each element gets its own mapped progress
<Element1 progress={phase1Progress} />
<Element2 progress={phase2Progress} />
<Element3 progress={phase3Progress} />
```

---

## Performance Considerations

### Keep ScrollTrigger Updates Efficient

```javascript
// ✅ GOOD - Update state once per frame
onUpdate: (self) => {
  setProgress(self.progress);
}

// ❌ BAD - Multiple state updates
onUpdate: (self) => {
  setShape(self.progress);
  setText(self.progress);
  setCamera(self.progress);
  // Each causes re-render!
}
```

### Use scrub for Tight Coupling

```javascript
scrub: true,     // Instant, directly linked (can feel stiff)
scrub: 0.5,      // 0.5s smooth catch-up (feels responsive)
scrub: 2,        // 2s smooth catch-up (feels loose)
```

### Optimize Lenis

```javascript
const lenis = new Lenis({
  wheelMultiplier: 0.3,  // Scroll sensitivity
  duration: 2.0,         // Smooth duration
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});
```

---

## Debugging Checklist

When animations feel off:

1. ✅ Is there only ONE ScrollTrigger for the section?
2. ✅ Are phases mapped correctly (start < end)?
3. ✅ Do phase ranges add up to your intent?
4. ✅ Is scroll progress being passed, not time?
5. ✅ Are you clamping mapped progress to 0-1?
6. ✅ Is `scrub` enabled for scroll-linked animations?
7. ✅ Does Lenis scroll speed feel right?
8. ✅ Is pin working correctly?

---

## Summary

**The Pattern:**

1. **One ScrollTrigger** per section
2. **Map raw progress** to phase-specific progress
3. **Pass mapped values** to components
4. **Test and adjust** phase ranges until it feels right

**The Result:**

Smooth, coordinated scroll animations where every element knows exactly when to animate, creating the cinematic, deliberate pacing seen in award-winning sites.

---

**Key Takeaway:** Award-winning scroll experiences aren't about complex code—they're about careful phase planning and a single source of truth for scroll progress.


