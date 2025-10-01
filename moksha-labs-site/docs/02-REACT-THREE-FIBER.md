# React Three Fiber (R3F)

**The Modern, Declarative Way to Build Three.js Applications**

---

## 📖 Table of Contents

1. [What is React Three Fiber?](#what-is-react-three-fiber)
2. [Setup and Installation](#setup-and-installation)
3. [Core Concepts](#core-concepts)
4. [@react-three/drei - Essential Helpers](#react-threedrei---essential-helpers)
5. [Hooks](#hooks)
6. [Events and Interactions](#events-and-interactions)
7. [Performance Optimization](#performance-optimization)
8. [Post-Processing](#post-processing)
9. [Best Practices](#best-practices)

---

## What is React Three Fiber?

React Three Fiber (R3F) is a React renderer for Three.js. Instead of imperative Three.js code, you write declarative React components.

### Why R3F?

**Imperative Three.js:**
```javascript
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
mesh.position.x = 2;
scene.add(mesh);
```

**Declarative R3F:**
```jsx
<mesh position-x={2}>
  <boxGeometry args={[1, 1, 1]} />
  <meshStandardMaterial color="red" />
</mesh>
```

**Benefits:**
- ✅ Declarative and composable
- ✅ Automatic memory management
- ✅ React ecosystem (hooks, context, etc.)
- ✅ Better code organization
- ✅ Easier to reason about
- ✅ Hot module replacement works great

---

## Setup and Installation

```bash
# Core packages
npm install three @react-three/fiber

# Essential helpers
npm install @react-three/drei

# Post-processing
npm install @react-three/postprocessing

# Types
npm install @types/three --save-dev
```

### Basic Setup

```jsx
import { Canvas } from '@react-three/fiber';

function App() {
  return (
    <Canvas>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </Canvas>
  );
}
```

### Canvas Props

```jsx
<Canvas
  // Camera
  camera={{ position: [0, 0, 5], fov: 75 }}
  
  // Renderer settings
  gl={{
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  }}
  
  // Tone mapping
  gl={{ toneMapping: THREE.ACESFilmicToneMapping }}
  
  // Pixel ratio (performance vs quality)
  dpr={[1, 2]}  // min 1, max 2
  
  // Shadow settings
  shadows
  // OR
  shadows={{
    type: THREE.PCFSoftShadowMap,
    enabled: true,
  }}
  
  // Performance mode
  mode="concurrent"
  
  // Events
  onCreated={(state) => {
    // Access to scene, camera, renderer, etc.
    console.log(state);
  }}
  
  // Style
  style={{ position: 'fixed', top: 0, left: 0 }}
  
  // Fallback during Suspense
  fallback={<Loading />}
>
  {/* Your 3D scene */}
</Canvas>
```

---

## Core Concepts

### 1. Everything is a Component

```jsx
// Three.js objects become React components
<mesh>
  <boxGeometry />
  <meshStandardMaterial />
</mesh>

// Lowercase names = Three.js constructors
// <mesh> → new THREE.Mesh()
// <boxGeometry> → new THREE.BoxGeometry()
```

### 2. Props Map to Three.js Properties

```jsx
// Direct property access
<mesh
  position={[0, 1, 0]}
  rotation={[0, Math.PI / 4, 0]}
  scale={1.5}
>
  <boxGeometry args={[1, 1, 1]} />
  <meshStandardMaterial
    color="hotpink"
    metalness={0.5}
    roughness={0.5}
  />
</mesh>

// Sub-property access with dash notation
<mesh position-x={2} rotation-y={Math.PI} scale-z={0.5}>
```

### 3. args for Constructor Arguments

```jsx
// args array maps to constructor parameters
<boxGeometry args={[1, 2, 3]} />
// → new THREE.BoxGeometry(1, 2, 3)

<pointLight args={['#ff0000', 1, 100, 2]} />
// → new THREE.PointLight('#ff0000', 1, 100, 2)
```

### 4. attach for Special Cases

```jsx
// Attach to specific property
<mesh>
  <boxGeometry />
  <meshStandardMaterial>
    <texture attach="map" />
  </meshStandardMaterial>
</mesh>
```

### 5. useFrame for Animation Loop

```jsx
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

function RotatingCube() {
  const meshRef = useRef();

  useFrame((state, delta) => {
    // Runs every frame (60fps)
    meshRef.current.rotation.y += delta;
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  );
}
```

---

## @react-three/drei - Essential Helpers

Drei provides helpful components and hooks for common Three.js patterns.

```bash
npm install @react-three/drei
```

### Camera Controls

```jsx
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={2}
        maxDistance={10}
      />
      <mesh>
        <sphereGeometry />
        <meshStandardMaterial />
      </mesh>
    </>
  );
}
```

### Lights

```jsx
import { Environment, ContactShadows } from '@react-three/drei';

function Lights() {
  return (
    <>
      {/* HDR environment lighting */}
      <Environment preset="sunset" />
      
      {/* Or custom HDRI */}
      <Environment files="/path/to/hdri.hdr" />
      
      {/* Contact shadows (fake AO shadows) */}
      <ContactShadows
        position={[0, -1, 0]}
        opacity={0.5}
        scale={10}
        blur={2}
      />
    </>
  );
}
```

### Geometries and Materials

```jsx
import { RoundedBox, MeshWobbleMaterial, MeshDistortMaterial } from '@react-three/drei';

function Shapes() {
  return (
    <>
      {/* Rounded box with radius */}
      <RoundedBox args={[1, 1, 1]} radius={0.05} smoothness={4}>
        <meshStandardMaterial color="hotpink" />
      </RoundedBox>
      
      {/* Animated wobble material */}
      <mesh>
        <sphereGeometry />
        <MeshWobbleMaterial factor={1} speed={2} />
      </mesh>
      
      {/* Distortion material */}
      <mesh>
        <sphereGeometry />
        <MeshDistortMaterial distort={0.5} speed={2} />
      </mesh>
    </>
  );
}
```

### Text

```jsx
import { Text, Text3D, Center } from '@react-three/drei';

function TextElements() {
  return (
    <>
      {/* 2D Text (billboard) */}
      <Text
        position={[0, 2, 0]}
        fontSize={1}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Hello World
      </Text>
      
      {/* 3D Text */}
      <Center>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.5}
          height={0.2}
        >
          Hello 3D
          <meshNormalMaterial />
        </Text3D>
      </Center>
    </>
  );
}
```

### Models

```jsx
import { useGLTF, Clone } from '@react-three/drei';

function Model() {
  const { scene } = useGLTF('/models/model.glb');
  
  return <primitive object={scene} />;
}

// Preload models
useGLTF.preload('/models/model.glb');

// Clone models for instancing
function MultipleModels() {
  const { scene } = useGLTF('/model.glb');
  
  return (
    <>
      <Clone object={scene} position={[0, 0, 0]} />
      <Clone object={scene} position={[2, 0, 0]} />
      <Clone object={scene} position={[4, 0, 0]} />
    </>
  );
}
```

### Helpers

```jsx
import {
  Stage,
  Grid,
  Stats,
  Bounds,
  BakeShadows,
} from '@react-three/drei';

function HelperComponents() {
  return (
    <>
      {/* Performance stats */}
      <Stats />
      
      {/* Grid */}
      <Grid
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#6f6f6f"
        sectionSize={3}
        sectionThickness={1.5}
        sectionColor="#9d4b4b"
        fadeDistance={25}
        fadeStrength={1}
        infiniteGrid
      />
      
      {/* Stage with lights and shadows */}
      <Stage
        intensity={0.5}
        environment="sunset"
        shadows={{ type: 'contact', opacity: 0.5, blur: 2 }}
      >
        <mesh>
          <sphereGeometry />
          <meshStandardMaterial />
        </mesh>
      </Stage>
      
      {/* Auto-fit camera to bounds */}
      <Bounds fit clip observe>
        <mesh>
          <boxGeometry />
          <meshStandardMaterial />
        </mesh>
      </Bounds>
      
      {/* Bake shadows for performance */}
      <BakeShadows />
    </>
  );
}
```

---

## Hooks

R3F provides powerful hooks for accessing state and functionality.

### useThree

```jsx
import { useThree } from '@react-three/fiber';

function Component() {
  const {
    scene,
    camera,
    gl: renderer,
    size,           // { width, height }
    viewport,       // { width, height, factor, distance }
    raycaster,
    mouse,
    clock,
    invalidate,     // Force re-render
    advance,        // Manual frame advancement
    setSize,
    setDpr,
  } = useThree();

  // Example: Update camera on mount
  useEffect(() => {
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return null;
}
```

### useFrame

```jsx
import { useFrame } from '@react-three/fiber';

function AnimatedCube() {
  const meshRef = useRef();

  useFrame((state, delta, xrFrame) => {
    // state: same as useThree()
    // delta: time since last frame
    // xrFrame: WebXR frame (if in VR/AR)

    meshRef.current.rotation.y += delta;

    // Access state
    const time = state.clock.elapsedTime;
    meshRef.current.position.y = Math.sin(time);
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  );
}

// Render priority (lower = later)
useFrame((state, delta) => {
  // Heavy computation
}, -1);  // Runs after default priority (0)
```

### useLoader

```jsx
import { useLoader } from '@react-three/fiber';
import { TextureLoader, GLTFLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function TexturedCube() {
  const texture = useLoader(TextureLoader, '/texture.jpg');
  
  return (
    <mesh>
      <boxGeometry />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

// Load multiple
function MultipleTextures() {
  const [color, normal, roughness] = useLoader(TextureLoader, [
    '/color.jpg',
    '/normal.jpg',
    '/roughness.jpg',
  ]);
  
  return (
    <mesh>
      <boxGeometry />
      <meshStandardMaterial
        map={color}
        normalMap={normal}
        roughnessMap={roughness}
      />
    </mesh>
  );
}

// With Suspense
function App() {
  return (
    <Canvas>
      <Suspense fallback={<LoadingSpinner />}>
        <TexturedCube />
      </Suspense>
    </Canvas>
  );
}
```

### useTexture (from Drei)

```jsx
import { useTexture } from '@react-three/drei';

function TexturedMesh() {
  const props = useTexture({
    map: '/color.jpg',
    normalMap: '/normal.jpg',
    roughnessMap: '/roughness.jpg',
    metalnessMap: '/metalness.jpg',
  });

  return (
    <mesh>
      <sphereGeometry />
      <meshStandardMaterial {...props} />
    </mesh>
  );
}

// Preload
useTexture.preload('/color.jpg');
```

---

## Events and Interactions

R3F makes 3D object interactions easy with pointer events.

### Basic Events

```jsx
function InteractiveCube() {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  return (
    <mesh
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setClicked(!clicked)}
      onPointerDown={(e) => console.log('Down', e)}
      onPointerUp={(e) => console.log('Up', e)}
      onPointerMove={(e) => console.log('Move', e)}
      scale={clicked ? 1.5 : 1}
    >
      <boxGeometry />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'gray'} />
    </mesh>
  );
}
```

### Event Properties

```jsx
function ClickableObject() {
  const handleClick = (event) => {
    event.stopPropagation();  // Prevent event bubbling
    event.object;             // The THREE.Object3D
    event.point;              // Point of intersection (Vector3)
    event.distance;           // Distance from camera
    event.face;               // Face that was hit
    event.faceIndex;
    event.uv;                 // UV coordinates
    event.intersections;      // All intersections
    event.ray;                // The raycaster ray
    event.camera;
    event.nativeEvent;        // Original DOM event
  };

  return (
    <mesh onClick={handleClick}>
      <sphereGeometry />
      <meshStandardMaterial />
    </mesh>
  );
}
```

### Pointer Cursor

```jsx
function HoverableMesh() {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
  }, [hovered]);

  return (
    <mesh
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  );
}
```

---

## Performance Optimization

### 1. Instances for Repeated Objects

```jsx
import { Instances, Instance } from '@react-three/drei';

function ManyObjects() {
  return (
    <Instances limit={1000}>
      <sphereGeometry args={[0.1]} />
      <meshStandardMaterial />
      
      {Array.from({ length: 1000 }, (_, i) => (
        <Instance
          key={i}
          position={[
            Math.random() * 10 - 5,
            Math.random() * 10 - 5,
            Math.random() * 10 - 5,
          ]}
        />
      ))}
    </Instances>
  );
}
```

### 2. Level of Detail (LOD)

```jsx
import { Detailed } from '@react-three/drei';

function OptimizedModel() {
  return (
    <Detailed distances={[0, 10, 20]}>
      {/* High detail (close) */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial />
      </mesh>
      
      {/* Medium detail */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial />
      </mesh>
      
      {/* Low detail (far) */}
      <mesh>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial />
      </mesh>
    </Detailed>
  );
}
```

### 3. Conditional Rendering

```jsx
import { useInView } from 'react-intersection-observer';

function ConditionalScene() {
  const { ref, inView } = useInView();

  return (
    <div ref={ref}>
      <Canvas>
        {inView && <ExpensiveScene />}
      </Canvas>
    </div>
  );
}
```

---

## Best Practices

```jsx
// ✅ Use refs to access Three.js objects
const meshRef = useRef();

// ✅ Dispose of resources (drei handles this automatically)
// But for manual Three.js objects:
useEffect(() => {
  const geometry = new THREE.BufferGeometry();
  return () => geometry.dispose();
}, []);

// ✅ Use Suspense for async loading
<Suspense fallback={<Spinner />}>
  <Model />
</Suspense>

// ✅ Memoize expensive computations
const positions = useMemo(() => {
  return new Float32Array(1000).map(() => Math.random());
}, []);

// ✅ Use frameloop="demand" for static scenes
<Canvas frameloop="demand">
  <StaticScene />
</Canvas>

// ✅ Set pixel ratio carefully
<Canvas dpr={[1, 2]}>  // Max 2x for retina
```

---

**Key Takeaways:**
- R3F makes Three.js declarative and easier to maintain
- Drei provides essential helpers for common patterns
- Use useFrame for animations
- Events make interactions straightforward
- Always optimize with instancing and LOD for production

**Next:** [Shader Programming](./03-SHADER-PROGRAMMING.md) →

