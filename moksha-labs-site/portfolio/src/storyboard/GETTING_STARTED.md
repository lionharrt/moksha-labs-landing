# Getting Started with Storyboard Framework

## 5-Minute Quick Start

### 1. Try the Example Scene

The framework includes a complete working example: **Silk Emergence Scene**.

```typescript
// app/page.tsx
import { SilkEmergenceScene } from '@/storyboard/scenes/01-silk-emergence/SilkEmergenceScene';

export default function Home() {
  return (
    <main className="min-h-screen">
      <SilkEmergenceScene />
    </main>
  );
}
```

That's it! Scroll to see the silk surface emerge with ripple effects.

---

### 2. Create Your First Scene

Use the CLI to generate boilerplate:

```bash
# From portfolio directory
node src/storyboard/cli/create-scene.ts "my-first-scene" 2
```

This creates:
```
scenes/02-my-first-scene/
├── MyFirstSceneScene.config.ts  # Configuration
├── MyFirstSceneScene.tsx        # Component
├── README.md                    # Documentation
└── components/                  # Your 3D components
```

---

### 3. Define Your Scene's Phases

Edit `MyFirstSceneScene.config.ts`:

```typescript
phases: {
  intro: { start: 0, end: 0.2 },     // First 20% of scroll
  build: { start: 0.2, end: 0.7 },   // Next 50% of scroll
  hold: { start: 0.7, end: 0.9 },    // Hold state
  outro: { start: 0.9, end: 1.0 },   // Final 10%
}
```

---

### 4. Build Your Scene Component

Edit `MyFirstSceneScene.tsx`:

```typescript
export function MyFirstSceneScene() {
  const { sceneRef, getPhaseProgress } = useScene(myFirstSceneConfig);
  
  const introProgress = getPhaseProgress('intro');
  const buildProgress = getPhaseProgress('build');
  
  return (
    <section ref={sceneRef} id="my-first-scene" className="relative h-screen">
      {/* Your content here - opacity controlled by intro phase */}
      <div style={{ opacity: introProgress }}>
        <h1>My First Scene</h1>
      </div>
    </section>
  );
}
```

---

### 5. Register and Test

Add to StoryboardManager:

```typescript
// app/page.tsx or layout
import { StoryboardManager } from '@/storyboard';
import { silkEmergenceConfig } from '@/storyboard/scenes/01-silk-emergence/SilkEmergenceScene.config';
import { myFirstSceneConfig } from '@/storyboard/scenes/02-my-first-scene/MyFirstSceneScene.config';

const storyboard = new StoryboardManager({
  scenes: [
    silkEmergenceConfig,
    myFirstSceneConfig, // Your new scene!
  ],
  debug: true, // Shows markers and logs
});

useEffect(() => {
  storyboard.initialize();
  return () => storyboard.cleanup();
}, []);
```

---

## Key Concepts (2 minutes)

### Phases
Break your scene into segments of scroll:
- **Intro**: Fade in, establish elements
- **Build**: Main animation action
- **Hold**: Stable state, user can absorb
- **Outro**: Transition to next scene

### Elements
Visual objects in your scene:
- **Scene-scoped**: Only exist in this scene
- **Persistent**: Span multiple scenes (like camera)

### Effects
Reusable animations applied to elements:
- **fade-in**: Opacity 0 → 1
- **silk-ripple**: Vertex displacement
- **camera-orbit**: Circular camera movement

---

## Common Patterns

### Pattern 1: Fade In Element

```typescript
const introProgress = getPhaseProgress('intro');

<mesh>
  <meshStandardMaterial 
    opacity={introProgress} 
    transparent 
  />
</mesh>
```

### Pattern 2: Scale During Build

```typescript
const buildProgress = getPhaseProgress('build');
const scale = 1 + buildProgress * 2; // Scale 1 → 3

<mesh scale={scale}>
  {/* ... */}
</mesh>
```

### Pattern 3: Rotate During Hold

```typescript
const holdProgress = getPhaseProgress('hold');
const rotation = holdProgress * Math.PI * 2; // Full rotation

<mesh rotation={[0, rotation, 0]}>
  {/* ... */}
</mesh>
```

---

## Debug Tips

### Enable Debug Mode
```typescript
const storyboard = new StoryboardManager({
  scenes: [...],
  debug: true, // Shows ScrollTrigger markers and logs
});
```

### Check Phase Progress
```typescript
useEffect(() => {
  console.log('Intro:', getPhaseProgress('intro'));
  console.log('Build:', getPhaseProgress('build'));
}, [getPhaseProgress]);
```

### Validate Phases
```typescript
import { validatePhases } from '@/storyboard';

const validation = validatePhases(mySceneConfig.phases);
console.log('Valid?', validation.valid);
console.log('Errors:', validation.errors);
console.log('Warnings:', validation.warnings);
```

---

## Next Steps

1. **Study the example**: Check out `scenes/01-silk-emergence/` for a complete implementation
2. **Read the docs**: 
   - `README.md` - Architecture overview
   - `USAGE.md` - Comprehensive usage guide
   - `IMPLEMENTATION_SUMMARY.md` - Implementation details
3. **Experiment**: Create simple scenes to understand phase mapping
4. **Build**: Create your full animation sequence scene by scene

---

## Need Help?

- **Phase mapping confusing?** → Read `@docs/14-SCROLL-PHASING-PATTERNS.md`
- **Want examples?** → See `scenes/01-silk-emergence/`
- **TypeScript errors?** → Check `types/` for full definitions
- **Performance issues?** → See IMPLEMENTATION_SUMMARY.md "Performance Considerations"

---

## Framework Philosophy

> **One scene at a time.** Each scene is independent, testable, and can be developed in isolation. No more monolithic scroll code. No more competing ScrollTriggers. Just clean, modular animations.

Happy building! 🚀

