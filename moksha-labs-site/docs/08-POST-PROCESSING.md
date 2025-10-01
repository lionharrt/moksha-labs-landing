# Post-Processing Effects

**Polish Your Scene with Camera Effects**

---

## 📖 Table of Contents

1. [What is Post-Processing?](#what-is-post-processing)
2. [Setup in Three.js](#setup-in-threejs)
3. [React Three Fiber Post-Processing](#react-three-fiber-post-processing)
4. [Common Effects](#common-effects)
5. [Custom Effects](#custom-effects)
6. [Performance Considerations](#performance-considerations)
7. [Award-Winning Combinations](#award-winning-combinations)

---

## What is Post-Processing?

Post-processing applies effects to the final rendered image, like Instagram filters for 3D scenes.

### Why Use Post-Processing?

✅ **Visual polish** - Makes scenes look professional  
✅ **Atmosphere** - Creates mood and style  
✅ **Depth** - Adds realism with depth of field  
✅ **Glow** - Bloom for luminous objects  
✅ **Differentiation** - Unique visual identity  

### The Post-Processing Pipeline

```
3D Scene Render
    ↓
Effect 1 (e.g., Bloom)
    ↓
Effect 2 (e.g., Depth of Field)
    ↓
Effect 3 (e.g., Vignette)
    ↓
Final Output to Screen
```

---

## Setup in Three.js

### Basic Setup (Vanilla Three.js)

```javascript
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// Create composer
const composer = new EffectComposer(renderer);

// Add render pass (renders scene)
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// Add bloom effect
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,    // strength
  0.4,    // radius
  0.85    // threshold
);
composer.addPass(bloomPass);

// Render with composer instead of renderer
function animate() {
  requestAnimationFrame(animate);
  composer.render();  // Instead of renderer.render(scene, camera)
}
```

### Handle Resize

```javascript
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
  
  // Update individual passes if needed
  bloomPass.setSize(window.innerWidth, window.innerHeight);
});
```

---

## React Three Fiber Post-Processing

Much easier with R3F and `@react-three/postprocessing`!

### Installation

```bash
npm install @react-three/postprocessing
```

### Basic Setup

```jsx
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Canvas } from '@react-three/fiber';

function App() {
  return (
    <Canvas>
      <Scene />
      <EffectComposer>
        <Bloom intensity={1.5} />
      </EffectComposer>
    </Canvas>
  );
}
```

---

## Common Effects

### Bloom

Glowing light effect for bright objects.

```jsx
import { Bloom } from '@react-three/postprocessing';

<EffectComposer>
  <Bloom
    intensity={1.0}           // Glow intensity
    luminanceThreshold={0.9}  // Brightness threshold (0-1)
    luminanceSmoothing={0.9}  // Smoothness
    mipmapBlur={true}         // Better quality
  />
</EffectComposer>
```

**Use for:** Sci-fi scenes, glowing objects, neon, magical effects

### Depth of Field (DOF)

Blurs objects based on distance from focus point.

```jsx
import { DepthOfField } from '@react-three/postprocessing';

<EffectComposer>
  <DepthOfField
    focusDistance={0.01}    // Focus distance (0-1)
    focalLength={0.05}      // Focal length
    bokehScale={3}          // Blur amount
    height={480}            // Render height (lower = faster)
  />
</EffectComposer>
```

**Use for:** Emphasize subject, cinematic look, product shots

### Vignette

Darkens edges of screen.

```jsx
import { Vignette } from '@react-three/postprocessing';

<EffectComposer>
  <Vignette
    offset={0.5}      // Darkness amount (0-1)
    darkness={0.5}    // Edge darkness
    eskil={false}     // Use eskil vignette
  />
</EffectComposer>
```

**Use for:** Focus attention, vintage look, dramatic mood

### Chromatic Aberration

Color separation effect.

```jsx
import { ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';

<EffectComposer>
  <ChromaticAberration
    offset={new THREE.Vector2(0.002, 0.002)}
    radialModulation={false}
    modulationOffset={0}
  />
</EffectComposer>
```

**Use for:** Retro, glitchy, lens distortion effects

### Noise

Film grain / TV static.

```jsx
import { Noise } from '@react-three/postprocessing';

<EffectComposer>
  <Noise
    opacity={0.05}    // Noise intensity
    premultiply       // Blend mode
  />
</EffectComposer>
```

**Use for:** Film look, texture, vintage aesthetic

### Glitch

Digital glitch effect.

```jsx
import { Glitch } from '@react-three/postprocessing';

<EffectComposer>
  <Glitch
    delay={[1.5, 3.5]}      // Min/max delay between glitches
    duration={[0.6, 1.0]}   // Min/max glitch duration
    strength={[0.3, 1.0]}   // Min/max glitch strength
    mode={GlitchMode.SPORADIC}
    active                   // Toggle on/off
    ratio={0.85}
  />
</EffectComposer>
```

**Use for:** Sci-fi, hacker aesthetic, transitions

### SSAO (Screen Space Ambient Occlusion)

Adds realistic shadows in crevices.

```jsx
import { SSAO } from '@react-three/postprocessing';

<EffectComposer>
  <SSAO
    samples={31}              // Quality (more = better but slower)
    radius={5}                // AO radius
    intensity={30}            // Effect strength
    luminanceInfluence={0.6}  // How much lighting affects AO
    color="black"
  />
</EffectComposer>
```

**Use for:** Realism, depth, architectural visualization

### Outline

Edge detection / toon outline.

```jsx
import { Outline } from '@react-three/postprocessing';

<EffectComposer>
  <Outline
    selection={[mesh1, mesh2]}  // Objects to outline
    selectionLayer={10}          // Layer for outlined objects
    edgeStrength={2.5}
    pulseSpeed={0.0}
    visibleEdgeColor={0xffffff}
    hiddenEdgeColor={0x22090a}
    blur={false}
    xRay={true}
  />
</EffectComposer>
```

**Use for:** Highlighting, toon shading, selection

### Color Grading

Adjust overall colors (like LUTs in photography).

```jsx
import { HueSaturation, BrightnessContrast } from '@react-three/postprocessing';

<EffectComposer>
  <HueSaturation
    hue={0}           // -180 to 180
    saturation={0.2}  // -1 to 1
  />
  <BrightnessContrast
    brightness={0.05}  // -1 to 1
    contrast={0.1}     // -1 to 1
  />
</EffectComposer>
```

**Use for:** Color correction, mood, style

---

## Custom Effects

### Custom Shader Effect

```jsx
import { Effect } from 'postprocessing';
import { forwardRef } from 'react';

// Define custom effect
const fragmentShader = `
  uniform float time;
  
  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec3 color = inputColor.rgb;
    
    // Custom effect (e.g., wave distortion)
    vec2 distortion = vec2(
      sin(uv.y * 10.0 + time) * 0.01,
      0.0
    );
    
    outputColor = vec4(color, inputColor.a);
  }
`;

class CustomEffectImpl extends Effect {
  constructor({ time = 0 }) {
    super('CustomEffect', fragmentShader, {
      uniforms: new Map([
        ['time', new Uniform(time)]
      ])
    });
  }
  
  update(renderer, inputBuffer, deltaTime) {
    this.uniforms.get('time').value += deltaTime;
  }
}

// React component wrapper
export const CustomEffect = forwardRef(({ time }, ref) => {
  const effect = useMemo(() => new CustomEffectImpl({ time }), [time]);
  return <primitive ref={ref} object={effect} dispose={null} />;
});

// Usage
<EffectComposer>
  <CustomEffect />
</EffectComposer>
```

---

## Performance Considerations

### Optimization Tips

```jsx
// ✅ Use multisampling carefully
<EffectComposer multisampling={0}>  // 0 = off, 8 = best quality

// ✅ Reduce resolution for expensive effects
<DepthOfField height={480} />  // Lower = faster

// ✅ Disable on mobile
const isMobile = window.innerWidth < 768;

{!isMobile && (
  <EffectComposer>
    <Bloom />
  </EffectComposer>
)}

// ✅ Use simpler alternatives
// Instead of full SSAO, use ContactShadows
import { ContactShadows } from '@react-three/drei';
<ContactShadows opacity={0.5} scale={10} blur={2} />

// ✅ Selective bloom (only certain objects glow)
import { BlendFunction } from 'postprocessing';

<Bloom
  intensity={2}
  luminanceThreshold={0}  // All objects
  luminanceSmoothing={0}
  mipmapBlur
/>

// Mark objects that should bloom
material.emissive = new THREE.Color(0xffffff);
material.emissiveIntensity = 1;
```

### Performance Budget

```javascript
// Cost ranking (cheap to expensive):
// 1. Vignette, Noise - Very cheap
// 2. ChromaticAberration - Cheap
// 3. Bloom - Moderate
// 4. DepthOfField - Moderate-Expensive
// 5. SSAO - Expensive
// 6. Reflections - Very expensive

// Recommended maximum:
// Desktop: 3-4 moderate effects
// Mobile: 1-2 cheap effects
```

---

## Award-Winning Combinations

### 1. Cinematic Look

```jsx
<EffectComposer>
  <DepthOfField
    focusDistance={0.01}
    focalLength={0.05}
    bokehScale={2}
  />
  <Bloom
    intensity={0.5}
    luminanceThreshold={0.9}
  />
  <Vignette darkness={0.6} />
  <Noise opacity={0.02} />
</EffectComposer>
```

### 2. Neon / Cyberpunk

```jsx
<EffectComposer>
  <Bloom
    intensity={2}
    luminanceThreshold={0.2}
    luminanceSmoothing={0.9}
  />
  <ChromaticAberration
    offset={new THREE.Vector2(0.003, 0.003)}
  />
  <Vignette darkness={0.8} />
</EffectComposer>
```

### 3. Clean / Minimal

```jsx
<EffectComposer>
  <Bloom
    intensity={0.3}
    luminanceThreshold={0.95}
  />
  <BrightnessContrast
    brightness={0.05}
    contrast={0.1}
  />
</EffectComposer>
```

### 4. Retro / VHS

```jsx
<EffectComposer>
  <ChromaticAberration
    offset={new THREE.Vector2(0.005, 0.005)}
  />
  <Noise opacity={0.1} />
  <Scanline density={1.25} />
  <Vignette darkness={0.7} />
</EffectComposer>
```

### 5. Product Showcase

```jsx
<EffectComposer>
  <DepthOfField
    focusDistance={0.01}
    focalLength={0.05}
    bokehScale={2}
  />
  <Bloom
    intensity={0.5}
    luminanceThreshold={0.9}
  />
  <SSAO
    samples={31}
    radius={5}
    intensity={20}
  />
</EffectComposer>
```

### 6. Glitchy / Tech

```jsx
import { useState, useEffect } from 'react';

function GlitchyEffects() {
  const [active, setActive] = useState(false);

  // Random glitches
  useEffect(() => {
    const interval = setInterval(() => {
      setActive(true);
      setTimeout(() => setActive(false), 200);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <EffectComposer>
      <Glitch
        active={active}
        delay={[0.5, 1]}
        duration={[0.1, 0.3]}
      />
      <ChromaticAberration
        offset={new THREE.Vector2(0.002, 0.002)}
      />
      <Scanline density={2} />
    </EffectComposer>
  );
}
```

---

## Complete Example

```jsx
import { Canvas } from '@react-three/fiber';
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  Vignette,
  Noise,
  ChromaticAberration,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      {/* Emissive sphere (will glow) */}
      <mesh>
        <sphereGeometry />
        <meshStandardMaterial
          color="hotpink"
          emissive="hotpink"
          emissiveIntensity={2}
        />
      </mesh>
      
      {/* Regular cube */}
      <mesh position={[2, 0, 0]}>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
    </>
  );
}

function App() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <Scene />
      
      <EffectComposer multisampling={8}>
        {/* Main bloom for glow */}
        <Bloom
          intensity={1.5}
          luminanceThreshold={0.9}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        
        {/* Depth of field for focus */}
        <DepthOfField
          focusDistance={0.01}
          focalLength={0.05}
          bokehScale={2}
          height={480}
        />
        
        {/* Chromatic aberration for style */}
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.001, 0.001)}
        />
        
        {/* Vignette for focus */}
        <Vignette
          offset={0.5}
          darkness={0.5}
        />
        
        {/* Film grain */}
        <Noise opacity={0.02} />
      </EffectComposer>
    </Canvas>
  );
}
```

---

## Interactive Post-Processing

Use Leva for real-time tweaking:

```jsx
import { useControls } from 'leva';

function AdjustableEffects() {
  const { bloomIntensity, bokehScale, vignetteOffset } = useControls({
    bloomIntensity: { value: 1.5, min: 0, max: 5, step: 0.1 },
    bokehScale: { value: 2, min: 0, max: 10, step: 0.5 },
    vignetteOffset: { value: 0.5, min: 0, max: 1, step: 0.01 },
  });

  return (
    <EffectComposer>
      <Bloom intensity={bloomIntensity} />
      <DepthOfField bokehScale={bokehScale} />
      <Vignette offset={vignetteOffset} />
    </EffectComposer>
  );
}
```

---

**Key Takeaways:**
- Post-processing adds professional polish
- Use sparingly - less is more
- Test performance on target devices
- Bloom and DOF most common in award winners
- Combine effects thoughtfully for unique style

**Next:** [Particle Systems](./09-PARTICLE-SYSTEMS.md) →

