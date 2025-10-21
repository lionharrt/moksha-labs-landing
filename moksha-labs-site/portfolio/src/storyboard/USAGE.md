# Storyboard Framework Usage Guide

## Quick Start

### 1. Define Your Scene Config

Create a configuration file for your scene with phases and effects:

```typescript
// scenes/my-scene/MyScene.config.ts
import { SceneConfig } from '@/storyboard/types/Scene.types';

export const mySceneConfig: SceneConfig = {
  id: 'my-scene',
  name: 'My Amazing Scene',
  order: 1,
  duration: '100vh',
  
  phases: {
    intro: { start: 0, end: 0.2 },
    build: { start: 0.2, end: 0.7 },
    hold: { start: 0.7, end: 0.9 },
    outro: { start: 0.9, end: 1.0 },
  },
  
  elements: [
    {
      id: 'my-element',
      type: 'mesh',
      persistent: false,
      initialState: {
        visible: true,
        opacity: 1,
        position: [0, 0, 0],
      },
    },
  ],
  
  effects: [
    {
      id: 'fade-in',
      target: 'my-element',
      phases: ['intro'],
      params: { duration: 1.0 },
    },
  ],
  
  pin: true,
  scrub: 1,
};
```

### 2. Create Your Scene Component

```typescript
// scenes/my-scene/MyScene.tsx
'use client';

import { useScene } from '@/storyboard/hooks/useScene';
import { mySceneConfig } from './MyScene.config';

export function MyScene() {
  const { sceneRef, getPhaseProgress } = useScene(mySceneConfig);
  
  const introProgress = getPhaseProgress('intro');
  const buildProgress = getPhaseProgress('build');
  
  return (
    <section
      ref={sceneRef}
      id={mySceneConfig.id}
      className="relative h-screen"
    >
      {/* Your scene content here */}
      <div style={{ opacity: introProgress }}>
        Fading in...
      </div>
    </section>
  );
}
```

### 3. Register Scene in Storyboard

```typescript
// app/page.tsx or your main component
import { StoryboardManager } from '@/storyboard/core/StoryboardManager';
import { mySceneConfig } from '@/storyboard/scenes/my-scene/MyScene.config';

const storyboard = new StoryboardManager({
  scenes: [mySceneConfig],
  debug: true,
});

// Initialize when component mounts
useEffect(() => {
  storyboard.initialize();
  return () => storyboard.cleanup();
}, []);
```

---

## Common Patterns

### Pattern 1: Phase-Mapped Animations

Map different animations to different scroll phases:

```typescript
function MyScene() {
  const { getPhaseProgress } = useScene(config);
  
  // Each animation gets its own phase progress (0-1)
  const fadeProgress = getPhaseProgress('intro');
  const scaleProgress = getPhaseProgress('build');
  const rotateProgress = getPhaseProgress('hold');
  
  return (
    <mesh
      scale={1 + scaleProgress}
      rotation={[0, rotateProgress * Math.PI * 2, 0]}
    >
      <meshStandardMaterial opacity={fadeProgress} transparent />
    </mesh>
  );
}
```

### Pattern 2: Persistent Elements

Elements that span multiple scenes:

```typescript
// In Scene 1 config
elements: [
  {
    id: 'main-camera',
    type: 'camera',
    persistent: true, // Will persist across scenes
    initialState: {
      position: [0, 5, 10],
    },
  },
]

// In Scene 2 config (same camera, different target position)
elements: [
  {
    id: 'main-camera',
    type: 'camera',
    persistent: true,
    initialState: {
      position: [3, 2, 8], // Camera smoothly transitions
    },
  },
]
```

### Pattern 3: Composing Effects

Apply multiple effects to one element:

```typescript
effects: [
  {
    id: 'fade-in',
    target: 'lotus-petal',
    phases: ['intro'],
  },
  {
    id: 'vertex-wave',
    target: 'lotus-petal',
    phases: ['build', 'hold'],
    params: { amplitude: 0.1, frequency: 2.0 },
  },
  {
    id: 'iridescence',
    target: 'lotus-petal',
    phases: ['hold'],
    params: { strength: 0.5 },
  },
]
```

### Pattern 4: Smooth Phase Transitions

Blend between phases using overlapping ranges:

```typescript
phases: {
  intro: { start: 0, end: 0.3 },
  build: { start: 0.25, end: 0.7 },  // Overlaps with intro & hold
  hold: { start: 0.65, end: 1.0 },   // Overlaps with build
}

// In component
const introFade = Math.max(0, 1 - buildProgress); // Fade out intro as build starts
const buildIntensity = buildProgress * (1 - holdProgress * 0.5); // Smooth transition
```

### Pattern 5: Conditional Effects

Enable effects based on scroll progress or conditions:

```typescript
function MyScene() {
  const { progress, getPhaseProgress } = useScene(config);
  
  const buildProgress = getPhaseProgress('build');
  const shouldAnimate = buildProgress > 0.3; // Only animate after 30% through build
  
  return (
    <mesh>
      {shouldAnimate && (
        <MyAnimation intensity={buildProgress} />
      )}
    </mesh>
  );
}
```

---

## Advanced Usage

### Custom Phase Easing

Apply easing to individual phases:

```typescript
phases: {
  intro: {
    start: 0,
    end: 0.3,
    ease: 'power2.out', // Ease out for smooth entry
  },
  build: {
    start: 0.3,
    end: 0.7,
    ease: 'elastic.out', // Bouncy effect
  },
}
```

### Dynamic Phase Mapping

Create custom phase mappers for complex animations:

```typescript
import { createPhaseMapper, smoothstep } from '@/storyboard/utils/phaseMapper';

const customMapper = createPhaseMapper(0.2, 0.8, 'power3.out');
const customProgress = customMapper(scrollProgress);

// Or use smoothstep for even smoother transitions
const smoothProgress = smoothstep(0.2, 0.8, scrollProgress);
```

### Element State Management

Subscribe to element state changes:

```typescript
import { useElement } from '@/storyboard/hooks/useElement';

function MyComponent() {
  const { state, updateState } = useElement('my-element');
  
  // Update element state
  const handleClick = () => {
    updateState({
      position: [1, 2, 3],
      material: { color: '#ff0000' },
    });
  };
  
  return <div>Element opacity: {state?.opacity}</div>;
}
```

### Creating Custom Effects

Register custom effects with the registry:

```typescript
// effects/myCustomEffect.ts
import { EffectConfig, EffectApplication } from '@/storyboard/types/Effect.types';

export const myCustomEffectConfig: EffectConfig = {
  id: 'my-custom-effect',
  name: 'My Custom Effect',
  category: 'geometry',
  defaultParams: {
    intensity: 1.0,
    speed: 1.0,
  },
};

export const myCustomEffectApplication: EffectApplication = {
  apply: (elementState, progress, params, deltaTime) => {
    // Apply effect logic
    return {
      ...elementState,
      position: [
        elementState.position[0] + Math.sin(progress * Math.PI) * params.intensity,
        elementState.position[1],
        elementState.position[2],
      ],
    };
  },
};

// Register in storyboard initialization
effectRegistry.register(myCustomEffectConfig, myCustomEffectApplication);
```

---

## Debugging

### Enable Debug Mode

```typescript
const storyboard = new StoryboardManager({
  scenes: [scene1, scene2],
  debug: true, // Enables console logging and ScrollTrigger markers
});
```

### Get Debug Info

```typescript
// Global debug info
const debugInfo = storyboard.getDebugInfo();
console.log('Active scene:', debugInfo.activeScene);
console.log('Total scenes:', debugInfo.scenes.length);

// Scene-specific debug info
const scene = storyboard.getScene('my-scene');
const sceneDebug = scene?.getDebugInfo();
console.log('Scene progress:', sceneDebug?.progress);
console.log('Active effects:', sceneDebug?.activeEffects);
```

### Validate Scene Config

```typescript
import { validatePhases } from '@/storyboard/utils/phaseMapper';

const validation = validatePhases(mySceneConfig.phases);

if (!validation.valid) {
  console.error('Phase errors:', validation.errors);
}

if (validation.warnings.length > 0) {
  console.warn('Phase warnings:', validation.warnings);
}
```

---

## Best Practices

### 1. Keep Scenes Self-Contained

Each scene should be independently testable and renderable:

```typescript
// ✅ Good: Scene can render independently
export function MyScene() {
  const { sceneRef, getPhaseProgress } = useScene(config);
  return <section ref={sceneRef}>{/* ... */}</section>;
}

// ❌ Bad: Scene depends on external global state
export function MyScene() {
  const globalState = useGlobalState(); // Avoid this
  return <section>{/* ... */}</section>;
}
```

### 2. Use Semantic Phase Names

Choose phase names that describe what's happening:

```typescript
// ✅ Good: Descriptive phase names
phases: {
  fadeIn: { start: 0, end: 0.2 },
  petalUnfurl: { start: 0.2, end: 0.6 },
  bloomComplete: { start: 0.6, end: 1.0 },
}

// ❌ Bad: Generic phase names
phases: {
  phase1: { start: 0, end: 0.2 },
  phase2: { start: 0.2, end: 0.6 },
}
```

### 3. Avoid Competing ScrollTriggers

Use ONE ScrollTrigger per scene, map phases internally:

```typescript
// ✅ Good: Single ScrollTrigger, phase-mapped
const introProgress = getPhaseProgress('intro');
const buildProgress = getPhaseProgress('build');

// ❌ Bad: Multiple ScrollTriggers
ScrollTrigger.create({ /* intro */ });
ScrollTrigger.create({ /* build */ }); // Competes with above!
```

### 4. Document Scene Dependencies

Use metadata to document what each scene needs:

```typescript
metadata: {
  description: 'Lotus petals unfurl using Fibonacci spiral',
  tags: ['lotus', 'procedural', 'fibonacci'],
  dependencies: ['silk-surface', 'seed-pod'],
}
```

### 5. Clean Up Resources

Always cleanup in scene components:

```typescript
useEffect(() => {
  // Setup
  const cleanup = setupMyScene();
  
  // Cleanup on unmount
  return () => {
    cleanup();
  };
}, []);
```

---

## Troubleshooting

### "Element not found in registry"

Make sure elements are registered before scenes initialize:

```typescript
// Register global elements first
storyboard = new StoryboardManager({
  elements: [globalCameraConfig, globalLightConfig],
  scenes: [scene1Config], // Scenes can now reference global elements
});
```

### "Phase validation errors"

Check that phases don't overlap and cover 0-1 range:

```typescript
// ❌ Bad: Gap between phases
phases: {
  intro: { start: 0, end: 0.3 },
  build: { start: 0.5, end: 1.0 }, // Gap from 0.3-0.5!
}

// ✅ Good: Continuous coverage
phases: {
  intro: { start: 0, end: 0.3 },
  build: { start: 0.3, end: 1.0 },
}
```

### "ScrollTrigger not updating"

Refresh ScrollTrigger after layout changes:

```typescript
import { refreshScrollTriggers } from '@/storyboard/utils/scrollSync';

useEffect(() => {
  // After dynamic content loads
  refreshScrollTriggers();
}, [contentLoaded]);
```

---

## Next Steps

1. **Create your first scene** using the Silk Emergence example as reference
2. **Define your scene phases** based on your animation requirements
3. **Build scene components** with R3F for 3D and React for DOM
4. **Register scenes** in StoryboardManager
5. **Test in isolation** before integrating into full storyboard
6. **Iterate and refine** based on scroll feel and performance

For more examples, see:
- `scenes/01-silk-emergence/` - Complete scene implementation
- `README.md` - Architecture overview
- `types/` - Full TypeScript definitions

