# Framer Motion Integration

**React Animation Library for Smooth UI Interactions**

---

## 📖 Table of Contents

1. [What is Framer Motion?](#what-is-framer-motion)
2. [Basic Animations](#basic-animations)
3. [Gestures & Interactions](#gestures--interactions)
4. [Layout Animations](#layout-animations)
5. [Scroll Animations](#scroll-animations)
6. [Variants](#variants)
7. [Page Transitions](#page-transitions)
8. [Integration with Three.js](#integration-with-threejs)
9. [Award-Winning Patterns](#award-winning-patterns)

---

## What is Framer Motion?

Framer Motion is a production-ready animation library for React with a simple, declarative API.

### Why Framer Motion?

✅ **Declarative** - Describe what, not how  
✅ **Performant** - Hardware accelerated  
✅ **Gestures** - Drag, hover, tap built-in  
✅ **Layout animations** - Automatic smooth layout changes  
✅ **Server-side rendering** - Works with Next.js  
✅ **TypeScript** - Full type safety  

### Installation

```bash
npm install framer-motion
```

---

## Basic Animations

### Simple Fade In

```jsx
import { motion } from 'framer-motion';

function FadeIn() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      Hello World
    </motion.div>
  );
}
```

### Slide In

```jsx
<motion.div
  initial={{ x: -100, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

### Scale Pop

```jsx
<motion.button
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{
    type: "spring",
    stiffness: 260,
    damping: 20
  }}
>
  Click Me
</motion.button>
```

### Continuous Animation

```jsx
<motion.div
  animate={{
    rotate: 360,
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: "linear"
  }}
>
  ↻
</motion.div>
```

---

## Gestures & Interactions

### Hover

```jsx
<motion.button
  whileHover={{
    scale: 1.1,
    transition: { duration: 0.2 }
  }}
  whileTap={{ scale: 0.95 }}
>
  Hover Me
</motion.button>
```

### Tap/Click

```jsx
<motion.div
  whileTap={{
    scale: 0.9,
    rotate: -5
  }}
>
  Press Me
</motion.div>
```

### Drag

```jsx
<motion.div
  drag
  dragConstraints={{
    top: -50,
    left: -50,
    right: 50,
    bottom: 50,
  }}
  dragElastic={0.1}
>
  Drag Me
</motion.div>
```

### Drag with Ref Constraints

```jsx
import { useRef } from 'react';

function DragBox() {
  const constraintsRef = useRef(null);

  return (
    <div ref={constraintsRef} style={{ width: 400, height: 400 }}>
      <motion.div
        drag
        dragConstraints={constraintsRef}
      >
        Drag within parent
      </motion.div>
    </div>
  );
}
```

### onDrag Events

```jsx
<motion.div
  drag="x"
  onDragStart={() => console.log('Drag started')}
  onDrag={(event, info) => console.log(info.offset.x)}
  onDragEnd={() => console.log('Drag ended')}
>
  Drag horizontally
</motion.div>
```

---

## Layout Animations

Layout animations automatically animate layout changes.

### Basic Layout Animation

```jsx
import { useState } from 'react';

function ExpandBox() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      onClick={() => setIsExpanded(!isExpanded)}
      style={{
        width: isExpanded ? 300 : 100,
        height: isExpanded ? 200 : 100,
      }}
    >
      Click to expand
    </motion.div>
  );
}
```

### Shared Layout Animation

```jsx
import { motion } from 'framer-motion';
import { useState } from 'react';

function Tabs() {
  const [selected, setSelected] = useState(0);
  const tabs = ['Tab 1', 'Tab 2', 'Tab 3'];

  return (
    <div>
      {tabs.map((tab, i) => (
        <button
          key={i}
          onClick={() => setSelected(i)}
          style={{ position: 'relative' }}
        >
          {tab}
          {selected === i && (
            <motion.div
              layoutId="underline"
              style={{
                position: 'absolute',
                bottom: -2,
                left: 0,
                right: 0,
                height: 2,
                background: 'blue',
              }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
```

### LayoutGroup

```jsx
import { motion, LayoutGroup } from 'framer-motion';

function Cards() {
  return (
    <LayoutGroup>
      <motion.div layout>Card 1</motion.div>
      <motion.div layout>Card 2</motion.div>
      <motion.div layout>Card 3</motion.div>
    </LayoutGroup>
  );
}
```

---

## Scroll Animations

### useScroll Hook

```jsx
import { useScroll, useTransform, motion } from 'framer-motion';

function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      style={{
        scaleX: scrollYProgress,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 10,
        background: 'blue',
        transformOrigin: '0%',
      }}
    />
  );
}
```

### Scroll-Based Parallax

```jsx
function ParallaxSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -200]);

  return (
    <motion.div style={{ y }}>
      Parallax Content
    </motion.div>
  );
}
```

### Element-Specific Scroll

```jsx
import { useRef } from 'react';

function Section() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  return (
    <motion.div ref={ref} style={{ opacity }}>
      Fades in and out
    </motion.div>
  );
}
```

### useTransform

```jsx
const { scrollYProgress } = useScroll();

// Map scroll progress to different values
const scale = useTransform(scrollYProgress, [0, 1], [1, 2]);
const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

return (
  <motion.div
    style={{
      scale,
      rotate,
      opacity,
    }}
  >
    Transforms on scroll
  </motion.div>
);
```

---

## Variants

Variants allow you to define animation states and orchestrate children.

### Basic Variants

```jsx
const variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

<motion.div
  initial="hidden"
  animate="visible"
  variants={variants}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

### Propagating Variants

```jsx
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

function List() {
  return (
    <motion.ul
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <motion.li variants={item}>Item 1</motion.li>
      <motion.li variants={item}>Item 2</motion.li>
      <motion.li variants={item}>Item 3</motion.li>
    </motion.ul>
  );
}
```

### Dynamic Variants

```jsx
const item = {
  hidden: { opacity: 0 },
  visible: (custom) => ({
    opacity: 1,
    transition: { delay: custom * 0.1 }
  })
};

<motion.div
  custom={2}
  variants={item}
  initial="hidden"
  animate="visible"
>
  Delayed item
</motion.div>
```

---

## Page Transitions

### Next.js Page Transitions

```jsx
// pages/_app.js
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={router.route}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Component {...pageProps} />
      </motion.div>
    </AnimatePresence>
  );
}
```

### Slide Transitions

```jsx
const pageVariants = {
  initial: { x: '-100%', opacity: 0 },
  in: { x: 0, opacity: 1 },
  out: { x: '100%', opacity: 0 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

<AnimatePresence>
  <motion.div
    key={page}
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
  >
    {content}
  </motion.div>
</AnimatePresence>
```

---

## Integration with Three.js

Framer Motion for UI, Three.js for 3D - best of both worlds.

### Animated UI Over Canvas

```jsx
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';

function App() {
  return (
    <>
      {/* Three.js Canvas (background) */}
      <Canvas style={{ position: 'fixed', top: 0, left: 0 }}>
        <Scene />
      </Canvas>

      {/* Framer Motion UI (foreground) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <h1>Welcome</h1>
      </motion.div>
    </>
  );
}
```

### Sync Animations

```jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';

function App() {
  const [scale, setScale] = useState(1);

  return (
    <>
      <Canvas>
        <SyncedCube scale={scale} />
      </Canvas>

      <motion.button
        whileHover={{ scale: 1.1 }}
        onHoverStart={() => setScale(1.5)}
        onHoverEnd={() => setScale(1)}
      >
        Hover to scale 3D object
      </motion.button>
    </>
  );
}

function SyncedCube({ scale }) {
  const ref = useRef();

  useFrame(() => {
    ref.current.scale.lerp({ x: scale, y: scale, z: scale }, 0.1);
  });

  return (
    <mesh ref={ref}>
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  );
}
```

---

## Award-Winning Patterns

### 1. Staggered Hero Text

```jsx
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    }
  }
};

const child = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', damping: 12, stiffness: 100 }
  }
};

function Hero() {
  return (
    <motion.div variants={container} initial="hidden" animate="visible">
      <motion.h1 variants={child}>Welcome</motion.h1>
      <motion.p variants={child}>To our site</motion.p>
      <motion.button variants={child}>Get Started</motion.button>
    </motion.div>
  );
}
```

### 2. Scroll-Triggered Reveals

```jsx
import { useInView } from 'framer-motion';
import { useRef } from 'react';

function Section({ children }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.div>
  );
}
```

### 3. Magnetic Button

```jsx
import { useMotionValue, useSpring } from 'framer-motion';
import { useRef } from 'react';

function MagneticButton({ children }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.button>
  );
}
```

### 4. Image Reveal on Hover

```jsx
function ImageCard() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <motion.img
        animate={{
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.4 }}
        src="/image.jpg"
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: isHovered ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 25 }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(0,0,0,0.8)',
          padding: 20,
        }}
      >
        <h3>Title</h3>
        <p>Description</p>
      </motion.div>
    </motion.div>
  );
}
```

### 5. Loading Skeleton

```jsx
function Skeleton() {
  return (
    <motion.div
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        background: '#e0e0e0',
        borderRadius: 4,
        height: 100,
      }}
    />
  );
}
```

### 6. Menu Animation

```jsx
const menuVariants = {
  closed: {
    opacity: 0,
    x: '-100%',
  },
  open: {
    opacity: 1,
    x: 0,
    transition: {
      staggerChildren: 0.1,
    }
  }
};

const itemVariants = {
  closed: { x: -20, opacity: 0 },
  open: { x: 0, opacity: 1 },
};

function Menu({ isOpen }) {
  return (
    <motion.nav
      variants={menuVariants}
      initial="closed"
      animate={isOpen ? 'open' : 'closed'}
    >
      <motion.a variants={itemVariants} href="/">Home</motion.a>
      <motion.a variants={itemVariants} href="/about">About</motion.a>
      <motion.a variants={itemVariants} href="/contact">Contact</motion.a>
    </motion.nav>
  );
}
```

---

## Advanced Techniques

### useMotionValue

```jsx
import { useMotionValue, useTransform, motion } from 'framer-motion';

function Tracker() {
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-100, 0, 100],
    ['#ff0000', '#0000ff', '#00ff00']
  );

  return (
    <motion.div
      drag="x"
      style={{ x, background }}
      dragConstraints={{ left: -100, right: 100 }}
    />
  );
}
```

### useAnimationControls

```jsx
import { motion, useAnimationControls } from 'framer-motion';

function ControlledAnimation() {
  const controls = useAnimationControls();

  return (
    <>
      <motion.div
        animate={controls}
        style={{ width: 100, height: 100, background: 'red' }}
      />
      <button onClick={() => controls.start({ rotate: 180 })}>
        Rotate
      </button>
      <button onClick={() => controls.start({ scale: 2 })}>
        Scale
      </button>
    </>
  );
}
```

---

**Key Takeaways:**
- Framer Motion excels at UI animations
- Perfect complement to Three.js for UI layer
- Layout animations are magical
- Variants make complex animations simple
- Gestures and scroll hooks built-in

**Next:** [GSAP Techniques](./07-GSAP-TECHNIQUES.md) →

