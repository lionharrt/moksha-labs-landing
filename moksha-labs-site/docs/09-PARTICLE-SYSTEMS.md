# Particle Systems

**Create Stunning Effects with Thousands of Particles**

---

## 📖 Table of Contents

1. [What are Particle Systems?](#what-are-particle-systems)
2. [Basic Points](#basic-points)
3. [GPU Particles with Shaders](#gpu-particles-with-shaders)
4. [Instanced Particles](#instanced-particles)
5. [drei Helpers](#drei-helpers)
6. [Particle Effects Library](#particle-effects-library)
7. [Performance Optimization](#performance-optimization)
8. [Award-Winning Examples](#award-winning-examples)

---

## What are Particle Systems?

Particle systems render thousands/millions of small elements efficiently.

### Common Uses

- ✨ Magic effects, sparkles
- 🌟 Stars, galaxies
- 💨 Smoke, dust, fog
- 🔥 Fire, explosions
- 💧 Rain, snow, water
- 🎆 Fireworks
- 🌌 Abstract backgrounds

### Performance Key

**CPU Particles:** Each particle = separate calculation (slow, ~1000 max)  
**GPU Particles:** Parallel processing on graphics card (fast, millions possible)

---

## Basic Points

Three.js Points system - simplest particle approach.

### Simple Particle Cloud

```javascript
import * as THREE from 'three';

// Create geometry
const particlesGeometry = new THREE.BufferGeometry();
const count = 5000;

// Generate random positions
const positions = new Float32Array(count * 3);  // x, y, z for each particle

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
}

particlesGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positions, 3)
);

// Create material
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.02,
  color: '#ffffff',
  transparent: true,
  alphaMap: texture,  // Optional: custom particle shape
  depthWrite: false,  // Prevent z-fighting
});

// Create points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);
```

### With Texture

```javascript
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load('/particle.png');

const material = new THREE.PointsMaterial({
  size: 0.1,
  map: particleTexture,
  transparent: true,
  alphaMap: particleTexture,
  depthWrite: false,
  blending: THREE.AdditiveBlending,  // Glow effect
});
```

### Animated Particles

```javascript
function animate() {
  const elapsedTime = clock.getElapsedTime();

  // Rotate entire system
  particles.rotation.y = elapsedTime * 0.05;

  // Or animate individual particles (slow!)
  const positions = particles.geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 1] = Math.sin(elapsedTime + positions[i]);
  }
  particles.geometry.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
```

---

## GPU Particles with Shaders

Custom shaders for high-performance particles.

### Vertex Shader Animation

```glsl
// Vertex Shader
uniform float time;
uniform float size;
attribute float scale;
attribute vec3 customColor;

varying vec3 vColor;

void main() {
  vColor = customColor;
  
  vec3 pos = position;
  
  // Wave motion
  pos.y += sin(time + position.x * 3.0) * 0.5;
  
  // Transform position
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  
  // Size based on distance
  gl_PointSize = size * scale * (300.0 / -mvPosition.z);
  
  gl_Position = projectionMatrix * mvPosition;
}
```

```glsl
// Fragment Shader
uniform sampler2D pointTexture;
varying vec3 vColor;

void main() {
  // Circular particle
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);
  
  if (dist > 0.5) discard;  // Make circular
  
  float alpha = 1.0 - (dist * 2.0);  // Fade to edges
  
  gl_FragColor = vec4(vColor, alpha);
}
```

### ShaderMaterial Setup

```javascript
const particlesMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
    size: { value: 30.0 },
    pointTexture: { value: texture },
  },
  vertexShader,
  fragmentShader,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

// Update in animation loop
particlesMaterial.uniforms.time.value = clock.getElapsedTime();
```

### Custom Attributes

```javascript
const count = 5000;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);
const scales = new Float32Array(count);

for (let i = 0; i < count; i++) {
  // Positions
  positions[i * 3] = (Math.random() - 0.5) * 10;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  
  // Random colors
  colors[i * 3] = Math.random();
  colors[i * 3 + 1] = Math.random();
  colors[i * 3 + 2] = Math.random();
  
  // Random sizes
  scales[i] = Math.random();
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
```

---

## Instanced Particles

Best performance for 3D particles (actual geometry).

### Using InstancedMesh

```javascript
const count = 1000;
const geometry = new THREE.SphereGeometry(0.05, 8, 8);
const material = new THREE.MeshStandardMaterial({ color: 'hotpink' });

const instancedMesh = new THREE.InstancedMesh(geometry, material, count);

// Set transforms for each instance
const dummy = new THREE.Object3D();

for (let i = 0; i < count; i++) {
  dummy.position.set(
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10
  );
  
  dummy.rotation.set(
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI
  );
  
  const scale = Math.random();
  dummy.scale.set(scale, scale, scale);
  
  dummy.updateMatrix();
  instancedMesh.setMatrixAt(i, dummy.matrix);
}

instancedMesh.instanceMatrix.needsUpdate = true;
scene.add(instancedMesh);
```

### Animated Instances

```javascript
function animate() {
  const time = clock.getElapsedTime();
  
  for (let i = 0; i < count; i++) {
    // Get current matrix
    instancedMesh.getMatrixAt(i, dummy.matrix);
    dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
    
    // Update
    dummy.position.y += Math.sin(time + i) * 0.01;
    dummy.rotation.y += 0.01;
    
    // Set new matrix
    dummy.updateMatrix();
    instancedMesh.setMatrixAt(i, dummy.matrix);
  }
  
  instancedMesh.instanceMatrix.needsUpdate = true;
  
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
```

---

## drei Helpers

React Three Fiber makes particles easier.

### Simple Particles

```jsx
import { Points, PointMaterial } from '@react-three/drei';
import { useMemo } from 'react';

function ParticleCloud() {
  const particles = useMemo(() => {
    const positions = new Float32Array(5000 * 3);
    
    for (let i = 0; i < positions.length; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
    }
    
    return positions;
  }, []);

  return (
    <Points positions={particles} stride={3}>
      <PointMaterial
        size={0.02}
        color="#ffffff"
        transparent
        depthWrite={false}
        sizeAttenuation
      />
    </Points>
  );
}
```

### Instanced Particles

```jsx
import { Instances, Instance } from '@react-three/drei';

function InstancedParticles() {
  return (
    <Instances limit={1000}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshStandardMaterial />
      
      {Array.from({ length: 1000 }, (_, i) => (
        <Instance
          key={i}
          position={[
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
          ]}
          scale={Math.random()}
        />
      ))}
    </Instances>
  );
}
```

### Animated Instanced Particles

```jsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function AnimatedParticle({ index, ...props }) {
  const ref = useRef();
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    ref.current.position.y = Math.sin(time + index) * 2;
    ref.current.rotation.y = time + index;
  });
  
  return <Instance ref={ref} {...props} />;
}

function ParticleSystem() {
  return (
    <Instances limit={1000}>
      <boxGeometry />
      <meshStandardMaterial />
      
      {Array.from({ length: 1000 }, (_, i) => (
        <AnimatedParticle
          key={i}
          index={i}
          position={[
            (Math.random() - 0.5) * 10,
            0,
            (Math.random() - 0.5) * 10,
          ]}
        />
      ))}
    </Instances>
  );
}
```

---

## Particle Effects Library

Common particle effect patterns.

### Galaxy

```jsx
function Galaxy() {
  const particles = useMemo(() => {
    const count = 10000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const colorInside = new THREE.Color('#ff6030');
    const colorOutside = new THREE.Color('#1b3984');
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Spiral galaxy shape
      const radius = Math.random() * 5;
      const spinAngle = radius * 0.5;
      const branchAngle = (i % 3) / 3 * Math.PI * 2;
      
      positions[i3] = Math.cos(branchAngle + spinAngle) * radius;
      positions[i3 + 1] = (Math.random() - 0.5) * 0.3;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius;
      
      // Random offset
      positions[i3] += (Math.random() - 0.5) * 0.5;
      positions[i3 + 1] += (Math.random() - 0.5) * 0.5;
      positions[i3 + 2] += (Math.random() - 0.5) * 0.5;
      
      // Color based on distance
      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, radius / 5);
      
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }
    
    return { positions, colors };
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.01}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}
```

### Floating Particles

```jsx
function FloatingParticles() {
  const pointsRef = useRef();
  
  const particles = useMemo(() => {
    const count = 1000;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20;
    }
    
    return positions;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const time = state.clock.elapsedTime;
    const positions = pointsRef.current.geometry.attributes.position.array;
    
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const z = positions[i + 2];
      
      positions[i + 1] += Math.sin(time + x) * 0.001;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.6}
        depthWrite={false}
      />
    </points>
  );
}
```

### Fire Effect

```jsx
function FireParticles() {
  const particlesRef = useRef();
  
  useFrame((state) => {
    if (!particlesRef.current) return;
    
    const positions = particlesRef.current.geometry.attributes.position.array;
    
    for (let i = 0; i < positions.length; i += 3) {
      // Move upward
      positions[i + 1] += 0.02;
      
      // Spread outward
      positions[i] += (Math.random() - 0.5) * 0.01;
      positions[i + 2] += (Math.random() - 0.5) * 0.01;
      
      // Reset when too high
      if (positions[i + 1] > 3) {
        positions[i] = (Math.random() - 0.5) * 0.5;
        positions[i + 1] = 0;
        positions[i + 2] = (Math.random() - 0.5) * 0.5;
      }
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const particles = useMemo(() => {
    const count = 1000;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.5;
      positions[i * 3 + 1] = Math.random() * 3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
    
    return positions;
  }, []);

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#ff4400"
        transparent
        opacity={0.8}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
```

---

## Performance Optimization

### Best Practices

```javascript
// ✅ Use GPU for calculations
// Move logic to vertex shader instead of CPU

// ✅ Reuse geometries and materials
const sharedGeometry = new THREE.SphereGeometry(0.05);
const sharedMaterial = new THREE.MeshStandardMaterial();

// ✅ Use InstancedMesh for 3D particles
// Up to 100x faster than separate meshes

// ✅ Limit particle count based on device
const maxParticles = isMobile ? 1000 : 10000;

// ✅ Use depthWrite: false for transparent particles
material.depthWrite = false;

// ✅ Disable frustum culling for large particle systems
particles.frustumCulled = false;

// ✅ Use lower-poly geometry for instanced particles
// Icosahedron instead of sphere
const geometry = new THREE.IcosahedronGeometry(0.05, 0);

// ✅ Dispose when done
geometry.dispose();
material.dispose();
```

### LOD for Particles

```javascript
// Show fewer particles when far away
const distance = camera.position.distanceTo(particles.position);

if (distance > 20) {
  particles.visible = false;
} else if (distance > 10) {
  // Show 50% of particles
  const count = originalCount * 0.5;
  particles.geometry.setDrawRange(0, count);
} else {
  particles.geometry.setDrawRange(0, originalCount);
}
```

---

## Award-Winning Examples

### 1. Interactive Particle Field

Mouse-reactive particles:

```jsx
function InteractiveParticles() {
  const pointsRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const positions = pointsRef.current.geometry.attributes.position.array;
    
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      
      const dx = mouse.current.x * 5 - x;
      const dy = mouse.current.y * 5 - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 2) {
        positions[i] -= dx * 0.02;
        positions[i + 1] -= dy * 0.02;
      }
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  // ... rest of component
}
```

### 2. Morphing Particle Cloud

```jsx
// Morph between sphere and cube
function MorphingParticles() {
  const pointsRef = useRef();
  const originalPositions = useRef([]);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const morphProgress = (Math.sin(time * 0.5) + 1) / 2;
    
    const positions = pointsRef.current.geometry.attributes.position.array;
    
    for (let i = 0; i < positions.length; i += 3) {
      const spherePos = originalPositions.current[i];
      const cubePos = /* calculate cube position */;
      
      positions[i] = spherePos + (cubePos - spherePos) * morphProgress;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });
  
  // ... rest
}
```

---

**Key Takeaways:**
- Use GPU for best performance
- Points for simple 2D particles
- InstancedMesh for 3D particles
- Custom shaders for advanced effects
- Test particle count on target devices

**Next:** [Physics & Interactions](./10-PHYSICS-INTERACTIONS.md) →

