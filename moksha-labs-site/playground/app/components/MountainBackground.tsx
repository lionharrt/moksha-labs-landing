"use client";

import { useRef, useEffect, useState } from "react";

interface MountainBackgroundProps {
  width?: number;
  height?: number;
  color?: string;
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

export default function MountainBackground({
  width,
  height,
  color = "#2D5A5A",
}: MountainBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const [showControls, setShowControls] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState(0);

  // Initial mountain configurations - Updated from slider controls
  const initialMountains: MountainConfig[] = [
    {
      peakX: 0.36,
      leftX: -0.2,
      rightX: 1.01,
      baseHeight: 0.58,
      peakHeight: 0.35,
      noiseScale: 0.062,
      noiseStrength: 0.53,
      leftNoiseBias: 2,
      rightNoiseBias: 0.7,
      noisePositionFalloff: 2,
      noiseOffset: 100,
      leftSideCurvature: 10,
      rightSideCurvature: 10,
      peakShape: PeakShapeFunction.SMOOTHSTEP,
    },
    {
      peakX: -0.05,
      leftX: -0.02,
      rightX: 0.93,
      baseHeight: 0.54,
      peakHeight: 0.28,
      noiseScale: 0.031,
      noiseStrength: 0.47,
      leftNoiseBias: 1.6,
      rightNoiseBias: 2.2,
      noisePositionFalloff: 1.8,
      noiseOffset: 200,
      leftSideCurvature: 0.1,
      rightSideCurvature: 9.3,
      peakShape: PeakShapeFunction.SINE,
    },
    {
      peakX: 1.07,
      leftX: -1.14,
      rightX: 1.43,
      baseHeight: 0.64,
      peakHeight: 0.33,
      noiseScale: 0.037,
      noiseStrength: 0.17,
      leftNoiseBias: 0.7,
      rightNoiseBias: 0.8,
      noisePositionFalloff: 1.6,
      noiseOffset: 300,
      leftSideCurvature: 10,
      rightSideCurvature: 1.6,
      peakShape: PeakShapeFunction.SMOOTHSTEP,
    },
    {
      peakX: 0.54,
      leftX: 0.02,
      rightX: 1.08,
      baseHeight: 0.52,
      peakHeight: 0.17,
      noiseScale: 0.024,
      noiseStrength: 0.04,
      leftNoiseBias: 4,
      rightNoiseBias: 3.9,
      noisePositionFalloff: 0,
      noiseOffset: 400,
      leftSideCurvature: 8,
      rightSideCurvature: 4.4,
      peakShape: PeakShapeFunction.SMOOTHSTEP,
    },
    {
      peakX: -0.04,
      leftX: -0.35,
      rightX: 1.35,
      baseHeight: 0.64,
      peakHeight: 0.44,
      noiseScale: 0.056,
      noiseStrength: 0.83,
      leftNoiseBias: 1,
      rightNoiseBias: 1.2,
      noisePositionFalloff: 1.3,
      noiseOffset: 500,
      leftSideCurvature: 5.4,
      rightSideCurvature: 10,
      peakShape: PeakShapeFunction.SINE,
    },
    {
      peakX: 1.26,
      leftX: -0.22,
      rightX: 1.45,
      baseHeight: 0.68,
      peakHeight: 0.48,
      noiseScale: 0.018,
      noiseStrength: 0.42,
      leftNoiseBias: 1.5,
      rightNoiseBias: 1.1,
      noisePositionFalloff: 1,
      noiseOffset: 600,
      leftSideCurvature: 2.8,
      rightSideCurvature: 1.5,
      peakShape: PeakShapeFunction.SMOOTHSTEP,
    },
    {
      peakX: -1,
      leftX: -4,
      rightX: 1.45,
      baseHeight: 0.83,
      peakHeight: 0.42,
      noiseScale: 0.021,
      noiseStrength: 0.25,
      leftNoiseBias: 1.1,
      rightNoiseBias: 2,
      noisePositionFalloff: 1,
      noiseOffset: 700,
      leftSideCurvature: 1.5,
      rightSideCurvature: 1,
      peakShape: PeakShapeFunction.SMOOTHSTEP,
    },
    {
      peakX: 1.14,
      leftX: -0.6,
      rightX: 1.6,
      baseHeight: 0.99,
      peakHeight: 0.7,
      noiseScale: 0.036,
      noiseStrength: 0.48,
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
      baseHeight: 0.96,
      peakHeight: 0.52,
      noiseScale: 0.025,
      noiseStrength: 0.13,
      leftNoiseBias: 1.2,
      rightNoiseBias: 4,
      noisePositionFalloff: 2.8,
      noiseOffset: 900,
      leftSideCurvature: 1.8,
      rightSideCurvature: 1,
      peakShape: PeakShapeFunction.SINE,
    },
    {
      peakX: 1,
      leftX: 0.11,
      rightX: 1.89,
      baseHeight: 0.9,
      peakHeight: 0.75,
      noiseScale: 0.032,
      noiseStrength: 0.75,
      leftNoiseBias: 1,
      rightNoiseBias: 1,
      noisePositionFalloff: 0.5,
      noiseOffset: 1000,
      leftSideCurvature: 8.3,
      rightSideCurvature: 1.6,
      peakShape: PeakShapeFunction.SMOOTHSTEP,
    },
    {
      peakX: 0.38,
      leftX: -3.57,
      rightX: 1.25,
      baseHeight: 0.98,
      peakHeight: 0.88,
      noiseScale: 0.035,
      noiseStrength: 0.82,
      leftNoiseBias: 1,
      rightNoiseBias: 2.5,
      noisePositionFalloff: 0.5,
      noiseOffset: 1100,
      leftSideCurvature: 1.6,
      rightSideCurvature: 4,
      peakShape: PeakShapeFunction.SMOOTHSTEP,
    },
    {
      peakX: -1.11,
      leftX: -1.96,
      rightX: 0.6,
      baseHeight: 1,
      peakHeight: 0.47,
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
      peakX: 3,
      leftX: 0.56,
      rightX: 1.02,
      baseHeight: 1,
      peakHeight: 0.18,
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = dimensions.width;
    const displayHeight = dimensions.height;

    // Set actual size in memory (scaled for DPI)
    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;

    // Scale the canvas back down using CSS
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    // Scale the drawing context so everything draws at the correct size
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, displayWidth, displayHeight);

    // Helper function to draw a single mountain using noise
    const drawMountain = (config: MountainConfig) => {
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

      // Create noise generator for this mountain
      const noise = new SimpleNoise(config.noiseOffset);

      // Calculate mountain width and height range
      const mountainWidth = baseRightX - baseLeftX;
      const heightRange = baseY - peakY;

      // Generate ridgeline points using hybrid approach for lifelike, non-repeating shapes
      // Combine multiple techniques: warped noise, random walk, and multiple noise layers
      const points: { x: number; y: number }[] = [];
      const numPoints = Math.max(300, Math.floor(mountainWidth / 0.5)); // Many more points for detailed curves

      // Create multiple independent noise generators for variety
      const noise1 = new SimpleNoise(config.noiseOffset);
      const noise2 = new SimpleNoise(config.noiseOffset + 1000);
      const noise3 = new SimpleNoise(config.noiseOffset + 2000);
      const noiseWarp = new SimpleNoise(config.noiseOffset + 5000);

      // Helper function to apply peak shape function with side-specific curvature
      const applyPeakShape = (t: number, sideCurvature: number): number => {
        // t is normalized distance from peak (0 = at peak, 1 = at edge/base)
        const normalized = Math.max(0, Math.min(1, t));
        const curvature = config.curvature ?? 1; // Peak shape curvature
        const invNorm = 1 - normalized; // Inverted for convenience (1 at peak, 0 at edge)

        // First apply the peak shape function
        let baseShape: number;
        switch (config.peakShape) {
          case PeakShapeFunction.LINEAR:
            baseShape = invNorm;
            break;

          case PeakShapeFunction.SMOOTHSTEP:
            // Apply curvature to smoothstep interpolation
            const smoothT = Math.pow(invNorm, curvature);
            baseShape = smoothT * smoothT * (3 - 2 * smoothT);
            break;

          case PeakShapeFunction.QUADRATIC:
            // Curvature controls the exponent: < 1 = more convex, > 1 = more concave
            baseShape = Math.pow(invNorm, 2 * curvature);
            break;

          case PeakShapeFunction.CUBIC:
            // Curvature controls the exponent
            baseShape = Math.pow(invNorm, 3 * curvature);
            break;

          case PeakShapeFunction.POWER:
            // Curvature directly controls the power exponent
            baseShape = Math.pow(invNorm, 0.8 * curvature);
            break;

          case PeakShapeFunction.EXPONENTIAL:
            // Curvature controls the decay rate: higher = sharper falloff
            baseShape = Math.exp(-normalized * 2 * curvature);
            break;

          case PeakShapeFunction.SINE:
            // Curvature controls the frequency/phase of the sine wave
            baseShape = Math.sin((invNorm * Math.PI) / (2 / curvature));
            break;

          default:
            baseShape = invNorm;
        }

        // Then apply side curvature to modify the overall slope shape
        // sideCurvature < 1 = convex (bulging outward, gentler slope that stays high)
        // sideCurvature > 1 = concave (hollow inward, steeper slope that drops quickly)
        if (sideCurvature !== 1) {
          // Apply power function to modify the falloff curve
          // baseShape ranges from 1 (at peak) to 0 (at base)
          // Power < 1 (e.g., 0.5 = square root) keeps values higher = convex/bulging
          // Power > 1 (e.g., 2.0 = square) makes values lower = concave/hollow
          baseShape = Math.pow(baseShape, sideCurvature);
        }

        return baseShape;
      };

      // Random walk accumulator for natural drift
      let randomWalk = 0;
      const walkStrength = heightRange * 0.02;

      const leftSideCurvature = config.leftSideCurvature ?? 1;
      const rightSideCurvature = config.rightSideCurvature ?? 1;

      for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints; // 0 to 1 across mountain width
        const x = baseLeftX + t * mountainWidth;

        // Determine which side of peak we're on and calculate normalized distance
        const isLeft = x < peakX;
        const distFromPeak = isLeft
          ? (peakX - x) / (peakX - baseLeftX) // 0 at peak, 1 at left base
          : (x - peakX) / (baseRightX - peakX); // 0 at peak, 1 at right base

        // Apply peak shape function with appropriate side curvature
        const sideCurvature = isLeft ? leftSideCurvature : rightSideCurvature;
        const baseShape = applyPeakShape(distFromPeak, sideCurvature);
        const baseHeightVariation = baseShape * heightRange;

        // Warped noise: distort coordinates using another noise function
        const warpAmount = noiseWarp.noise(x * config.noiseScale * 0.1) * 50;
        const warpedX = x + warpAmount;

        // Calculate noise intensity that varies along the mountain
        // More variation near base, less near peak (or vice versa)
        // Also make it asymmetric - different intensity on left vs right
        const noiseIntensityVariation =
          noiseWarp.noise(x * config.noiseScale * 0.05 + 1000) * 0.4 + 0.6; // 0.2 to 1.0 range (smooth variation)
        const leftNoiseBias = config.leftNoiseBias ?? 0.8;
        const rightNoiseBias = config.rightNoiseBias ?? 1.2;
        const sideNoiseBias = isLeft ? leftNoiseBias : rightNoiseBias;
        const noisePositionFalloff = config.noisePositionFalloff ?? 0.7;
        const positionBasedIntensity = Math.pow(
          distFromPeak,
          noisePositionFalloff
        ); // More noise near base (distFromPeak = 1), less near peak (0)

        // Combined noise intensity multiplier - creates gradual, asymmetric variation
        const noiseIntensity =
          noiseIntensityVariation * sideNoiseBias * positionBasedIntensity;

        // Combine multiple noise layers with different characteristics
        // Layer 1: Large-scale variation (smooth, broad features)
        const noise1Value = noise1.noise(warpedX * config.noiseScale * 0.3);

        // Layer 2: Medium-scale variation (moderate detail)
        const noise2Value = noise2.noise(warpedX * config.noiseScale * 0.6);

        // Layer 3: Fine-scale variation (subtle detail)
        const noise3Value = noise3.noise(warpedX * config.noiseScale * 1.2);

        // Combine layers with different weights
        const combinedNoise =
          noise1Value * 0.5 + // Large features
          noise2Value * 0.3 + // Medium features
          noise3Value * 0.2; // Fine details

        // Add random walk for natural drift (accumulates small random changes)
        const walkStep = (combinedNoise - 0.5) * walkStrength;
        randomWalk += walkStep * 0.1; // Dampened accumulation
        randomWalk *= 0.95; // Decay to prevent drift from accumulating too much

        // Apply variation: combine noise and random walk with variable intensity
        // Base noise strength that can be adjusted, multiplied by the intensity factor
        const baseNoiseStrength = config.noiseStrength ?? 0.15; // Base multiplier for noise effect
        const variation =
          (combinedNoise - 0.5) *
            heightRange *
            baseNoiseStrength *
            noiseIntensity +
          randomWalk;

        // Combine base shape with variation
        const totalHeight = baseHeightVariation + variation;
        const y = baseY - totalHeight;

        points.push({ x, y });
      }

      // Draw mountain shape with smooth curves using cubic bezier
      ctx.beginPath();
      ctx.moveTo(baseLeftX, baseY);
      ctx.lineTo(points[0].x, points[0].y);

      // Draw smooth cubic bezier curves connecting all points
      // Use Catmull-Rom style control points for smooth continuity
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = i > 0 ? points[i - 1] : points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = i < points.length - 2 ? points[i + 2] : p2;

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

      ctx.lineTo(baseRightX, baseY);
      ctx.lineTo(baseRightX, displayHeight);
      ctx.lineTo(baseLeftX, displayHeight);
      ctx.closePath();

      // Fill mountain
      ctx.fillStyle = color;
      ctx.globalAlpha = 1;
      ctx.fill();

      // Stroke outline
      ctx.strokeStyle = "white";
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    // Draw all mountains back-to-front
    mountains.forEach((mountain) => {
      drawMountain(mountain);
    });
  }, [dimensions.width, dimensions.height, color, mountains]);

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
          zIndex: 1000,
          display: showControls ? "block" : "none",
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
          zIndex: 1001,
        }}
      >
        {showControls ? "👁️ Hide Controls" : "⚙️ Show Controls"}
      </button>
    </div>
  );
}

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
