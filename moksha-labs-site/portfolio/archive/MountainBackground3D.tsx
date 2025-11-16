"use client";

import { useRef, useEffect, useState, memo } from "react";
import type React from "react";
import * as THREE from "three";
import { performanceLogger } from "@/utils/performanceLogger";
import { useIntroContext } from "@/contexts/IntroContext";

// Initial mountain configurations - Simplified for layered art style
const initialMountains: MountainConfig[] = [
  {
    centerX: 0,
    width: 2,
    baseY: 0.15,
    peakY: 0.35,
    zDepth: 0,
    jaggedness: 0.5,
    smoothness: 0.1,
    brightness: 1,
  },
  {
    centerX: 1,
    width: 1.55,
    baseY: 0.15,
    peakY: 0.36,
    zDepth: 0.5,
    jaggedness: 0.5,
    smoothness: 0.4,
    brightness: 0.55,
  },
  {
    centerX: 0.28,
    width: 1.4,
    baseY: 0.21,
    peakY: 0.36,
    zDepth: 1,
    jaggedness: 0.5,
    smoothness: 1,
    brightness: 1.55,
  },
  {
    centerX: 0.74,
    width: 2,
    baseY: 0.27,
    peakY: 0.37,
    zDepth: 1.5,
    jaggedness: 0.9,
    smoothness: 0.5,
    brightness: 0.8,
    noiseScale: 0.027,
    noiseLayers: 3,
  },
  {
    centerX: 0,
    width: 1.5,
    baseY: 0.21,
    peakY: 0.51,
    zDepth: 2,
    jaggedness: 1,
    smoothness: 0.55,
    brightness: 1.05,
    noiseScale: 0.023,
    rightRoughness: 1.6,
    noiseLayers: 2,
  },
  {
    centerX: 0.78,
    width: 2,
    baseY: 0.21,
    peakY: 0.5,
    zDepth: 2.5,
    jaggedness: 0.85,
    smoothness: 0.4,
    brightness: 1.2,
    noiseScale: 0.021,
    rightRoughness: 1.1,
    noiseVariation: 0,
    noiseLayers: 2,
    leftRoughness: 1,
  },
  {
    centerX: 0,
    width: 1.05,
    baseY: 0.3,
    peakY: 0.55,
    zDepth: 3,
    jaggedness: 1,
    smoothness: 0.7,
    brightness: 2,
    noiseScale: 0.027,
    noiseVariation: 2,
    rightRoughness: 1.6,
    noiseLayers: 2,
    leftRoughness: 0.9,
  },
  {
    centerX: 0.52,
    width: 1.6,
    baseY: 0.3,
    peakY: 0.5,
    zDepth: 3.5,
    jaggedness: 1,
    smoothness: 0.5,
    brightness: 1.4,
    noiseScale: 0.06,
    noiseLayers: 5,
    noiseVariation: 1,
    leftRoughness: 1,
    rightRoughness: 1,
  },
  {
    centerX: 0.89,
    width: 0.45,
    baseY: 0.3,
    peakY: 0.64,
    zDepth: 4,
    jaggedness: 0.3,
    smoothness: 0.5,
    brightness: 2,
    noiseScale: 0.01,
    noiseLayers: 2,
    noiseVariation: 1,
    leftRoughness: 1,
    rightRoughness: 1,
  },
  {
    centerX: 0.13,
    width: 0.7,
    baseY: 0.19,
    peakY: 0.68,
    zDepth: 4.5,
    jaggedness: 0.3,
    smoothness: 0.5,
    brightness: 1,
    noiseScale: 0.01,
    noiseLayers: 2,
    noiseVariation: 1,
    leftRoughness: 1,
    rightRoughness: 1,
  },
  {
    centerX: 0.38,
    width: 2,
    baseY: 0.21,
    peakY: 0.54,
    zDepth: 10,
    jaggedness: 1,
    smoothness: 1,
    brightness: 1.15,
    noiseScale: 0.038,
    noiseLayers: 3,
    noiseVariation: 1.4,
    leftRoughness: 0.8,
    rightRoughness: 1,
  },
  {
    centerX: 0.61,
    width: 0.7,
    baseY: 0.23,
    peakY: 0.62,
    zDepth: 11,
    jaggedness: 0.3,
    smoothness: 0.9,
    brightness: 1,
    noiseScale: 0.01,
    noiseLayers: 2,
    noiseVariation: 1,
    leftRoughness: 1,
    rightRoughness: 1,
  },
  {
    centerX: 0.26,
    width: 0.55,
    baseY: 0.25,
    peakY: 0.89,
    zDepth: 12,
    jaggedness: 0.65,
    smoothness: 0.55,
    brightness: 1,
    noiseScale: 0.014,
    noiseLayers: 1,
    noiseVariation: 1.3,
    leftRoughness: 1,
    rightRoughness: 1,
  },
];

interface MountainBackgroundProps {
  width?: number;
  height?: number;
  color?: string;
}

type MountainConfig = {
  // Position
  centerX: number; // 0-1, where peak is horizontally (0.5 = center)
  width: number; // 0-2, how wide the mountain is
  baseY: number; // 0-1, where the mountain starts from bottom (0 = bottom, 1 = top)
  peakY: number; // 0-1, where the peak reaches (0 = bottom, 1 = top)

  // 3D Depth
  zDepth: number; // 0-10, position in 3D space (0 = closest, 10 = farthest)

  // Shape
  jaggedness: number; // 0-1, how rough the silhouette is
  smoothness: number; // 0-1, how smooth the curves are

  // Noise Detail
  noiseScale?: number; // 0.001-0.1, frequency of noise (default: 0.01)
  noiseLayers?: number; // 1-5, number of noise octaves for detail (default: 1)
  noiseVariation?: number; // 0-2, amplitude variation across mountain (default: 1)
  leftRoughness?: number; // 0-2, multiplier for left side roughness (default: 1)
  rightRoughness?: number; // 0-2, multiplier for right side roughness (default: 1)

  // Visual
  brightness: number; // 0-2, color brightness multiplier (1 = base color)
};

// Simple Perlin noise implementation (same as original)
class SimpleNoise {
  private perm: number[];

  constructor(seed: number = 0) {
    this.perm = [];
    const p = [];
    for (let i = 0; i < 256; i++) {
      p[i] = i;
    }
    for (let i = 255; i > 0; i--) {
      const j = Math.floor((seed + i) % (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }
    for (let i = 0; i < 512; i++) {
      this.perm[i] = p[i % 256];
    }
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(a: number, b: number, t: number): number {
    return a + t * (b - a);
  }

  private grad(hash: number, x: number): number {
    return (hash & 1) === 0 ? x : -x;
  }

  noise(x: number): number {
    const X = Math.floor(x) & 255;
    x -= Math.floor(x);
    const u = this.fade(x);
    return (
      this.lerp(
        this.grad(this.perm[X], x),
        this.grad(this.perm[X + 1], x - 1),
        u
      ) *
        0.5 +
      0.5
    );
  }
}

function MountainBackground3D({
  width,
  height,
  color = "#2D5A5A",
}: MountainBackgroundProps) {
  const { introProgressRef } = useIntroContext();
  performanceLogger.logRender("MountainBackground3D");

  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const [mountains, setMountains] =
    useState<MountainConfig[]>(initialMountains);
  const [showControls, setShowControls] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState(0);
  const [needsUpdate, setNeedsUpdate] = useState(false);

  // THREE.js refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const directionalLightRef = useRef<THREE.DirectionalLight | null>(null);
  const sunMeshRef = useRef<THREE.Mesh | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const mountainMeshesRef = useRef<THREE.Mesh[]>([]);

  // Update dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (width && height) {
        setDimensions({ width, height });
      } else {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [width, height]);

  // Calculate mountain points with new simplified system
  const calculateMountainPoints = (
    config: MountainConfig,
    displayWidth: number,
    displayHeight: number,
    seed: number
  ): { x: number; y: number }[] => {
    // Calculate bounds from center and width
    const peakX = config.centerX * displayWidth;
    const halfWidth = (config.width / 2) * displayWidth;
    const baseLeftX = peakX - halfWidth;
    const baseRightX = peakX + halfWidth;

    // Y coordinates: 0 = bottom, 1 = top (our system)
    const baseY = config.baseY * displayHeight; // Bottom of mountain
    const peakY = config.peakY * displayHeight; // Top of mountain

    const mountainWidth = baseRightX - baseLeftX;
    const heightRange = peakY - baseY; // Height goes UP from base to peak
    const numPoints = Math.max(100, Math.floor(mountainWidth / 2));

    const points: { x: number; y: number }[] = [];

    // Noise configuration with defaults
    const baseNoiseScale = config.noiseScale ?? 0.01;
    const noiseLayers = config.noiseLayers ?? 1;
    const noiseVariation = config.noiseVariation ?? 1;
    const leftRoughness = config.leftRoughness ?? 1;
    const rightRoughness = config.rightRoughness ?? 1;

    // Create multiple noise layers for detail
    const noiseGenerators: SimpleNoise[] = [];
    for (let i = 0; i < noiseLayers; i++) {
      noiseGenerators.push(new SimpleNoise(seed + i * 100));
    }

    const baseNoiseStrength = config.jaggedness * heightRange * 0.2;

    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      const x = baseLeftX + t * mountainWidth;

      // Distance from peak (0 at peak, 1 at edges)
      const distFromPeak = Math.abs((x - peakX) / halfWidth);

      // Determine if on left or right side
      const isLeft = x < peakX;

      // Smooth mountain profile using smoothstep
      const smoothFactor = config.smoothness;
      const profile = 1 - Math.pow(distFromPeak, 1 + smoothFactor);

      // Base height from profile
      const baseHeight = profile * heightRange;

      // Multi-layer noise for complex detail
      let combinedNoise = 0;
      let amplitude = 1.0;
      let frequency = 1.0;

      for (let layer = 0; layer < noiseLayers; layer++) {
        const layerScale = baseNoiseScale * frequency * (1 + config.jaggedness);
        const noiseValue = noiseGenerators[layer].noise(x * layerScale);
        combinedNoise += noiseValue * amplitude;

        amplitude *= 0.5; // Each layer contributes less
        frequency *= 2.0; // Each layer is higher frequency
      }

      // Normalize combined noise
      combinedNoise = combinedNoise / (2 - Math.pow(0.5, noiseLayers));

      // Apply variation based on position (makes noise non-uniform)
      const variationFactor = 1 + (combinedNoise - 0.5) * noiseVariation;

      // Apply side-specific roughness
      const sideRoughness = isLeft ? leftRoughness : rightRoughness;

      // Calculate final noise displacement
      const noiseStrength = baseNoiseStrength * variationFactor * sideRoughness;
      const jaggedVariation = (combinedNoise - 0.5) * noiseStrength;

      // Final Y position (from bottom up)
      const y = baseY + baseHeight + jaggedVariation;

      points.push({ x, y });
    }

    return points;
  };

  // Initialize THREE.js scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const displayWidth = dimensions.width;
    const displayHeight = dimensions.height;

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#87CEEB"); // Sky blue
    sceneRef.current = scene;

    // Create orthographic camera (standard top-left origin)
    const camera = new THREE.OrthographicCamera(
      0, // left
      displayWidth, // right
      0, // top
      displayHeight, // bottom
      -1000, // near
      1000 // far
    );
    camera.position.z = 100;
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(displayWidth, displayHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Set canvas style to allow pointer events to pass through to UI controls
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.pointerEvents = "none"; // Allow UI controls to receive clicks

    container.appendChild(renderer.domElement);

    // Add ambient light (base illumination) - very low so sun has dramatic effect
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    // Add directional light (sun) - intensity will be animated based on sun height
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    scene.add(directionalLight);
    directionalLightRef.current = directionalLight;

    // Create 3D sun mesh with emissive glow
    const sunGeometry = new THREE.SphereGeometry(30, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffa500, // Bright orange (appears to glow against sky)
    });
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    // Start low in the distance, behind the farthest mountains
    // Mountains are at Z=0 to Z=-360, sun should be farther back
    sunMesh.position.set(displayWidth / 2, displayHeight / 2, -500);
    scene.add(sunMesh);
    sunMeshRef.current = sunMesh;

    // Parse color
    const parseColor = (colorStr: string): THREE.Color => {
      return new THREE.Color(colorStr);
    };

    const baseColor = parseColor(color);

    // Find tallest mountain for snow peak
    const mountainHeights = mountains.map((m) => m.peakY - m.baseY);
    const maxHeight = Math.max(...mountainHeights);
    const tallestIndex = mountainHeights.indexOf(maxHeight);

    // Color determination function with smooth transitions
    const getMountainColor = (
      mountain: MountainConfig,
      index: number
    ): THREE.Color => {
      const height = mountain.peakY - mountain.baseY;

      // Color definitions
      const lightGreen = baseColor.clone().lerp(new THREE.Color(0xc8ffc8), 0.6); // Light mint green
      const regularGreen = baseColor.clone();
      const grey = new THREE.Color(0x808080);
      const snow = new THREE.Color(0xf0f0f0);

      // Transition points and ranges
      const flatToMedium = 0.25; // Center point for flat/medium transition
      const mediumToTall = 0.4; // Center point for medium/tall transition
      const transitionRange = 0.05; // Width of transition zone (±0.05)

      let finalColor: THREE.Color;

      // Check if in transition zone between flat and medium
      if (height < flatToMedium + transitionRange) {
        // Between pure light green (< 0.20) and transition (0.20 - 0.30)
        if (height < flatToMedium - transitionRange) {
          // Pure light green (flat)
          finalColor = lightGreen.clone();
        } else {
          // Transition from light green to regular green
          const t =
            (height - (flatToMedium - transitionRange)) / (transitionRange * 2);
          finalColor = lightGreen.clone().lerp(regularGreen, t);
        }
      }
      // Check if in transition zone between medium and tall
      else if (height < mediumToTall + transitionRange) {
        if (height < mediumToTall - transitionRange) {
          // Pure regular green (medium)
          finalColor = regularGreen.clone();
        } else {
          // Transition from regular green to grey
          const t =
            (height - (mediumToTall - transitionRange)) / (transitionRange * 2);

          // If tallest mountain, use snow-tinted grey
          const targetGrey =
            index === tallestIndex
              ? new THREE.Color(0xa0a0a0).lerp(snow, 0.3)
              : grey;

          finalColor = regularGreen.clone().lerp(targetGrey, t);
        }
      }
      // Pure tall (grey)
      else {
        if (index === tallestIndex) {
          finalColor = new THREE.Color(0xa0a0a0).lerp(snow, 0.3);
        } else {
          finalColor = grey.clone();
        }
      }

      // Don't apply brightness multiplier - let the lighting system handle it
      return finalColor;
    };

    // Create mountain meshes
    const mountainMeshes: THREE.Mesh[] = [];
    mountains.forEach((mountain, index) => {
      const seed = index * 1000 + 100; // Unique seed per mountain
      const points = calculateMountainPoints(
        mountain,
        displayWidth,
        displayHeight,
        seed
      );

      // Create shape from points
      const shape = new THREE.Shape();

      // Calculate bounds
      const peakX = mountain.centerX * displayWidth;
      const halfWidth = (mountain.width / 2) * displayWidth;
      const baseLeftX = peakX - halfWidth;
      const baseRightX = peakX + halfWidth;

      // Base Y in THREE.js coordinates (inverted: 0 = top, displayHeight = bottom)
      const baseYThree = displayHeight - mountain.baseY * displayHeight;

      // Start at base left
      shape.moveTo(baseLeftX, baseYThree);

      // Draw mountain outline (convert our Y to THREE.js Y)
      for (let i = 0; i < points.length; i++) {
        shape.lineTo(points[i].x, displayHeight - points[i].y);
      }

      // Complete shape back to base right
      shape.lineTo(baseRightX, baseYThree);
      shape.closePath();

      // Extrude settings - create flat plane with minimal depth
      const extrudeSettings = {
        depth: 0.1, // Minimal depth for flat appearance
        bevelEnabled: false,
      };

      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

      // Get color based on mountain characteristics
      const layerColor = getMountainColor(mountain, index);

      const material = new THREE.MeshStandardMaterial({
        color: layerColor,
        roughness: 0.8,
        metalness: 0.2,
        flatShading: false,
      });

      const mesh = new THREE.Mesh(geometry, material);

      // Position in Z-space using zDepth
      // zDepth: 0 = closest (z = 0), 10 = farthest (z = -300)
      mesh.position.z = -mountain.zDepth * 30;

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      scene.add(mesh);
      mountainMeshes.push(mesh);
    });

    mountainMeshesRef.current = mountainMeshes;

    // Cleanup
    return () => {
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      mountainMeshes.forEach((mesh) => {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
        scene.remove(mesh);
      });
      if (sunMesh) {
        sunMesh.geometry.dispose();
        (sunMesh.material as THREE.Material).dispose();
        scene.remove(sunMesh);
      }
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimensions.width, dimensions.height, color]);

  // Recreate mountains when config changes
  useEffect(() => {
    if (!sceneRef.current || !needsUpdate) return;

    const scene = sceneRef.current;
    const displayWidth = dimensions.width;
    const displayHeight = dimensions.height;

    // Remove old meshes
    mountainMeshesRef.current.forEach((mesh) => {
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
      scene.remove(mesh);
    });

    const parseColor = (colorStr: string): THREE.Color => {
      return new THREE.Color(colorStr);
    };

    const baseColor = parseColor(color);

    // Find tallest mountain for snow peak
    const mountainHeights = mountains.map((m) => m.peakY - m.baseY);
    const maxHeight = Math.max(...mountainHeights);
    const tallestIndex = mountainHeights.indexOf(maxHeight);

    // Color determination function with smooth transitions
    const getMountainColor = (
      mountain: MountainConfig,
      index: number
    ): THREE.Color => {
      const height = mountain.peakY - mountain.baseY;

      // Color definitions
      const lightGreen = baseColor.clone().lerp(new THREE.Color(0xc8ffc8), 0.6); // Light mint green
      const regularGreen = baseColor.clone();
      const grey = new THREE.Color(0x808080);
      const snow = new THREE.Color(0xf0f0f0);

      // Transition points and ranges
      const flatToMedium = 0.25; // Center point for flat/medium transition
      const mediumToTall = 0.4; // Center point for medium/tall transition
      const transitionRange = 0.05; // Width of transition zone (±0.05)

      let finalColor: THREE.Color;

      // Check if in transition zone between flat and medium
      if (height < flatToMedium + transitionRange) {
        // Between pure light green (< 0.20) and transition (0.20 - 0.30)
        if (height < flatToMedium - transitionRange) {
          // Pure light green (flat)
          finalColor = lightGreen.clone();
        } else {
          // Transition from light green to regular green
          const t =
            (height - (flatToMedium - transitionRange)) / (transitionRange * 2);
          finalColor = lightGreen.clone().lerp(regularGreen, t);
        }
      }
      // Check if in transition zone between medium and tall
      else if (height < mediumToTall + transitionRange) {
        if (height < mediumToTall - transitionRange) {
          // Pure regular green (medium)
          finalColor = regularGreen.clone();
        } else {
          // Transition from regular green to grey
          const t =
            (height - (mediumToTall - transitionRange)) / (transitionRange * 2);

          // If tallest mountain, use snow-tinted grey
          const targetGrey =
            index === tallestIndex
              ? new THREE.Color(0xa0a0a0).lerp(snow, 0.3)
              : grey;

          finalColor = regularGreen.clone().lerp(targetGrey, t);
        }
      }
      // Pure tall (grey)
      else {
        if (index === tallestIndex) {
          finalColor = new THREE.Color(0xa0a0a0).lerp(snow, 0.3);
        } else {
          finalColor = grey.clone();
        }
      }

      // Don't apply brightness multiplier - let the lighting system handle it
      return finalColor;
    };

    // Create new mountain meshes
    const mountainMeshes: THREE.Mesh[] = [];
    mountains.forEach((mountain, index) => {
      const seed = index * 1000 + 100;
      const points = calculateMountainPoints(
        mountain,
        displayWidth,
        displayHeight,
        seed
      );

      const shape = new THREE.Shape();

      const peakX = mountain.centerX * displayWidth;
      const halfWidth = (mountain.width / 2) * displayWidth;
      const baseLeftX = peakX - halfWidth;
      const baseRightX = peakX + halfWidth;
      const baseYThree = displayHeight - mountain.baseY * displayHeight;

      shape.moveTo(baseLeftX, baseYThree);

      for (let i = 0; i < points.length; i++) {
        shape.lineTo(points[i].x, displayHeight - points[i].y);
      }

      shape.lineTo(baseRightX, baseYThree);
      shape.closePath();

      const extrudeSettings = {
        depth: 0.1,
        bevelEnabled: false,
      };

      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      const layerColor = getMountainColor(mountain, index);

      const material = new THREE.MeshStandardMaterial({
        color: layerColor,
        roughness: 0.8,
        metalness: 0.2,
        flatShading: false,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.z = -mountain.zDepth * 30;
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      scene.add(mesh);
      mountainMeshes.push(mesh);
    });

    mountainMeshesRef.current = mountainMeshes;
    setNeedsUpdate(false);
  }, [mountains, needsUpdate, dimensions.width, dimensions.height, color]);

  // Render loop
  useEffect(() => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;
    const directionalLight = directionalLightRef.current;

    const render = () => {
      // Get intro progress (0 to 1)
      const progress = introProgressRef.current;

      // Calculate sun position directly in 3D coordinates based on progress
      // X: center of screen (no horizontal movement for now)
      // Y: animate from bottom (displayHeight) to top (0)
      // Z: far behind mountains (-500)
      const sunX = dimensions.width / 2;
      const sunY = dimensions.height - progress * dimensions.height * 0.8; // Rise 80% of screen height
      const sunZ = -500;

      // Update sun mesh position
      if (sunMeshRef.current) {
        sunMeshRef.current.position.set(sunX, sunY, sunZ);
      }

      // Calculate light intensity based on sun progress
      // When progress is 0 (sun at bottom), intensity is low
      // When progress is 1 (sun at top), intensity is high
      const lightIntensity = Math.max(0.1, progress * 2.5); // Range: 0.1 to 2.5

      // Update directional light to match sun position
      if (directionalLight) {
        directionalLight.intensity = lightIntensity;
        // Light comes from sun position toward scene center
        directionalLight.position.set(sunX, sunY, 200);
        directionalLight.target.position.set(
          dimensions.width / 2,
          dimensions.height / 2,
          0
        );
        directionalLight.target.updateMatrixWorld();
      }

      // Update sky color based on sun progress
      // Dawn (low progress): darker sky
      // Day (high progress): bright blue sky
      if (scene.background instanceof THREE.Color) {
        const dawnColor = new THREE.Color(0x87ceeb); // Sky blue
        const dayColor = new THREE.Color(0xa7e6ff); // Bright sky blue
        scene.background.lerpColors(dawnColor, dayColor, progress);
      }

      renderer.render(scene, camera);
      animationFrameIdRef.current = requestAnimationFrame(render);
    };

    animationFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    };
  }, [dimensions.width, dimensions.height, introProgressRef]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      {/* Control Panel */}
      <div
        style={{
          position: "fixed",
          top: 10,
          right: 10,
          background: "rgba(0, 0, 0, 0.8)",
          color: "white",
          padding: "20px",
          borderRadius: "8px",
          maxWidth: "400px",
          maxHeight: "60vh",
          fontFamily: "monospace",
          fontSize: "12px",
          zIndex: 1000,
          display: showControls ? "block" : "none",
          pointerEvents: "auto",
        }}
      >
        <div
          style={{
            marginBottom: "15px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ margin: 0 }}>Mountain Controls (3D)</h3>
          <button
            onClick={() => setShowControls(false)}
            style={{
              background: "#444",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {/* Layer Selector */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Layer: {selectedLayer + 1} / {mountains.length}
          </label>
          <input
            type="range"
            min="0"
            max={mountains.length - 1}
            value={selectedLayer}
            onChange={(e) => setSelectedLayer(parseInt(e.target.value))}
            style={{ width: "100%" }}
          />

          {/* Add/Remove Layer Buttons */}
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              onClick={() => {
                const newLayer: MountainConfig = {
                  centerX: 0.5,
                  width: 0.8,
                  baseY: 0.3,
                  peakY: 0.7,
                  zDepth: mountains.length,
                  jaggedness: 0.3,
                  smoothness: 0.5,
                  brightness: 1.0,
                  noiseScale: 0.01,
                  noiseLayers: 2,
                  noiseVariation: 1,
                  leftRoughness: 1,
                  rightRoughness: 1,
                };
                const updated = [...mountains, newLayer];
                setMountains(updated);
                setSelectedLayer(updated.length - 1);
                setNeedsUpdate(true);
              }}
              style={{
                flex: 1,
                padding: "8px",
                background: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "bold",
              }}
            >
              ➕ Add Layer
            </button>
            <button
              onClick={() => {
                if (mountains.length > 1) {
                  const updated = mountains.filter(
                    (_, i) => i !== selectedLayer
                  );
                  setMountains(updated);
                  setSelectedLayer(Math.min(selectedLayer, updated.length - 1));
                  setNeedsUpdate(true);
                }
              }}
              disabled={mountains.length <= 1}
              style={{
                flex: 1,
                padding: "8px",
                background: mountains.length <= 1 ? "#555" : "#f44336",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: mountains.length <= 1 ? "not-allowed" : "pointer",
                fontSize: "13px",
                fontWeight: "bold",
                opacity: mountains.length <= 1 ? 0.5 : 1,
              }}
            >
              🗑️ Remove
            </button>
          </div>
        </div>

        {/* Parameter Sliders */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            overflowY: "auto",
            maxHeight: "50vh",
          }}
        >
          {mountains[selectedLayer] && (
            <>
              <SliderControl
                label="Center X"
                value={mountains[selectedLayer].centerX}
                min={0}
                max={1}
                step={0.01}
                onChange={(val) => {
                  const updated = [...mountains];
                  updated[selectedLayer] = {
                    ...updated[selectedLayer],
                    centerX: val,
                  };
                  setMountains(updated);
                  setNeedsUpdate(true);
                }}
              />
              <SliderControl
                label="Width"
                value={mountains[selectedLayer].width}
                min={0.1}
                max={2}
                step={0.05}
                onChange={(val) => {
                  const updated = [...mountains];
                  updated[selectedLayer] = {
                    ...updated[selectedLayer],
                    width: val,
                  };
                  setMountains(updated);
                  setNeedsUpdate(true);
                }}
              />
              <SliderControl
                label="Base Y"
                value={mountains[selectedLayer].baseY}
                min={0}
                max={1}
                step={0.01}
                onChange={(val) => {
                  const updated = [...mountains];
                  updated[selectedLayer] = {
                    ...updated[selectedLayer],
                    baseY: val,
                  };
                  setMountains(updated);
                  setNeedsUpdate(true);
                }}
              />
              <SliderControl
                label="Peak Y"
                value={mountains[selectedLayer].peakY}
                min={0}
                max={1}
                step={0.01}
                onChange={(val) => {
                  const updated = [...mountains];
                  updated[selectedLayer] = {
                    ...updated[selectedLayer],
                    peakY: val,
                  };
                  setMountains(updated);
                  setNeedsUpdate(true);
                }}
              />
              <SliderControl
                label="Z Depth"
                value={mountains[selectedLayer].zDepth}
                min={0}
                max={10}
                step={0.5}
                onChange={(val) => {
                  const updated = [...mountains];
                  updated[selectedLayer] = {
                    ...updated[selectedLayer],
                    zDepth: val,
                  };
                  setMountains(updated);
                  setNeedsUpdate(true);
                }}
              />
              <SliderControl
                label="Jaggedness"
                value={mountains[selectedLayer].jaggedness}
                min={0}
                max={1}
                step={0.05}
                onChange={(val) => {
                  const updated = [...mountains];
                  updated[selectedLayer] = {
                    ...updated[selectedLayer],
                    jaggedness: val,
                  };
                  setMountains(updated);
                  setNeedsUpdate(true);
                }}
              />
              <SliderControl
                label="Smoothness"
                value={mountains[selectedLayer].smoothness}
                min={0}
                max={1}
                step={0.05}
                onChange={(val) => {
                  const updated = [...mountains];
                  updated[selectedLayer] = {
                    ...updated[selectedLayer],
                    smoothness: val,
                  };
                  setMountains(updated);
                  setNeedsUpdate(true);
                }}
              />
              <SliderControl
                label="Brightness"
                value={mountains[selectedLayer].brightness}
                min={0}
                max={2}
                step={0.05}
                onChange={(val) => {
                  const updated = [...mountains];
                  updated[selectedLayer] = {
                    ...updated[selectedLayer],
                    brightness: val,
                  };
                  setMountains(updated);
                  setNeedsUpdate(true);
                }}
              />

              {/* Advanced Noise Controls */}
              <div
                style={{
                  gridColumn: "1 / -1",
                  borderTop: "1px solid #555",
                  paddingTop: "10px",
                  marginTop: "10px",
                }}
              >
                <h4 style={{ margin: "0 0 10px 0", fontSize: "14px" }}>
                  Advanced Noise Controls
                </h4>
              </div>

              <SliderControl
                label="Noise Scale"
                value={mountains[selectedLayer].noiseScale ?? 0.01}
                min={0.001}
                max={0.1}
                step={0.001}
                onChange={(val) => {
                  const updated = [...mountains];
                  updated[selectedLayer] = {
                    ...updated[selectedLayer],
                    noiseScale: val,
                  };
                  setMountains(updated);
                  setNeedsUpdate(true);
                }}
              />

              <SliderControl
                label="Noise Layers"
                value={mountains[selectedLayer].noiseLayers ?? 1}
                min={1}
                max={5}
                step={1}
                onChange={(val) => {
                  const updated = [...mountains];
                  updated[selectedLayer] = {
                    ...updated[selectedLayer],
                    noiseLayers: val,
                  };
                  setMountains(updated);
                  setNeedsUpdate(true);
                }}
              />

              <SliderControl
                label="Noise Variation"
                value={mountains[selectedLayer].noiseVariation ?? 1}
                min={0}
                max={2}
                step={0.1}
                onChange={(val) => {
                  const updated = [...mountains];
                  updated[selectedLayer] = {
                    ...updated[selectedLayer],
                    noiseVariation: val,
                  };
                  setMountains(updated);
                  setNeedsUpdate(true);
                }}
              />

              <SliderControl
                label="Left Roughness"
                value={mountains[selectedLayer].leftRoughness ?? 1}
                min={0}
                max={2}
                step={0.1}
                onChange={(val) => {
                  const updated = [...mountains];
                  updated[selectedLayer] = {
                    ...updated[selectedLayer],
                    leftRoughness: val,
                  };
                  setMountains(updated);
                  setNeedsUpdate(true);
                }}
              />

              <SliderControl
                label="Right Roughness"
                value={mountains[selectedLayer].rightRoughness ?? 1}
                min={0}
                max={2}
                step={0.1}
                onChange={(val) => {
                  const updated = [...mountains];
                  updated[selectedLayer] = {
                    ...updated[selectedLayer],
                    rightRoughness: val,
                  };
                  setMountains(updated);
                  setNeedsUpdate(true);
                }}
              />
            </>
          )}
        </div>

        {/* Export Button */}
        <button
          onClick={() => {
            console.log("=== MOUNTAIN CONFIGURATION (3D) ===");
            console.log(JSON.stringify(mountains, null, 2));
            console.log("=== COPY THE ABOVE JSON ===");
            alert(
              "Configuration logged to console! Check the browser console."
            );
          }}
          style={{
            width: "100%",
            padding: "10px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
            marginTop: "15px",
          }}
        >
          📋 Log Config to Console
        </button>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setShowControls(!showControls)}
        style={{
          position: "absolute",
          top: 10,
          right: showControls ? "420px" : 10,
          background: "rgba(0, 0, 0, 0.8)",
          color: "white",
          border: "none",
          padding: "10px 15px",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
          zIndex: 10001,
          pointerEvents: "auto",
        }}
      >
        {showControls ? "👁️ Hide Controls" : "⚙️ Show Controls"}
      </button>
    </div>
  );
}

export default memo(MountainBackground3D);

// Slider Control Component
function SliderControl({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <div style={{ marginBottom: "0px" }}>
      <label style={{ display: "block", marginBottom: "0px" }}>
        {label}: {value.toFixed(3)}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: "100%" }}
      />
    </div>
  );
}
