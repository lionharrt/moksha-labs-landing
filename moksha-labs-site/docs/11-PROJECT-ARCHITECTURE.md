# Project Architecture

**Best Practices for Organizing Award-Winning Three.js Projects**

---

## 📖 Table of Contents

1. [Project Structure](#project-structure)
2. [File Organization](#file-organization)
3. [State Management](#state-management)
4. [Component Patterns](#component-patterns)
5. [Code Splitting](#code-splitting)
6. [Environment Setup](#environment-setup)
7. [TypeScript Setup](#typescript-setup)
8. [Production Checklist](#production-checklist)

---

## Project Structure

### Next.js + React Three Fiber (Recommended)

```
my-3d-site/
├── public/
│   ├── models/
│   │   ├── scene.glb
│   │   └── character.glb
│   ├── textures/
│   │   ├── color.jpg
│   │   ├── normal.jpg
│   │   └── roughness.jpg
│   ├── fonts/
│   └── audio/
│
├── src/
│   ├── app/                    # Next.js 14+ App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── canvas/             # Three.js/R3F components
│   │   │   ├── Scene.tsx
│   │   │   ├── Camera.tsx
│   │   │   ├── Lights.tsx
│   │   │   ├── Models/
│   │   │   │   ├── HeroModel.tsx
│   │   │   │   └── ProductModel.tsx
│   │   │   ├── Effects/
│   │   │   │   ├── Particles.tsx
│   │   │   │   └── PostProcessing.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── dom/                # HTML/React components
│   │   │   ├── Hero.tsx
│   │   │   ├── Section.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   └── common/             # Shared components
│   │       ├── Loading.tsx
│   │       ├── ErrorBoundary.tsx
│   │       └── SEO.tsx
│   │
│   ├── hooks/
│   │   ├── useLenis.ts
│   │   ├── useScroll.ts
│   │   ├── useMediaQuery.ts
│   │   └── useGLTF.ts
│   │
│   ├── stores/
│   │   ├── useStore.ts         # Zustand store
│   │   └── types.ts
│   │
│   ├── shaders/
│   │   ├── fragment.glsl
│   │   ├── vertex.glsl
│   │   └── utils.glsl
│   │
│   ├── utils/
│   │   ├── math.ts
│   │   ├── animation.ts
│   │   ├── three-utils.ts
│   │   └── constants.ts
│   │
│   ├── config/
│   │   ├── theme.ts
│   │   ├── site.ts
│   │   └── gsap.ts
│   │
│   └── types/
│       ├── three.d.ts
│       └── global.d.ts
│
├── .env.local
├── .env.production
├── next.config.js
├── tsconfig.json
├── tailwind.config.js
└── package.json
```

### Vite + React Three Fiber (Alternative)

```
my-3d-site/
├── public/
│   └── [assets]/
│
├── src/
│   ├── components/
│   │   ├── canvas/
│   │   └── dom/
│   ├── hooks/
│   ├── stores/
│   ├── shaders/
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## File Organization

### Component Organization

```tsx
// src/components/canvas/Models/HeroModel.tsx

import { useGLTF, useAnimations } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { useScroll } from '@/hooks/useScroll';

/**
 * Hero 3D model with scroll-based animation
 */
export function HeroModel() {
  const group = useRef();
  const { scene, animations } = useGLTF('/models/hero.glb');
  const { actions } = useAnimations(animations, group);
  const scrollY = useScroll();

  useEffect(() => {
    actions['Idle']?.play();
  }, [actions]);

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

// Preload
useGLTF.preload('/models/hero.glb');
```

### Index Exports

```typescript
// src/components/canvas/index.ts

export { Scene } from './Scene';
export { Camera } from './Camera';
export { Lights } from './Lights';
export { HeroModel } from './Models/HeroModel';
export { Particles } from './Effects/Particles';
export { PostProcessing } from './Effects/PostProcessing';

// Usage:
// import { Scene, Camera, Lights } from '@/components/canvas';
```

---

## State Management

### Zustand Store (Recommended)

```typescript
// src/stores/useStore.ts

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface AppState {
  // UI State
  loading: boolean;
  section: number;
  menuOpen: boolean;
  
  // 3D State
  cameraPosition: [number, number, number];
  
  // Actions
  setLoading: (loading: boolean) => void;
  setSection: (section: number) => void;
  toggleMenu: () => void;
  setCameraPosition: (position: [number, number, number]) => void;
}

export const useStore = create<AppState>()(
  subscribeWithSelector((set) => ({
    // Initial state
    loading: true,
    section: 0,
    menuOpen: false,
    cameraPosition: [0, 0, 5],
    
    // Actions
    setLoading: (loading) => set({ loading }),
    setSection: (section) => set({ section }),
    toggleMenu: () => set((state) => ({ menuOpen: !state.menuOpen })),
    setCameraPosition: (position) => set({ cameraPosition: position }),
  }))
);

// Usage in components
function MyComponent() {
  const section = useStore((state) => state.section);
  const setSection = useStore((state) => state.setSection);
  
  return <button onClick={() => setSection(1)}>Go to Section 1</button>;
}

// Subscribe to changes
useStore.subscribe(
  (state) => state.section,
  (section) => console.log('Section changed:', section)
);
```

### React Context (For Simple State)

```tsx
// src/contexts/LenisContext.tsx

import { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import Lenis from '@studio-freight/lenis';

interface LenisContextValue {
  lenis: Lenis | null;
}

const LenisContext = createContext<LenisContextValue>({ lenis: null });

export function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <LenisContext.Provider value={{ lenis: lenisRef.current }}>
      {children}
    </LenisContext.Provider>
  );
}

export const useLenis = () => useContext(LenisContext);
```

---

## Component Patterns

### Container/Presenter Pattern

```tsx
// Container (logic)
function HeroContainer() {
  const [modelReady, setModelReady] = useState(false);
  const scrollY = useScroll();
  
  const rotation = useMemo(
    () => scrollY * 0.001,
    [scrollY]
  );

  return (
    <HeroPresenter
      rotation={rotation}
      onModelReady={() => setModelReady(true)}
    />
  );
}

// Presenter (rendering)
function HeroPresenter({ rotation, onModelReady }) {
  return (
    <group rotation={[0, rotation, 0]}>
      <Model onLoad={onModelReady} />
    </group>
  );
}
```

### Compound Components

```tsx
// Scene.tsx
function Scene({ children }: { children: ReactNode }) {
  return <group>{children}</group>;
}

Scene.Camera = function SceneCamera() {
  return <PerspectiveCamera makeDefault position={[0, 0, 5]} />;
};

Scene.Lights = function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
    </>
  );
};

// Usage
<Canvas>
  <Scene>
    <Scene.Camera />
    <Scene.Lights />
    <Model />
  </Scene>
</Canvas>
```

### Render Props

```tsx
function WithPhysics({ children }: { children: (api: PhysicsAPI) => ReactNode }) {
  const api = usePhysics();
  
  return <>{children(api)}</>;
}

// Usage
<WithPhysics>
  {(api) => (
    <button onClick={() => api.applyForce([0, 10, 0])}>
      Jump
    </button>
  )}
</WithPhysics>
```

---

## Code Splitting

### Lazy Loading Components

```tsx
import { lazy, Suspense } from 'react';

// Lazy load heavy 3D component
const HeavyModel = lazy(() => import('@/components/canvas/Models/HeavyModel'));

function Scene() {
  return (
    <Suspense fallback={<LoadingBox />}>
      <HeavyModel />
    </Suspense>
  );
}
```

### Dynamic Imports

```tsx
// Load on interaction
function loadPhysics() {
  return import('@react-three/rapier');
}

function Scene() {
  const [Physics, setPhysics] = useState(null);

  useEffect(() => {
    loadPhysics().then((module) => {
      setPhysics(() => module.Physics);
    });
  }, []);

  if (!Physics) return <SimpleScene />;

  return (
    <Physics>
      <ComplexScene />
    </Physics>
  );
}
```

### Route-Based Splitting

```tsx
// app/sections/hero/page.tsx
export default function HeroSection() {
  return <Hero />;
}

// app/sections/gallery/page.tsx
export default function GallerySection() {
  return <Gallery />;
}

// Next.js automatically code-splits by route
```

---

## Environment Setup

### Environment Variables

```bash
# .env.local

NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_STATS=true
NEXT_PUBLIC_ENABLE_DEBUG=true
```

```bash
# .env.production

NEXT_PUBLIC_API_URL=https://api.mysite.com
NEXT_PUBLIC_ENABLE_STATS=false
NEXT_PUBLIC_ENABLE_DEBUG=false
```

### Configuration File

```typescript
// src/config/site.ts

export const siteConfig = {
  name: 'My 3D Site',
  description: 'Award-winning 3D experience',
  url: 'https://mysite.com',
  
  features: {
    stats: process.env.NEXT_PUBLIC_ENABLE_STATS === 'true',
    debug: process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true',
  },
  
  performance: {
    maxParticles: {
      mobile: 1000,
      desktop: 10000,
    },
    pixelRatio: {
      min: 1,
      max: 2,
    },
  },
};
```

---

## TypeScript Setup

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/stores/*": ["./src/stores/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

### Type Definitions

```typescript
// src/types/three.d.ts

import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

declare module '*.glsl' {
  const content: string;
  export default content;
}

declare module '*.gltf' {
  const content: string;
  export default content;
}

declare module '*.glb' {
  const content: string;
  export default content;
}

// Extend Three.js types
declare module 'three' {
  interface Object3D {
    userData: {
      [key: string]: any;
    };
  }
}
```

---

## Production Checklist

### Performance

```typescript
// Performance monitoring
export function usePerformanceMonitor() {
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();

    function checkFPS() {
      frameCount++;
      const currentTime = performance.now();
      const elapsed = currentTime - lastTime;

      if (elapsed >= 1000) {
        const fps = Math.round((frameCount * 1000) / elapsed);
        
        if (fps < 30) {
          console.warn(`Low FPS: ${fps}`);
          // Reduce quality settings
        }

        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(checkFPS);
    }

    checkFPS();
  }, []);
}
```

### Error Boundaries

```tsx
// src/components/common/ErrorBoundary.tsx

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div>
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
<ErrorBoundary fallback={<ErrorScreen />}>
  <Canvas>
    <Scene />
  </Canvas>
</ErrorBoundary>
```

### Analytics

```typescript
// src/utils/analytics.ts

export const trackEvent = (event: string, data?: Record<string, any>) => {
  if (typeof window === 'undefined') return;
  
  // Google Analytics
  if (window.gtag) {
    window.gtag('event', event, data);
  }
  
  // Custom analytics
  console.log('Event:', event, data);
};

// Usage
trackEvent('model_loaded', { modelName: 'hero' });
trackEvent('section_viewed', { section: 2 });
```

### SEO

```tsx
// src/components/common/SEO.tsx

import Head from 'next/head';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

export function SEO({ title, description, image, url }: SEOProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </Head>
  );
}
```

---

## Build Configuration

### Next.js Config

```javascript
// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // GLSL shader support
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader', 'glslify-loader'],
    });

    return config;
  },
  
  images: {
    domains: ['cdn.mysite.com'],
  },
  
  experimental: {
    optimizePackageImports: ['three', '@react-three/fiber', '@react-three/drei'],
  },
};

module.exports = nextConfig;
```

### Vite Config

```typescript
// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  plugins: [
    react(),
    glsl(),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three-vendor': ['three'],
          'r3f-vendor': ['@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
});
```

---

**Key Takeaways:**
- Organize by feature, not file type
- Use TypeScript for type safety
- Implement proper state management
- Code split for performance
- Monitor performance in production
- Handle errors gracefully

**Complete! Return to [Overview](./00-OVERVIEW.md) to review all documentation.**

