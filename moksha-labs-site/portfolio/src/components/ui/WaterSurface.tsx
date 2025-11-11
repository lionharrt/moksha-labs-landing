"use client";

import {
  useRef,
  useLayoutEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { LightingState } from "@/hooks/useLighting";

interface Ripple {
  x: number; // X position in canvas coordinates
  y: number; // Y position in canvas coordinates (water surface level)
  radius: number;
  initialRadius: number; // Starting radius (for phase 2 flowers)
  maxRadius: number;
  opacity: number;
  startTime: number;
}

interface WaterSurfaceProps {
  flowerPositions?: Array<{
    x: number;
    y: number;
    phase?: number;
    verticalBob?: number; // Vertical bobbing amplitude in pixels
    bobDuration?: number; // Duration of bobbing cycle in seconds
    bobDelay?: number; // Delay before bobbing starts in seconds
  }>; // Flower positions and animation parameters
  splitAndShrinkProgress?: number | null; // Progress of split animation (0-1 or null)
  lightingState?: LightingState; // Optional lighting integration
}

export interface WaterSurfaceRef {
  emitRippleFromElement: (
    flowerIndex: number,
    element: HTMLElement,
    phase?: number
  ) => void;
}

/**
 * WaterSurface Component
 * Creates a realistic 2.5D lake surface viewed from afar
 * Uses Gerstner waves for surface undulation and sky reflection
 */
export const WaterSurface = forwardRef<WaterSurfaceRef, WaterSurfaceProps>(
  (
    { flowerPositions = [], splitAndShrinkProgress = null, lightingState },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number>();
    const timeRef = useRef(0);
    const ripplesRef = useRef<Ripple[]>([]);
    const flowerPositionsRef = useRef(flowerPositions);
    const splitProgressRef = useRef(splitAndShrinkProgress);
    const lightingStateRef = useRef<LightingState | undefined>(lightingState);
    const canvasRectRef = useRef<DOMRect | null>(null);
    const canvasContextRef = useRef<{
      canvas: HTMLCanvasElement;
      ctx: CanvasRenderingContext2D;
      getShoreY: (x: number, time: number) => number;
    } | null>(null);
    
    // OPTIMIZED: Frame budget tracking (game dev technique)
    const frameBudgetRef = useRef({
      targetFrameTime: 16.67, // 60fps target
      maxFrameTime: 33.33, // Don't exceed 30fps
      lastFrameTime: 0,
    });

    // Expose emitRippleFromElement function via ref
    useImperativeHandle(
      ref,
      () => ({
        emitRippleFromElement: (
          flowerIndex: number,
          element: HTMLElement,
          phase: number = 1
        ) => {
          if (!canvasContextRef.current) return;

          const { canvas, getShoreY } = canvasContextRef.current;
          // Use cached rect or get fresh one
          const canvasRect = canvasRectRef.current || canvas.getBoundingClientRect();
          const elementRect = element.getBoundingClientRect();

          // Get element's center X position in screen coordinates
          const elementCenterX = elementRect.left + elementRect.width / 2;
          const elementBottomY = elementRect.bottom;

          // Convert directly to canvas coordinates
          // X: element center to canvas X
          const canvasX =
            ((elementCenterX - canvasRect.left) / canvasRect.width) *
            canvas.width;

          // Y: element bottom to canvas Y
          // canvasRect.top is the top of the canvas in viewport coordinates
          // elementBottomY is the bottom of the element in viewport coordinates
          // We need to convert this to canvas internal coordinates
          const screenY = elementBottomY - canvasRect.top;

          // Dynamic offset for the ripple position based on the flower index
          let dynamicOffset = -25;
          if (flowerIndex === 3) {
            dynamicOffset = -17.5;
          } else if (flowerIndex === 1) {
            dynamicOffset = -20;
          }

          const canvasY =
            (screenY / canvasRect.height) * canvas.height + dynamicOffset;

          // Get water surface Y at this X position (in canvas coordinates)
          const shoreY = getShoreY(canvasX, timeRef.current);

          // Convert shoreY back to screen coordinates for comparison
          const shoreYScreen =
            canvasRect.top + (shoreY / canvas.height) * canvasRect.height;

          // Ripple appears at the base of the flower (bottom edge)
          // Since callback fires at lowest bob point, element should be in water
          // Use element's bottom position directly - it already accounts for all transforms
          const isPhase2 = phase === 2;

          const rippleY = canvasY + (isPhase2 ? 5 : 0);

          // Only emit if flower is in water (element bottom is at or below water surface)
          if (elementBottomY >= shoreYScreen) {
            const baseRadius = isPhase2 ? 1250 : 250;

            // For phase 2, calculate initial radius based on flower size at water surface
            // Phase 2 flowers are much larger and partially submerged
            // The ripple should start from the outer edge where flower touches water
            let initialRadius = 0;
            let startTimeOffset = 0; // Offset to make ripple appear earlier

            if (isPhase2) {
              // Estimate flower radius from element size
              // Container is 200px, phase 2 flowers are scaled up significantly
              // Use element width as approximation (flowers are roughly circular)
              const flowerRadiusEstimate = elementRect.width / 2;

              // Convert to canvas coordinates
              const flowerRadiusCanvas =
                (flowerRadiusEstimate / canvasRect.width) * canvas.width;

              // The ripple starts from where the flower touches the water surface
              // Since flower is partially submerged, use a portion of the radius
              // Start at ~60-70% of the flower radius (where it's submerged)
              initialRadius = flowerRadiusCanvas * 0.65;

              // Make ripple appear earlier by offsetting startTime
              // This makes it look like the ripple started before the bob completed
              // Speed is 30 pixels/second, so to appear ~0.3 seconds earlier:
              startTimeOffset = -0.3; // Negative = in the past
            }

            ripplesRef.current.push({
              x: canvasX,
              y: rippleY,
              radius: initialRadius, // Initial radius (0 for phase 1, calculated for phase 2)
              initialRadius: initialRadius, // Store separately to preserve it
              maxRadius: baseRadius,
              opacity: phase === 2 ? 0.35 : 0.5,
              startTime: timeRef.current + startTimeOffset,
            });
          }
        },
      }),
      []
    );

    // Update refs when props change (no re-render needed)
    useLayoutEffect(() => {
      flowerPositionsRef.current = flowerPositions;
      splitProgressRef.current = splitAndShrinkProgress;
      lightingStateRef.current = lightingState;
    }, [flowerPositions, splitAndShrinkProgress, lightingState]);

    useLayoutEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d", { alpha: true });
      if (!ctx) return;

      // Set canvas size based on its display size
      const resizeCanvas = () => {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        canvasRectRef.current = rect; // Cache the rect
      };

      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);
      
      // Update cached rect periodically (every 100ms) to catch position changes
      const interval = setInterval(() => {
        if (canvasRef.current) {
          canvasRectRef.current = canvasRef.current.getBoundingClientRect();
        }
      }, 100);

      // Store canvas context for emitRipple function
      canvasContextRef.current = {
        canvas,
        ctx,
        getShoreY: () => 0, // Will be set below
      };

      // Smooth noise function using multiple octaves for organic variation
      const smoothNoise = (x: number, time: number): number => {
        // Use lower frequency for smoother variation
        const n1 = Math.sin(x * 0.003 + time * 0.1) * 0.5 + 0.5;
        const n2 = Math.sin(x * 0.007 + time * 0.15) * 0.3 + 0.5;
        const n3 = Math.sin(x * 0.015 + time * 0.2) * 0.2 + 0.5;
        // Blend smoothly
        return n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
      };

      // Generate smooth wavy shore line with organic variation
      const getShoreY = (x: number, time: number): number => {
        // Get smooth noise value
        const n = smoothNoise(x, time * 0.3);

        // Multiple waves with very subtle amplitudes (viewing from far away)
        const wave1 =
          Math.sin((x * 0.006 + time * 0.25) * Math.PI) * (0.8 + n * 0.3);
        const wave2 =
          Math.sin((x * 0.012 + time * 0.18 + n * 0.5) * Math.PI) *
          (0.6 + n * 0.2);
        const wave3 =
          Math.sin((x * 0.009 + time * 0.22) * Math.PI) * (0.4 + n * 0.15);
        const wave4 =
          Math.sin((x * 0.016 + time * 0.16) * Math.PI) * (0.3 + n * 0.1);

        // Very subtle noise variation
        const smoothVariation = (n - 0.5) * 0.3;

        // Combine waves smoothly
        return wave1 + wave2 + wave3 + wave4 + smoothVariation;
      };

      // Update getShoreY in context ref
      if (canvasContextRef.current) {
        canvasContextRef.current.getShoreY = getShoreY;
      }

      // Function to generate wave lines with adjustable parameters
      const generateWaveLines = (config: {
        // Number of wave lines to generate
        lineCount?: number;
        // Depth range: [minDepth, maxDepth] where 1.0 = bottom, 0.0 = shore
        depthRange?: [number, number];
        // Opacity range: [minOpacity, maxOpacity] - higher at bottom (closer to viewer)
        opacityRange?: [number, number];
        // Line width range: [minWidth, maxWidth]
        lineWidthRange?: [number, number];
        // Gap threshold range: [minThreshold, maxThreshold] - lower = more coverage (denser)
        gapThresholdRange?: [number, number];
        // Speed range: [minSpeed, maxSpeed] - wave animation speed
        speedRange?: [number, number];
        // Frequency range: [minFreq, maxFreq] - wave frequency
        frequencyRange?: [number, number];
      }) => {
        const {
          lineCount = 20,
          depthRange = [0.05, 1.0], // From shore (0.05) to bottom (1.0)
          opacityRange = [0.22, 0.7], // Lower at shore, higher at bottom
          lineWidthRange = [0.3, 0.7],
          gapThresholdRange = [0.34, 0.5], // Lower = denser (more coverage)
          speedRange = [1.05, 1.25],
          frequencyRange = [0.012, 0.016],
        } = config;

        const waveLines = [];

        for (let i = 0; i < lineCount; i++) {
          // Normalized position: 0 = shore (top), 1 = bottom (front)
          const normalizedPos = i / (lineCount - 1);

          // Depth: interpolate from minDepth (shore) to maxDepth (bottom)
          // normalizedPos=0 -> shore (minDepth), normalizedPos=1 -> bottom (maxDepth)
          const depth =
            depthRange[0] + normalizedPos * (depthRange[1] - depthRange[0]);

          // Opacity: interpolate from minOpacity (shore) to maxOpacity (bottom)
          // Higher opacity at bottom (closer to viewer)
          const baseOpacity =
            opacityRange[0] +
            normalizedPos * (opacityRange[1] - opacityRange[0]);

          // Line width: interpolate from minWidth (bottom) to maxWidth (shore)
          // Thinner at bottom, thicker at shore
          const lineWidth =
            lineWidthRange[0] +
            (1 - normalizedPos) * (lineWidthRange[1] - lineWidthRange[0]);

          // Gap threshold: interpolate from minThreshold (bottom, denser) to maxThreshold (shore)
          // Lower threshold = more coverage (denser lines)
          const gapThreshold =
            gapThresholdRange[0] +
            (1 - normalizedPos) * (gapThresholdRange[1] - gapThresholdRange[0]);

          // Speed: interpolate from minSpeed (bottom) to maxSpeed (shore)
          // Faster animation at shore
          const speed =
            speedRange[0] +
            (1 - normalizedPos) * (speedRange[1] - speedRange[0]);

          // Frequency: interpolate from minFreq (shore) to maxFreq (bottom)
          // Higher frequency at bottom
          const frequency =
            frequencyRange[0] +
            normalizedPos * (frequencyRange[1] - frequencyRange[0]);

          waveLines.push({
            depth,
            lineWidth,
            baseOpacity,
            speed,
            frequency,
            gapThreshold,
          });
        }

        return waveLines;
      };

      const render = () => {
        // OPTIMIZED: Frame budget tracking (game dev technique)
        const frameStart = performance.now();
        const frameBudget = frameBudgetRef.current;
        
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Draw water area with wavy top edge
        // Use lighting color if available, otherwise default blue (from ref)
        const currentLightingState = lightingStateRef.current;
        const waterColor = currentLightingState?.waterColor ?? "rgb(4, 148, 180)";
        ctx.fillStyle = waterColor;
        ctx.beginPath();

        // Start from top-left
        ctx.moveTo(0, getShoreY(0, timeRef.current));

        // Draw wavy top edge with smooth curves
        const step = 1; // Smaller step for smoother curves
        let prevY = getShoreY(0, timeRef.current);

        for (let x = step; x <= canvasWidth; x += step) {
          const y = getShoreY(x, timeRef.current);
          // Use quadratic curves for smooth transitions
          const midX = x - step / 2;
          const midY = (prevY + y) / 2;
          ctx.quadraticCurveTo(x - step, prevY, midX, midY);
          prevY = y;
        }

        // Final point
        ctx.lineTo(canvasWidth, prevY);

        // Complete the shape by going to bottom corners
        ctx.lineTo(canvasWidth, canvasHeight);
        ctx.lineTo(0, canvasHeight);
        ctx.closePath();
        ctx.fill();

        // Wave crest lines that progress from bottom (far water) toward shore
        // Lines randomly appear, build, and fade creating depth

        const shoreYAvg = getShoreY(canvasWidth / 2, timeRef.current);

        // Define the water depth area: from bottom to near shore (fade out close to shore)
        const nearShoreBuffer = canvasHeight * 0.02; // Very small buffer, let lines go near shore
        const waterAreaStart = shoreYAvg + nearShoreBuffer;
        const waterAreaHeight = canvasHeight - waterAreaStart;

        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Generate wave lines using configurable function
        // Adjust parameters below to change the pattern
        const waveLines = generateWaveLines({
          lineCount: 12, // Number of wave lines
          depthRange: [0.05, 1.0], // [shore, bottom] - extend all the way to bottom
          opacityRange: [0.1, 0.25], // [shore, bottom] - higher opacity closer to viewer
          lineWidthRange: [0.7, 0.7], // [bottom, shore] - thinner at bottom, thicker at shore
          gapThresholdRange: [0.7, 0.2], // [bottom, shore] - lower = denser (more coverage)
          speedRange: [0.5, 0.75], // [bottom, shore] - faster at shore
          frequencyRange: [0.012, 0.016], // [shore, bottom] - higher frequency at bottom
        });

        for (const wave of waveLines) {
          const baseY = waterAreaStart + waterAreaHeight * wave.depth;

          // Use noise to vary opacity but NEVER skip drawing entirely
          const lifecycleNoise = smoothNoise(
            baseY * 0.05,
            timeRef.current * 0.2
          );

          // Opacity varies but never goes to zero - always at least 30% of base
          let opacity = wave.baseOpacity;
          if (lifecycleNoise < 0.3) {
            // Fade to minimum
            opacity *= 0.3 + (lifecycleNoise / 0.3) * 0.7;
          } else if (lifecycleNoise > 0.7) {
            // Fade to minimum
            opacity *= 0.3 + ((1 - lifecycleNoise) / 0.3) * 0.7;
          }

          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.lineWidth = wave.lineWidth;

          let inSegment = false;

          for (let x = 0; x <= canvasWidth; x += step) {
            // Wave undulation
            const waveY =
              Math.sin(
                (x * wave.frequency + timeRef.current * wave.speed) * Math.PI
              ) * 2;
            const y = baseY + waveY;

            // Create breaks using PURELY POSITION-BASED noise with unique seed per wave
            // Each wave gets unique breaks based on its depth, but breaks NEVER move over time
            const breakNoise = smoothNoise(
              x * 0.1 + wave.depth * 10, // x position + unique offset per wave
              wave.depth * 7.3 // Static seed unique to this wave depth
            );
            const shouldDraw = breakNoise > wave.gapThreshold;

            // Allow lines to extend all the way to the bottom of the canvas
            if (shouldDraw && y <= canvasHeight) {
              if (!inSegment) {
                inSegment = true;
                ctx.beginPath();
                ctx.moveTo(x, y);
              } else {
                ctx.lineTo(x, y);
              }
            } else {
              if (inSegment) {
                ctx.stroke();
                inSegment = false;
              }
            }
          }

          // Close any open segment
          if (inSegment) {
            ctx.stroke();
          }
        }

        // Ripples are now emitted via emitRipple function call from HeroScene
        // Update and draw existing ripples with 2.5D perspective effect
        const currentTime = timeRef.current;

        // Clear ripples if split phase hasn't completed
        if (splitProgressRef.current !== 1) {
          ripplesRef.current = [];
        }

        // Update and draw ripples with 2.5D perspective effect
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 1.5;

        ripplesRef.current = ripplesRef.current.filter((ripple) => {
          const age = currentTime - ripple.startTime;
          const speed = 30; // pixels per second
          // Add the expansion to the initial radius
          ripple.radius = ripple.initialRadius + age * speed;

          // Fade out as ripple expands
          const progress =
            (ripple.radius - ripple.initialRadius) /
            (ripple.maxRadius - ripple.initialRadius);
          ripple.opacity = Math.max(0, ripple.opacity * (1 - progress));

          // Remove if fully expanded or faded
          if (ripple.radius > ripple.maxRadius || ripple.opacity <= 0) {
            return false;
          }

          // 2.5D perspective effect: squash ellipse vertically as it expands
          // The further the ripple expands, the more squashed it becomes (simulating rotation on X axis)
          const perspectiveFactor = 0.3 + progress * 0.7; // Goes from 0.3 to 1.0 (more squashed = smaller Y radius)
          const radiusX = ripple.radius; // Horizontal radius stays the same
          const radiusY = ripple.radius * perspectiveFactor; // Vertical radius gets squashed

          // Draw ripple ellipse (rotated on X axis for 2.5D effect)
          ctx.save();
          ctx.beginPath();
          ctx.ellipse(ripple.x, ripple.y, radiusX, radiusY, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${ripple.opacity})`;
          ctx.stroke();

          // Draw inner ring for depth (also with perspective)
          if (ripple.radius > 20) {
            const innerRadiusX = ripple.radius - 15;
            const innerRadiusY = (ripple.radius - 15) * perspectiveFactor;
            ctx.beginPath();
            ctx.ellipse(
              ripple.x,
              ripple.y,
              innerRadiusX,
              innerRadiusY,
              0,
              0,
              Math.PI * 2
            );
            ctx.strokeStyle = `rgba(255, 255, 255, ${ripple.opacity * 0.5})`;
            ctx.stroke();
          }
          ctx.restore();

          return true;
        });

        // Update time for animation
        timeRef.current += 0.01;

        // OPTIMIZED: Frame budget enforcement (game dev technique)
        const frameTime = performance.now() - frameStart;
        if (frameTime > frameBudget.maxFrameTime) {
          // Skip next frame if we're over budget
          animationFrameRef.current = requestAnimationFrame(() => {
            animationFrameRef.current = requestAnimationFrame(render);
          });
        } else {
          animationFrameRef.current = requestAnimationFrame(render);
        }
      };

      // Start animation loop
      animationFrameRef.current = requestAnimationFrame(render);

      return () => {
        window.removeEventListener("resize", resizeCanvas);
        clearInterval(interval);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [flowerPositions, splitAndShrinkProgress]); // Removed lightingState - using ref instead

    return (
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          width: "100%",
          height: "35%",
          pointerEvents: "none",
          display: "block",
          willChange: "transform", // GPU acceleration hint
        }}
      />
    );
  }
);

WaterSurface.displayName = "WaterSurface";
