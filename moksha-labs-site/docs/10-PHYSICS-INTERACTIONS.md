# Physics & Interactions

**Add Realistic Physics and User Interactions to Your 3D Scenes**

---

## 📖 Table of Contents

1. [Physics Engines Overview](#physics-engines-overview)
2. [Rapier Physics](#rapier-physics)
3. [Cannon-es Physics](#cannon-es-physics)
4. [React Three Fiber Integration](#react-three-fiber-integration)
5. [Raycasting](#raycasting)
6. [Drag Controls](#drag-controls)
7. [Collision Detection](#collision-detection)
8. [Interactive Patterns](#interactive-patterns)

---

## Physics Engines Overview

### Available Engines

| Engine | Speed | Features | Size | Best For |
|--------|-------|----------|------|----------|
| **Rapier** | ⚡️⚡️⚡️ Very Fast | Full 3D physics | ~500kb | Production, complex simulations |
| **Cannon-es** | ⚡️⚡️ Fast | Good 3D physics | ~200kb | Most projects |
| **Ammo.js** | ⚡️ Moderate | Very complete | ~1MB | Advanced needs |
| **Matter.js** | ⚡️⚡️ Fast | 2D only | ~100kb | 2D games |

**Recommendation:** Use **Rapier** for best performance and features.

---

## Rapier Physics

Rapier is the fastest physics engine for Three.js.

### Installation

```bash
npm install @react-three/rapier
```

### Basic Setup

```jsx
import { Canvas } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';

function App() {
  return (
    <Canvas>
      <Physics gravity={[0, -9.81, 0]}>
        <Floor />
        <Box />
        <Sphere />
      </Physics>
    </Canvas>
  );
}
```

### Rigid Bodies

```jsx
import { RigidBody } from '@react-three/rapier';

// Dynamic (affected by gravity, collisions)
function DynamicBox() {
  return (
    <RigidBody position={[0, 5, 0]}>
      <mesh>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
    </RigidBody>
  );
}

// Static (immovable, like ground)
function Ground() {
  return (
    <RigidBody type="fixed">
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial />
      </mesh>
    </RigidBody>
  );
}

// Kinematic (controlled by code, not physics)
function MovingPlatform() {
  return (
    <RigidBody type="kinematicPosition">
      <mesh>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
    </RigidBody>
  );
}
```

### Colliders

```jsx
import { RigidBody, CuboidCollider, BallCollider } from '@react-three/rapier';

// Automatic collider (from geometry)
<RigidBody colliders="cuboid">
  <mesh>
    <boxGeometry />
    <meshStandardMaterial />
  </mesh>
</RigidBody>

// Manual collider
<RigidBody colliders={false}>
  <CuboidCollider args={[0.5, 0.5, 0.5]} />
  <mesh>
    <boxGeometry />
    <meshStandardMaterial />
  </mesh>
</RigidBody>

// Ball collider
<RigidBody colliders={false}>
  <BallCollider args={[0.5]} />
  <mesh>
    <sphereGeometry />
    <meshStandardMaterial />
  </mesh>
</RigidBody>

// Multiple colliders
<RigidBody colliders={false}>
  <CuboidCollider args={[1, 0.1, 1]} position={[0, 0, 0]} />
  <CuboidCollider args={[0.1, 1, 1]} position={[0, 1, 0]} />
  <mesh>
    <boxGeometry />
    <meshStandardMaterial />
  </mesh>
</RigidBody>
```

### Apply Forces

```jsx
import { useRef } from 'react';
import { RigidBody } from '@react-three/rapier';
import { useFrame } from '@react-three/fiber';

function BouncingBall() {
  const rigidBody = useRef();

  const jump = () => {
    rigidBody.current.applyImpulse({ x: 0, y: 5, z: 0 }, true);
  };

  return (
    <>
      <RigidBody ref={rigidBody} position={[0, 2, 0]}>
        <mesh>
          <sphereGeometry />
          <meshStandardMaterial />
        </mesh>
      </RigidBody>
      
      <button onClick={jump}>Jump</button>
    </>
  );
}

// Continuous force
function Propeller() {
  const rigidBody = useRef();

  useFrame(() => {
    rigidBody.current.applyTorqueImpulse({ x: 0, y: 0.01, z: 0 }, true);
  });

  return (
    <RigidBody ref={rigidBody}>
      <mesh>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
    </RigidBody>
  );
}
```

### Collision Events

```jsx
import { RigidBody } from '@react-three/rapier';

function CollisionDetector() {
  const handleCollision = (event) => {
    console.log('Collision with:', event.other.rigidBodyObject);
  };

  return (
    <RigidBody
      onCollisionEnter={handleCollision}
      onCollisionExit={() => console.log('Collision ended')}
      onIntersectionEnter={() => console.log('Sensor triggered')}
    >
      <mesh>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
    </RigidBody>
  );
}
```

### Physics Properties

```jsx
<RigidBody
  // Mass
  mass={1}
  
  // Friction (0 = ice, 1 = rubber)
  friction={0.5}
  
  // Bounciness (0 = no bounce, 1 = super bouncy)
  restitution={0.8}
  
  // Linear damping (air resistance for movement)
  linearDamping={0.5}
  
  // Angular damping (air resistance for rotation)
  angularDamping={0.5}
  
  // Lock axes
  enabledRotations={[true, false, true]}  // Lock Y rotation
  enabledTranslations={[true, true, false]}  // Lock Z movement
  
  // Continuous Collision Detection (for fast objects)
  ccd={true}
>
  <mesh>
    <sphereGeometry />
    <meshStandardMaterial />
  </mesh>
</RigidBody>
```

---

## Cannon-es Physics

Alternative physics engine (lighter than Rapier).

### Installation

```bash
npm install @react-three/cannon
```

### Basic Setup

```jsx
import { Canvas } from '@react-three/fiber';
import { Physics, useBox, usePlane } from '@react-three/cannon';

function Box() {
  const [ref] = useBox(() => ({
    mass: 1,
    position: [0, 5, 0],
  }));

  return (
    <mesh ref={ref}>
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  );
}

function Plane() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
  }));

  return (
    <mesh ref={ref}>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial />
    </mesh>
  );
}

function App() {
  return (
    <Canvas>
      <Physics>
        <Box />
        <Plane />
      </Physics>
    </Canvas>
  );
}
```

### Shapes

```jsx
import {
  useBox,
  useSphere,
  usePlane,
  useCylinder,
  useCompoundBody,
} from '@react-three/cannon';

// Box
const [boxRef] = useBox(() => ({
  mass: 1,
  position: [0, 5, 0],
}));

// Sphere
const [sphereRef] = useSphere(() => ({
  mass: 1,
  args: [0.5],  // radius
  position: [0, 5, 0],
}));

// Plane
const [planeRef] = usePlane(() => ({
  rotation: [-Math.PI / 2, 0, 0],
}));

// Cylinder
const [cylinderRef] = useCylinder(() => ({
  mass: 1,
  args: [0.5, 0.5, 2, 16],  // radiusTop, radiusBottom, height, segments
}));
```

### Apply Forces

```jsx
function Ball() {
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: [0, 5, 0],
  }));

  const jump = () => {
    api.velocity.set(0, 5, 0);
  };

  const push = () => {
    api.applyImpulse([0, 0, 5], [0, 0, 0]);
  };

  return (
    <>
      <mesh ref={ref}>
        <sphereGeometry />
        <meshStandardMaterial />
      </mesh>
      
      <button onClick={jump}>Jump</button>
      <button onClick={push}>Push</button>
    </>
  );
}
```

---

## React Three Fiber Integration

### Draggable Objects

```jsx
import { useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';

function DraggableBox() {
  const meshRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const { camera, gl } = useThree();

  const handlePointerDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    gl.domElement.style.cursor = 'grabbing';
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    gl.domElement.style.cursor = 'grab';
  };

  const handlePointerMove = (e) => {
    if (isDragging) {
      meshRef.current.position.copy(e.point);
    }
  };

  return (
    <mesh
      ref={meshRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => gl.domElement.style.cursor = 'grab'}
      onPointerLeave={() => gl.domElement.style.cursor = 'auto'}
    >
      <boxGeometry />
      <meshStandardMaterial color={isDragging ? 'hotpink' : 'gray'} />
    </mesh>
  );
}
```

### DragControls (drei)

```jsx
import { DragControls } from '@react-three/drei';

function Scene() {
  return (
    <DragControls>
      <mesh>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
    </DragControls>
  );
}
```

---

## Raycasting

Detect what the user is looking at or clicking.

### Manual Raycasting

```javascript
import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
  // Normalize mouse coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update raycaster
  raycaster.setFromCamera(mouse, camera);

  // Check intersections
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    const object = intersects[0].object;
    const point = intersects[0].point;
    
    console.log('Clicked:', object);
    console.log('At position:', point);
  }
});
```

### R3F Raycasting (Automatic)

```jsx
// Raycasting is built-in!
function ClickableBox() {
  const handleClick = (event) => {
    console.log('Clicked at:', event.point);
    console.log('Distance:', event.distance);
    console.log('Object:', event.object);
  };

  return (
    <mesh onClick={handleClick}>
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  );
}
```

### Raycast from Object

```jsx
import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function Scanner() {
  const meshRef = useRef();
  const { scene } = useThree();
  const raycaster = useRef(new THREE.Raycaster());

  useFrame(() => {
    if (!meshRef.current) return;

    // Raycast forward from object
    raycaster.current.set(
      meshRef.current.position,
      new THREE.Vector3(0, 0, -1)  // Direction
    );

    const intersects = raycaster.current.intersectObjects(scene.children);

    if (intersects.length > 0) {
      console.log('Detecting object ahead');
    }
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

## Collision Detection

Without full physics engine.

### Bounding Box Collision

```jsx
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function CollisionExample() {
  const box1Ref = useRef();
  const box2Ref = useRef();
  const bbox1 = useRef(new THREE.Box3());
  const bbox2 = useRef(new THREE.Box3());

  useFrame(() => {
    // Update bounding boxes
    bbox1.current.setFromObject(box1Ref.current);
    bbox2.current.setFromObject(box2Ref.current);

    // Check collision
    if (bbox1.current.intersectsBox(bbox2.current)) {
      console.log('Collision detected!');
      box1Ref.current.material.color.set('red');
    } else {
      box1Ref.current.material.color.set('white');
    }
  });

  return (
    <>
      <mesh ref={box1Ref} position={[0, 0, 0]}>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
      
      <mesh ref={box2Ref} position={[1, 0, 0]}>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
    </>
  );
}
```

### Distance-Based Collision

```jsx
function ProximityDetection() {
  const player = useRef();
  const enemy = useRef();

  useFrame(() => {
    const distance = player.current.position.distanceTo(
      enemy.current.position
    );

    if (distance < 2) {
      console.log('Enemy nearby!');
    }
  });

  return (
    <>
      <mesh ref={player} position={[0, 0, 0]}>
        <sphereGeometry />
        <meshStandardMaterial color="blue" />
      </mesh>
      
      <mesh ref={enemy} position={[5, 0, 0]}>
        <sphereGeometry />
        <meshStandardMaterial color="red" />
      </mesh>
    </>
  );
}
```

---

## Interactive Patterns

### Hover Highlight

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

### Click to Destroy

```jsx
function DestroyableBox() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <mesh onClick={() => setVisible(false)}>
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  );
}
```

### Grab and Throw

```jsx
import { RigidBody } from '@react-three/rapier';
import { useState, useRef } from 'react';

function ThrowableObject() {
  const rigidBody = useRef();
  const [grabbed, setGrabbed] = useState(false);

  const handlePointerDown = () => {
    setGrabbed(true);
    rigidBody.current.setBodyType('kinematicPosition');
  };

  const handlePointerUp = () => {
    setGrabbed(false);
    rigidBody.current.setBodyType('dynamic');
    
    // Apply throw force
    rigidBody.current.applyImpulse({ x: 0, y: 2, z: -5 }, true);
  };

  return (
    <RigidBody ref={rigidBody}>
      <mesh
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <sphereGeometry />
        <meshStandardMaterial color={grabbed ? 'yellow' : 'white'} />
      </mesh>
    </RigidBody>
  );
}
```

### Physics-Based Button

```jsx
function PhysicsButton({ onPress }) {
  const [pressed, setPressed] = useState(false);

  return (
    <RigidBody
      type="fixed"
      onCollisionEnter={() => {
        if (!pressed) {
          setPressed(true);
          onPress();
        }
      }}
      onCollisionExit={() => setPressed(false)}
    >
      <mesh position={[0, pressed ? -0.1 : 0, 0]}>
        <boxGeometry args={[1, 0.2, 1]} />
        <meshStandardMaterial color={pressed ? 'green' : 'red'} />
      </mesh>
    </RigidBody>
  );
}
```

---

## Complete Example: Interactive Physics Scene

```jsx
import { Canvas } from '@react-three/fiber';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import { OrbitControls } from '@react-three/drei';
import { useState } from 'react';

function Box({ position }) {
  const [hovered, setHovered] = useState(false);

  return (
    <RigidBody position={position} colliders="cuboid">
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry />
        <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
      </mesh>
    </RigidBody>
  );
}

function Floor() {
  return (
    <RigidBody type="fixed">
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="lightblue" />
      </mesh>
    </RigidBody>
  );
}

function App() {
  return (
    <Canvas camera={{ position: [5, 5, 5] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} />
      
      <Physics gravity={[0, -9.81, 0]}>
        <Floor />
        <Box position={[0, 5, 0]} />
        <Box position={[1, 6, 0]} />
        <Box position={[-1, 7, 0]} />
      </Physics>
      
      <OrbitControls />
    </Canvas>
  );
}
```

---

**Key Takeaways:**
- Rapier is fastest for production
- Cannon-es is lighter alternative
- R3F makes physics integration easy
- Raycasting built into R3F pointer events
- Physics adds realism and interactivity

**Next:** [Project Architecture](./11-PROJECT-ARCHITECTURE.md) →

