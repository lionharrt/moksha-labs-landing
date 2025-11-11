"use client";

import { useRef, useEffect, useState, useCallback, memo } from "react";
import { LightingState } from "@/hooks/useLighting";

interface MountainBackgroundProps {
  width?: number;
  height?: number;
  color?: string;
  lightingState?: LightingState; // Optional lighting integration
}

export enum PeakShapeFunction {
  LINEAR = "linear",
  SMOOTHSTEP = "smoothstep",
  QUADRATIC = "quadratic",
  CUBIC = "cubic",
  POWER = "power",
  EXPONENTIAL = "exponential",
  SINE = "sine",
}

type MountainConfig = {
  peakX: number; // X position of the peak (0-1)
  baseLeft?: number; // Left edge of base (can be negative) - deprecated, use leftX instead
  baseRight?: number; // Right edge of base (can be > 1) - deprecated, use rightX instead
  leftX?: number; // Left boundary X position (0-1 viewport coordinates, can be negative for off-viewport)
  rightX?: number; // Right boundary X position (0-1 viewport coordinates, can be > 1 for off-viewport)
  baseHeight: number; // 0-1, where 0 is top, 1 is bottom
  peakHeight: number; // 0-1, where 0 is top, 1 is bottom
  noiseScale: number; // Scale for noise (smaller = smoother)
  noiseOffset: number; // Offset for unique noise pattern
  peakShape: PeakShapeFunction; // Mathematical function to shape the peak
  curvature?: number; // Controls convexity/concavity: < 1 = more convex (rounded), > 1 = more concave (sharp), default = 1
  leftSideCurvature?: number; // Controls curvature of left slope: < 1 = convex (bulging outward), > 1 = concave (hollow inward), default = 1
  rightSideCurvature?: number; // Controls curvature of right slope: < 1 = convex (bulging outward), > 1 = concave (hollow inward), default = 1
  noiseStrength?: number; // Base strength of noise effect (0-1), default = 0.15
  leftNoiseBias?: number; // Noise intensity multiplier for left side, default = 0.8
  rightNoiseBias?: number; // Noise intensity multiplier for right side, default = 1.2
  noisePositionFalloff?: number; // How noise intensity changes from peak to base (0-1): lower = more noise near base, higher = more uniform, default = 0.7
};

// Simple Perlin noise implementation (simplified version)
class SimpleNoise {
  private perm: number[];

  constructor(seed: number = 0) {
    this.perm = [];
    const p = [];
    for (let i = 0; i < 256; i++) {
      p[i] = i;
    }
    // Shuffle based on seed
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
    ); // Normalize to 0-1
  }
}

function MountainBackground({
  width,
  height,
  color = "#2D5A5A",
  lightingState,
}: MountainBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const [showControls, setShowControls] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState(0);
  const canvasSizeRef = useRef({ width: 0, height: 0, dpr: 1 }); // Cache canvas size to avoid resizing every frame
  
  // Store latest values in refs to avoid re-renders
  const lightingStateRef = useRef(lightingState);
  const colorRef = useRef(color);
  
  // OPTIMIZED: Cache mountain paths (Path2D objects) - only recalculate when dimensions/mountains change
  const mountainPathsCacheRef = useRef<Map<string, Path2D>>(new Map());
  const mountainPointsCacheRef = useRef<Map<string, { x: number; y: number }[]>>(new Map());
  
  // OPTIMIZED: Cache gradients - only recreate when lighting changes significantly
  const gradientCacheRef = useRef<Map<string, CanvasGradient>>(new Map());
  
  // OPTIMIZED: Frame budget tracking
  const frameBudgetRef = useRef({
    targetFrameTime: 16.67, // 60fps target
    maxFrameTime: 33.33, // Don't exceed 30fps
    lastFrameTime: 0,
  });

  // Initial mountain configurations - Updated from slider controls
  const initialMountains: MountainConfig[] = [
    {
      peakX: 0.47,
      leftX: 0.16,
      rightX: 0.84,
      baseHeight: 0.46,
      peakHeight: 0.25,
      noiseScale: 0.07,
      noiseStrength: 0.23,
      leftNoiseBias: 3.3,
      rightNoiseBias: 2.8,
      noisePositionFalloff: 0.7,
      noiseOffset: 100,
      leftSideCurvature: 6.4,
      rightSideCurvature: 5.9,
      peakShape: PeakShapeFunction.SMOOTHSTEP,
    },
    {
      peakX: 0.86,
      leftX: 0.39,
      rightX: 1.07,
      baseHeight: 0.47,
      peakHeight: 0.34,
      noiseScale: 0.048,
      noiseStrength: 0.49,
      leftNoiseBias: 2.1,
      rightNoiseBias: 3,
      noisePositionFalloff: 0.4,
      noiseOffset: 200,
      leftSideCurvature: 6.6,
      rightSideCurvature: 4.6,
      peakShape: PeakShapeFunction.SINE,
    },
    {
      peakX: 0.24,
      leftX: 0.04,
      rightX: 0.61,
      baseHeight: 0.52,
      peakHeight: 0.38,
      noiseScale: 0.04,
      noiseStrength: 0.48,
      leftNoiseBias: 1.5,
      rightNoiseBias: 3,
      noisePositionFalloff: 0.8,
      noiseOffset: 300,
      leftSideCurvature: 4,
      rightSideCurvature: 5.6,
      peakShape: PeakShapeFunction.SMOOTHSTEP,
    },
    {
      peakX: 0.41,
      leftX: 0.25,
      rightX: 0.52,
      baseHeight: 0.5,
      peakHeight: 0.44,
      noiseScale: 0.054,
      noiseStrength: 0.44,
      leftNoiseBias: 4,
      rightNoiseBias: 1.7,
      noisePositionFalloff: 0.5,
      noiseOffset: 400,
      leftSideCurvature: 3.2,
      rightSideCurvature: 3.5,
      peakShape: PeakShapeFunction.SMOOTHSTEP,
    },
    {
      peakX: 0.06,
      leftX: -0.85,
      rightX: 1.33,
      baseHeight: 0.76,
      peakHeight: 0.43,
      noiseScale: 0.035,
      noiseStrength: 0.42,
      leftNoiseBias: 2.4,
      rightNoiseBias: 1.2,
      noisePositionFalloff: 0.6,
      noiseOffset: 500,
      leftSideCurvature: 4.4,
      rightSideCurvature: 9.5,
      peakShape: PeakShapeFunction.SINE,
    },
    {
      peakX: 0.62,
      leftX: -0.22,
      rightX: 1.55,
      baseHeight: 0.7,
      peakHeight: 0.43,
      noiseScale: 0.018,
      noiseStrength: 0.42,
      leftNoiseBias: 1.5,
      rightNoiseBias: 1.1,
      noisePositionFalloff: 0.1,
      noiseOffset: 600,
      leftSideCurvature: 2.8,
      rightSideCurvature: 5.1,
      peakShape: PeakShapeFunction.SMOOTHSTEP,
    },
    {
      peakX: 0.36,
      leftX: -0.55,
      rightX: 1.45,
      baseHeight: 0.66,
      peakHeight: 0.57,
      noiseScale: 0.021,
      noiseStrength: 0.87,
      leftNoiseBias: 1.3,
      rightNoiseBias: 2,
      noisePositionFalloff: 0.5,
      noiseOffset: 700,
      leftSideCurvature: 5.2,
      rightSideCurvature: 4.5,
      peakShape: PeakShapeFunction.SMOOTHSTEP,
    },
    {
      peakX: 1.09,
      leftX: -0.99,
      rightX: 1.6,
      baseHeight: 0.99,
      peakHeight: 0.45,
      noiseScale: 0.036,
      noiseStrength: 0.12,
      leftNoiseBias: 2,
      rightNoiseBias: 1.2,
      noisePositionFalloff: 0.75,
      noiseOffset: 800,
      leftSideCurvature: 3.5,
      rightSideCurvature: 1.8,
      peakShape: PeakShapeFunction.SINE,
    },
    {
      peakX: -1.5,
      leftX: -0.25,
      rightX: 1,
      baseHeight: 0.57,
      peakHeight: 0.72,
      noiseScale: 0.025,
      noiseStrength: 0.13,
      leftNoiseBias: 1.2,
      rightNoiseBias: 4,
      noisePositionFalloff: 2.8,
      noiseOffset: 900,
      leftSideCurvature: 3,
      rightSideCurvature: 1.1,
      peakShape: PeakShapeFunction.SINE,
    },
    {
      peakX: 1.06,
      leftX: 0.04,
      rightX: 1.16,
      baseHeight: 0.67,
      peakHeight: 0.43,
      noiseScale: 0.032,
      noiseStrength: 0.48,
      leftNoiseBias: 1,
      rightNoiseBias: 1,
      noisePositionFalloff: 0.5,
      noiseOffset: 1000,
      leftSideCurvature: 8.3,
      rightSideCurvature: 1.6,
      peakShape: PeakShapeFunction.SMOOTHSTEP,
    },
    {
      peakX: 0.39,
      leftX: -0.61,
      rightX: 4.14,
      baseHeight: 0.43,
      peakHeight: 0.7,
      noiseScale: 0.034,
      noiseStrength: 0.13,
      leftNoiseBias: 1,
      rightNoiseBias: 2.5,
      noisePositionFalloff: 0.5,
      noiseOffset: 1100,
      leftSideCurvature: 3.5,
      rightSideCurvature: 9.3,
      peakShape: PeakShapeFunction.SMOOTHSTEP,
    },
    {
      peakX: -1.11,
      leftX: -1.96,
      rightX: 1.95,
      baseHeight: 0.51,
      peakHeight: 0.83,
      noiseScale: 0.038,
      noiseStrength: 0.1,
      leftNoiseBias: 3,
      rightNoiseBias: 0.8,
      noisePositionFalloff: 1.4,
      noiseOffset: 1200,
      leftSideCurvature: 5.5,
      rightSideCurvature: 1.8,
      peakShape: PeakShapeFunction.SINE,
    },
    {
      peakX: 2.39,
      leftX: -0.15,
      rightX: 1.02,
      baseHeight: 0.56,
      peakHeight: 0.89,
      noiseScale: 0.034,
      noiseStrength: 0.15,
      leftNoiseBias: 0.4,
      rightNoiseBias: 1.9,
      noisePositionFalloff: 0.4,
      noiseOffset: 1300,
      leftSideCurvature: 1.4,
      rightSideCurvature: 5,
      peakShape: PeakShapeFunction.SINE,
    },
  ];

  const [mountains, setMountains] =
    useState<MountainConfig[]>(initialMountains);

  // Update dimensions based on viewport or container
  useEffect(() => {
    const updateDimensions = () => {
      if (width && height) {
        // Use provided dimensions
        setDimensions({ width, height });
      } else {
        // Use viewport dimensions
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
  
  // OPTIMIZED: Clear caches when dimensions change
  useEffect(() => {
    mountainPathsCacheRef.current.clear();
    mountainPointsCacheRef.current.clear();
    gradientCacheRef.current.clear();
  }, [dimensions.width, dimensions.height]);

  // Render function extracted for requestAnimationFrame throttling
  const renderMountains = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // OPTIMIZED: Frame budget tracking (game dev technique)
    const frameStart = performance.now();
    const frameBudget = frameBudgetRef.current;

    // Use latest values from refs
    const currentLightingState = lightingStateRef.current;
    const currentColor = colorRef.current;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = dimensions.width;
    const displayHeight = dimensions.height;

    // OPTIMIZED: Only resize canvas when dimensions actually change
    // Resizing clears the canvas and forces full redraw - very expensive!
    const newCanvasWidth = displayWidth * dpr;
    const newCanvasHeight = displayHeight * dpr;
    
    if (
      canvasSizeRef.current.width !== newCanvasWidth ||
      canvasSizeRef.current.height !== newCanvasHeight ||
      canvasSizeRef.current.dpr !== dpr
    ) {
      canvas.width = newCanvasWidth;
      canvas.height = newCanvasHeight;
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;
      ctx.scale(dpr, dpr);
      canvasSizeRef.current = { width: newCanvasWidth, height: newCanvasHeight, dpr };
    }
    // Note: Don't call scale() again if canvas hasn't changed - it's already scaled

    // Clear canvas (transparent)
    ctx.clearRect(0, 0, displayWidth, displayHeight);

    // Water covers bottom 35% of screen, so mountains are only visible above 65% from top
    const waterLevel = displayHeight * 0.65;

    // Use lighting color if available, otherwise fallback to prop color
    const mountainBaseColor = currentLightingState?.mountainColor ?? currentColor;

    // Pre-calculate colors ONCE (performance optimization)
    // Parse colors as floats to maintain precision throughout calculations
    const parseColor = (colorStr: string): [number, number, number] => {
      if (colorStr.startsWith("rgb")) {
        const match = colorStr.match(/\d+/g);
        if (match) {
          return [parseFloat(match[0]), parseFloat(match[1]), parseFloat(match[2])]; // Use parseFloat for precision
        }
      } else if (colorStr.startsWith("#")) {
        const hex = colorStr.slice(1);
        return [
          parseInt(hex.slice(0, 2), 16),
          parseInt(hex.slice(2, 4), 16),
          parseInt(hex.slice(4, 6), 16),
        ];
      }
      return [45, 90, 90]; // Default teal
    };

    const baseColorRGB = parseColor(mountainBaseColor);
    const skyColorRGB: [number, number, number] = currentLightingState?.skyColor 
      ? parseColor(currentLightingState.skyColor)
      : [135, 206, 235]; // Default sky blue
    
    // Pre-calculate lighting parameters
    const lightDirX = currentLightingState ? -currentLightingState.shadowDirection.x : 0;
    const lightDirY = currentLightingState ? -currentLightingState.shadowDirection.y : 0;
    const lightingStrength = currentLightingState?.isDaytime ? 1.3 : 1.6;
    const shadowStrength = currentLightingState?.isDaytime ? 0.6 : 0.5;
    const ambientBrightness = currentLightingState?.ambientBrightness ?? 1;
    const behindMountainsDarkness = currentLightingState?.behindMountainsDarkness ?? 0;

    // Optimized color manipulation functions (inline for performance)
    // Use floating point precision throughout, only round at final output
    const blendColors = (
      c1: [number, number, number],
      c2: [number, number, number],
      t: number
    ): [number, number, number] => {
      const invT = 1 - t;
      // Keep as floats for precision
      return [
        c1[0] * invT + c2[0] * t,
        c1[1] * invT + c2[1] * t,
        c1[2] * invT + c2[2] * t,
      ];
    };

    const adjustBrightness = (
      c: [number, number, number],
      factor: number
    ): [number, number, number] => {
      // Keep as floats for precision, clamp but don't round
      return [
        Math.min(255, Math.max(0, c[0] * factor)),
        Math.min(255, Math.max(0, c[1] * factor)),
        Math.min(255, Math.max(0, c[2] * factor)),
      ];
    };
    
    // Helper to round colors only when outputting to canvas
    const roundColor = (c: [number, number, number]): [number, number, number] => {
      return [
        Math.round(c[0]),
        Math.round(c[1]),
        Math.round(c[2]),
      ];
    };

    // Helper function to calculate mountain points without drawing
    const calculateMountainPoints = (config: MountainConfig, layerIndex: number = 0): { x: number; y: number }[] => {
      // OPTIMIZED: Cache mountain points - only recalculate when dimensions change
      const cacheKey = `${config.peakX}-${config.baseHeight}-${config.peakHeight}-${displayWidth}-${displayHeight}-${layerIndex}`;
      const cached = mountainPointsCacheRef.current.get(cacheKey);
      if (cached) {
        return cached;
      }
      
      const peakX = config.peakX * displayWidth;
      const baseLeftX =
        (config.leftX !== undefined ? config.leftX : config.baseLeft ?? -0.2) *
        displayWidth;
      const baseRightX =
        (config.rightX !== undefined
          ? config.rightX
          : config.baseRight ?? 1.2) * displayWidth;
      const baseY = config.baseHeight * displayHeight;
      const peakY = config.peakHeight * displayHeight;

      const noise = new SimpleNoise(config.noiseOffset);
      const mountainWidth = baseRightX - baseLeftX;
      const heightRange = baseY - peakY;
      
      // OPTIMIZED: Significantly fewer points for better performance
      // Reduced base points and more aggressive reduction for distant mountains
      const depthFactor = layerIndex / mountains.length;
      const baseNumPoints = Math.max(150, Math.floor(mountainWidth / 1.0)); // Reduced from 300 and 0.5
      const numPoints = Math.floor(baseNumPoints * (1 - depthFactor * 0.7)); // Reduce by up to 70% for distant (was 50%)
      
      const points: { x: number; y: number }[] = [];

      const noise1 = new SimpleNoise(config.noiseOffset);
      const noise2 = new SimpleNoise(config.noiseOffset + 1000);
      const noise3 = new SimpleNoise(config.noiseOffset + 2000);
      const noiseWarp = new SimpleNoise(config.noiseOffset + 5000);

      const applyPeakShape = (t: number, sideCurvature: number): number => {
        const normalized = Math.max(0, Math.min(1, t));
        const curvature = config.curvature ?? 1;
        const invNorm = 1 - normalized;
        let baseShape: number;
        switch (config.peakShape) {
          case PeakShapeFunction.LINEAR:
            baseShape = invNorm;
            break;
          case PeakShapeFunction.SMOOTHSTEP:
            const smoothT = Math.pow(invNorm, curvature);
            baseShape = smoothT * smoothT * (3 - 2 * smoothT);
            break;
          case PeakShapeFunction.QUADRATIC:
            baseShape = Math.pow(invNorm, 2 * curvature);
            break;
          case PeakShapeFunction.CUBIC:
            baseShape = Math.pow(invNorm, 3 * curvature);
            break;
          case PeakShapeFunction.POWER:
            baseShape = Math.pow(invNorm, 0.8 * curvature);
            break;
          case PeakShapeFunction.EXPONENTIAL:
            baseShape = Math.exp(-normalized * 2 * curvature);
            break;
          case PeakShapeFunction.SINE:
            baseShape = Math.sin((invNorm * Math.PI) / (2 / curvature));
            break;
          default:
            baseShape = invNorm;
        }
        if (sideCurvature !== 1) {
          baseShape = Math.pow(baseShape, sideCurvature);
        }
        return baseShape;
      };

      let randomWalk = 0;
      const walkStrength = heightRange * 0.02;
      const leftSideCurvature = config.leftSideCurvature ?? 1;
      const rightSideCurvature = config.rightSideCurvature ?? 1;

      for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        const x = baseLeftX + t * mountainWidth;
        const isLeft = x < peakX;
        const distFromPeak = isLeft
          ? (peakX - x) / (peakX - baseLeftX)
          : (x - peakX) / (baseRightX - peakX);
        const sideCurvature = isLeft ? leftSideCurvature : rightSideCurvature;
        const baseShape = applyPeakShape(distFromPeak, sideCurvature);
        const baseHeightVariation = baseShape * heightRange;
        const warpAmount = noiseWarp.noise(x * config.noiseScale * 0.1) * 50;
        const warpedX = x + warpAmount;
        const noiseIntensityVariation =
          noiseWarp.noise(x * config.noiseScale * 0.05 + 1000) * 0.4 + 0.6;
        const leftNoiseBias = config.leftNoiseBias ?? 0.8;
        const rightNoiseBias = config.rightNoiseBias ?? 1.2;
        const sideNoiseBias = isLeft ? leftNoiseBias : rightNoiseBias;
        const noisePositionFalloff = config.noisePositionFalloff ?? 0.7;
        const positionBasedIntensity = Math.pow(distFromPeak, noisePositionFalloff);
        const noiseIntensity = noiseIntensityVariation * sideNoiseBias * positionBasedIntensity;
        const noise1Value = noise1.noise(warpedX * config.noiseScale * 0.3);
        const noise2Value = noise2.noise(warpedX * config.noiseScale * 0.6);
        const noise3Value = noise3.noise(warpedX * config.noiseScale * 1.2);
        const combinedNoise = noise1Value * 0.5 + noise2Value * 0.3 + noise3Value * 0.2;
        const walkStep = (combinedNoise - 0.5) * walkStrength;
        randomWalk += walkStep * 0.1;
        randomWalk *= 0.95;
        const baseNoiseStrength = config.noiseStrength ?? 0.15;
        const variation =
          (combinedNoise - 0.5) * heightRange * baseNoiseStrength * noiseIntensity +
          randomWalk;
        const totalHeight = baseHeightVariation + variation;
        const y = baseY - totalHeight;
        points.push({ x, y });
      }
      return points;
    };

    // Helper function to draw a single mountain using noise
    const drawMountain = (config: MountainConfig, layerIndex: number = 0, points?: { x: number; y: number }[]) => {
      const peakX = config.peakX * displayWidth;
      // Use leftX/rightX if provided, otherwise fall back to baseLeft/baseRight for backward compatibility
      const baseLeftX =
        (config.leftX !== undefined ? config.leftX : config.baseLeft ?? -0.2) *
        displayWidth;
      const baseRightX =
        (config.rightX !== undefined
          ? config.rightX
          : config.baseRight ?? 1.2) * displayWidth;
      const baseY = config.baseHeight * displayHeight;
      const peakY = config.peakHeight * displayHeight;

      // Calculate mountain width and height range
      const mountainWidth = baseRightX - baseLeftX;
      const heightRange = baseY - peakY;

      // Use provided points if available, otherwise calculate them
      const mountainPoints = points ?? calculateMountainPoints(config, layerIndex);

      // Draw mountain shape with smooth curves using cubic bezier
      ctx.beginPath();
      ctx.moveTo(baseLeftX, baseY);
      ctx.lineTo(mountainPoints[0].x, mountainPoints[0].y);

      // Draw smooth cubic bezier curves connecting all points
      // Use Catmull-Rom style control points for smooth continuity
      for (let i = 0; i < mountainPoints.length - 1; i++) {
        const p0 = i > 0 ? mountainPoints[i - 1] : mountainPoints[i];
        const p1 = mountainPoints[i];
        const p2 = mountainPoints[i + 1];
        const p3 = i < mountainPoints.length - 2 ? mountainPoints[i + 2] : p2;

        // Calculate smooth control points using Catmull-Rom spline approach
        // This ensures C1 continuity (smooth first derivative)
        const baseTension = 0.5; // Base curve tightness

        // Calculate base tangent vectors
        const dx1 = (p2.x - p0.x) * baseTension;
        const dy1 = (p2.y - p0.y) * baseTension;
        const dx2 = (p3.x - p1.x) * baseTension;
        const dy2 = (p3.y - p1.y) * baseTension;

        // Calculate control points (standard Catmull-Rom)
        const cp1x = p1.x + dx1 / 3;
        const cp1y = p1.y + dy1 / 3;
        const cp2x = p2.x - dx2 / 3;
        const cp2y = p2.y - dy2 / 3;

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
      }

      // Clip to water level - only draw above water (65% from top)
      ctx.lineTo(baseRightX, baseY);
      ctx.lineTo(baseRightX, waterLevel); // Stop at water level instead of displayHeight
      ctx.lineTo(baseLeftX, waterLevel); // Stop at water level
      ctx.lineTo(baseLeftX, baseY);
      ctx.closePath();

      // Save the path for later use (shadows, mist)
      ctx.save();

      // Calculate atmospheric perspective (distant mountains are lighter, more desaturated)
      // Use pre-calculated baseColorRGB and skyColorRGB for performance
      const depthFactor = layerIndex / mountains.length; // 0 = front, 1 = back
      
      // Blend with sky color for distant mountains (atmospheric perspective)
      const atmosphericBlend = Math.pow(depthFactor, 1.5) * 0.4; // Stronger blend for distant
      const perspectiveColor = blendColors(baseColorRGB, skyColorRGB, atmosphericBlend);
      
      // Lighten distant mountains (haze effect)
      const lightenFactor = 1.0 + depthFactor * 0.6; // Up to 60% lighter
      let finalColor = adjustBrightness(perspectiveColor, lightenFactor);

      // Apply "behind mountains" darkness (when sun/moon is behind mountains)
      // Darken the base color and reduce lighting contrast
      const darknessFactor = 1.0 - behindMountainsDarkness * 0.6; // Darken by up to 60%
      finalColor = adjustBrightness(finalColor, darknessFactor);

      // Apply directional lighting (per-mountain, not global)
      // Use pre-calculated lightDirX, lightDirY, lightingStrength, shadowStrength
      if (currentLightingState) {
        // Calculate mountain center
        const mountainCenterX = peakX;
        const mountainCenterY = (baseY + config.peakHeight * displayHeight) / 2;
        
        // Reduce lighting contrast when light is behind mountains (less difference between lit/shadow)
        const contrastReduction = 1.0 - behindMountainsDarkness * 0.5; // Reduce contrast by up to 50%
        const adjustedLightingStrength = 1.0 + (lightingStrength - 1.0) * contrastReduction;
        const adjustedShadowStrength = 1.0 - (1.0 - shadowStrength) * contrastReduction;
        
        // Lit side (brighter - facing the light source)
        const litColor = adjustBrightness(finalColor, adjustedLightingStrength);
        // Shadow side (darker - facing away from light)
        const shadowColor = adjustBrightness(finalColor, adjustedShadowStrength);
        
        // Round colors only when outputting to canvas
        const finalColorRounded = roundColor(finalColor);
        const litColorRounded = roundColor(litColor);
        const shadowColorRounded = roundColor(shadowColor);
        
        // OPTIMIZED: Cache gradient - only recreate when lighting changes significantly
        const gradientKey = `${mountainCenterX}-${mountainCenterY}-${lightDirX}-${lightDirY}-${adjustedLightingStrength}-${adjustedShadowStrength}-${behindMountainsDarkness}-${finalColorRounded[0]}-${finalColorRounded[1]}-${finalColorRounded[2]}`;
        let gradient = gradientCacheRef.current.get(gradientKey);
        
        if (!gradient) {
          gradient = ctx.createLinearGradient(
            mountainCenterX + lightDirX * mountainWidth * 0.5, // Start at lit side (toward light)
            mountainCenterY + lightDirY * displayHeight * 0.3,
            mountainCenterX - lightDirX * mountainWidth * 0.5, // End at shadow side (away from light)
            mountainCenterY - lightDirY * displayHeight * 0.3
          );
          
          gradient.addColorStop(0, `rgb(${litColorRounded[0]},${litColorRounded[1]},${litColorRounded[2]})`);
          gradient.addColorStop(0.5, `rgb(${finalColorRounded[0]},${finalColorRounded[1]},${finalColorRounded[2]})`);
          gradient.addColorStop(1, `rgb(${shadowColorRounded[0]},${shadowColorRounded[1]},${shadowColorRounded[2]})`);
          
          // Cache the gradient (limit cache size to prevent memory issues)
          if (gradientCacheRef.current.size > 50) {
            const firstKey = gradientCacheRef.current.keys().next().value;
            gradientCacheRef.current.delete(firstKey);
          }
          gradientCacheRef.current.set(gradientKey, gradient);
        }
        
        ctx.fillStyle = gradient;
      } else {
        const finalColorRounded = roundColor(finalColor);
        ctx.fillStyle = `rgb(${finalColorRounded[0]},${finalColorRounded[1]},${finalColorRounded[2]})`;
      }
      
      // Mountains are fully opaque (solid) - atmospheric perspective achieved through color blending only
      ctx.globalAlpha = 1.0;
      ctx.fill();

      ctx.restore();

      // NO STROKE - using mist for differentiation instead
      return mountainPoints; // Return points for mist layer generation
    };

    // Helper function to draw cast shadow
    const drawShadow = (config: MountainConfig, mountainPoints: { x: number; y: number }[]) => {
      if (!currentLightingState || currentLightingState.shadowOpacity === 0) return;

      const peakX = config.peakX * displayWidth;
      const baseLeftX =
        (config.leftX !== undefined ? config.leftX : config.baseLeft ?? -0.2) *
        displayWidth;
      const baseRightX =
        (config.rightX !== undefined
          ? config.rightX
          : config.baseRight ?? 1.2) * displayWidth;
      const baseY = config.baseHeight * displayHeight;

      ctx.save();

      // Shadow offset based on light direction
      const shadowOffsetX = currentLightingState.shadowDirection.x * currentLightingState.shadowOffset;
      const shadowOffsetY = currentLightingState.shadowDirection.y * currentLightingState.shadowOffset;

      // Create shadow path (offset mountain silhouette)
      // Clip to water level - shadows below water aren't visible
      ctx.beginPath();
      ctx.moveTo(baseLeftX + shadowOffsetX, Math.min(baseY + shadowOffsetY, waterLevel));
      
      for (const point of mountainPoints) {
        const shadowY = Math.min(point.y + shadowOffsetY, waterLevel);
        ctx.lineTo(point.x + shadowOffsetX, shadowY);
      }
      
      ctx.lineTo(baseRightX + shadowOffsetX, Math.min(baseY + shadowOffsetY, waterLevel));
      ctx.lineTo(baseRightX + shadowOffsetX, waterLevel);
      ctx.lineTo(baseLeftX + shadowOffsetX, waterLevel);
      ctx.closePath();

      // Apply shadow with gradient for soft edges
      // OPTIMIZED: Cache shadow gradient
      const shadowGradientKey = `${peakX + shadowOffsetX}-${config.peakHeight * displayHeight + shadowOffsetY}-${currentLightingState.shadowOpacity}-${Math.max(displayWidth, displayHeight)}`;
      let shadowGradient = gradientCacheRef.current.get(shadowGradientKey);
      
      if (!shadowGradient) {
        shadowGradient = ctx.createRadialGradient(
          peakX + shadowOffsetX, 
          config.peakHeight * displayHeight + shadowOffsetY,
          0,
          peakX + shadowOffsetX,
          config.peakHeight * displayHeight + shadowOffsetY,
          Math.max(displayWidth, displayHeight) * 0.5
        );
        shadowGradient.addColorStop(0, `rgba(0, 0, 0, ${currentLightingState.shadowOpacity})`);
        shadowGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        
        // Cache the gradient (limit cache size)
        if (gradientCacheRef.current.size > 50) {
          const firstKey = gradientCacheRef.current.keys().next().value;
          gradientCacheRef.current.delete(firstKey);
        }
        gradientCacheRef.current.set(shadowGradientKey, shadowGradient);
      }

      ctx.fillStyle = shadowGradient;
      ctx.filter = `blur(${currentLightingState.shadowBlur}px)`;
      ctx.fill();
      ctx.filter = "none";

      ctx.restore();
    };

    // Helper function to draw mist layer
    const drawMist = (config: MountainConfig, mountainPoints: { x: number; y: number }[], layerIndex: number) => {
      if (!currentLightingState || currentLightingState.mistOpacity === 0) return;

      const baseLeftX =
        (config.leftX !== undefined ? config.leftX : config.baseLeft ?? -0.2) *
        displayWidth;
      const baseRightX =
        (config.rightX !== undefined
          ? config.rightX
          : config.baseRight ?? 1.2) * displayWidth;
      const baseY = config.baseHeight * displayHeight;
      const mistHeightPx = (baseY - config.peakHeight * displayHeight) * currentLightingState.mistHeight;

      // OPTIMIZED: Reduce mist layers for better performance
      // Draw fewer mist layers (max 2 instead of 3) for distant mountains
      const maxMistLayers = Math.min(currentLightingState.mistLayers, layerIndex < mountains.length / 2 ? 2 : 3);
      for (let layer = 0; layer < maxMistLayers; layer++) {
        const layerProgress = layer / Math.max(1, currentLightingState.mistLayers - 1);
        const layerHeight = baseY - mistHeightPx * layerProgress;
        const layerOpacity = currentLightingState.mistOpacity * (1 - layerProgress * 0.5);

        ctx.save();
        ctx.beginPath();
        
        // Create wavy mist band (only above water level)
        const mistBottom = Math.min(layerHeight + 20, waterLevel); // Don't draw below water
        if (layerHeight >= waterLevel) {
          ctx.restore();
          continue; // Skip if mist is entirely below water
        }
        
        ctx.moveTo(baseLeftX, Math.max(layerHeight, waterLevel));
        for (let i = 0; i < mountainPoints.length; i++) {
          const point = mountainPoints[i];
          // Only draw mist below the mountain peak and above water
          if (point.y < layerHeight && point.y >= waterLevel) {
            const mistY = Math.max(layerHeight + Math.sin(point.x * 0.01 + layer) * 3, waterLevel);
            ctx.lineTo(point.x, mistY);
          }
        }
        ctx.lineTo(baseRightX, Math.max(layerHeight, waterLevel));
        ctx.lineTo(baseRightX, mistBottom);
        ctx.lineTo(baseLeftX, mistBottom);
        ctx.closePath();

        // Gradient for soft mist
        const mistGradient = ctx.createLinearGradient(0, layerHeight - 10, 0, layerHeight + 20);
        const mistColor = currentLightingState.isDaytime ? "255, 255, 255" : "200, 220, 255";
        mistGradient.addColorStop(0, `rgba(${mistColor}, 0)`);
        mistGradient.addColorStop(0.5, `rgba(${mistColor}, ${layerOpacity})`);
        mistGradient.addColorStop(1, `rgba(${mistColor}, 0)`);

        ctx.fillStyle = mistGradient;
        ctx.fill();

        ctx.restore();
      }
    };
    // Draw all mountains back-to-front with shadows and mist
    const mountainData: Array<{ config: MountainConfig; points: { x: number; y: number }[]; layerIndex: number }> = [];
    
    // First pass: collect mountain data with layer indices (calculate points without drawing)
    mountains.forEach((mountain, index) => {
      const points = calculateMountainPoints(mountain, index);
      mountainData.push({ config: mountain, points, layerIndex: index });
    });

    // Second pass: draw shadows from back to front
    if (currentLightingState && currentLightingState.shadowOpacity > 0) {
      for (let i = mountainData.length - 1; i >= 0; i--) {
        drawShadow(mountainData[i].config, mountainData[i].points);
      }
    }

    // Third pass: draw mountains
    mountainData.forEach(({ config, points, layerIndex }) => {
      // Draw the mountain with proper layer index for atmospheric perspective
      drawMountain(config, layerIndex, points);
    });

    // Fourth pass: draw mist layers for depth differentiation
    // REMOVED: Mist drawing for performance - was causing significant CPU usage
    // mountainData.forEach(({ config, points }) => {
    //   drawMist(config, points);
    // });
    
    // OPTIMIZED: Frame budget enforcement (game dev technique)
    const frameTime = performance.now() - frameStart;
    if (frameTime > frameBudget.maxFrameTime) {
      // Clear caches if frame took too long (might be memory pressure)
      if (gradientCacheRef.current.size > 20) {
        gradientCacheRef.current.clear();
      }
    }
  }, [dimensions.width, dimensions.height, mountains]);
  
  // Throttled render using requestAnimationFrame for lighting state changes
  // This prevents excessive re-renders during smooth color transitions
  useEffect(() => {
    // Update refs immediately
    lightingStateRef.current = lightingState;
    colorRef.current = color;
    
    // Schedule a throttled render
    if (animationFrameRef.current !== null) return; // Already scheduled
    
    animationFrameRef.current = requestAnimationFrame(() => {
      renderMountains();
      animationFrameRef.current = null;
    });
    
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [lightingState, color, renderMountains]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "transparent", // Explicitly transparent
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          backgroundColor: "transparent",
          willChange: "transform", // GPU acceleration hint
        }}
      />

      {/* Control Panel */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          background: "rgba(0, 0, 0, 0.8)",
          color: "white",
          padding: "20px",
          borderRadius: "8px",
          maxWidth: "400px",
          maxHeight: "90vh",
          overflowY: "auto",
          fontFamily: "monospace",
          fontSize: "12px",
          zIndex: 10001, // Higher than canvas layers
          display: showControls ? "block" : "none",
          pointerEvents: "auto", // Ensure controls are clickable
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
          <h3 style={{ margin: 0 }}>Mountain Controls</h3>
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
        </div>

        {/* Parameter Sliders */}
        {mountains[selectedLayer] && (
          <>
            <SliderControl
              label="Peak X"
              value={mountains[selectedLayer].peakX}
              min={-2}
              max={3}
              step={0.01}
              onChange={(val) => {
                const updated = [...mountains];
                updated[selectedLayer] = {
                  ...updated[selectedLayer],
                  peakX: val,
                };
                setMountains(updated);
              }}
            />
            <SliderControl
              label="Left X"
              value={mountains[selectedLayer].leftX ?? -0.2}
              min={-5}
              max={2}
              step={0.01}
              onChange={(val) => {
                const updated = [...mountains];
                updated[selectedLayer] = {
                  ...updated[selectedLayer],
                  leftX: val,
                };
                setMountains(updated);
              }}
            />
            <SliderControl
              label="Right X"
              value={mountains[selectedLayer].rightX ?? 1.2}
              min={-2}
              max={5}
              step={0.01}
              onChange={(val) => {
                const updated = [...mountains];
                updated[selectedLayer] = {
                  ...updated[selectedLayer],
                  rightX: val,
                };
                setMountains(updated);
              }}
            />
            <SliderControl
              label="Base Height"
              value={mountains[selectedLayer].baseHeight}
              min={0}
              max={1}
              step={0.01}
              onChange={(val) => {
                const updated = [...mountains];
                updated[selectedLayer] = {
                  ...updated[selectedLayer],
                  baseHeight: val,
                };
                setMountains(updated);
              }}
            />
            <SliderControl
              label="Peak Height"
              value={mountains[selectedLayer].peakHeight}
              min={0}
              max={1}
              step={0.01}
              onChange={(val) => {
                const updated = [...mountains];
                updated[selectedLayer] = {
                  ...updated[selectedLayer],
                  peakHeight: val,
                };
                setMountains(updated);
              }}
            />
            <SliderControl
              label="Noise Scale"
              value={mountains[selectedLayer].noiseScale}
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
              }}
            />
            <SliderControl
              label="Noise Strength"
              value={mountains[selectedLayer].noiseStrength ?? 0.15}
              min={0}
              max={1}
              step={0.01}
              onChange={(val) => {
                const updated = [...mountains];
                updated[selectedLayer] = {
                  ...updated[selectedLayer],
                  noiseStrength: val,
                };
                setMountains(updated);
              }}
            />
            <SliderControl
              label="Left Noise Bias"
              value={mountains[selectedLayer].leftNoiseBias ?? 0.8}
              min={0}
              max={5}
              step={0.1}
              onChange={(val) => {
                const updated = [...mountains];
                updated[selectedLayer] = {
                  ...updated[selectedLayer],
                  leftNoiseBias: val,
                };
                setMountains(updated);
              }}
            />
            <SliderControl
              label="Right Noise Bias"
              value={mountains[selectedLayer].rightNoiseBias ?? 1.2}
              min={0}
              max={5}
              step={0.1}
              onChange={(val) => {
                const updated = [...mountains];
                updated[selectedLayer] = {
                  ...updated[selectedLayer],
                  rightNoiseBias: val,
                };
                setMountains(updated);
              }}
            />
            <SliderControl
              label="Noise Position Falloff"
              value={mountains[selectedLayer].noisePositionFalloff ?? 0.7}
              min={0}
              max={5}
              step={0.1}
              onChange={(val) => {
                const updated = [...mountains];
                updated[selectedLayer] = {
                  ...updated[selectedLayer],
                  noisePositionFalloff: val,
                };
                setMountains(updated);
              }}
            />
            <SliderControl
              label="Left Side Curvature"
              value={mountains[selectedLayer].leftSideCurvature ?? 1}
              min={0.1}
              max={10}
              step={0.1}
              onChange={(val) => {
                const updated = [...mountains];
                updated[selectedLayer] = {
                  ...updated[selectedLayer],
                  leftSideCurvature: val,
                };
                setMountains(updated);
              }}
            />
            <SliderControl
              label="Right Side Curvature"
              value={mountains[selectedLayer].rightSideCurvature ?? 1}
              min={0.1}
              max={10}
              step={0.1}
              onChange={(val) => {
                const updated = [...mountains];
                updated[selectedLayer] = {
                  ...updated[selectedLayer],
                  rightSideCurvature: val,
                };
                setMountains(updated);
              }}
            />

            {/* Peak Shape Selector */}
            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                Peak Shape
              </label>
              <select
                value={mountains[selectedLayer].peakShape}
                onChange={(e) => {
                  const updated = [...mountains];
                  updated[selectedLayer] = {
                    ...updated[selectedLayer],
                    peakShape: e.target.value as PeakShapeFunction,
                  };
                  setMountains(updated);
                }}
                style={{
                  width: "100%",
                  padding: "5px",
                  background: "#333",
                  color: "white",
                  border: "1px solid #555",
                }}
              >
                {Object.values(PeakShapeFunction).map((shape) => (
                  <option key={shape} value={shape}>
                    {shape}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* Export Button */}
        <button
          onClick={() => {
            console.log("=== MOUNTAIN CONFIGURATION ===");
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
          zIndex: 10001, // Match control panel z-index
          pointerEvents: "auto", // Ensure button is clickable
        }}
      >
        {showControls ? "👁️ Hide Controls" : "⚙️ Show Controls"}
      </button>
    </div>
  );
}

export default memo(MountainBackground);

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
    <div style={{ marginBottom: "10px" }}>
      <label style={{ display: "block", marginBottom: "5px" }}>
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

