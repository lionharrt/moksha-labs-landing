# Quick Reference Cheat Sheet

**Essential Code Patterns for Award-Winning Three.js Sites**

---

## 🚀 Basic Setup

### Minimal R3F Setup
```jsx
import { Canvas } from '@react-three/fiber';

function App() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
    </Canvas>
  );
}
```

### Production Canvas Setup
```jsx
<Canvas
  camera={{ position: [0, 0, 5], fov: 75 }}
  dpr={[1, 2]}  // Limit pixel ratio
  gl={{
    antialias: true,
    powerPreference: 'high-performance',
  }}
  shadows
  style={{ position: 'fixed', top: 0, left: 0 }}
>
  <Suspense fallback={<Loader />}>
    <Scene />
  </Suspense>
</Canvas>
```

---

## 🎨 Common Geometries

```jsx
// Primitives
<boxGeometry args={[1, 1, 1]} />
<sphereGeometry args={[1, 32, 32]} />
<planeGeometry args={[10, 10]} />
<cylinderGeometry args={[1, 1, 2, 32]} />
<torusGeometry args={[1, 0.4, 16, 100]} />
<torusKnotGeometry args={[1, 0.3, 128, 16]} />

// Drei helpers
<RoundedBox args={[1, 1, 1]} radius={0.05} />
<Sphere args={[1, 32, 32]} />
```

---

## 💡 Lighting Patterns

### Three-Point Lighting
```jsx
function Lights() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 10, 7]} intensity={1} />
      <directionalLight position={[-5, 0, 2]} intensity={0.3} />
      <directionalLight position={[0, 5, -10]} intensity={0.5} />
    </>
  );
}
```

### Environment + Contact Shadows (Production)
```jsx
import { Environment, ContactShadows } from '@react-three/drei';

<Environment preset="sunset" />
<ContactShadows position={[0, -1, 0]} opacity={0.5} scale={10} blur={2} />
```

---

## 🎭 Materials

### Standard PBR Material
```jsx
<meshStandardMaterial
  color="#ff0000"
  metalness={0.5}
  roughness={0.5}
  envMapIntensity={1}
/>
```

### Glass Material
```jsx
<meshPhysicalMaterial
  transmission={1}
  thickness={0.5}
  roughness={0}
  ior={1.5}
  transparent
/>
```

### With Texture
```jsx
import { useTexture } from '@react-three/drei';

function TexturedMesh() {
  const props = useTexture({
    map: '/color.jpg',
    normalMap: '/normal.jpg',
    roughnessMap: '/roughness.jpg',
  });
  
  return (
    <mesh>
      <sphereGeometry />
      <meshStandardMaterial {...props} />
    </mesh>
  );
}
```

---

## 🎬 Animation Patterns

### Basic Rotation
```jsx
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

function RotatingCube() {
  const ref = useRef();
  
  useFrame((state, delta) => {
    ref.current.rotation.y += delta;
  });
  
  return (
    <mesh ref={ref}>
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  );
}
```

### Sine Wave Animation
```jsx
useFrame((state) => {
  const t = state.clock.elapsedTime;
  ref.current.position.y = Math.sin(t) * 2;
});
```

### Lerp (Smooth Follow)
```jsx
import { MathUtils } from 'three';

useFrame(() => {
  ref.current.position.x = MathUtils.lerp(
    ref.current.position.x,
    targetX,
    0.1  // Smoothness (0-1)
  );
});
```

---

## 📜 Scroll Integration

### Lenis Setup
```jsx
import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';

function App() {
  const lenisRef = useRef();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });
    
    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return <div>{/* content */}</div>;
}
```

### GSAP ScrollTrigger
```jsx
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Fade in on scroll
gsap.from('.box', {
  scrollTrigger: {
    trigger: '.box',
    start: 'top 80%',
    end: 'top 20%',
    scrub: true,
  },
  opacity: 0,
  y: 100,
});

// Pin section
gsap.to('.hero', {
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: '+=1000',
    pin: true,
    scrub: 1,
  },
  scale: 1.5,
});
```

### Connect Scroll to Three.js
```jsx
const [scrollY, setScrollY] = useState(0);

useEffect(() => {
  const lenis = new Lenis();
  
  lenis.on('scroll', ({ scroll }) => {
    setScrollY(scroll);
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}, []);

// In R3F component
useFrame(() => {
  ref.current.rotation.y = scrollY * 0.001;
});
```

---

## 🎮 Interactions

### Click Event
```jsx
<mesh onClick={(e) => {
  e.stopPropagation();
  console.log('Clicked at', e.point);
}}>
  <boxGeometry />
  <meshStandardMaterial />
</mesh>
```

### Hover Effect
```jsx
import { useState } from 'react';

function HoverBox() {
  const [hovered, setHovered] = useState(false);

  return (
    <mesh
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.2 : 1}
    >
      <boxGeometry />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'gray'} />
    </mesh>
  );
}
```

---

## 🚀 Performance

### Instancing (Many Objects)
```jsx
import { Instances, Instance } from '@react-three/drei';

<Instances limit={1000}>
  <boxGeometry />
  <meshStandardMaterial />
  
  {Array.from({ length: 1000 }, (_, i) => (
    <Instance key={i} position={[i * 2, 0, 0]} />
  ))}
</Instances>
```

### Level of Detail
```jsx
import { Detailed } from '@react-three/drei';

<Detailed distances={[0, 10, 20]}>
  <mesh><sphereGeometry args={[1, 64, 64]} /></mesh>  // High
  <mesh><sphereGeometry args={[1, 32, 32]} /></mesh>  // Med
  <mesh><sphereGeometry args={[1, 8, 8]} /></mesh>    // Low
</Detailed>
```

### Dispose Pattern
```jsx
useEffect(() => {
  const geometry = new THREE.BufferGeometry();
  const material = new THREE.MeshStandardMaterial();
  
  return () => {
    geometry.dispose();
    material.dispose();
  };
}, []);
```

---

## 🎥 Camera Controls

### Orbit Controls
```jsx
import { OrbitControls } from '@react-three/drei';

<OrbitControls
  enableDamping
  dampingFactor={0.05}
  minDistance={2}
  maxDistance={10}
  enablePan={false}
/>
```

### Camera Animation
```jsx
import gsap from 'gsap';
import { useThree } from '@react-three/fiber';

function CameraAnimation() {
  const { camera } = useThree();
  
  const moveTo = (position) => {
    gsap.to(camera.position, {
      x: position.x,
      y: position.y,
      z: position.z,
      duration: 2,
      ease: 'power2.inOut',
    });
  };

  return <button onClick={() => moveTo({ x: 5, y: 2, z: 5 })}>Move</button>;
}
```

---

## 📦 Models

### Load GLTF
```jsx
import { useGLTF } from '@react-three/drei';

function Model() {
  const { scene } = useGLTF('/model.glb');
  return <primitive object={scene} />;
}

// Preload
useGLTF.preload('/model.glb');
```

### Animated Model
```jsx
import { useGLTF, useAnimations } from '@react-three/drei';
import { useEffect, useRef } from 'react';

function AnimatedModel() {
  const group = useRef();
  const { scene, animations } = useGLTF('/model.glb');
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    actions['Animation']?.play();
  }, [actions]);

  return <primitive ref={group} object={scene} />;
}
```

---

## 🎨 Post-Processing

```jsx
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing';

<Canvas>
  <Scene />
  <EffectComposer>
    <Bloom intensity={0.5} luminanceThreshold={0.9} />
    <DepthOfField focusDistance={0.01} focalLength={0.05} bokehScale={3} />
  </EffectComposer>
</Canvas>
```

---

## 🔧 Debug

### Stats
```jsx
import { Stats } from '@react-three/drei';

<Canvas>
  <Stats />
  <Scene />
</Canvas>
```

### Leva GUI
```jsx
import { useControls } from 'leva';

function Box() {
  const { scale, color } = useControls({
    scale: { value: 1, min: 0.1, max: 5, step: 0.1 },
    color: '#ff0000',
  });

  return (
    <mesh scale={scale}>
      <boxGeometry />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
```

---

## 📱 Responsive

```jsx
import { useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';

function ResponsiveScene() {
  const { size } = useThree();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(size.width < 768);
  }, [size]);

  return (
    <mesh scale={isMobile ? 0.5 : 1}>
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  );
}
```

---

## ⚡ Essential Imports

```jsx
// Core
import * as THREE from 'three';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';

// Drei
import {
  OrbitControls,
  Environment,
  ContactShadows,
  useGLTF,
  useTexture,
  Text,
  Html,
  Bounds,
  Stage,
  Instances,
  Instance,
  Detailed,
  Stats,
} from '@react-three/drei';

// Post-processing
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  ChromaticAberration,
  Vignette,
} from '@react-three/postprocessing';

// Animation
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { motion } from 'framer-motion';

// Utils
import { useControls } from 'leva';
import { MathUtils } from 'three';
```

---

## 🎯 Award-Winning Formula

```jsx
// 1. Smooth scroll
const lenis = new Lenis({ smooth: true });

// 2. Optimized rendering
<Canvas dpr={[1, 2]} gl={{ antialias: true }} />

// 3. Purposeful animations
gsap.to(object, { scrollTrigger: { scrub: true } });

// 4. Clean design
<Environment preset="sunset" />

// 5. Performance monitoring
<Stats />
```

---

**More details in full documentation!**
- [Complete Overview](./00-OVERVIEW.md)
- [Three.js Fundamentals](./01-THREEJS-FUNDAMENTALS.md)
- [React Three Fiber](./02-REACT-THREE-FIBER.md)
- [Scroll Animations](./05-SCROLL-ANIMATIONS.md)
- [Performance](./04-PERFORMANCE-OPTIMIZATION.md)

