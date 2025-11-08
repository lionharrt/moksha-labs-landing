"use client";

import { useRef, useLayoutEffect } from "react";

/**
 * WaterSurface Component
 * Creates a realistic 2.5D lake surface viewed from afar
 * Uses Gerstner waves for surface undulation and sky reflection
 */
export function WaterSurface() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const timeRef = useRef(0);

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
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

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

    const render = () => {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Draw water area with wavy top edge
      ctx.fillStyle = "rgb(4 148 180)";
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

      // Create multiple wave crest lines at different depths
      // Lines near us (bottom) are MORE visible, fade toward shore (top)
      // More lines toward shore, gaps bigger near us (bottom), smaller toward shore
      const waveLines = [
        {
          depth: 0.95,
          lineWidth: 1.2,
          baseOpacity: 0.7,
          speed: 0.8,
          frequency: 0.007,
          gapThreshold: 0.6, // Bigger gaps (40% coverage)
        },
        {
          depth: 0.85,
          lineWidth: 1.1,
          baseOpacity: 0.65,
          speed: 0.85,
          frequency: 0.008,
          gapThreshold: 0.58,
        },
        {
          depth: 0.75,
          lineWidth: 1.0,
          baseOpacity: 0.6,
          speed: 0.9,
          frequency: 0.009,
          gapThreshold: 0.56,
        },
        {
          depth: 0.65,
          lineWidth: 0.9,
          baseOpacity: 0.55,
          speed: 0.95,
          frequency: 0.01,
          gapThreshold: 0.54,
        },
        {
          depth: 0.55,
          lineWidth: 0.8,
          baseOpacity: 0.5,
          speed: 1.0,
          frequency: 0.011,
          gapThreshold: 0.52,
        },
        {
          depth: 0.45,
          lineWidth: 0.7,
          baseOpacity: 0.45,
          speed: 1.05,
          frequency: 0.012,
          gapThreshold: 0.5, // 50% coverage
        },
        {
          depth: 0.4,
          lineWidth: 0.65,
          baseOpacity: 0.42,
          speed: 1.08,
          frequency: 0.0125,
          gapThreshold: 0.48,
        },
        {
          depth: 0.35,
          lineWidth: 0.6,
          baseOpacity: 0.4,
          speed: 1.1,
          frequency: 0.013,
          gapThreshold: 0.46,
        },
        {
          depth: 0.3,
          lineWidth: 0.55,
          baseOpacity: 0.38,
          speed: 1.13,
          frequency: 0.0135,
          gapThreshold: 0.44,
        },
        {
          depth: 0.25,
          lineWidth: 0.5,
          baseOpacity: 0.35,
          speed: 1.15,
          frequency: 0.014,
          gapThreshold: 0.42,
        },
        {
          depth: 0.2,
          lineWidth: 0.45,
          baseOpacity: 0.33,
          speed: 1.18,
          frequency: 0.0145,
          gapThreshold: 0.4,
        },
        {
          depth: 0.15,
          lineWidth: 0.4,
          baseOpacity: 0.3,
          speed: 1.2,
          frequency: 0.015,
          gapThreshold: 0.38,
        },
        {
          depth: 0.1,
          lineWidth: 0.35,
          baseOpacity: 0.28,
          speed: 1.23,
          frequency: 0.0155,
          gapThreshold: 0.36,
        },
        {
          depth: 0.05,
          lineWidth: 0.3,
          baseOpacity: 0.25,
          speed: 1.25,
          frequency: 0.016,
          gapThreshold: 0.34, // Smaller gaps (66% coverage)
        },
      ];

      for (const wave of waveLines) {
        const baseY = waterAreaStart + waterAreaHeight * wave.depth;

        // Use noise to vary opacity but NEVER skip drawing entirely
        const lifecycleNoise = smoothNoise(baseY * 0.05, timeRef.current * 0.2);

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

          if (shouldDraw && y < canvasHeight) {
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

      // Update time for animation
      timeRef.current += 0.01;

      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(render);
    };

    // Start animation loop
    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

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
      }}
    />
  );
}
