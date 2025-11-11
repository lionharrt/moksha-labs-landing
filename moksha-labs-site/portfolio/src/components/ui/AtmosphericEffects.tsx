"use client";

import { useRef, useEffect, memo } from "react";
import { LightingState } from "@/hooks/useLighting";

interface AtmosphericEffectsProps {
  lightingState: LightingState;
  width?: number;
  height?: number;
}

function AtmosphericEffects({
  lightingState,
  width,
  height,
}: AtmosphericEffectsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const lightingStateRef = useRef<LightingState>(lightingState);
  const sunElementRef = useRef<HTMLElement | null>(null);
  const moonElementRef = useRef<HTMLElement | null>(null);
  const canvasRectRef = useRef<DOMRect | null>(null);
  const sunRectRef = useRef<DOMRect | null>(null);
  const moonRectRef = useRef<DOMRect | null>(null);

  // Update lighting state ref immediately (no re-render needed)
  useEffect(() => {
    lightingStateRef.current = lightingState;
  }, [lightingState]);

  // Cache DOM elements and update on resize
  useEffect(() => {
    const updateElements = () => {
      const sunEl = document.getElementById("day-night-cycle-sun");
      const moonEl = document.getElementById("day-night-cycle-moon");
      sunElementRef.current = sunEl;
      moonElementRef.current = moonEl;

      if (sunEl) sunRectRef.current = sunEl.getBoundingClientRect();
      if (moonEl) moonRectRef.current = moonEl.getBoundingClientRect();
      if (canvasRef.current) {
        canvasRectRef.current = canvasRef.current.getBoundingClientRect();
      }
    };

    updateElements();
    window.addEventListener("resize", updateElements);

    // Update periodically (every 100ms) to catch position changes without querying every frame
    const interval = setInterval(updateElements, 100);

    return () => {
      window.removeEventListener("resize", updateElements);
      clearInterval(interval);
    };
  }, []);

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
      canvasRectRef.current = canvas.getBoundingClientRect();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let time = 0;
    let lastFrameTime = 0;
    const targetFPS = 30; // Reduce from 60fps to 30fps for better performance
    const frameInterval = 1000 / targetFPS;

    const render = (currentTime: number = performance.now()) => {
      // Throttle to target FPS
      const elapsed = currentTime - lastFrameTime;
      if (elapsed < frameInterval) {
        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }
      lastFrameTime = currentTime - (elapsed % frameInterval);
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const canvasRect =
        canvasRectRef.current || canvas.getBoundingClientRect();

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Use cached lighting state
      const currentLightingState = lightingStateRef.current;

      // Get actual DOM element positions for sun/moon centers (using cached refs)
      const getCelestialCenter = (
        element: HTMLElement | null,
        cachedRect: DOMRect | null
      ): { x: number; y: number } | null => {
        if (!element || !cachedRect) return null;

        // Use cached rect instead of calling getBoundingClientRect() every frame
        const centerX = cachedRect.left + 150; // SVG center X offset
        const centerY = cachedRect.top + 150; // SVG center Y offset

        // Convert to canvas coordinates
        const scaleX = canvasWidth / canvasRect.width;
        const scaleY = canvasHeight / canvasRect.height;

        return {
          x: (centerX - canvasRect.left) * scaleX,
          y: (centerY - canvasRect.top) * scaleY,
        };
      };

      // Get the active celestial body (sun during day, moon during night)
      const activeElement = currentLightingState.isDaytime
        ? getCelestialCenter(sunElementRef.current, sunRectRef.current)
        : getCelestialCenter(moonElementRef.current, moonRectRef.current);

      // Fallback to calculated position if DOM elements not found
      const lightX =
        activeElement?.x ?? currentLightingState.lightX * canvasWidth;
      const lightY =
        activeElement?.y ?? currentLightingState.lightY * canvasHeight;

      // === FOG removed - now in MountainBackground between layers ===

      // === GOD RAYS (only during daytime) ===
      if (
        currentLightingState.godRaysIntensity > 0 &&
        currentLightingState.isDaytime
      ) {
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

        const rayOpacity = currentLightingState.godRaysIntensity;
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
        // OPTIMIZED: Reduced from 12 to 8 rays for better performance
        const rayCount = 8;
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
      if (currentLightingState.lensFlareIntensity > 0) {
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

        const flareColor = currentLightingState.isDaytime
          ? `rgba(255, 220, 150, ${currentLightingState.lensFlareIntensity})`
          : `rgba(200, 220, 255, ${
              currentLightingState.lensFlareIntensity * 0.6
            })`;

        flareGradient.addColorStop(0, flareColor);
        flareGradient.addColorStop(
          0.2,
          `rgba(255, 240, 200, ${
            currentLightingState.lensFlareIntensity * 0.5
          })`
        );
        flareGradient.addColorStop(
          0.5,
          `rgba(255, 250, 220, ${
            currentLightingState.lensFlareIntensity * 0.2
          })`
        );
        flareGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = flareGradient;
        ctx.fillRect(lightX - 200, lightY - 200, 400, 400);

        // Secondary flares (lens artifacts)
        // OPTIMIZED: Only draw secondary flares if intensity is high enough
        if (currentLightingState.lensFlareIntensity > 0.15) {
          const centerX = canvasWidth / 2;
          const centerY = canvasHeight / 2;
          const dx = lightX - centerX;
          const dy = lightY - centerY;

          // Draw 2 secondary flares (reduced from 3) along the line from light to center
          for (let i = 1; i <= 2; i++) {
            const t = i * 0.25;
            const x = lightX - dx * t;
            const y = lightY - dy * t;
            const size = 50 + i * 30;
            const opacity =
              currentLightingState.lensFlareIntensity * (0.3 - i * 0.08);

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
        }

        ctx.globalCompositeOperation = "source-over";
        ctx.restore();
      }

      // === ATMOSPHERIC GLOW (subtle ambient color) ===
      // OPTIMIZED: Only draw if intensity is significant, and use smaller area
      // Full-screen fillRect is very expensive - only draw around light source
      // Further optimized: Skip entirely if light source is off-screen or very dim
      if (
        (currentLightingState.godRaysIntensity > 0.3 ||
          currentLightingState.lensFlareIntensity > 0.2) &&
        lightX > -200 &&
        lightX < canvasWidth + 200 &&
        lightY > -200 &&
        lightY < canvasHeight + 200
      ) {
        // Reduced radius further - only draw immediate area around light
        const glowRadius = Math.min(canvasWidth, canvasHeight) * 0.4; // Reduced from 0.6
        const glowGradient = ctx.createRadialGradient(
          lightX,
          lightY,
          0,
          lightX,
          lightY,
          glowRadius
        );

        const glowOpacity = currentLightingState.isDaytime ? 0.05 : 0.03;
        glowGradient.addColorStop(0, `rgba(255, 240, 200, ${glowOpacity})`);
        glowGradient.addColorStop(
          0.7,
          `rgba(200, 220, 255, ${glowOpacity * 0.5})`
        );
        glowGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = glowGradient;
        // Only draw around light source, not full screen
        // Clamp to canvas bounds to avoid drawing off-screen
        const drawX = Math.max(0, lightX - glowRadius);
        const drawY = Math.max(0, lightY - glowRadius);
        const drawWidth = Math.min(canvasWidth - drawX, glowRadius * 2);
        const drawHeight = Math.min(canvasHeight - drawY, glowRadius * 2);

        if (drawWidth > 0 && drawHeight > 0) {
          ctx.fillRect(drawX, drawY, drawWidth, drawHeight);
        }
      }

      // === SUN CORONA / BACKLIGHT (visible when behind mountains) ===
      // Render BELOW mountains (will be occluded but creates rim lighting)
      // This is already in the right layer, just keeping it subtle

      // Update time for animations
      time += frameInterval / 1000; // Adjust time increment for throttled FPS

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [width, height]); // Removed lightingState from dependencies - using ref instead

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
        willChange: "transform", // GPU acceleration hint
      }}
    />
  );
}

export default memo(AtmosphericEffects);
