# Project Structure

This document outlines the clean, modular architecture of the Moksha Labs portfolio site.

## Overview

The project is organized by feature, with strict separation of concerns to prevent monolithic components and accidental coupling.

## Core Directories

```
src/
├── app/                         # Next.js 14 App Router
│   ├── layout.tsx              # Root layout with providers
│   └── page.tsx                # Home page
├── components/
│   ├── dev/                    # Development tools
│   │   └── DevToolbar.tsx      # Runtime effect/mandala switcher
│   ├── providers/              # React context providers
│   │   ├── LenisProvider.tsx   # Smooth scroll orchestration
│   │   └── Providers.tsx       # Provider composition
│   └── sections/               # Page sections
│       └── Hero/               # Hero section (our focus)
│           ├── Hero.tsx        # Section container with scroll logic
│           ├── GeometricWireframe.tsx  # R3F Canvas wrapper
│           ├── effects/        # ⭐ Modular effect system
│           └── mandalas/       # Sacred geometry definitions
├── stores/                     # Zustand state management
│   └── useStore.ts             # Global app state
└── types/                      # TypeScript declarations
    └── glsl.d.ts              # Shader file types
```

## Hero Section Architecture

### Key Design: Separation of Concerns

```
Hero.tsx                        # Scroll orchestration (single source of truth)
    ↓ (passes breakProgress)
GeometricWireframe.tsx         # R3F Canvas wrapper
    ↓ (switches based on selectedEffect)
effects/                       # Modular, swappable effects
    ├── MeshBreakEffect/       # Manual mesh manipulation
    ├── ParticleExplosionEffect/  # GPU particles
    └── ShaderDissolveEffect/  # Custom shaders
```

### Effect System

Each effect is:
- **Self-contained**: Lives in its own folder
- **Stateless**: Receives all data via props
- **Interface-compliant**: Implements `EffectProps`
- **Independent**: No dependencies on other effects

This allows:
✅ Easy testing of different visual approaches
✅ No risk of breaking other effects when editing one
✅ Clear separation between scroll logic and rendering
✅ Simple addition of new effects

See `src/components/sections/Hero/effects/README.md` for details.

## State Management

### Zustand Store (`stores/useStore.ts`)

```typescript
{
  // Current state
  currentSection: 'hero' | 'services' | ...
  scrollProgress: 0-1
  
  // Visual configuration
  selectedMandala: 'original' | 'flowerOfLife' | ...
  selectedEffect: 'mesh-break' | 'particle-explosion' | ...
  
  // Dev tools
  devMode: boolean
}
```

### Single Source of Truth Pattern

```typescript
// Hero.tsx creates ONE ScrollTrigger
ScrollTrigger.create({
  trigger: '.hero',
  start: 'top top',
  end: '+=1000vh',
  onUpdate: (self) => {
    const rawProgress = self.progress; // 0-1 for entire section
    const breakProgress = /* map to specific phase */;
    setBreakProgress(breakProgress); // Pass to effects
  }
});
```

All animations derive from this single scroll value, ensuring perfect synchronization.

## Modularity Principles

### 1. Feature Folders
Each feature (effect, mandala, section) lives in its own directory with all related files.

### 2. Index Files
Every folder exports through `index.ts` for clean imports:
```typescript
// Clean
import { MeshBreakEffect } from '@/components/sections/Hero/effects';

// Instead of
import { MeshBreakEffect } from '@/components/sections/Hero/effects/MeshBreakEffect/MeshBreakEffect';
```

### 3. Type Safety
All cross-cutting types defined in `effects/types.ts` ensure interface compliance.

### 4. No Circular Dependencies
Strict one-way data flow: Props down, events/state changes up.

## Adding New Features

### New Effect
1. Create folder: `effects/NewEffect/`
2. Implement `EffectProps` interface
3. Export from `effects/index.ts`
4. Add to `EFFECT_INFO` registry
5. Update `GeometricWireframe.tsx` switch

### New Mandala
1. Create file: `mandalas/NewMandala.tsx`
2. Accept `breakProgress` prop
3. Export from `mandalas/index.ts`
4. Add to `MANDALA_INFO` registry
5. Update effect-specific generators if needed

### New Section
1. Create folder: `sections/NewSection/`
2. Implement scroll logic
3. Add to `app/page.tsx`
4. Update navigation config

## Performance Patterns

### Code Splitting
- Effects lazy-loaded via dynamic imports
- R3F Canvas only renders on Hero section

### Optimization
- `useMemo` for expensive calculations
- `useFrame` for animation loops (R3F)
- GSAP for smooth, optimized tweens
- Lenis for hardware-accelerated smooth scroll

### Asset Management
- GLSL shaders compiled at build time
- Geometries generated procedurally (no model files)
- Minimal bundle size (~350kB total)

## Development Workflow

1. **DevToolbar** (`cmd+shift+D` or bottom-right tab)
   - Switch effects in real-time
   - Change mandalas without code
   - Monitor scroll progress
   - Toggle ScrollTrigger markers

2. **Hot Reload**
   - All changes reflect immediately
   - No manual server restarts needed

3. **Type Safety**
   - All props typed
   - GLSL files have declarations
   - Store actions strongly typed

## Anti-Patterns Avoided

❌ **Monolithic Components**
- Each effect is <100 lines
- Shared logic extracted to utilities

❌ **Prop Drilling**
- Zustand for global state
- Context only for cross-cutting concerns

❌ **Tight Coupling**
- Effects don't know about each other
- Mandalas don't know about effects
- Scroll logic separated from rendering

❌ **Mixed Concerns**
- Scroll orchestration (Hero.tsx)
- Effect rendering (effects/)
- Geometry definitions (mandalas/)
- All separate

## Testing Strategy

Effects are unit-testable:
```typescript
<EffectProps breakProgress={0.5} selectedMandala="original" />
```

No mocking required - just pass props and verify output.

---

This structure enables rapid iteration, prevents accidental breakage, and keeps the codebase maintainable as complexity grows.

