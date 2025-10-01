# Shader Programming with GLSL

**Custom Visual Effects with Vertex and Fragment Shaders**

---

## 📖 Table of Contents

1. [What are Shaders?](#what-are-shaders)
2. [GLSL Basics](#glsl-basics)
3. [Vertex Shaders](#vertex-shaders)
4. [Fragment Shaders](#fragment-shaders)
5. [Uniforms, Attributes, Varyings](#uniforms-attributes-varyings)
6. [Common Shader Patterns](#common-shader-patterns)
7. [ShaderMaterial in Three.js](#shadermaterial-in-threejs)
8. [Award-Winning Shader Techniques](#award-winning-shader-techniques)
9. [Resources & Learning](#resources--learning)

---

## What are Shaders?

Shaders are programs that run on the GPU to determine how vertices and pixels are rendered.

### Why Learn Shaders?

**Award-winning sites use custom shaders for:**
- Unique visual effects impossible with standard materials
- Performance (GPU is faster than CPU for parallel operations)
- Creative differentiation
- Organic, flowing animations
- Particle systems with millions of particles

### The Rendering Pipeline

```
3D Model Data
    ↓
VERTEX SHADER (runs per vertex)
    - Transforms vertex positions
    - Passes data to fragment shader
    ↓
RASTERIZATION (automatic)
    - Creates fragments (potential pixels)
    ↓
FRAGMENT SHADER (runs per pixel)
    - Determines pixel color
    - Applies lighting, textures, effects
    ↓
Final Pixels on Screen
```

---

## GLSL Basics

GLSL (OpenGL Shading Language) is a C-like language for writing shaders.

### Data Types

```glsl
// Scalars
float f = 1.0;
int i = 1;
bool b = true;

// Vectors
vec2 v2 = vec2(1.0, 2.0);        // 2D vector
vec3 v3 = vec3(1.0, 2.0, 3.0);   // 3D vector (RGB or XYZ)
vec4 v4 = vec4(1.0, 2.0, 3.0, 4.0); // 4D vector (RGBA or XYZW)

// Vector construction
vec3 color = vec3(1.0);           // All components = 1.0
vec3 position = vec3(v2, 1.0);    // Combine vec2 + float
vec4 rgba = vec4(color, 0.5);     // vec3 + alpha

// Accessing components
float x = v3.x;  // or v3.r or v3[0]
float y = v3.y;  // or v3.g or v3[1]
float z = v3.z;  // or v3.b or v3[2]

// Swizzling
vec2 xy = v3.xy;
vec3 bgr = color.bgr;  // Reverse RGB
vec2 xx = v2.xx;       // Duplicate x

// Matrices
mat2 m2 = mat2(1.0);   // 2x2 identity
mat3 m3 = mat3(1.0);   // 3x3 identity
mat4 m4 = mat4(1.0);   // 4x4 identity
```

### Built-in Functions

```glsl
// Math
float a = abs(-1.0);           // Absolute value
float m = min(1.0, 2.0);       // Minimum
float M = max(1.0, 2.0);       // Maximum
float c = clamp(x, 0.0, 1.0);  // Constrain to range
float s = sin(x);              // Sine
float p = pow(x, 2.0);         // Power
float e = exp(x);              // Exponential
float sq = sqrt(x);            // Square root

// Interpolation
float l = mix(a, b, 0.5);      // Linear interpolation
float sm = smoothstep(0.0, 1.0, x);  // Smooth interpolation
float st = step(0.5, x);       // 0 if x < edge, else 1

// Vector operations
float d = distance(p1, p2);    // Distance between points
float len = length(v);         // Vector length
vec3 n = normalize(v);         // Normalized vector
float dp = dot(v1, v2);        // Dot product
vec3 cp = cross(v1, v2);       // Cross product
vec3 r = reflect(I, N);        // Reflection

// Common patterns
float fract = fract(x);        // Fractional part
float floor = floor(x);        // Round down
float ceil = ceil(x);          // Round up
float mod = mod(x, 2.0);       // Modulo
```

---

## Vertex Shaders

Vertex shaders transform vertex positions.

### Basic Vertex Shader

```glsl
// Vertex Shader (vertex.glsl)

// Attributes (per-vertex data)
attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;

// Uniforms (same for all vertices)
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float time;

// Varyings (pass to fragment shader)
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  // Pass data to fragment shader
  vUv = uv;
  vNormal = normal;
  
  // Transform position
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  
  // Set final position
  gl_Position = projectedPosition;
}
```

### Vertex Displacement

```glsl
uniform float time;
uniform float amplitude;

void main() {
  vUv = uv;
  
  // Create wave displacement
  vec3 pos = position;
  float wave = sin(position.x * 2.0 + time) * amplitude;
  pos.y += wave;
  
  // Transform
  vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  
  gl_Position = projectedPosition;
}
```

### Twist Effect

```glsl
uniform float twist;

void main() {
  vec3 pos = position;
  
  float angle = twist * pos.y;
  float c = cos(angle);
  float s = sin(angle);
  
  mat2 rotation = mat2(c, -s, s, c);
  pos.xz = rotation * pos.xz;
  
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
}
```

---

## Fragment Shaders

Fragment shaders determine pixel colors.

### Basic Fragment Shader

```glsl
// Fragment Shader (fragment.glsl)

// Varyings from vertex shader
varying vec2 vUv;
varying vec3 vNormal;

// Uniforms
uniform vec3 color;
uniform float time;

void main() {
  // Set pixel color (RGBA)
  gl_FragColor = vec4(color, 1.0);
}
```

### UV-Based Gradient

```glsl
varying vec2 vUv;

void main() {
  // Horizontal gradient
  vec3 color = vec3(vUv.x);
  
  // Or vertical
  // vec3 color = vec3(vUv.y);
  
  // Or both
  // vec3 color = vec3(vUv.x, vUv.y, 0.0);
  
  gl_FragColor = vec4(color, 1.0);
}
```

### Animated Colors

```glsl
uniform float time;
varying vec2 vUv;

void main() {
  vec3 color = vec3(
    sin(time + vUv.x * 3.14159) * 0.5 + 0.5,
    sin(time + vUv.y * 3.14159) * 0.5 + 0.5,
    sin(time) * 0.5 + 0.5
  );
  
  gl_FragColor = vec4(color, 1.0);
}
```

### Circle Pattern

```glsl
varying vec2 vUv;

void main() {
  // Center UVs
  vec2 center = vUv - 0.5;
  
  // Distance from center
  float dist = length(center);
  
  // Create circle
  float circle = step(0.25, dist);  // 0 inside, 1 outside
  
  // Or smooth circle
  // float circle = smoothstep(0.24, 0.26, dist);
  
  gl_FragColor = vec4(vec3(circle), 1.0);
}
```

---

## Uniforms, Attributes, Varyings

### Uniforms

Values that are the same for all vertices/fragments.

```glsl
// In shader
uniform float time;
uniform vec3 color;
uniform sampler2D texture1;
```

```javascript
// In JavaScript
const material = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0.0 },
    color: { value: new THREE.Color(0xff0000) },
    texture1: { value: texture },
  },
  vertexShader,
  fragmentShader,
});

// Update in animation loop
material.uniforms.time.value = clock.getElapsedTime();
```

### Attributes

Per-vertex data (position, uv, normal, etc.).

```glsl
// Built-in attributes (automatic)
attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;

// Custom attributes
attribute float size;
attribute vec3 customColor;
```

```javascript
// Custom attribute in JavaScript
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array([...]);
const sizes = new Float32Array([1.0, 2.0, 1.5, ...]);

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
```

### Varyings

Pass data from vertex shader to fragment shader.

```glsl
// Vertex shader
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vPosition = position;
  // ...
}

// Fragment shader
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  // Use vUv and vPosition
  gl_FragColor = vec4(vPosition, 1.0);
}
```

---

## Common Shader Patterns

### Noise Functions

```glsl
// Simple pseudo-random
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// 2D noise
float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  
  vec2 u = f * f * (3.0 - 2.0 * f);
  
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// Usage
void main() {
  float n = noise(vUv * 5.0);
  gl_FragColor = vec4(vec3(n), 1.0);
}
```

### Fresnel Effect

```glsl
// Vertex shader
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vViewPosition = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}

// Fragment shader
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vec3 viewDir = normalize(vViewPosition);
  float fresnel = pow(1.0 - dot(viewDir, vNormal), 3.0);
  
  vec3 color = mix(vec3(0.0, 0.0, 1.0), vec3(1.0), fresnel);
  gl_FragColor = vec4(color, 1.0);
}
```

### Holographic Effect

```glsl
uniform float time;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  // Rainbow stripes
  float stripes = sin(vUv.y * 50.0 + time * 2.0);
  
  // Rainbow colors
  vec3 color1 = vec3(1.0, 0.0, 1.0);  // Magenta
  vec3 color2 = vec3(0.0, 1.0, 1.0);  // Cyan
  vec3 color = mix(color1, color2, stripes);
  
  // Fresnel
  vec3 viewDir = normalize(cameraPosition - vPosition);
  float fresnel = pow(1.0 - dot(viewDir, vNormal), 2.0);
  
  color *= fresnel;
  
  gl_FragColor = vec4(color, 1.0);
}
```

### Dissolve Effect

```glsl
uniform float dissolve;  // 0 to 1
uniform sampler2D noiseTexture;
varying vec2 vUv;

void main() {
  float noise = texture2D(noiseTexture, vUv).r;
  
  if (noise < dissolve) {
    discard;  // Don't render this pixel
  }
  
  // Edge glow
  float edge = smoothstep(dissolve, dissolve + 0.05, noise);
  vec3 glowColor = vec3(1.0, 0.5, 0.0);
  vec3 baseColor = vec3(1.0);
  
  vec3 color = mix(glowColor, baseColor, edge);
  
  gl_FragColor = vec4(color, 1.0);
}
```

---

## ShaderMaterial in Three.js

### Basic Setup

```javascript
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float time;
  varying vec2 vUv;
  
  void main() {
    vec3 color = vec3(vUv.x, vUv.y, sin(time) * 0.5 + 0.5);
    gl_FragColor = vec4(color, 1.0);
  }
`;

const material = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0.0 },
  },
  vertexShader,
  fragmentShader,
});

// Update in animation loop
function animate() {
  material.uniforms.time.value = clock.getElapsedTime();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
```

### With External Files

```javascript
// Load shaders from files
const loader = new THREE.FileLoader();

Promise.all([
  loader.loadAsync('/shaders/vertex.glsl'),
  loader.loadAsync('/shaders/fragment.glsl'),
]).then(([vertexShader, fragmentShader]) => {
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      time: { value: 0.0 },
    },
  });
  
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
});
```

### React Three Fiber

```jsx
import { shaderMaterial } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import { useRef } from 'react';

// Create shader material
const WaveMaterial = shaderMaterial(
  // Uniforms
  {
    time: 0,
    color: new THREE.Color(0.2, 0.0, 0.1),
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    uniform float time;
    
    void main() {
      vUv = uv;
      vec3 pos = position;
      pos.z += sin(pos.x * 2.0 + time) * 0.1;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform vec3 color;
    varying vec2 vUv;
    
    void main() {
      gl_FragColor = vec4(color * vUv.x, 1.0);
    }
  `
);

// Make it available as <waveMaterial />
extend({ WaveMaterial });

// Use in component
function WavePlane() {
  const ref = useRef();
  
  useFrame((state) => {
    ref.current.time = state.clock.elapsedTime;
  });
  
  return (
    <mesh>
      <planeGeometry args={[2, 2, 32, 32]} />
      <waveMaterial ref={ref} />
    </mesh>
  );
}
```

---

## Award-Winning Shader Techniques

### 1. Vertex Displacement Waves

```glsl
// Vertex
uniform float time;
uniform float frequency;
uniform float amplitude;

void main() {
  vec3 pos = position;
  
  float wave = sin(pos.x * frequency + time) * 
               sin(pos.y * frequency + time) * 
               amplitude;
  pos.z += wave;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
```

### 2. Gradient Mapping

```glsl
// Fragment
uniform vec3 color1;
uniform vec3 color2;
varying vec2 vUv;

void main() {
  vec3 color = mix(color1, color2, vUv.y);
  gl_FragColor = vec4(color, 1.0);
}
```

### 3. Time-Based Morphing

```glsl
// Vertex
uniform float time;

void main() {
  vec3 pos = position;
  
  // Morph between sphere and cube
  float morphFactor = sin(time) * 0.5 + 0.5;
  
  // Sphere shape
  vec3 spherePos = normalize(position);
  
  // Mix
  pos = mix(position, spherePos, morphFactor);
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
```

### 4. Voronoi Pattern

```glsl
vec2 random2(vec2 p) {
  return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
}

float voronoi(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  
  float minDist = 1.0;
  
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 neighbor = vec2(float(x), float(y));
      vec2 point = random2(i + neighbor);
      vec2 diff = neighbor + point - f;
      float dist = length(diff);
      minDist = min(minDist, dist);
    }
  }
  
  return minDist;
}

void main() {
  float pattern = voronoi(vUv * 10.0);
  gl_FragColor = vec4(vec3(pattern), 1.0);
}
```

---

## Resources & Learning

### Essential Learning

**The Book of Shaders**
- https://thebookofshaders.com/
- *THE best shader tutorial*
- Free, comprehensive, interactive

**ShaderToy**
- https://www.shadertoy.com/
- Thousands of shader examples
- Learn by studying others' code

**Maxime Heckel's Shader Articles**
- "The Study of Shaders with React Three Fiber"
- "On Crafting Painterly Shaders"
- "Refraction, Dispersion, and Other Shader Light Effects"

### Tools

**Shader Editors**
- **ShaderToy**: Online editor
- **GLSL Canvas**: VS Code extension
- **KodeLife**: Desktop editor
- **ISF Editor**: Interactive Shader Format

### Reference

**GLSL Reference**
- https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language
- Official spec and reference

**Three.js Shader Examples**
- https://threejs.org/examples/?q=shader

---

**Key Takeaways:**
- Shaders run on GPU for performance
- Vertex shaders transform geometry
- Fragment shaders determine pixel colors
- Start with simple effects, build complexity
- Study ShaderToy for inspiration

**Next:** [Performance Optimization](./04-PERFORMANCE-OPTIMIZATION.md) →

