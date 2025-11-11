"use client";

import { useRef, useEffect } from "react";
import { LightingState } from "@/hooks/useLighting";

interface AtmosphericEffectsProps {
  lightingState: LightingState;
  width?: number;
  height?: number;
}

export default function AtmosphericEffects({
  lightingState,
  width,
  height,
}: AtmosphericEffectsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const w = width || window.innerWidth;
      const h = height || window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let time = 0;

    const render = () => {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const canvasRect = canvas.getBoundingClientRect();

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Get actual DOM element positions for sun/moon centers
      // This is the most reliable way to get exact positions
      const getCelestialCenter = (
        elementId: string
      ): { x: number; y: number } | null => {
        const element = document.getElementById(elementId);
        if (!element) return null;

        const rect = element.getBoundingClientRect();
        // The SVG center is at (200, 200) within the 300x300 SVG
        // So the center point is: element position + (200 - 0) = element position + 200
        // But since the element is positioned at (sunPosition.x - 200), the center is at sunPosition.x
        // Actually, the SVG is 300x300, so the center is at element.left + 150, element.top + 150
        // But wait - the Sun/Moon SVG has centerX=200, centerY=200, so center is at element.left + 200, element.top + 200

        const centerX = rect.left + 150; // SVG center X offset
        const centerY = rect.top + 150; // SVG center Y offset

        // Convert to canvas coordinates
        const scaleX = canvasWidth / canvasRect.width;
        const scaleY = canvasHeight / canvasRect.height;

        return {
          x: (centerX - canvasRect.left) * scaleX,
          y: (centerY - canvasRect.top) * scaleY,
        };
      };

      // Get the active celestial body (sun during day, moon during night)
      const activeElement = lightingState.isDaytime
        ? getCelestialCenter("day-night-cycle-sun")
        : getCelestialCenter("day-night-cycle-moon");

      // Fallback to calculated position if DOM elements not found
      const lightX = activeElement?.x ?? lightingState.lightX * canvasWidth;
      const lightY = activeElement?.y ?? lightingState.lightY * canvasHeight;

      // === FOG removed - now in MountainBackground between layers ===

      // === GOD RAYS (only during daytime) ===
      if (lightingState.godRaysIntensity > 0 && lightingState.isDaytime) {
        ctx.save();

        // Create radial gradient emanating from light source
        const rayGradient = ctx.createRadialGradient(
          lightX,
          lightY,
          0,
          lightX,
          lightY,
          canvasHeight * 1.2
        );

        const rayOpacity = lightingState.godRaysIntensity;
        rayGradient.addColorStop(0, `rgba(255, 230, 150, ${rayOpacity * 0.8})`);
        rayGradient.addColorStop(
          0.3,
          `rgba(255, 240, 200, ${rayOpacity * 0.3})`
        );
        rayGradient.addColorStop(
          0.6,
          `rgba(255, 250, 220, ${rayOpacity * 0.1})`
        );
        rayGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        // Draw animated god rays using rotating beams
        const rayCount = 12;
        const rayWidth = (Math.PI * 2) / rayCount;

        for (let i = 0; i < rayCount; i++) {
          const angle = (i / rayCount) * Math.PI * 2 + time * 0.05;
          const opacity =
            (Math.sin(time * 0.1 + i) * 0.5 + 0.5) * rayOpacity * 0.15;

          ctx.save();
          ctx.translate(lightX, lightY);
          ctx.rotate(angle);

          // Draw ray beam
          const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
          gradient.addColorStop(0, `rgba(255, 240, 200, ${opacity})`);
          gradient.addColorStop(0.4, `rgba(255, 250, 220, ${opacity * 0.5})`);
          gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(-100, canvasHeight);
          ctx.lineTo(100, canvasHeight);
          ctx.closePath();
          ctx.fill();

          ctx.restore();
        }

        ctx.restore();
      }

      // === LENS FLARE ===
      if (lightingState.lensFlareIntensity > 0) {
        ctx.save();

        // Main flare (bright center)
        const flareGradient = ctx.createRadialGradient(
          lightX,
          lightY,
          0,
          lightX,
          lightY,
          200
        );

        const flareColor = lightingState.isDaytime
          ? `rgba(255, 220, 150, ${lightingState.lensFlareIntensity})`
          : `rgba(200, 220, 255, ${lightingState.lensFlareIntensity * 0.6})`;

        flareGradient.addColorStop(0, flareColor);
        flareGradient.addColorStop(
          0.2,
          `rgba(255, 240, 200, ${lightingState.lensFlareIntensity * 0.5})`
        );
        flareGradient.addColorStop(
          0.5,
          `rgba(255, 250, 220, ${lightingState.lensFlareIntensity * 0.2})`
        );
        flareGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = flareGradient;
        ctx.fillRect(lightX - 200, lightY - 200, 400, 400);

        // Secondary flares (lens artifacts)
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
        const dx = lightX - centerX;
        const dy = lightY - centerY;

        // Draw 3 secondary flares along the line from light to center
        for (let i = 1; i <= 3; i++) {
          const t = i * 0.25;
          const x = lightX - dx * t;
          const y = lightY - dy * t;
          const size = 50 + i * 30;
          const opacity = lightingState.lensFlareIntensity * (0.3 - i * 0.08);

          const secondaryGradient = ctx.createRadialGradient(
            x,
            y,
            0,
            x,
            y,
            size
          );
          const hue = i * 60; // Rainbow effect
          secondaryGradient.addColorStop(
            0,
            `hsla(${hue}, 80%, 70%, ${opacity})`
          );
          secondaryGradient.addColorStop(
            0.5,
            `hsla(${hue}, 80%, 60%, ${opacity * 0.5})`
          );
          secondaryGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

          ctx.fillStyle = secondaryGradient;
          ctx.fillRect(x - size, y - size, size * 2, size * 2);
        }

        ctx.globalCompositeOperation = "source-over";
        ctx.restore();
      }

      // === ATMOSPHERIC GLOW (subtle ambient color) ===
      // Add a subtle color wash based on time of day
      const glowGradient = ctx.createRadialGradient(
        lightX,
        lightY,
        0,
        lightX,
        lightY,
        canvasHeight * 0.8
      );

      const glowOpacity = lightingState.isDaytime ? 0.05 : 0.03;
      glowGradient.addColorStop(0, `rgba(255, 240, 200, ${glowOpacity})`);
      glowGradient.addColorStop(
        0.7,
        `rgba(200, 220, 255, ${glowOpacity * 0.5})`
      );
      glowGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = glowGradient;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // === SUN CORONA / BACKLIGHT (visible when behind mountains) ===
      // Render BELOW mountains (will be occluded but creates rim lighting)
      // This is already in the right layer, just keeping it subtle

      // Update time for animations
      time += 0.016; // ~60fps

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [lightingState, width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 5,
      }}
    />
  );
}
