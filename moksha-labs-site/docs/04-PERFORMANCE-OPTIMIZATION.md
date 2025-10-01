# Performance Optimization

**Production-Ready Techniques for 60fps Three.js Applications**

---

## 📖 Table of Contents

1. [Performance Fundamentals](#performance-fundamentals)
2. [Geometry Optimization](#geometry-optimization)
3. [Material & Texture Optimization](#material--texture-optimization)
4. [Rendering Optimization](#rendering-optimization)
5. [Memory Management](#memory-management)
6. [Instancing](#instancing)
7. [Level of Detail (LOD)](#level-of-detail-lod)
8. [Culling Techniques](#culling-techniques)
9. [Loading & Code Splitting](#loading--code-splitting)
10. [Monitoring & Debugging](#monitoring--debugging)

---

## Performance Fundamentals

### The 60fps Rule

Award-winning sites MUST maintain 60fps on desktop, minimum 30fps on mobile.

```
1 frame = 16.67ms (60fps)
1 frame = 33.33ms (30fps)
```

### Performance Budget

```javascript
// Rough budget per frame at 60fps:
// JavaScript: ~3ms
// Rendering: ~10ms
// Browser work: ~3.67ms
// Total: 16.67ms

// Use performance.now() to measure
const start = performance.now();
// ... your code ...
const end = performance.now();
console.log(`Took ${end - start}ms`);
```

### The Render Pipeline

```
1. JavaScript (useFrame, animations)
2. Style recalculation
3. Layout
4. Paint
5. Composite
6. WebGL rendering (Three.js)
```

Optimize each step to achieve 60fps.

---

## Geometry Optimization

### 1. Reduce Polygon Count

```javascript
// ❌ Too many polygons
const sphere = new THREE.SphereGeometry(1, 128, 128);  // 32,512 triangles

// ✅ Optimized
const sphere = new THREE.SphereGeometry(1, 32, 32);    // 2,048 triangles

// Rule of thumb:
// Background objects: 8-16 segments
// Mid-ground: 16-32 segments
// Hero objects: 32-64 segments
```

### 2. Merge Geometries

```javascript
// ❌ Many separate meshes (expensive)
for (let i = 0; i < 100; i++) {
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}

// ✅ Merge into single geometry
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const geometries = [];
for (let i = 0; i < 100; i++) {
  const geo = geometry.clone();
  geo.translate(i * 2, 0, 0);
  geometries.push(geo);
}

const mergedGeometry = mergeBufferGeometries(geometries);
const mesh = new THREE.Mesh(mergedGeometry, material);
scene.add(mesh);
```

### 3. Use BufferGeometry

```javascript
// ✅ Always use BufferGeometry (not Geometry - deprecated)
const geometry = new THREE.BufferGeometry();

const vertices = new Float32Array([
  0, 0, 0,
  1, 0, 0,
  0, 1, 0,
]);

geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
```

### 4. Dispose Unused Geometries

```javascript
// ✅ Always dispose when done
geometry.dispose();

// In React
useEffect(() => {
  const geometry = new THREE.BufferGeometry();
  // ... use geometry ...
  
  return () => {
    geometry.dispose();
  };
}, []);
```

---

## Material & Texture Optimization

### 1. Reuse Materials

```javascript
// ❌ Create new material for each mesh
objects.forEach(obj => {
  obj.material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
});

// ✅ Share single material
const sharedMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
objects.forEach(obj => {
  obj.material = sharedMaterial;
});
```

### 2. Choose Appropriate Materials

```javascript
// From cheapest to most expensive:

// 1. MeshBasicMaterial (no lighting)
const basic = new THREE.MeshBasicMaterial();

// 2. MeshLambertMaterial (simple lighting)
const lambert = new THREE.MeshLambertMaterial();

// 3. MeshPhongMaterial (specular highlights)
const phong = new THREE.MeshPhongMaterial();

// 4. MeshStandardMaterial (PBR)
const standard = new THREE.MeshStandardMaterial();

// 5. MeshPhysicalMaterial (advanced PBR)
const physical = new THREE.MeshPhysicalMaterial();

// Use the simplest material that achieves your visual goal
```

### 3. Optimize Textures

```javascript
// ✅ Power-of-two dimensions (512, 1024, 2048)
// Better memory, automatic mipmaps

// ✅ Compress textures
// JPEG for color maps (lossy, smaller)
// PNG for alpha maps (lossless)

// ✅ Use appropriate sizes
const sizes = {
  hero: 2048,      // Main focus objects
  standard: 1024,  // Regular objects
  background: 512, // Far away objects
  tiny: 256,       // Very small/far objects
};

// ✅ Load textures efficiently
import { TextureLoader } from 'three';

const loader = new TextureLoader();
const texture = loader.load('/texture.jpg');

// Set filtering
texture.minFilter = THREE.LinearMipmapLinearFilter;
texture.magFilter = THREE.LinearFilter;

// Anisotropic filtering (sharper at angles)
texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

// ✅ Dispose textures
texture.dispose();
```

### 4. Atlas Textures

```javascript
// Combine multiple textures into one atlas
// Reduces draw calls and texture swaps

// Instead of 10 separate 512x512 textures:
// → 1 atlas texture 2048x2048

// Adjust UVs to point to atlas regions
```

---

## Rendering Optimization

### 1. Pixel Ratio

```javascript
// ✅ Limit pixel ratio (most important!)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Pixel ratio scaling:
// 1x = 1 pixel
// 2x = 4 pixels (2×2)
// 3x = 9 pixels (3×3)

// On high-DPI displays, capping at 2 saves massive performance
```

### 2. Renderer Settings

```javascript
const renderer = new THREE.WebGLRenderer({
  // Enable if needed, but costs performance
  antialias: true,           // ⚠️ Expensive on high-DPI
  
  // Performance
  powerPreference: 'high-performance',
  stencil: false,            // Disable if not used
  depth: true,               // Usually needed
  
  // Transparency
  alpha: false,              // Set to true only if needed
  premultipliedAlpha: true,
});

// Tone mapping
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

// Output encoding
renderer.outputEncoding = THREE.sRGBEncoding;

// Shadow map
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;  // Balance quality/performance
```

### 3. Shadow Optimization

```javascript
// ✅ Reduce shadow map size
light.shadow.mapSize.width = 1024;   // Default 512
light.shadow.mapSize.height = 1024;

// ✅ Adjust shadow camera frustum
const size = 10;
light.shadow.camera.left = -size;
light.shadow.camera.right = size;
light.shadow.camera.top = size;
light.shadow.camera.bottom = -size;

// ✅ Use fewer shadow-casting lights
// Each shadow-casting light = separate shadow map render

// ✅ Consider baked shadows (drei)
import { BakeShadows } from '@react-three/drei';

<BakeShadows />
```

### 4. Frustum Culling

```javascript
// ✅ Automatic in Three.js (objects outside view aren't rendered)
// Help it by setting reasonable object bounds

mesh.geometry.computeBoundingSphere();
mesh.frustumCulled = true;  // Default

// ❌ Don't disable unless you have a specific reason
mesh.frustumCulled = false;
```

---

## Memory Management

### The dispose() Pattern

```javascript
// ✅ Always dispose of Three.js resources

// Geometries
geometry.dispose();

// Materials
material.dispose();

// Textures
texture.dispose();

// Render targets
renderTarget.dispose();

// Complete cleanup function
function disposeHierarchy(node) {
  node.traverse((child) => {
    if (child.geometry) {
      child.geometry.dispose();
    }
    
    if (child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach(material => material.dispose());
      } else {
        child.material.dispose();
      }
    }
    
    // Dispose textures
    if (child.material) {
      for (const key in child.material) {
        const value = child.material[key];
        if (value && value.isTexture) {
          value.dispose();
        }
      }
    }
  });
}

// Usage
disposeHierarchy(scene);
```

### React Three Fiber Auto-Disposal

```javascript
// ✅ R3F automatically disposes of most resources
// But manual THREE objects still need disposal

import { useEffect } from 'react';

function Component() {
  useEffect(() => {
    const texture = new THREE.TextureLoader().load('/texture.jpg');
    
    return () => {
      // Cleanup
      texture.dispose();
    };
  }, []);
}
```

---

## Instancing

For rendering many copies of the same mesh.

### InstancedMesh (Vanilla Three.js)

```javascript
const count = 1000;
const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

const instancedMesh = new THREE.InstancedMesh(geometry, material, count);

// Set transform for each instance
const dummy = new THREE.Object3D();
for (let i = 0; i < count; i++) {
  dummy.position.set(
    Math.random() * 10 - 5,
    Math.random() * 10 - 5,
    Math.random() * 10 - 5
  );
  dummy.rotation.set(
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI
  );
  dummy.updateMatrix();
  instancedMesh.setMatrixAt(i, dummy.matrix);
}

instancedMesh.instanceMatrix.needsUpdate = true;
scene.add(instancedMesh);

// Update instances
function animate() {
  for (let i = 0; i < count; i++) {
    instancedMesh.getMatrixAt(i, dummy.matrix);
    dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
    
    dummy.rotation.y += 0.01;
    
    dummy.updateMatrix();
    instancedMesh.setMatrixAt(i, dummy.matrix);
  }
  instancedMesh.instanceMatrix.needsUpdate = true;
}
```

### Instances (React Three Fiber + Drei)

```jsx
import { Instances, Instance } from '@react-three/drei';

function ManyBoxes() {
  return (
    <Instances limit={1000} range={1000}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshStandardMaterial />
      
      {Array.from({ length: 1000 }, (_, i) => (
        <Instance
          key={i}
          position={[
            Math.random() * 10 - 5,
            Math.random() * 10 - 5,
            Math.random() * 10 - 5,
          ]}
          rotation={[
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI,
          ]}
        />
      ))}
    </Instances>
  );
}

// Animated instances
function AnimatedInstance({ index }) {
  const ref = useRef();
  
  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime + index;
  });
  
  return <Instance ref={ref} />;
}
```

**Performance gain:** 1000 separate meshes vs 1 instanced mesh = ~100x faster!

---

## Level of Detail (LOD)

Render different quality models based on distance.

### Drei Detailed Component

```jsx
import { Detailed } from '@react-three/drei';

function AdaptiveModel() {
  return (
    <Detailed distances={[0, 10, 20]}>
      {/* Distance 0-10: High detail */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial />
      </mesh>
      
      {/* Distance 10-20: Medium detail */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial />
      </mesh>
      
      {/* Distance 20+: Low detail */}
      <mesh>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial />
      </mesh>
    </Detailed>
  );
}
```

### Manual LOD

```javascript
const lod = new THREE.LOD();

// High detail
const highDetail = new THREE.Mesh(
  new THREE.SphereGeometry(1, 64, 64),
  material
);
lod.addLevel(highDetail, 0);  // Distance 0-10

// Medium detail
const mediumDetail = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  material
);
lod.addLevel(mediumDetail, 10);  // Distance 10-20

// Low detail
const lowDetail = new THREE.Mesh(
  new THREE.SphereGeometry(1, 8, 8),
  material
);
lod.addLevel(lowDetail, 20);  // Distance 20+

scene.add(lod);
```

---

## Culling Techniques

### 1. Frustum Culling (Automatic)

Already enabled by default. Objects outside camera frustum aren't rendered.

### 2. Distance Culling

```javascript
// Hide objects beyond certain distance
function distanceCull(camera, maxDistance) {
  scene.traverse((object) => {
    if (object.isMesh) {
      const distance = camera.position.distanceTo(object.position);
      object.visible = distance < maxDistance;
    }
  });
}

// In animation loop
distanceCull(camera, 50);
```

### 3. Occlusion Culling (Manual)

```javascript
// More advanced: Don't render objects hidden behind others
// Usually requires custom raycasting or spatial partitioning
// Consider only for very complex scenes
```

---

## Loading & Code Splitting

### 1. Lazy Load Models

```jsx
import { lazy, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';

const HeavyModel = lazy(() => import('./HeavyModel'));

function App() {
  return (
    <Canvas>
      <Suspense fallback={<LoadingBox />}>
        <HeavyModel />
      </Suspense>
    </Canvas>
  );
}
```

### 2. Preload Assets

```javascript
import { useGLTF } from '@react-three/drei';

// Preload before component mounts
useGLTF.preload('/model.glb');
useTexture.preload('/texture.jpg');

// Or with loading manager
const manager = new THREE.LoadingManager();

manager.onLoad = () => console.log('All loaded');
manager.onProgress = (url, loaded, total) => {
  console.log(`${loaded}/${total} files loaded`);
};

const loader = new GLTFLoader(manager);
```

### 3. Draco Compression

```javascript
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

// Models can be 90% smaller!
```

---

## Monitoring & Debugging

### 1. Stats.js

```javascript
import Stats from 'three/examples/jsm/libs/stats.module.js';

const stats = new Stats();
document.body.appendChild(stats.dom);

function animate() {
  stats.begin();
  
  // Your rendering
  renderer.render(scene, camera);
  
  stats.end();
  requestAnimationFrame(animate);
}
```

### 2. R3F Perf Monitor

```jsx
import { Perf } from 'r3f-perf';

<Canvas>
  <Perf position="top-left" />
  <Scene />
</Canvas>
```

### 3. Chrome DevTools

```javascript
// Enable Three.js debugging
localStorage.setItem('debug', 'three:*');

// Check renderer info
console.log(renderer.info);
// Shows: geometries, textures, programs, calls, triangles, etc.

// Profile rendering
// Chrome DevTools → Performance → Record → Analyze
```

### 4. Memory Profiling

```javascript
// Check memory usage
console.log(performance.memory);
// Shows: usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit

// Monitor WebGL memory
console.log(renderer.info.memory);
// Shows: geometries, textures
```

---

## Performance Checklist

```javascript
// ✅ Geometry
// □ Use low poly counts
// □ Merge static geometries
// □ Use instancing for repeated objects
// □ Implement LOD for distant objects
// □ Dispose unused geometries

// ✅ Materials & Textures
// □ Reuse materials
// □ Use simplest material possible
// □ Compress textures
// □ Use power-of-two texture sizes
// □ Limit texture resolution
// □ Dispose unused materials/textures

// ✅ Rendering
// □ Limit pixel ratio to 2
// □ Disable antialias on high-DPI
// □ Optimize shadow maps
// □ Use efficient renderer settings
// □ Enable frustum culling

// ✅ Code
// □ Avoid unnecessary useFrame calls
// □ Throttle expensive computations
// □ Use React.memo for static components
// □ Lazy load heavy components
// □ Preload critical assets

// ✅ Monitoring
// □ Use Stats.js or r3f-perf
// □ Profile with Chrome DevTools
// □ Test on target devices
// □ Monitor memory usage
```

---

**Key Takeaways:**
- Target 60fps on desktop, 30fps on mobile
- Pixel ratio is the #1 performance killer - cap at 2
- Use instancing for repeated geometry
- Always dispose of resources
- Measure, don't guess - use profiling tools

**Next:** [Award-Winning Examples](./12-AWARD-WINNING-EXAMPLES.md) →

