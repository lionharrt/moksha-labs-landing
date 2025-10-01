# Scroll Animations - The Foundation of Award-Winning Sites

**Master scroll-based 3D interactions with Lenis, GSAP ScrollTrigger, and React Three Fiber**

---

## 📖 Table of Contents

1. [Why Scroll Animations Matter](#why-scroll-animations-matter)
2. [Lenis - Industry Standard Smooth Scroll](#lenis---industry-standard-smooth-scroll)
3. [GSAP ScrollTrigger Integration](#gsap-scrolltrigger-integration)
4. [Scroll-Driven Three.js Animations](#scroll-driven-threejs-animations)
5. [React Three Fiber Scroll Integration](#react-three-fiber-scroll-integration)
6. [Parallax Effects](#parallax-effects)
7. [Scroll Progress Indicators](#scroll-progress-indicators)
8. [Performance Optimization](#performance-optimization)
9. [Award-Winning Patterns](#award-winning-patterns)

---

## Why Scroll Animations Matter

Every Awwwards-winning long-scrolling site has these characteristics:

1. **Buttery smooth scroll** - 60fps, no jank
2. **Purposeful animations** - Tied to narrative/journey
3. **Performance first** - Optimized for all devices
4. **Natural feel** - Easing that feels human

**The stack most winners use:**
- **Lenis** for smooth scrolling
- **GSAP ScrollTrigger** for animation triggers
- **React Three Fiber** for 3D integration
- **Framer Motion** for UI animations (sometimes)

---

## Lenis - Industry Standard Smooth Scroll

Lenis (by Darkroom Engineering / Studio Freight) is THE smooth scroll library of 2024-2025.

### Why Lenis?

- ✅ Buttery smooth (better than locomotive-scroll)
- ✅ Small bundle size (~5kb)
- ✅ Virtual scroll support
- ✅ Horizontal scroll support
- ✅ Perfect GSAP integration
- ✅ Accessibility friendly
- ✅ Used by: Apple, Stripe, Vercel, and most Awwwards winners

### Basic Setup

```bash
npm install @studio-freight/lenis
```

```javascript
import Lenis from '@studio-freight/lenis';

// Initialize Lenis
const lenis = new Lenis({
  duration: 1.2,           // Scroll duration
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
  direction: 'vertical',   // 'vertical' or 'horizontal'
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,      // Mouse wheel sensitivity
  smoothTouch: false,      // Smooth scroll on touch devices
  touchMultiplier: 2,
  infinite: false,
});

// Request animation frame loop
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
```

### React Integration

```javascript
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

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div>
      {/* Your content */}
    </div>
  );
}
```

### Custom Lenis Hook

```javascript
// hooks/useLenis.js
import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';

export function useLenis(options = {}) {
  const lenisRef = useRef();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      ...options,
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return lenisRef;
}

// Usage
function App() {
  const lenisRef = useLenis();

  const scrollToSection = (target) => {
    lenisRef.current?.scrollTo(target, {
      offset: 0,
      duration: 2,
      easing: (t) => t,
    });
  };

  return (
    <>
      <button onClick={() => scrollToSection('#section2')}>
        Scroll to Section 2
      </button>
      {/* Content */}
    </>
  );
}
```

### Lenis Methods

```javascript
// Scroll to specific position
lenis.scrollTo(target, {
  offset: 0,        // Offset in pixels
  duration: 1,      // Duration in seconds
  easing: (t) => t, // Custom easing function
  immediate: false, // Skip animation
  lock: false,      // Prevent user scroll during animation
  onComplete: () => console.log('Complete'),
});

// Valid targets:
// - Number: lenis.scrollTo(100)
// - Element: lenis.scrollTo(document.querySelector('#section'))
// - Selector: lenis.scrollTo('#section')

// Stop scrolling
lenis.stop();

// Start scrolling
lenis.start();

// Get scroll position
const scroll = lenis.scroll;  // Current scroll position
const limit = lenis.limit;    // Max scroll position
const progress = lenis.progress; // 0-1

// Listen to scroll events
lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
  console.log({ scroll, limit, velocity, direction, progress });
});
```

---

## GSAP ScrollTrigger Integration

GSAP ScrollTrigger is the most powerful scroll animation library. Combined with Lenis = perfection.

### Setup

```bash
npm install gsap
```

```javascript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
});

// Connect Lenis to ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);
```

### Basic ScrollTrigger Animation

```javascript
// Fade in element on scroll
gsap.from('.box', {
  scrollTrigger: {
    trigger: '.box',
    start: 'top 80%',    // When top of element hits 80% of viewport
    end: 'top 20%',      // When top of element hits 20% of viewport
    scrub: true,         // Smooth scrubbing
    markers: true,       // Debug markers (remove in production)
  },
  opacity: 0,
  y: 100,
});

// Pin element during scroll
gsap.to('.pin-section', {
  scrollTrigger: {
    trigger: '.pin-section',
    start: 'top top',
    end: '+=1000',       // Pin for 1000px of scroll
    pin: true,
    scrub: true,
  },
  scale: 1.5,
});
```

### ScrollTrigger Configuration

```javascript
ScrollTrigger.create({
  trigger: '.element',       // Element that triggers the animation
  start: 'top center',       // When trigger starts
  end: 'bottom center',      // When trigger ends
  
  // Start/End Format: "[trigger] [scroller]"
  // trigger: 'top', 'center', 'bottom', pixel value, or percentage
  // scroller: 'top', 'center', 'bottom'
  
  scrub: true,               // Smooth scrubbing
  // scrub: 1,                // 1 second smooth catch-up
  
  pin: true,                 // Pin the trigger element
  pinSpacing: true,          // Add spacing for pinned element
  
  markers: true,             // Show debug markers
  
  anticipatePin: 1,          // Prevent jump (if pin: true)
  
  // Callbacks
  onEnter: () => console.log('Enter'),
  onLeave: () => console.log('Leave'),
  onEnterBack: () => console.log('Enter Back'),
  onLeaveBack: () => console.log('Leave Back'),
  onUpdate: (self) => console.log('Progress:', self.progress),
  onToggle: (self) => console.log('Active:', self.isActive),
  
  // Advanced
  toggleActions: 'play none none reverse',
  // Format: onEnter onLeave onEnterBack onLeaveBack
  // Options: play, pause, resume, reset, restart, complete, reverse, none
  
  toggleClass: 'active',     // Toggle class on trigger
  
  id: 'my-trigger',          // For debugging
  
  snap: {
    snapTo: 'labels',        // Snap to timeline labels
    duration: 0.3,
    ease: 'power1.inOut',
  },
});
```

### Timeline with ScrollTrigger

```javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.section',
    start: 'top top',
    end: '+=2000',
    scrub: 1,
    pin: true,
  },
});

// Multiple animations in sequence
tl.from('.title', { opacity: 0, y: 100 })
  .from('.subtitle', { opacity: 0, y: 50 }, '-=0.3')  // 0.3s overlap
  .to('.image', { scale: 1.5, rotation: 10 })
  .to('.image', { x: 100 }, '<')  // Start at same time as previous
  .from('.cta', { opacity: 0, scale: 0.5 });
```

---

## Scroll-Driven Three.js Animations

Connecting scroll position to Three.js scene transformations.

### Basic Scroll to Three.js

```javascript
import * as THREE from 'three';
import Lenis from '@studio-freight/lenis';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });

// Create a cube
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0x00ff00 })
);
scene.add(cube);

// Lenis setup
const lenis = new Lenis();

let scrollY = 0;

lenis.on('scroll', ({ scroll }) => {
  scrollY = scroll;
});

function animate() {
  requestAnimationFrame(animate);
  lenis.raf(Date.now());
  
  // Rotate cube based on scroll
  cube.rotation.y = scrollY * 0.001;
  cube.rotation.x = scrollY * 0.0005;
  
  // Move cube based on scroll
  cube.position.y = -scrollY * 0.01;
  
  renderer.render(scene, camera);
}

animate();
```

### Scroll Between Sections

```javascript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Section-based animations
const sections = document.querySelectorAll('.section');

sections.forEach((section, index) => {
  ScrollTrigger.create({
    trigger: section,
    start: 'top center',
    end: 'bottom center',
    onEnter: () => animateCameraToSection(index),
    onEnterBack: () => animateCameraToSection(index),
  });
});

function animateCameraToSection(index) {
  const targetY = index * 10;
  
  gsap.to(camera.position, {
    y: targetY,
    duration: 1.5,
    ease: 'power2.inOut',
  });
  
  gsap.to(cube.rotation, {
    y: index * Math.PI,
    duration: 1.5,
    ease: 'power2.inOut',
  });
}
```

### Continuous Scroll Scrubbing

```javascript
// Scrub camera position through entire scroll
gsap.to(camera.position, {
  scrollTrigger: {
    trigger: '.scroll-container',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1,
  },
  y: 20,
  x: 5,
  z: -10,
});

// Scrub object rotation
gsap.to(cube.rotation, {
  scrollTrigger: {
    trigger: '.scroll-container',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1,
  },
  y: Math.PI * 4,
  x: Math.PI * 2,
});

// Scrub material properties
gsap.to(cube.material, {
  scrollTrigger: {
    trigger: '.section-2',
    start: 'top center',
    end: 'bottom center',
    scrub: true,
  },
  opacity: 0,
  emissiveIntensity: 1,
});
```

---

## React Three Fiber Scroll Integration

Integrating Lenis and ScrollTrigger with R3F.

### R3F + Lenis Context

```javascript
// contexts/LenisContext.jsx
import { createContext, useContext, useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';

const LenisContext = createContext();

export function LenisProvider({ children, options }) {
  const lenisRef = useRef();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      ...options,
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <LenisContext.Provider value={lenisRef}>
      {children}
    </LenisContext.Provider>
  );
}

export function useLenisScroll(callback) {
  const lenisRef = useContext(LenisContext);

  useEffect(() => {
    if (!lenisRef.current) return;

    lenisRef.current.on('scroll', callback);

    return () => {
      lenisRef.current.off('scroll', callback);
    };
  }, [callback, lenisRef]);
}

// App.jsx
import { LenisProvider } from './contexts/LenisContext';
import { Canvas } from '@react-three/fiber';

function App() {
  return (
    <LenisProvider>
      <Canvas>
        <Scene />
      </Canvas>
      <Content />
    </LenisProvider>
  );
}
```

### useFrame with Scroll

```javascript
import { useFrame } from '@react-three/fiber';
import { useLenisScroll } from './contexts/LenisContext';
import { useRef, useState } from 'react';

function ScrollCube() {
  const meshRef = useRef();
  const [scrollY, setScrollY] = useState(0);

  // Listen to Lenis scroll
  useLenisScroll(({ scroll }) => {
    setScrollY(scroll);
  });

  // Update Three.js on every frame
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = scrollY * 0.001;
      meshRef.current.position.y = -scrollY * 0.01;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}
```

### @react-three/drei ScrollControls

```javascript
import { ScrollControls, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

function Scene() {
  return (
    <ScrollControls pages={3} damping={0.1}>
      <ScrollingContent />
    </ScrollControls>
  );
}

function ScrollingContent() {
  const scroll = useScroll();
  const meshRef = useRef();

  useFrame(() => {
    // scroll.offset: 0-1 (scroll progress)
    // scroll.range(start, distance): normalized range
    // scroll.visible(start, distance): 0-1 visibility
    
    meshRef.current.rotation.y = scroll.offset * Math.PI * 2;
    meshRef.current.position.y = scroll.range(0, 1 / 3) * -10;
    
    // Fade based on visibility
    meshRef.current.material.opacity = scroll.visible(0, 0.3);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry />
      <meshStandardMaterial transparent />
    </mesh>
  );
}
```

---

## Parallax Effects

Create depth with different scroll speeds.

### CSS Parallax (Lenis Compatible)

```javascript
// Vanilla JS with Lenis
const lenis = new Lenis();

const parallaxElements = document.querySelectorAll('[data-speed]');

lenis.on('scroll', ({ scroll }) => {
  parallaxElements.forEach((el) => {
    const speed = parseFloat(el.dataset.speed);
    const y = scroll * speed;
    el.style.transform = `translate3d(0, ${y}px, 0)`;
  });
});
```

```html
<!-- HTML -->
<div class="parallax-container">
  <div data-speed="-0.5" class="layer">Slow</div>
  <div data-speed="0" class="layer">Normal</div>
  <div data-speed="0.5" class="layer">Fast</div>
</div>
```

### Three.js Parallax with Mouse

```javascript
import { useFrame } from '@react-three/fiber';
import { useState } from 'react';

function ParallaxScene() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <ParallaxObject mouse={mouse} depth={0.1} />
      <ParallaxObject mouse={mouse} depth={0.3} />
      <ParallaxObject mouse={mouse} depth={0.5} />
    </>
  );
}

function ParallaxObject({ mouse, depth }) {
  const meshRef = useRef();

  useFrame(() => {
    meshRef.current.position.x = mouse.x * depth;
    meshRef.current.position.y = mouse.y * depth;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.5]} />
      <meshStandardMaterial />
    </mesh>
  );
}
```

---

## Scroll Progress Indicators

Visual feedback for scroll position.

### Simple Progress Bar

```javascript
import { useLenisScroll } from './contexts/LenisContext';
import { useState } from 'react';

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useLenisScroll(({ progress }) => {
    setProgress(progress);
  });

  return (
    <div className="progress-bar">
      <div
        className="progress-fill"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
```

```css
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  z-index: 1000;
}

.progress-fill {
  height: 100%;
  background: #00ff00;
  transition: width 0.1s ease;
}
```

### Circular Progress

```javascript
function CircularProgress() {
  const [progress, setProgress] = useState(0);

  useLenisScroll(({ progress }) => {
    setProgress(progress);
  });

  const circumference = 2 * Math.PI * 40;  // radius = 40
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <svg className="circular-progress" width="100" height="100">
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="#ddd"
        strokeWidth="4"
      />
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="#00ff00"
        strokeWidth="4"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        transform="rotate(-90 50 50)"
      />
    </svg>
  );
}
```

---

## Performance Optimization

Scroll animations can tank performance if not optimized.

### Use RAF Properly

```javascript
// ❌ Bad: Multiple RAF loops
lenis.on('scroll', () => {
  requestAnimationFrame(() => {
    // Do stuff
  });
});

// ✅ Good: Single RAF loop
function raf(time) {
  lenis.raf(time);
  // Do all your updates here
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
```

### Throttle Expensive Operations

```javascript
import { useLenisScroll } from './contexts/LenisContext';
import { useCallback, useRef } from 'react';

function ExpensiveComponent() {
  const lastUpdate = useRef(0);

  const handleScroll = useCallback(({ scroll }) => {
    const now = Date.now();
    
    // Only update every 100ms
    if (now - lastUpdate.current > 100) {
      // Expensive operation
      updateComplexState(scroll);
      lastUpdate.current = now;
    }
  }, []);

  useLenisScroll(handleScroll);

  return <div>...</div>;
}
```

### Will-change for CSS

```css
/* Tell browser this will animate */
.parallax-element {
  will-change: transform;
}

/* Remove when animation done */
.parallax-element.animation-complete {
  will-change: auto;
}
```

---

## Award-Winning Patterns

Common scroll patterns from Awwwards winners.

### 1. Hero Fade & Scale

```javascript
gsap.to('.hero', {
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
  },
  opacity: 0,
  scale: 0.8,
  y: -100,
});
```

### 2. Text Reveal on Scroll

```javascript
// Reveal words one by one
const words = gsap.utils.toArray('.word');

words.forEach((word, i) => {
  gsap.from(word, {
    scrollTrigger: {
      trigger: word,
      start: 'top 80%',
      end: 'top 50%',
      scrub: 1,
    },
    opacity: 0,
    y: 50,
  });
});
```

### 3. Horizontal Scroll Section

```javascript
const sections = gsap.utils.toArray('.panel');

gsap.to(sections, {
  xPercent: -100 * (sections.length - 1),
  ease: 'none',
  scrollTrigger: {
    trigger: '.container',
    pin: true,
    scrub: 1,
    end: () => '+=' + document.querySelector('.container').offsetWidth,
  },
});
```

### 4. Sticky Element with Transform

```javascript
gsap.to('.sticky-image', {
  scrollTrigger: {
    trigger: '.content',
    start: 'top top',
    end: 'bottom bottom',
    pin: '.sticky-image',
    scrub: 1,
  },
  scale: 1.5,
  rotation: 360,
});
```

---

## Complete Example: Long-Scrolling Site

```javascript
// App.jsx
import { Canvas } from '@react-three/fiber';
import { LenisProvider } from './contexts/LenisContext';
import { Scene } from './components/Scene';
import { Content } from './components/Content';
import { ScrollProgress } from './components/ScrollProgress';

function App() {
  return (
    <LenisProvider>
      <ScrollProgress />
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ position: 'fixed', top: 0, left: 0 }}
      >
        <Scene />
      </Canvas>
      <Content />
    </LenisProvider>
  );
}

// components/Scene.jsx
import { useFrame } from '@react-three/fiber';
import { useLenisScroll } from '../contexts/LenisContext';
import { useState, useRef } from 'react';

export function Scene() {
  const meshRef = useRef();
  const [scrollY, setScrollY] = useState(0);

  useLenisScroll(({ scroll }) => {
    setScrollY(scroll);
  });

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = scrollY * 0.001;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1, 0.3, 128, 16]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </>
  );
}

// components/Content.jsx
export function Content() {
  return (
    <div style={{ position: 'relative' }}>
      <section className="hero" style={{ height: '100vh' }}>
        <h1>Scroll to Explore</h1>
      </section>
      <section className="section" style={{ height: '100vh' }}>
        <h2>Section 1</h2>
      </section>
      <section className="section" style={{ height: '100vh' }}>
        <h2>Section 2</h2>
      </section>
    </div>
  );
}
```

---

**Key Takeaways:**
- Lenis is the industry standard for smooth scrolling
- GSAP ScrollTrigger is the most powerful scroll animation library
- Always optimize scroll performance
- Scrub animations feel more connected than triggered ones
- Test on mobile devices early and often

**Next:** [Post-Processing Effects](./08-POST-PROCESSING.md) →

