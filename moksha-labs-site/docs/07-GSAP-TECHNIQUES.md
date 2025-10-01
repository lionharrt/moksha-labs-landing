# GSAP Techniques

**Professional Timeline Animations and ScrollTrigger Mastery**

---

## 📖 Table of Contents

1. [What is GSAP?](#what-is-gsap)
2. [Basic Tweens](#basic-tweens)
3. [Timelines](#timelines)
4. [Easing Functions](#easing-functions)
5. [ScrollTrigger Deep Dive](#scrolltrigger-deep-dive)
6. [Advanced Techniques](#advanced-techniques)
7. [GSAP + Three.js](#gsap--threejs)
8. [Award-Winning Patterns](#award-winning-patterns)

---

## What is GSAP?

GSAP (GreenSock Animation Platform) is the industry-standard JavaScript animation library.

### Why GSAP?

✅ **Performance** - Fastest, smoothest animations  
✅ **Cross-browser** - Works everywhere  
✅ **Powerful** - Can animate anything  
✅ **ScrollTrigger** - Best scroll animation plugin  
✅ **Timeline** - Sequencing made easy  
✅ **Support** - Professional, responsive team  

### Installation

```bash
npm install gsap
```

### Basic Import

```javascript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
```

---

## Basic Tweens

### gsap.to()

Animate FROM current state TO target state.

```javascript
// Fade out
gsap.to('.box', {
  opacity: 0,
  duration: 1
});

// Move and scale
gsap.to('.element', {
  x: 100,
  y: 50,
  scale: 1.5,
  rotation: 45,
  duration: 1,
  ease: 'power2.out'
});
```

### gsap.from()

Animate FROM specified state TO current state.

```javascript
// Fade in from transparent
gsap.from('.box', {
  opacity: 0,
  y: 50,
  duration: 1
});

// Useful for entrance animations
gsap.from('.hero-text', {
  opacity: 0,
  y: 100,
  duration: 1.5,
  ease: 'power3.out'
});
```

### gsap.fromTo()

Explicit start and end states.

```javascript
gsap.fromTo('.box',
  // FROM
  {
    opacity: 0,
    scale: 0
  },
  // TO
  {
    opacity: 1,
    scale: 1,
    duration: 1,
    ease: 'back.out'
  }
);
```

### gsap.set()

Immediately set properties (no animation).

```javascript
// Set initial state
gsap.set('.element', {
  opacity: 0,
  y: 50
});

// Then animate
gsap.to('.element', {
  opacity: 1,
  y: 0,
  duration: 1
});
```

---

## Timelines

Timelines sequence multiple animations.

### Basic Timeline

```javascript
const tl = gsap.timeline();

tl.to('.box1', { x: 100, duration: 1 })
  .to('.box2', { y: 100, duration: 1 })
  .to('.box3', { rotation: 360, duration: 1 });

// Animations play in sequence
```

### Position Parameter

```javascript
const tl = gsap.timeline();

// Absolute position
tl.to('.box1', { x: 100, duration: 1 })
  .to('.box2', { y: 100, duration: 1 }, 0.5);  // Start at 0.5s

// Relative position
tl.to('.box1', { x: 100, duration: 1 })
  .to('.box2', { y: 100, duration: 1 }, '-=0.5');  // Overlap by 0.5s

// Start at same time as previous
tl.to('.box1', { x: 100, duration: 1 })
  .to('.box2', { y: 100, duration: 1 }, '<');  // Start with previous

// Start at end of previous
tl.to('.box1', { x: 100, duration: 1 })
  .to('.box2', { y: 100, duration: 1 }, '>');  // Start after previous
```

### Timeline Controls

```javascript
const tl = gsap.timeline({
  paused: true,  // Start paused
  repeat: -1,    // Infinite repeat
  repeatDelay: 1,  // Delay between repeats
  yoyo: true,    // Reverse on repeat
  onComplete: () => console.log('Done!'),
});

// Control timeline
tl.play();
tl.pause();
tl.reverse();
tl.restart();
tl.seek(2);      // Jump to 2 seconds
tl.timeScale(2); // Play at 2x speed
```

### Timeline Methods

```javascript
const tl = gsap.timeline();

tl.to('.box', { x: 100 })
  .addLabel('midpoint')  // Add label
  .to('.box', { y: 100 })
  .addPause()            // Add pause point
  .to('.box', { rotation: 360 });

// Play to label
tl.play('midpoint');

// Get timeline info
console.log(tl.duration());      // Total duration
console.log(tl.progress());      // Progress (0-1)
console.log(tl.currentLabel());  // Current label
```

---

## Easing Functions

Easing controls the rate of change during animation.

### Basic Easing

```javascript
// Linear (constant speed)
gsap.to('.box', { x: 100, ease: 'none' });

// Power eases (most common)
gsap.to('.box', { x: 100, ease: 'power1.out' });  // Gentle
gsap.to('.box', { x: 100, ease: 'power2.out' });  // Medium
gsap.to('.box', { x: 100, ease: 'power3.out' });  // Strong
gsap.to('.box', { x: 100, ease: 'power4.out' });  // Very strong

// Variations
gsap.to('.box', { x: 100, ease: 'power2.in' });     // Accelerate
gsap.to('.box', { x: 100, ease: 'power2.out' });    // Decelerate
gsap.to('.box', { x: 100, ease: 'power2.inOut' });  // Both
```

### Special Eases

```javascript
// Back (overshoot)
gsap.to('.box', { scale: 1.5, ease: 'back.out' });

// Elastic (bounce)
gsap.to('.box', { y: -100, ease: 'elastic.out' });

// Bounce
gsap.to('.box', { y: 0, ease: 'bounce.out' });

// Steps (stair-step)
gsap.to('.box', { x: 100, ease: 'steps(5)' });

// Circ (circular)
gsap.to('.box', { x: 100, ease: 'circ.out' });

// Expo (exponential)
gsap.to('.box', { x: 100, ease: 'expo.out' });
```

### Custom Ease

```javascript
// Custom ease with CustomEase plugin (Club GreenSock)
gsap.to('.box', {
  x: 100,
  ease: 'M0,0 C0.5,0 0.5,1 1,1'  // SVG path
});

// Or use ease visualizer
// https://greensock.com/ease-visualizer/
```

### Recommended Eases

```javascript
// Natural movement
ease: 'power2.out'

// Quick attention-grabber
ease: 'back.out(1.7)'

// Smooth scroll
ease: 'power3.inOut'

// Bounce
ease: 'elastic.out(1, 0.3)'
```

---

## ScrollTrigger Deep Dive

ScrollTrigger is GSAP's scroll animation plugin.

### Basic ScrollTrigger

```javascript
gsap.to('.box', {
  scrollTrigger: {
    trigger: '.box',
    start: 'top center',  // When top of trigger hits center of viewport
    end: 'bottom center',
    markers: true,        // Debug markers
  },
  x: 100,
  duration: 1
});
```

### Start/End Positions

```javascript
scrollTrigger: {
  trigger: '.element',
  
  // Format: "[trigger position] [viewport position]"
  
  start: 'top top',       // Trigger top hits viewport top
  start: 'top center',    // Trigger top hits viewport center
  start: 'top bottom',    // Trigger top hits viewport bottom
  start: 'center center', // Trigger center hits viewport center
  start: 'bottom top',    // Trigger bottom hits viewport top
  
  // Pixel offset
  start: 'top top+=100',  // 100px from top
  start: 'top bottom-=50', // 50px before bottom
  
  // Percentage
  start: 'top 80%',       // 80% down viewport
  
  // Relative end
  end: '+=500',           // 500px of scroll after start
  end: 'bottom top',      // Until trigger bottom hits viewport top
}
```

### Scrub (Scroll-Linked)

```javascript
// Link animation progress to scroll progress
gsap.to('.box', {
  scrollTrigger: {
    trigger: '.box',
    start: 'top bottom',
    end: 'top top',
    scrub: true,  // Direct link
  },
  x: 100
});

// Smooth scrub with catch-up
gsap.to('.box', {
  scrollTrigger: {
    trigger: '.box',
    scrub: 1,  // 1 second catch-up
  },
  rotation: 360
});
```

### Pin Element

```javascript
gsap.to('.content', {
  scrollTrigger: {
    trigger: '.section',
    start: 'top top',
    end: '+=1000',        // Pin for 1000px of scroll
    pin: true,            // Pin the trigger element
    pinSpacing: true,     // Add spacing (default true)
    anticipatePin: 1,     // Prevent jump
  },
  scale: 2
});
```

### Callbacks

```javascript
ScrollTrigger.create({
  trigger: '.section',
  start: 'top center',
  end: 'bottom center',
  
  onEnter: () => console.log('Entered'),
  onLeave: () => console.log('Left'),
  onEnterBack: () => console.log('Entered (scrolling up)'),
  onLeaveBack: () => console.log('Left (scrolling up)'),
  
  onUpdate: (self) => {
    console.log('Progress:', self.progress);
  },
  
  onToggle: (self) => {
    console.log('Active:', self.isActive);
  }
});
```

### ToggleActions

```javascript
ScrollTrigger.create({
  trigger: '.element',
  toggleActions: 'play pause resume reset',
  // Format: onEnter onLeave onEnterBack onLeaveBack
  
  // Options:
  // play, pause, resume, reset, restart, complete, reverse, none
});

// Common patterns
toggleActions: 'play none none reverse'  // Play forward, reverse back
toggleActions: 'play none none none'     // Play once
toggleActions: 'play pause resume reset' // Full control
```

### Batch Processing

```javascript
// Animate multiple elements efficiently
ScrollTrigger.batch('.box', {
  onEnter: batch => gsap.to(batch, {
    opacity: 1,
    y: 0,
    stagger: 0.1
  }),
  start: 'top 80%',
});
```

---

## Advanced Techniques

### Stagger Animations

```javascript
// Sequential stagger
gsap.to('.box', {
  y: -100,
  stagger: 0.1,  // 0.1s between each
  duration: 1
});

// From center outward
gsap.to('.box', {
  scale: 1.5,
  stagger: {
    each: 0.1,
    from: 'center',
    grid: 'auto',
  }
});

// Advanced stagger
gsap.to('.box', {
  rotation: 360,
  stagger: {
    each: 0.1,
    from: 'end',
    ease: 'power2.inOut',
    repeat: -1,
    yoyo: true
  }
});
```

### Random Values

```javascript
// Random between values
gsap.to('.box', {
  x: 'random(-100, 100)',
  y: 'random(-100, 100)',
  rotation: 'random(0, 360)',
  duration: 1
});

// Random from array
gsap.to('.box', {
  backgroundColor: 'random(["red", "blue", "green"])',
  duration: 1
});
```

### Function-Based Values

```javascript
gsap.to('.box', {
  x: (index, target, targets) => {
    // Unique value for each element
    return index * 100;
  },
  duration: 1
});
```

### Relative Values

```javascript
// Relative to current
gsap.to('.box', {
  x: '+=100',    // Add 100
  y: '-=50',     // Subtract 50
  rotation: '+=360', // Rotate additional 360 degrees
  duration: 1
});
```

### Yoyo and Repeat

```javascript
gsap.to('.box', {
  x: 100,
  repeat: -1,        // Infinite
  yoyo: true,        // Reverse direction
  repeatDelay: 0.5,  // Delay between repeats
  duration: 1
});
```

---

## GSAP + Three.js

Animate Three.js objects with GSAP.

### Basic Three.js Animation

```javascript
import * as THREE from 'three';
import gsap from 'gsap';

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial()
);

// Animate position
gsap.to(cube.position, {
  x: 2,
  y: 1,
  z: -3,
  duration: 2,
  ease: 'power2.inOut'
});

// Animate rotation
gsap.to(cube.rotation, {
  y: Math.PI * 2,
  duration: 3,
  repeat: -1,
  ease: 'none'
});

// Animate scale
gsap.to(cube.scale, {
  x: 2,
  y: 2,
  z: 2,
  duration: 1,
  ease: 'back.out'
});
```

### Camera Animation

```javascript
// Move camera to position
gsap.to(camera.position, {
  x: 5,
  y: 2,
  z: 5,
  duration: 2,
  ease: 'power2.inOut',
  onUpdate: () => {
    camera.lookAt(0, 0, 0);
  }
});

// Camera shake
gsap.to(camera.position, {
  x: '+=0.1',
  y: '+=0.1',
  duration: 0.1,
  repeat: 5,
  yoyo: true
});
```

### Material Properties

```javascript
// Animate material opacity
gsap.to(material, {
  opacity: 0,
  duration: 1
});

// Animate color
gsap.to(material.color, {
  r: 1,
  g: 0,
  b: 0,
  duration: 1
});

// Or with Color object
const targetColor = new THREE.Color(0xff0000);
gsap.to(material.color, {
  r: targetColor.r,
  g: targetColor.g,
  b: targetColor.b,
  duration: 1
});
```

### Timeline with Three.js

```javascript
const tl = gsap.timeline();

tl.to(cube.position, { y: 2, duration: 1 })
  .to(cube.rotation, { y: Math.PI, duration: 1 }, '-=0.5')
  .to(cube.scale, { x: 2, y: 2, z: 2, duration: 1 })
  .to(material, { opacity: 0, duration: 0.5 });
```

### ScrollTrigger + Three.js

```javascript
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Rotate on scroll
gsap.to(cube.rotation, {
  y: Math.PI * 2,
  scrollTrigger: {
    trigger: '.section',
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
  }
});

// Move camera through sections
const sections = document.querySelectorAll('.section');

sections.forEach((section, i) => {
  gsap.to(camera.position, {
    z: -i * 5,
    scrollTrigger: {
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      scrub: 1,
    }
  });
});
```

---

## Award-Winning Patterns

### 1. Horizontal Scroll

```javascript
const sections = gsap.utils.toArray('.panel');

gsap.to(sections, {
  xPercent: -100 * (sections.length - 1),
  ease: 'none',
  scrollTrigger: {
    trigger: '.container',
    pin: true,
    scrub: 1,
    snap: 1 / (sections.length - 1),
    end: () => '+=' + document.querySelector('.container').offsetWidth,
  }
});
```

### 2. Text Reveal

```javascript
// Split text into words/chars (requires SplitText plugin)
const text = new SplitText('.title', { type: 'chars' });

gsap.from(text.chars, {
  opacity: 0,
  y: 50,
  rotationX: -90,
  stagger: 0.02,
  scrollTrigger: {
    trigger: '.title',
    start: 'top 80%',
  }
});
```

### 3. Parallax Layers

```javascript
gsap.utils.toArray('.parallax').forEach(layer => {
  const depth = layer.dataset.depth;
  const movement = -(layer.offsetHeight * depth);
  
  gsap.to(layer, {
    y: movement,
    ease: 'none',
    scrollTrigger: {
      trigger: layer,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    }
  });
});
```

```html
<div class="parallax" data-depth="0.2">Slow</div>
<div class="parallax" data-depth="0.5">Medium</div>
<div class="parallax" data-depth="0.8">Fast</div>
```

### 4. Image Sequence

```javascript
const frameCount = 100;
const images = [];

// Preload images
for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = `/frames/frame${i.toString().padStart(4, '0')}.jpg`;
  images.push(img);
}

const obj = { frame: 0 };

gsap.to(obj, {
  frame: frameCount - 1,
  snap: 'frame',
  scrollTrigger: {
    trigger: '.canvas-container',
    start: 'top top',
    end: '+=3000',
    scrub: 0.5,
    pin: true,
  },
  onUpdate: () => {
    context.drawImage(images[obj.frame], 0, 0);
  }
});
```

### 5. Morphing Shapes

```javascript
// Morph SVG paths
gsap.to('#shape', {
  attr: {
    d: 'M10,10 L90,90 L10,90 Z'  // New path
  },
  duration: 1,
  ease: 'power2.inOut'
});
```

### 6. Scroll-Triggered Counter

```javascript
const counter = { value: 0 };

gsap.to(counter, {
  value: 1000,
  duration: 2,
  ease: 'power1.out',
  scrollTrigger: {
    trigger: '.stats',
    start: 'top 80%',
  },
  onUpdate: () => {
    document.querySelector('.number').textContent = Math.round(counter.value);
  }
});
```

---

## Performance Tips

```javascript
// ✅ Use will-change CSS for animated properties
gsap.set('.element', { willChange: 'transform' });

// ✅ Force hardware acceleration
gsap.set('.element', { force3D: true });

// ✅ Batch DOM queries
const boxes = gsap.utils.toArray('.box');
gsap.to(boxes, { x: 100 });

// ✅ Kill animations when done
const tween = gsap.to('.box', { x: 100 });
tween.kill();

// ✅ Optimize ScrollTrigger
ScrollTrigger.config({
  limitCallbacks: true,  // Only call callbacks when necessary
  syncInterval: 150,     // Sync interval (ms)
});

// ✅ Refresh ScrollTrigger after layout changes
ScrollTrigger.refresh();
```

---

**Key Takeaways:**
- GSAP is the most powerful animation library
- ScrollTrigger is essential for award-winning scroll sites
- Timelines make complex sequences simple
- Works perfectly with Three.js
- Performance is excellent out of the box

**Next:** [Post-Processing Effects](./08-POST-PROCESSING.md) →

