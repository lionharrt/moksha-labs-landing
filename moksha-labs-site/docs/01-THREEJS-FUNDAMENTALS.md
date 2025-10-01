# Three.js Fundamentals

**Core Concepts for 3D Web Development**

---

## 📖 Table of Contents

1. [What is Three.js?](#what-is-threejs)
2. [Core Architecture](#core-architecture)
3. [Scene Setup](#scene-setup)
4. [Camera Types](#camera-types)
5. [Geometry](#geometry)
6. [Materials](#materials)
7. [Lighting](#lighting)
8. [Textures](#textures)
9. [Animation Loop](#animation-loop)
10. [Best Practices](#best-practices)

---

## What is Three.js?

Three.js is a JavaScript library that abstracts WebGL complexity, making 3D graphics accessible to web developers.

### Why Three.js?
- **Abstracts WebGL**: No need to write raw WebGL code
- **Powerful API**: Comprehensive 3D toolkit
- **Active Community**: Extensive resources and examples
- **Performance**: Hardware-accelerated 3D rendering
- **Cross-Platform**: Works everywhere WebGL is supported

### WebGL vs Three.js

```javascript
// Raw WebGL: ~100+ lines for a simple cube
// Three.js: ~20 lines for the same result

// Three.js makes complex 3D development practical
```

---

## Core Architecture

Three.js has 5 fundamental concepts that every scene needs:

```javascript
import * as THREE from 'three';

// 1. SCENE - Container for all 3D objects
const scene = new THREE.Scene();

// 2. CAMERA - Defines the viewpoint
const camera = new THREE.PerspectiveCamera(
  75,                                    // Field of view
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1,                                   // Near clipping plane
  1000                                   // Far clipping plane
);

// 3. RENDERER - Draws the scene to canvas
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#canvas'),
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 4. GEOMETRY + MATERIAL = MESH
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 5. ANIMATION LOOP - Continuously renders the scene
function animate() {
  requestAnimationFrame(animate);
  
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  
  renderer.render(scene, camera);
}
animate();
```

---

## Scene Setup

The Scene is the container for all your 3D objects, lights, and cameras.

### Creating and Configuring a Scene

```javascript
const scene = new THREE.Scene();

// Set background color
scene.background = new THREE.Color(0x000000);

// Or use a texture/HDR for background
const loader = new THREE.TextureLoader();
scene.background = loader.load('path/to/image.jpg');

// Add fog for depth perception
scene.fog = new THREE.Fog(0x000000, 10, 50);
// OR exponential fog
scene.fog = new THREE.FogExp2(0x000000, 0.01);
```

### Scene Graph Hierarchy

```javascript
// Objects can be nested for relative positioning
const group = new THREE.Group();

const sphere1 = new THREE.Mesh(sphereGeometry, material1);
const sphere2 = new THREE.Mesh(sphereGeometry, material2);

sphere2.position.x = 2; // Relative to group

group.add(sphere1);
group.add(sphere2);
scene.add(group);

// Rotating the group rotates all children
group.rotation.y = Math.PI / 4;
```

---

## Camera Types

### PerspectiveCamera (Most Common)

Mimics human eye - objects get smaller with distance.

```javascript
const camera = new THREE.PerspectiveCamera(
  fov,    // Field of view (degrees)
  aspect, // Aspect ratio (width/height)
  near,   // Near clipping plane
  far     // Far clipping plane
);

// Typical settings
const camera = new THREE.PerspectiveCamera(
  75,                                    // Wide FOV for immersive feel
  window.innerWidth / window.innerHeight,
  0.1,                                   // Don't make this too small
  1000                                   // Don't make this too large
);

// Position the camera
camera.position.z = 5;
camera.position.y = 2;
camera.lookAt(0, 0, 0); // Point at origin
```

**FOV Guidelines:**
- `35-50`: Narrow (architectural, product shots)
- `50-75`: Normal (general use)
- `75-90`: Wide (immersive, dramatic)

### OrthographicCamera

No perspective - objects stay same size regardless of distance.

```javascript
const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.OrthographicCamera(
  -aspect,  // left
  aspect,   // right
  1,        // top
  -1,       // bottom
  0.1,      // near
  1000      // far
);

// Useful for: 2D games, UI overlays, technical drawings
```

### Camera Best Practices

```javascript
// ✅ Always update aspect ratio on resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix(); // CRITICAL!
  
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ✅ Keep near plane as large as possible (0.1 minimum)
// ✅ Keep far plane as small as possible (optimize rendering)
// ❌ Never use near: 0.001, far: 100000 (Z-fighting issues)
```

---

## Geometry

Geometry defines the shape of your 3D objects.

### Built-in Geometries

```javascript
// Box (cube or rectangular prism)
const box = new THREE.BoxGeometry(width, height, depth);

// Sphere
const sphere = new THREE.SphereGeometry(
  radius,
  widthSegments,  // More = smoother (32 is good)
  heightSegments
);

// Plane (flat surface)
const plane = new THREE.PlaneGeometry(width, height);

// Torus (donut)
const torus = new THREE.TorusGeometry(
  radius,
  tubeRadius,
  radialSegments,
  tubularSegments
);

// Cylinder
const cylinder = new THREE.CylinderGeometry(
  radiusTop,
  radiusBottom,
  height,
  radialSegments
);
```

### Custom Geometry

```javascript
// Manual vertex creation
const geometry = new THREE.BufferGeometry();

// Define vertices (triangles)
const vertices = new Float32Array([
  -1.0, -1.0,  1.0,  // vertex 1
   1.0, -1.0,  1.0,  // vertex 2
   1.0,  1.0,  1.0,  // vertex 3
]);

geometry.setAttribute(
  'position',
  new THREE.BufferAttribute(vertices, 3) // 3 values per vertex (x, y, z)
);

// Define normals for lighting
const normals = new Float32Array([
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
]);

geometry.setAttribute(
  'normal',
  new THREE.BufferAttribute(normals, 3)
);

// Define UVs for textures
const uvs = new Float32Array([
  0, 0,
  1, 0,
  1, 1,
]);

geometry.setAttribute(
  'uv',
  new THREE.BufferAttribute(uvs, 2) // 2 values per vertex (u, v)
);
```

### Geometry Tips

```javascript
// ✅ Dispose of geometry when done
geometry.dispose();

// ✅ Use lower segment counts for better performance
// 8-16 segments usually sufficient for spheres in the background
// 32-64 segments for hero objects

// ✅ Compute normals for lighting
geometry.computeVertexNormals();

// ✅ Center geometry for easier transforms
geometry.center();
```

---

## Materials

Materials define how geometry surfaces appear.

### Basic Materials Overview

```javascript
// 1. MeshBasicMaterial - No lighting, flat color
const basic = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: false,
  transparent: false,
  opacity: 1.0
});
// Use for: UI elements, unlit objects

// 2. MeshStandardMaterial - PBR (Physically Based Rendering)
const standard = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 0.5,    // 0 = dielectric, 1 = metal
  roughness: 0.5,    // 0 = smooth, 1 = rough
  envMapIntensity: 1.0
});
// Use for: Most realistic objects (RECOMMENDED)

// 3. MeshPhysicalMaterial - Advanced PBR
const physical = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0.0,
  roughness: 0.0,
  transmission: 1.0,   // Glass-like transparency
  thickness: 0.5,
  clearcoat: 1.0,      // Car paint effect
  clearcoatRoughness: 0.0
});
// Use for: Glass, car paint, advanced materials

// 4. MeshLambertMaterial - Simple diffuse lighting
const lambert = new THREE.MeshLambertMaterial({
  color: 0xff0000
});
// Use for: Performance-critical scenes

// 5. MeshPhongMaterial - Specular highlights
const phong = new THREE.MeshPhongMaterial({
  color: 0xff0000,
  shininess: 100
});
// Use for: Shiny objects (older, use Standard instead)
```

### Material Properties Deep Dive

```javascript
const material = new THREE.MeshStandardMaterial({
  // Color
  color: 0xffffff,           // Base color
  
  // PBR Properties
  metalness: 0.5,            // How metal-like (0-1)
  roughness: 0.5,            // Surface roughness (0-1)
  
  // Maps (Textures)
  map: colorTexture,         // Diffuse/albedo map
  normalMap: normalTexture,  // Surface detail
  roughnessMap: roughTexture,// Roughness variation
  metalnessMap: metalTexture,// Metalness variation
  aoMap: aoTexture,          // Ambient occlusion
  displacementMap: dispTexture, // Actual geometry displacement
  displacementScale: 0.1,
  
  // Transparency
  transparent: true,
  opacity: 0.5,              // 0 = invisible, 1 = opaque
  alphaMap: alphaTexture,    // Transparency map
  
  // Rendering
  side: THREE.FrontSide,     // FrontSide, BackSide, DoubleSide
  flatShading: false,        // Faceted look
  wireframe: false,
  
  // Environment
  envMap: hdrTexture,        // Reflection map
  envMapIntensity: 1.0,
});
```

### Material Best Practices

```javascript
// ✅ Reuse materials when possible
const sharedMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const mesh1 = new THREE.Mesh(geometry1, sharedMaterial);
const mesh2 = new THREE.Mesh(geometry2, sharedMaterial);

// ✅ Dispose of materials when done
material.dispose();

// ✅ Use Standard or Physical for realistic rendering
// ❌ Avoid Basic/Lambert for final production (unless intentional style)

// ✅ Use rough metalness values for variety
// metal: 0 = dielectric (plastic, wood), 1 = metal
// roughness: 0 = mirror, 1 = matte

// ✅ Always use DoubleSide cautiously (performance cost)
// Only when actually needed (planes, thin objects)
```

---

## Lighting

Proper lighting is crucial for realistic 3D scenes.

### Light Types

```javascript
// 1. AmbientLight - Global illumination
const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);
// Affects all objects equally, no shadows
// Use for: Base lighting level

// 2. DirectionalLight - Sun-like parallel light
const directional = new THREE.DirectionalLight(0xffffff, 1);
directional.position.set(5, 10, 5);
directional.castShadow = true;
scene.add(directional);
// Use for: Sunlight, main light source

// 3. PointLight - Light bulb (radiates in all directions)
const point = new THREE.PointLight(0xffffff, 1, 100);
point.position.set(0, 10, 0);
scene.add(point);
// Parameters: color, intensity, distance (0 = infinite), decay
// Use for: Lamps, localized lighting

// 4. SpotLight - Flashlight/stage light
const spot = new THREE.SpotLight(0xffffff, 1);
spot.position.set(10, 20, 10);
spot.angle = Math.PI / 6;      // Cone angle
spot.penumbra = 0.1;           // Edge softness (0-1)
spot.decay = 2;
spot.distance = 100;
spot.castShadow = true;
scene.add(spot);
// Use for: Dramatic lighting, stage effects

// 5. HemisphereLight - Sky and ground lighting
const hemi = new THREE.HemisphereLight(
  0xffffbb,  // Sky color
  0x080820,  // Ground color
  1          // Intensity
);
scene.add(hemi);
// Use for: Outdoor scenes, natural lighting
```

### Lighting Setup Patterns

```javascript
// THREE-POINT LIGHTING (Classic setup)
function setupThreePointLighting(scene, target) {
  // Key light (main)
  const keyLight = new THREE.DirectionalLight(0xffffff, 1);
  keyLight.position.set(5, 10, 7);
  
  // Fill light (soften shadows)
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
  fillLight.position.set(-5, 0, 2);
  
  // Back light (rim lighting)
  const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
  backLight.position.set(0, 5, -10);
  
  scene.add(keyLight, fillLight, backLight);
}

// AWARD-WINNING SITE PATTERN
function setupAwardWinningLighting(scene) {
  // Low ambient for drama
  const ambient = new THREE.AmbientLight(0xffffff, 0.2);
  
  // One strong directional
  const main = new THREE.DirectionalLight(0xffffff, 0.8);
  main.position.set(10, 20, 10);
  
  // Colored accent lights
  const accent1 = new THREE.PointLight(0x00ffff, 0.5, 50);
  accent1.position.set(-10, 5, -10);
  
  const accent2 = new THREE.PointLight(0xff00ff, 0.5, 50);
  accent2.position.set(10, 5, -10);
  
  scene.add(ambient, main, accent1, accent2);
}
```

### Shadows

```javascript
// Enable shadows in renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadows

// Make light cast shadows
const light = new THREE.DirectionalLight(0xffffff, 1);
light.castShadow = true;

// Shadow camera settings (for directional light)
light.shadow.camera.left = -10;
light.shadow.camera.right = 10;
light.shadow.camera.top = 10;
light.shadow.camera.bottom = -10;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 50;

// Shadow resolution (higher = better quality, worse performance)
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;

// Bias to prevent shadow acne
light.shadow.bias = -0.001;

// Make objects cast and receive shadows
mesh.castShadow = true;
mesh.receiveShadow = true;
```

---

## Textures

Textures add detail without geometry complexity.

### Loading Textures

```javascript
const textureLoader = new THREE.TextureLoader();

// Simple loading
const texture = textureLoader.load('/path/to/texture.jpg');

// With callbacks
const texture = textureLoader.load(
  '/path/to/texture.jpg',
  // onLoad
  (texture) => {
    console.log('Texture loaded');
  },
  // onProgress
  (xhr) => {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  // onError
  (error) => {
    console.error('Error loading texture', error);
  }
);

// Apply to material
const material = new THREE.MeshStandardMaterial({
  map: texture
});
```

### Texture Properties

```javascript
const texture = textureLoader.load('/texture.jpg');

// Wrapping (how texture repeats)
texture.wrapS = THREE.RepeatWrapping;  // Horizontal
texture.wrapT = THREE.RepeatWrapping;  // Vertical
// Options: RepeatWrapping, ClampToEdgeWrapping, MirroredRepeatWrapping

// Repeat
texture.repeat.set(2, 2);  // Repeat 2x horizontally and vertically

// Offset
texture.offset.set(0.5, 0.5);  // Shift texture

// Rotation (around bottom-left corner)
texture.rotation = Math.PI / 4;  // 45 degrees

// Center point for rotation
texture.center.set(0.5, 0.5);  // Center of texture

// Filtering (how texture is sampled)
texture.minFilter = THREE.LinearMipmapLinearFilter;  // When far away
texture.magFilter = THREE.LinearFilter;               // When close up

// Anisotropic filtering (sharper at angles)
texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
```

### Texture Types

```javascript
const material = new THREE.MeshStandardMaterial({
  // Color/Albedo map
  map: colorTexture,
  
  // Normal map (fake surface detail)
  normalMap: normalTexture,
  normalScale: new THREE.Vector2(1, 1),
  
  // Roughness map (how shiny surface is)
  roughnessMap: roughnessTexture,
  roughness: 0.5,  // Multiplier
  
  // Metalness map
  metalnessMap: metalnessTexture,
  metalness: 0.5,  // Multiplier
  
  // Ambient Occlusion (darkens crevices)
  aoMap: aoTexture,
  aoMapIntensity: 1.0,
  
  // Displacement map (actual geometry displacement)
  displacementMap: displacementTexture,
  displacementScale: 0.1,
  
  // Emissive map (self-illumination)
  emissiveMap: emissiveTexture,
  emissive: new THREE.Color(0xffffff),
  emissiveIntensity: 1.0,
  
  // Alpha map (transparency)
  alphaMap: alphaTexture,
  transparent: true,
});

// NOTE: AO map requires second UV channel
// geometry.setAttribute('uv2', geometry.attributes.uv);
```

### Texture Best Practices

```javascript
// ✅ Use power-of-two dimensions (512, 1024, 2048)
// Better performance and mipmapping

// ✅ Compress textures
// Use JPEG for color maps
// Use PNG for alpha maps
// Use KTX2 for optimal loading

// ✅ Dispose of textures when done
texture.dispose();

// ✅ Use LoadingManager for multiple textures
const loadingManager = new THREE.LoadingManager();
loadingManager.onLoad = () => console.log('All loaded');
const loader = new THREE.TextureLoader(loadingManager);

// ✅ Optimize texture size
// 1024x1024 is usually sufficient
// 2048x2048 for hero objects
// 512x512 for background objects
```

---

## Animation Loop

The animation loop renders your scene continuously.

### Basic Loop

```javascript
function animate() {
  requestAnimationFrame(animate);
  
  // Update objects
  cube.rotation.y += 0.01;
  
  // Render scene
  renderer.render(scene, camera);
}
animate();
```

### Delta Time for Smooth Animation

```javascript
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  const deltaTime = clock.getDelta();  // Time since last frame
  const elapsedTime = clock.getElapsedTime();  // Total time
  
  // Frame-rate independent animation
  cube.rotation.y += 1.0 * deltaTime;  // 1 radian per second
  
  // Sine wave animation
  cube.position.y = Math.sin(elapsedTime) * 2;
  
  renderer.render(scene, camera);
}
animate();
```

### Performance Monitoring

```javascript
// Three.js Stats
import Stats from 'three/examples/jsm/libs/stats.module.js';

const stats = new Stats();
document.body.appendChild(stats.dom);

function animate() {
  requestAnimationFrame(animate);
  stats.begin();
  
  // Your animation code
  
  renderer.render(scene, camera);
  stats.end();
}
```

---

## Best Practices

### Performance

```javascript
// ✅ Dispose of unused resources
geometry.dispose();
material.dispose();
texture.dispose();

// ✅ Use object pooling for frequently created/destroyed objects
// ✅ Merge static geometries
// ✅ Use instancing for repeated objects
// ✅ Frustum culling is automatic, but help it with reasonable object sizes
```

### Code Organization

```javascript
// ✅ Separate setup from animation
function setupScene() {
  // Create scene, camera, renderer, objects
}

function setupLighting() {
  // Create and configure lights
}

function animate() {
  // Only animation logic here
}

setupScene();
setupLighting();
animate();
```

### Debugging

```javascript
// Add helpers
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

// Light helpers
const directionalLightHelper = new THREE.DirectionalLightHelper(light);
scene.add(directionalLightHelper);

// Camera helper
const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
scene.add(cameraHelper);
```

---

## Next Steps

Now that you understand Three.js fundamentals, continue to:
- **[React Three Fiber](./02-REACT-THREE-FIBER.md)** - Modern React approach
- **[Performance Optimization](./04-PERFORMANCE-OPTIMIZATION.md)** - Production techniques
- **[Shader Programming](./03-SHADER-PROGRAMMING.md)** - Custom visual effects

---

**Key Takeaways:**
- Scene, Camera, Renderer, Geometry, Material are the core 5
- Use PerspectiveCamera for most applications
- MeshStandardMaterial is the go-to for realistic rendering
- Proper lighting makes or breaks your scene
- Always dispose of resources
- Use delta time for frame-rate independent animation

