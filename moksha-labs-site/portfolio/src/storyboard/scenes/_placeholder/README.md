# Placeholder Scenes - Storyboard Planning Tool

## Purpose

Placeholder scenes allow you to **map out your entire storyboard** before implementing the actual 3D/animation content. This helps you:

1. **Visualize the flow** - See how scenes transition and feel the pacing
2. **Test scroll distances** - Experiment with different durations per scene
3. **Plan phase timing** - Understand when intro/build/hold/outro phases happen
4. **Get stakeholder feedback** - Share the scroll experience before building complex 3D

## Usage

### Quick Setup

```typescript
// 1. Import the placeholder creator
import { 
  createPlaceholderScene,
  seedPodArrivalConfig,
  petalUnfurlingConfig 
} from '@/storyboard/scenes/_placeholder/PlaceholderScene.config';

// 2. Add to StoryboardManager
const storyboard = new StoryboardManager({
  scenes: [
    silkEmergenceConfig,      // Real scene
    seedPodArrivalConfig,      // Placeholder
    petalUnfurlingConfig,      // Placeholder
  ],
});

// 3. Render placeholder in page
import { PlaceholderScene } from '@/storyboard/scenes/_placeholder/PlaceholderScene';

<PlaceholderScene config={seedPodArrivalConfig} />
```

### Custom Placeholder

```typescript
// Create a custom placeholder with specific duration and colors
const mySceneConfig = createPlaceholderScene(
  'my-scene-id',
  'My Scene Name',
  4,                    // Scene order
  '+=800vh'            // 8 screens of scroll
);

// Render with custom colors
<PlaceholderScene 
  config={mySceneConfig}
  bgColor="#2d6363"    // Background color
  textColor="#f2b56a"  // Text/accent color
/>
```

## Pre-defined Placeholders

The following placeholders are ready to use:

### Scene 2: Seed Pod Arrival
- **Duration**: 2000vh (20 screens)
- **Purpose**: Lotus seed pod emerges from silk surface

### Scene 3: Petal Unfurling  
- **Duration**: 1500vh (15 screens)
- **Purpose**: Petals unfurl using Fibonacci spiral

### Scene 4: Full Bloom
- **Duration**: 1000vh (10 screens)
- **Purpose**: Complete lotus flower revealed

### Scene 5: Final State
- **Duration**: 500vh (5 screens)
- **Purpose**: Transition to portfolio content

**Total Journey**: ~80 screens of scroll

## What Placeholders Show

Each placeholder displays:
- ✅ Scene name and order
- ✅ Overall scroll progress (0-100%)
- ✅ Individual phase progress (intro, build, hold, outro)
- ✅ Active phase indicator
- ✅ Visual progress bar at bottom
- ✅ Scene metadata/description

## Workflow

### Phase 1: Planning (Use Placeholders)
```typescript
// Map out entire storyboard with placeholders
scenes: [
  silkEmergenceConfig,        // 30 screens
  seedPodArrivalConfig,        // 20 screens (placeholder)
  petalUnfurlingConfig,        // 15 screens (placeholder)
  fullBloomConfig,             // 10 screens (placeholder)
  finalStateConfig,            //  5 screens (placeholder)
]
// Total: 80 screens mapped out
```

### Phase 2: Implementation (Replace Placeholders)
```typescript
// Replace placeholder with real scene implementation
scenes: [
  silkEmergenceConfig,        // ✅ Real scene
  seedPodArrivalConfig,        // ✅ Real scene (replaced placeholder)
  petalUnfurlingConfig,        // 🚧 Still placeholder
  fullBloomConfig,             // 🚧 Still placeholder
  finalStateConfig,            // 🚧 Still placeholder
]
```

### Phase 3: Refinement (Adjust Durations)
```typescript
// After testing, adjust durations
const seedPodArrivalConfig = createPlaceholderScene(
  'seed-pod-arrival',
  'Seed Pod Arrival',
  2,
  '+=1500vh'  // Changed from 2000vh to 1500vh - felt too long
);
```

## Tips

1. **Start with more screens** - Easier to reduce duration than add it
2. **Test on actual devices** - Scroll feel changes on mobile vs desktop
3. **Get feedback early** - Show placeholders to stakeholders before building
4. **Use consistent colors** - Alternate between teal and saffron palettes
5. **Document phase purposes** - Note what should happen in each phase

## Example: Full Storyboard Layout

```typescript
// app/page.tsx
<StoryboardProvider config={{ scenes: allScenes, debug: true }}>
  <Navigation />
  
  <div className="relative">
    {/* Scene 1 - IMPLEMENTED */}
    <SilkEmergenceScene />
    
    {/* Scene 2 - PLACEHOLDER */}
    <PlaceholderScene 
      config={seedPodArrivalConfig}
      bgColor="#0d3838"
      textColor="#e89f4c"
    />
    
    {/* Scene 3 - PLACEHOLDER */}
    <PlaceholderScene 
      config={petalUnfurlingConfig}
      bgColor="#1a4d4d"
      textColor="#f2b56a"
    />
    
    {/* Scene 4 - PLACEHOLDER */}
    <PlaceholderScene 
      config={fullBloomConfig}
      bgColor="#2d6363"
      textColor="#e89f4c"
    />
    
    {/* Scene 5 - PLACEHOLDER */}
    <PlaceholderScene 
      config={finalStateConfig}
      bgColor="#0d3838"
      textColor="#ffffff"
    />
  </div>
</StoryboardProvider>
```

## Transitioning from Placeholder to Real Scene

When you're ready to implement a scene:

1. Copy the placeholder config duration
2. Create new scene folder: `scenes/02-seed-pod-arrival/`
3. Build actual scene component with 3D/animations
4. Replace placeholder in page.tsx
5. Keep placeholder config as reference for phase timing

---

**Remember**: Placeholders are for planning, not production. Replace them as you build each scene!

