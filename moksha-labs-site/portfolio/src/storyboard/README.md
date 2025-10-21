# Moksha Labs Storyboard Framework

## Philosophy

This framework enables **scene-by-scene animation development** while maintaining a cohesive, non-competing scroll experience. It's built on three core principles:

1. **Single Source of Truth**: One ScrollTrigger per scene, with phase-mapped progress
2. **Modular Scenes**: Each scene is self-contained with its own DOM, 3D, and effects
3. **Persistent Elements**: Shared elements can persist across scenes with state management

---

## Architecture Overview

```
StoryboardManager (Global Timeline Coordinator)
├── Scene Registry (Scene definitions & metadata)
├── Element Registry (Persistent elements that span scenes)
├── Effect Registry (Reusable effects library)
└── Timeline Controller (GSAP master timeline + ScrollTrigger sync)

Scene (Self-contained unit)
├── Scene Config (duration, phases, scroll range)
├── DOM Components (React components for 2D UI)
├── 3D Components (R3F components for WebGL)
├── Effects (Scene-specific or shared from registry)
└── Scene Timeline (Local GSAP timeline, phase-mapped)
```

---

## Core Concepts

### 1. Scenes
A **scene** is a self-contained scroll segment with:
- **Fixed scroll duration** (e.g., 100vh, 200vh)
- **Phase definitions** (e.g., intro: 0-0.2, build: 0.2-0.7, hold: 0.7-0.85, outro: 0.85-1.0)
- **DOM & 3D components** (what appears on screen)
- **Local effects** (animations unique to this scene)

### 2. Elements
An **element** is a visual or interactive object that can:
- **Live within a single scene** (scene-scoped)
- **Persist across multiple scenes** (globally-scoped with state)
- **Transform between scenes** (morphing, position transitions)

Examples:
- Scene-scoped: Lotus petals that only exist in Scene 2
- Persistent: Camera that smoothly transitions from Scene 1 → Scene 2 → Scene 3
- Transforming: Silk surface that morphs from flat → rippled → lotus base

### 3. Effects
An **effect** is a reusable animation pattern:
- **Stateless and pure** (input → output, no side effects)
- **Swappable** (can be replaced without breaking the scene)
- **Composable** (multiple effects can layer on one element)

Examples:
- `silkRippleEffect`: Vertex displacement shader for water surface
- `fadeInEffect`: Opacity 0 → 1 over phase progress
- `cameraOrbitEffect`: Smooth camera arc around focal point

### 4. Phase Mapping (from `14-SCROLL-PHASING-PATTERNS.md`)

Instead of having multiple ScrollTriggers compete, we use **one ScrollTrigger per scene** and map its 0–1 progress to different animation phases:

```typescript
// ❌ BAD: Multiple competing ScrollTriggers
ScrollTrigger.create({ trigger: '.scene', start: 'top top', end: '+=500', onUpdate: animateA });
ScrollTrigger.create({ trigger: '.scene', start: 'top top', end: '+=300', onUpdate: animateB });

// ✅ GOOD: Single ScrollTrigger with phase mapping
ScrollTrigger.create({ 
  trigger: '.scene', 
  start: 'top top', 
  end: '+=100%',
  onUpdate: (self) => {
    const intro = mapPhase(self.progress, 0, 0.3);    // 0–30% of scroll
    const build = mapPhase(self.progress, 0.3, 0.7);  // 30–70% of scroll
    animateA(intro);
    animateB(build);
  }
});
```

**Phase mapping utility:**
```typescript
function mapPhase(scrollProgress: number, start: number, end: number): number {
  if (scrollProgress < start) return 0;
  if (scrollProgress > end) return 1;
  return (scrollProgress - start) / (end - start);
}
```

---

## File Structure

```
src/storyboard/
├── README.md (this file)
├── core/
│   ├── StoryboardManager.ts         # Global timeline coordinator
│   ├── SceneController.ts           # Individual scene lifecycle
│   ├── ElementRegistry.ts           # Persistent element state
│   └── EffectRegistry.ts            # Reusable effect library
├── types/
│   ├── Scene.types.ts               # Scene, Phase, SceneConfig
│   ├── Element.types.ts             # Element, ElementState
│   └── Effect.types.ts              # Effect, EffectParams
├── utils/
│   ├── phaseMapper.ts               # Phase mapping utilities
│   ├── scrollSync.ts                # ScrollTrigger sync helpers
│   └── timeline.ts                  # GSAP timeline helpers
├── scenes/
│   ├── 01-silk-emergence/           # Scene 1: Silk surface intro
│   │   ├── SilkEmergenceScene.tsx
│   │   ├── SilkEmergenceScene.config.ts
│   │   ├── effects/
│   │   │   └── silkRipple.ts
│   │   └── components/
│   │       ├── SilkSurface.tsx (R3F)
│   │       └── SceneUI.tsx (DOM)
│   ├── 02-seed-pod-arrival/         # Scene 2: Seed pod emerges
│   │   ├── SeedPodScene.tsx
│   │   ├── SeedPodScene.config.ts
│   │   ├── effects/
│   │   │   └── podEmergence.ts
│   │   └── components/
│   │       ├── LotusSeeded.tsx (R3F)
│   │       └── SceneUI.tsx (DOM)
│   └── ...
├── effects/
│   ├── camera/
│   │   ├── orbitEffect.ts
│   │   └── zoomEffect.ts
│   ├── materials/
│   │   ├── iridescenceEffect.ts
│   │   └── fresnelGlow.ts
│   └── transitions/
│       ├── fadeEffect.ts
│       └── morphEffect.ts
└── elements/
    ├── PersistentCamera.tsx         # Camera that spans all scenes
    ├── SilkSurface.tsx              # Surface that morphs across scenes
    └── LotusCore.tsx                # Central lotus that builds up
```

---

## Usage Pattern

### Step 1: Define Scene Config

```typescript
// scenes/01-silk-emergence/SilkEmergenceScene.config.ts
import { SceneConfig } from '@/storyboard/types/Scene.types';

export const silkEmergenceConfig: SceneConfig = {
  id: 'silk-emergence',
  duration: '100vh',               // Scroll distance
  order: 1,                         // Scene sequence
  
  phases: {
    intro: { start: 0, end: 0.15 },      // Fade in
    build: { start: 0.15, end: 0.6 },    // Ripples intensify
    hold: { start: 0.6, end: 0.85 },     // Stable state
    outro: { start: 0.85, end: 1.0 },    // Transition out
  },
  
  elements: [
    { id: 'silk-surface', type: 'persistent', persistent: true },
    { id: 'camera', type: 'persistent', persistent: true },
  ],
  
  effects: [
    { id: 'silk-ripple', target: 'silk-surface', phases: ['build', 'hold'] },
    { id: 'camera-drift', target: 'camera', phases: ['build', 'hold', 'outro'] },
    { id: 'fade-in', target: 'silk-surface', phases: ['intro'] },
  ],
};
```

### Step 2: Create Scene Component

```typescript
// scenes/01-silk-emergence/SilkEmergenceScene.tsx
import { useScene } from '@/storyboard/hooks/useScene';
import { silkEmergenceConfig } from './SilkEmergenceScene.config';
import { SilkSurface } from '@/storyboard/elements/SilkSurface';

export function SilkEmergenceScene() {
  const { sceneRef, progress, getPhaseProgress } = useScene(silkEmergenceConfig);
  
  // Phase-mapped progress values
  const introProgress = getPhaseProgress('intro');
  const buildProgress = getPhaseProgress('build');
  const holdProgress = getPhaseProgress('hold');
  const outroProgress = getPhaseProgress('outro');
  
  return (
    <section 
      ref={sceneRef}
      id={silkEmergenceConfig.id}
      className="relative h-screen"
      data-scene={silkEmergenceConfig.id}
    >
      {/* DOM Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Scene-specific UI here */}
      </div>
      
      {/* 3D Layer */}
      <div className="absolute inset-0">
        <Canvas>
          <SilkSurface 
            rippleIntensity={buildProgress} 
            opacity={introProgress}
          />
        </Canvas>
      </div>
    </section>
  );
}
```

### Step 3: Register Scene in Storyboard

```typescript
// storyboard/core/StoryboardManager.ts
import { silkEmergenceConfig } from '@/storyboard/scenes/01-silk-emergence/SilkEmergenceScene.config';
import { seedPodConfig } from '@/storyboard/scenes/02-seed-pod-arrival/SeedPodScene.config';

const storyboard = new StoryboardManager({
  scenes: [
    silkEmergenceConfig,
    seedPodConfig,
    // ... more scenes
  ],
});

storyboard.initialize();
```

---

## Key Patterns

### Pattern 1: Persistent Elements

When an element needs to span multiple scenes (e.g., camera, silk surface):

```typescript
// storyboard/elements/PersistentCamera.tsx
import { useElement } from '@/storyboard/hooks/useElement';

export function PersistentCamera() {
  const { state, updateState } = useElement('camera');
  
  useFrame(() => {
    // Camera position is managed globally, scenes just update target
    camera.position.lerp(state.targetPosition, 0.1);
  });
  
  return null; // Camera doesn't render, just updates Three.js camera
}
```

Scenes update the camera state:

```typescript
// In Scene 1
updateCameraState({ targetPosition: new Vector3(0, 2, 5) });

// In Scene 2 (camera smoothly transitions)
updateCameraState({ targetPosition: new Vector3(3, 1, 8) });
```

### Pattern 2: Effect Composition

Multiple effects can layer on one element:

```typescript
const element = useElement('lotus-petal');

// Apply multiple effects based on phase
useEffect(() => {
  const effects = [
    applyEffect('fade-in', element, introProgress),
    applyEffect('vertex-wave', element, buildProgress),
    applyEffect('iridescence', element, holdProgress),
  ];
  
  return () => effects.forEach(e => e.cleanup());
}, [introProgress, buildProgress, holdProgress]);
```

### Pattern 3: Scene Transitions

When transitioning between scenes, persist shared elements:

```typescript
// Scene 1 outro phase
const outroProgress = getPhaseProgress('outro');
updateElementState('silk-surface', {
  morphTarget: 'lotus-base',  // Start morphing to next scene's shape
  opacity: 1 - outroProgress * 0.3,  // Slight fade for transition
});

// Scene 2 intro phase picks up from Scene 1's outro state
const introProgress = getPhaseProgress('intro');
const currentMorph = getElementState('silk-surface').morphTarget;
```

---

## Implementation Phases

### Phase 1: Core Infrastructure (This PR)
- ✅ Type definitions
- ✅ StoryboardManager skeleton
- ✅ Phase mapping utilities
- ✅ useScene hook
- ✅ Example scene config

### Phase 2: Scene 1 - Silk Emergence
- Silk surface shader (vertex displacement for ripples)
- Camera drift effect
- Fade-in effect
- DOM UI for scene

### Phase 3: Scene 2 - Seed Pod Arrival
- Geometrically-correct lotus seed pod model (procedural)
- Emergence animation (scale + rotation)
- Silk → Lotus base morph
- Subsurface scattering material

### Phase 4: Additional Scenes
- Scene 3: Petal unfurling
- Scene 4: Full bloom
- Scene 5: [To be defined]

---

## CLI Tools

To support modular development, we'll create CLI tools:

```bash
# Generate new scene boilerplate
pnpm storyboard:create-scene "lotus-petal-unfurl"

# Preview specific scene in isolation
pnpm storyboard:preview silk-emergence

# Validate scene config
pnpm storyboard:validate scenes/01-silk-emergence/SilkEmergenceScene.config.ts

# Export scene timeline as JSON (for debugging)
pnpm storyboard:export silk-emergence --format json
```

---

## Testing Strategy

Each scene should be testable in isolation:

```typescript
// scenes/01-silk-emergence/__tests__/SilkEmergenceScene.test.tsx
describe('SilkEmergenceScene', () => {
  it('should map phases correctly', () => {
    const { getPhaseProgress } = renderScene(silkEmergenceConfig);
    
    // Simulate scroll to 10% (should be in intro phase)
    setScrollProgress(0.1);
    expect(getPhaseProgress('intro')).toBeCloseTo(0.67); // 0.1 / 0.15
  });
  
  it('should apply silk ripple effect during build phase', () => {
    const { getByTestId } = renderScene(silkEmergenceConfig);
    setScrollProgress(0.4); // Middle of build phase
    
    const surface = getByTestId('silk-surface');
    expect(surface).toHaveStyle({ '--ripple-intensity': '0.625' });
  });
});
```

---

## Next Steps

1. **Implement core types** (`Scene.types.ts`, `Element.types.ts`, `Effect.types.ts`)
2. **Build StoryboardManager** with GSAP timeline coordination
3. **Create first scene** (Silk Emergence) as reference implementation
4. **Document patterns** as we discover them during Scene 1 development
5. **Iterate and refine** based on real usage

This framework prevents monolithic code while maintaining a cohesive scroll experience. Each scene is a modular unit that can be developed, tested, and refined independently.

