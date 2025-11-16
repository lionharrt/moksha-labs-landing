"use client";

import { useRef, useEffect, useState, memo } from "react";
import type React from "react";
import { performanceLogger } from "@/utils/performanceLogger";
import { useIntroContext } from "@/contexts/IntroContext";
import { useLightingContext } from "@/contexts/LightingContext";

export enum PeakShapeFunction {
  LINEAR = "linear",
  SMOOTHSTEP = "smoothstep",
  QUADRATIC = "quadratic",
  CUBIC = "cubic",
  POWER = "power",
  EXPONENTIAL = "exponential",
  SINE = "sine",
}
// Initial mountain configurations - Updated from slider controls
const initialMountains: MountainConfig[] = [
  {
    peakX: 0.27,
    leftX: 0.16,
    rightX: 1.07,
    baseHeight: 0.46,
    peakHeight: 0.14,
    noiseScale: 0.07,
    noiseStrength: 0.23,
    leftNoiseBias: 3.3,
    rightNoiseBias: 2.9,
    noisePositionFalloff: 0.7,
    noiseOffset: 100,
    leftSideCurvature: 0.3,
    rightSideCurvature: 5.8,
    peakShape: PeakShapeFunction.SMOOTHSTEP,
    curvature: 1.7,
  },
  {
    peakX: 0.53,
    leftX: -1.41,
    rightX: 1.88,
    baseHeight: 0.16,
    peakHeight: 0.6,
    noiseScale: 0.048,
    noiseStrength: 0.28,
    leftNoiseBias: 2.1,
    rightNoiseBias: 3,
    noisePositionFalloff: 0.5,
    noiseOffset: 200,
    leftSideCurvature: 10,
    rightSideCurvature: 2.5,
    peakShape: PeakShapeFunction.SINE,
    curvature: 1,
  },
  {
    peakX: 0.73,
    leftX: -0.03,
    rightX: 1.52,
    baseHeight: 0.78,
    peakHeight: 0.34,
    noiseScale: 0.035,
    noiseStrength: 0.29,
    leftNoiseBias: 1.3,
    rightNoiseBias: 2.3,
    noisePositionFalloff: 0.4,
    noiseOffset: 300,
    leftSideCurvature: 1.6,
    rightSideCurvature: 5.6,
    peakShape: PeakShapeFunction.SMOOTHSTEP,
    curvature: 1.8,
  },
  {
    peakX: 0.23,
    leftX: -0.37,
    rightX: 0.52,
    baseHeight: 0.55,
    peakHeight: 0.44,
    noiseScale: 0.065,
    noiseStrength: 1,
    leftNoiseBias: 3,
    rightNoiseBias: 1.7,
    noisePositionFalloff: 0,
    noiseOffset: 400,
    leftSideCurvature: 0.1,
    rightSideCurvature: 1.8,
    peakShape: PeakShapeFunction.SMOOTHSTEP,
    curvature: 3.3,
  },
  {
    peakX: 0.31,
    leftX: -1.07,
    rightX: 1.33,
    baseHeight: 0.68,
    peakHeight: 0.47,
    noiseScale: 0.055,
    noiseStrength: 0.99,
    leftNoiseBias: 2.4,
    rightNoiseBias: 1.2,
    noisePositionFalloff: 0.4,
    noiseOffset: 500,
    leftSideCurvature: 10,
    rightSideCurvature: 9.5,
    peakShape: PeakShapeFunction.SINE,
    curvature: 1.3,
  },
  {
    peakX: 0.68,
    leftX: -0.22,
    rightX: 1.55,
    baseHeight: 0.7,
    peakHeight: 0.43,
    noiseScale: 0.076,
    noiseStrength: 0.59,
    leftNoiseBias: 1.5,
    rightNoiseBias: 1.1,
    noisePositionFalloff: 0.1,
    noiseOffset: 600,
    leftSideCurvature: 2.8,
    rightSideCurvature: 5.1,
    peakShape: PeakShapeFunction.SMOOTHSTEP,
  },
  {
    peakX: 0.29,
    leftX: -0.55,
    rightX: 1.45,
    baseHeight: 0.47,
    peakHeight: 0.6,
    noiseScale: 0.063,
    noiseStrength: 0.87,
    leftNoiseBias: 1.3,
    rightNoiseBias: 2,
    noisePositionFalloff: 0.5,
    noiseOffset: 700,
    leftSideCurvature: 5.2,
    rightSideCurvature: 4.5,
    peakShape: PeakShapeFunction.SMOOTHSTEP,
    curvature: 1.1,
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

interface MountainBackgroundProps {
  width?: number;
  height?: number;
  color?: string;
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
}: MountainBackgroundProps) {
  const { introProgressRef } = useIntroContext();
  const { lightSourceRef } = useLightingContext();
  performanceLogger.logRender("MountainBackground");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const [showControls, setShowControls] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState(0);
  const canvasSizeRef = useRef({ width: 0, height: 0, dpr: 1 }); // Cache canvas size to avoid resizing every frame

  // OPTIMIZED: Cache mountain paths (Path2D objects) - only recalculate when dimensions/mountains change
  // LRU cache with size limit to prevent memory leaks
  const MAX_PATH_CACHE_SIZE = 100;
  const mountainPathsCacheRef = useRef<Map<string, Path2D>>(new Map());
  const mountainPointsCacheRef = useRef<
    Map<string, { x: number; y: number }[]>
  >(new Map());

  // Helper function to enforce LRU cache size limit
  const enforceCacheLimit = <T,>(cache: Map<string, T>, maxSize: number) => {
    if (cache.size > maxSize) {
      // Remove oldest entries (first keys in Map iteration order)
      const keysToRemove = Array.from(cache.keys()).slice(
        0,
        cache.size - maxSize
      );
      keysToRemove.forEach((key) => cache.delete(key));
    }
  };

  const [mountains, setMountains] =
    useState<MountainConfig[]>(initialMountains);

  const animationFrameIdRef = useRef<number | null>(null);

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
  }, [dimensions.width, dimensions.height]);

  // CRITICAL: Clear caches when mountains state changes (controls updated)
  // Without this, control changes won't take effect due to cached mountain shapes
  useEffect(() => {
    mountainPathsCacheRef.current.clear();
    mountainPointsCacheRef.current.clear();
  }, [mountains]);

  // Render function extracted for requestAnimationFrame throttling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI displays (these don't change per frame)
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = dimensions.width;
    const displayHeight = dimensions.height;

    // Current lighting configuration
    const currentMountainColor = color;

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
      canvasSizeRef.current = {
        width: newCanvasWidth,
        height: newCanvasHeight,
        dpr,
      };
    }
    // Note: Don't call scale() again if canvas hasn't changed - it's already scaled

    // Use lighting color if available, otherwise fallback to prop color
    const mountainBaseColor = currentMountainColor ?? color;

    // Pre-calculate colors ONCE (performance optimization)
    // Parse colors as floats to maintain precision throughout calculations
    const parseColor = (colorStr: string): [number, number, number] => {
      if (colorStr.startsWith("rgb")) {
        const match = colorStr.match(/\d+/g);
        if (match) {
          return [
            parseFloat(match[0]),
            parseFloat(match[1]),
            parseFloat(match[2]),
          ]; // Use parseFloat for precision
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

    // Helper to round colors when outputting to canvas
    const roundColor = (
      c: [number, number, number]
    ): [number, number, number] => {
      return [Math.round(c[0]), Math.round(c[1]), Math.round(c[2])];
    };

    // Helper function to calculate mountain points without drawing
    const calculateMountainPoints = (
      config: MountainConfig,
      layerIndex: number = 0
    ): { x: number; y: number }[] => {
      // OPTIMIZED: Cache mountain points - recalculate when any shape-affecting parameters change
      const cacheKey = `${config.peakX}-${config.baseHeight}-${config.peakHeight}-${config.noiseScale}-${config.noiseStrength}-${config.leftNoiseBias}-${config.rightNoiseBias}-${config.noisePositionFalloff}-${config.noiseOffset}-${config.peakShape}-${config.curvature}-${config.leftSideCurvature}-${config.rightSideCurvature}-${displayWidth}-${displayHeight}-${layerIndex}`;
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
        const positionBasedIntensity = Math.pow(
          distFromPeak,
          noisePositionFalloff
        );
        const noiseIntensity =
          noiseIntensityVariation * sideNoiseBias * positionBasedIntensity;
        const noise1Value = noise1.noise(warpedX * config.noiseScale * 0.3);
        const noise2Value = noise2.noise(warpedX * config.noiseScale * 0.6);
        const noise3Value = noise3.noise(warpedX * config.noiseScale * 1.2);
        const combinedNoise =
          noise1Value * 0.5 + noise2Value * 0.3 + noise3Value * 0.2;
        const walkStep = (combinedNoise - 0.5) * walkStrength;
        randomWalk += walkStep * 0.1;
        randomWalk *= 0.95;
        const baseNoiseStrength = config.noiseStrength ?? 0.15;
        const variation =
          (combinedNoise - 0.5) *
            heightRange *
            baseNoiseStrength *
            noiseIntensity +
          randomWalk;
        const totalHeight = baseHeightVariation + variation;
        const y = baseY - totalHeight;
        points.push({ x, y });
      }

      // Cache the points (enforce LRU cache size limit)
      mountainPointsCacheRef.current.set(cacheKey, points);
      enforceCacheLimit(mountainPointsCacheRef.current, MAX_PATH_CACHE_SIZE);

      return points;
    };

    // Helper function to draw a single mountain using noise
    const drawMountain = (
      config: MountainConfig,
      layerIndex: number = 0,
      points?: { x: number; y: number }[]
    ) => {
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

      // Use provided points if available, otherwise calculate them
      const mountainPoints =
        points ?? calculateMountainPoints(config, layerIndex);

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

      // Complete the mountain shape
      ctx.lineTo(baseRightX, baseY);
      ctx.lineTo(baseRightX, displayHeight);
      ctx.lineTo(baseLeftX, displayHeight);
      ctx.lineTo(baseLeftX, baseY);
      ctx.closePath();

      // Fill mountain with depth-based color
      // Mountains are drawn back-to-front, so index 0 = farthest, highest index = closest
      ctx.save();

      // Calculate depth factor: 0 = closest (front), 1 = farthest (back)
      const depthFactor = layerIndex / (mountains.length - 1);

      // Lighten distant mountains, darken close mountains
      // Far mountains blend more with sky (lighter), close mountains are darker
      const lightnessAdjust = 0.6 + depthFactor * 0.8; // Range: 0.6 (close/dark) to 1.4 (far/light)

      const layerColor: [number, number, number] = [
        Math.min(255, baseColorRGB[0] * lightnessAdjust),
        Math.min(255, baseColorRGB[1] * lightnessAdjust),
        Math.min(255, baseColorRGB[2] * lightnessAdjust),
      ];

      const finalColorRounded = roundColor(layerColor);
      ctx.fillStyle = `rgb(${finalColorRounded[0]},${finalColorRounded[1]},${finalColorRounded[2]})`;
      ctx.globalAlpha = 1.0;
      ctx.fill();
      ctx.restore();

      return mountainPoints;
    };

    // Pre-calculate mountain data (only once, doesn't change per frame)
    const mountainData: Array<{
      config: MountainConfig;
      points: { x: number; y: number }[];
      layerIndex: number;
    }> = [];

    mountains.forEach((mountain, index) => {
      const points = calculateMountainPoints(mountain, index);
      mountainData.push({ config: mountain, points, layerIndex: index });
    });

    // ============================================================================
    // RENDER LOOP: Runs every frame to update as sun moves
    // ============================================================================
    const render = () => {
      // Get light source position from context (GSAP-animated SVG element)
      const lightSVG = lightSourceRef.current;
      if (!lightSVG) {
        animationFrameIdRef.current = requestAnimationFrame(render);
        return;
      }

      // Clear canvas
      ctx.clearRect(0, 0, displayWidth, displayHeight);

      // Draw mountains with base colors
      mountainData.forEach(({ config, points, layerIndex }) => {
        drawMountain(config, layerIndex, points);
      });

      // Store rafId in ref for cleanup
      animationFrameIdRef.current = requestAnimationFrame(render);
    };

    // Start the render loop
    animationFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      // Cleanup: cancel animation frame when component unmounts or dependencies change
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    };
    // Note: lightSourceRef is intentionally excluded - it's a stable ref that doesn't trigger updates
    // The render loop checks lightSourceRef.current every frame via requestAnimationFrame
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimensions.width, dimensions.height, mountains, color]);

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
          zIndex: 1000, // Higher than canvas layers
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            overflowY: "auto",
            maxHeight: "38vh",
          }}
        >
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
                label="Peak Curvature"
                value={mountains[selectedLayer].curvature ?? 1}
                min={0.1}
                max={5}
                step={0.1}
                onChange={(val) => {
                  const updated = [...mountains];
                  updated[selectedLayer] = {
                    ...updated[selectedLayer],
                    curvature: val,
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
        </div>
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
