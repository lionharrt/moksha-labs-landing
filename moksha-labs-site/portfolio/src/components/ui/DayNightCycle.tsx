"use client";

import { useMemo, useRef, useEffect, memo, useLayoutEffect } from "react";
import Sun from "./Sun";
import Moon from "./Moon";
import { performanceLogger } from "@/utils/performanceLogger";
import { calculateLightPosition } from "@/utils/lightPosition";

interface DayNightCycleProps {
  progressRef: React.MutableRefObject<number>;
  viewportDimensionsRef: React.MutableRefObject<{
    width: number;
    height: number;
  }>;
  isDaytime: boolean;
  moonPhase: number;
  skyColor?: string; // Optional sky color from lighting system
}

function DayNightCycle({
  progressRef,
  viewportDimensionsRef,
  isDaytime,
  moonPhase,
  skyColor,
}: DayNightCycleProps) {
  performanceLogger.logRender("DayNightCycle", {
    isDaytime,
    moonPhase,
  });

  // SVG is 400x400, so center is at 200, 200
  const centerX = 200;
  const centerY = 200;

  // CRITICAL: Use refs to update positions directly via DOM to avoid React re-renders
  // This prevents expensive React reconciliation on every progress change
  const sunContainerRef = useRef<HTMLDivElement>(null);
  const moonContainerRef = useRef<HTMLDivElement>(null);
  const lastSunPositionRef = useRef({ x: 0, y: 0 });
  const lastMoonPositionRef = useRef({ x: 0, y: 0 });
  const lastSunOpacityRef = useRef(0);
  const lastMoonOpacityRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  // CRITICAL: Calculate moonPhase internally from progressRef for smooth updates
  // This prevents stuttering caused by throttled progress prop updates
  const moonPhaseRef = useRef(moonPhase);
  moonPhaseRef.current = moonPhase; // Keep in sync with prop for initial value

  // Single RAF loop that runs continuously, calculates positions from progressRef
  // No React props needed for positions - reads directly from refs
  useLayoutEffect(() => {
    const updatePositions = () => {
      // Read progress directly from ref (updates every frame, no React overhead)
      const progress = progressRef.current;
      const viewportWidth = viewportDimensionsRef.current.width;
      const viewportHeight = viewportDimensionsRef.current.height;

      // Calculate positions directly (same logic as HeroScene, but in RAF loop)
      const totalCycles = 28;
      const currentCycle = Math.floor(progress * totalCycles);
      const cycleProgress = (progress * totalCycles) % 1;
      const isCurrentlyDaytime = cycleProgress < 0.5;

      // CRITICAL: Calculate moonPhase from progressRef for smooth updates
      // This matches the calculation in HeroScene but updates every frame
      const smoothMoonPhase = currentCycle / totalCycles;
      moonPhaseRef.current = smoothMoonPhase;

      const lightPosition = calculateLightPosition(
        progress,
        viewportWidth,
        viewportHeight
      );

      // CRITICAL: Use continuous parabolic arc across ALL cycles (no resetting)
      // This prevents teleporting at cycle boundaries and ensures smooth lighting transitions
      // Use the same calculation as calculateLightPosition for consistency
      const continuousAngle = progress * totalCycles * Math.PI * 2;
      const normalizedAngle = continuousAngle % (Math.PI * 2);

      // Parabolic arc parameters (same as calculateLightPosition)
      const horizontalStart = viewportWidth + 200;
      const horizontalEnd = -200;
      const skyHeight = viewportHeight * 0.7;
      const horizonY = viewportHeight * 0.8;

      // Calculate sun position using continuous parabolic arc
      let sunX: number;
      let sunY: number;
      if (normalizedAngle <= Math.PI) {
        const parabolaProgress = normalizedAngle / Math.PI;
        sunX =
          horizontalStart +
          (horizontalEnd - horizontalStart) * parabolaProgress;
        const parabola = -4 * Math.pow(parabolaProgress - 0.5, 2) + 1;
        sunY = horizonY - skyHeight * parabola;
      } else {
        const parabolaProgress = 1 - (normalizedAngle - Math.PI) / Math.PI;
        sunX =
          horizontalEnd + (horizontalStart - horizontalEnd) * parabolaProgress;
        const parabola = -4 * Math.pow(parabolaProgress - 0.5, 2) + 1;
        sunY = horizonY + skyHeight * parabola * 0.3;
      }

      // Moon position: opposite side of arc (180 degrees offset)
      const moonAngle = (normalizedAngle + Math.PI) % (Math.PI * 2);
      let moonX: number;
      let moonY: number;
      if (moonAngle <= Math.PI) {
        const parabolaProgress = moonAngle / Math.PI;
        moonX =
          horizontalStart +
          (horizontalEnd - horizontalStart) * parabolaProgress;
        const parabola = -4 * Math.pow(parabolaProgress - 0.5, 2) + 1;
        moonY = horizonY - skyHeight * parabola;
      } else {
        const parabolaProgress = 1 - (moonAngle - Math.PI) / Math.PI;
        moonX =
          horizontalEnd + (horizontalStart - horizontalEnd) * parabolaProgress;
        const parabola = -4 * Math.pow(parabolaProgress - 0.5, 2) + 1;
        moonY = horizonY + skyHeight * parabola * 0.3;
      }

      const sunPos = { x: sunX, y: sunY };
      const moonPos = { x: moonX, y: moonY };

      // Update sun position
      if (sunContainerRef.current) {
        const newX = sunPos.x - centerX;
        const newY = sunPos.y - centerY;
        if (
          Math.abs(newX - lastSunPositionRef.current.x) > 0.01 ||
          Math.abs(newY - lastSunPositionRef.current.y) > 0.01
        ) {
          sunContainerRef.current.style.left = `${newX}px`;
          sunContainerRef.current.style.top = `${newY}px`;
          lastSunPositionRef.current = { x: newX, y: newY };
        }

        // CRITICAL: Update opacity directly in RAF loop for smooth transitions
        // Match the time-of-day periods: dawn (0-0.12), day (0.12-0.47), twilight (0.47-0.53), night (0.53-0.88), dusk (0.88-1.0)
        let opacity = 0;

        if (cycleProgress < 0.12) {
          // Dawn: fade in sun (0 to 1)
          opacity = cycleProgress / 0.12;
        } else if (cycleProgress < 0.47) {
          // Day: sun fully visible
          opacity = 1;
        } else if (cycleProgress < 0.53) {
          // Twilight: fade out sun (1 to 0)
          const twilightProgress = (cycleProgress - 0.47) / 0.06;
          opacity = 1 - twilightProgress;
        } else {
          // Night + Dusk: sun hidden
          opacity = 0;
        }

        if (Math.abs(opacity - lastSunOpacityRef.current) > 0.01) {
          sunContainerRef.current.style.opacity = opacity.toString();
          lastSunOpacityRef.current = opacity;
        }
      }

      // Update moon position
      if (moonContainerRef.current) {
        const newX = moonPos.x - centerX;
        const newY = moonPos.y - centerY;
        if (
          Math.abs(newX - lastMoonPositionRef.current.x) > 0.01 ||
          Math.abs(newY - lastMoonPositionRef.current.y) > 0.01
        ) {
          moonContainerRef.current.style.left = `${newX}px`;
          moonContainerRef.current.style.top = `${newY}px`;
          lastMoonPositionRef.current = { x: newX, y: newY };
        }

        // CRITICAL: Update opacity directly in RAF loop for smooth transitions
        // Match the time-of-day periods: dawn (0-0.12), day (0.12-0.47), twilight (0.47-0.53), night (0.53-0.88), dusk (0.88-1.0)
        let opacity = 0;

        if (cycleProgress < 0.12) {
          // Dawn: fade out moon (1 to 0)
          opacity = 1 - cycleProgress / 0.12;
        } else if (cycleProgress < 0.47) {
          // Day: moon hidden
          opacity = 0;
        } else if (cycleProgress < 0.53) {
          // Twilight: fade in moon (0 to 1)
          const twilightProgress = (cycleProgress - 0.47) / 0.06;
          opacity = twilightProgress;
        } else if (cycleProgress < 0.88) {
          // Night: moon fully visible
          opacity = 1;
        } else {
          // Dusk: fade out moon (1 to 0)
          const duskProgress = (cycleProgress - 0.88) / 0.12;
          opacity = 1 - duskProgress;
        }

        if (Math.abs(opacity - lastMoonOpacityRef.current) > 0.01) {
          moonContainerRef.current.style.opacity = opacity.toString();
          lastMoonOpacityRef.current = opacity;
        }
      }

      rafIdRef.current = requestAnimationFrame(updatePositions);
    };

    rafIdRef.current = requestAnimationFrame(updatePositions);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [progressRef, viewportDimensionsRef]); // Only re-run if refs change (they shouldn't)

  // Calculate background gradient colors - memoized to avoid recalculation on every render
  // const skyGradient = useMemo(() => {
  //   // Default gradients if no lighting system or during transitions
  //   if (!skyColor) {
  //     if (isDaytime) {
  //       // Day gradient: bright blue sky to lighter blue/white horizon
  //       return "linear-gradient(to bottom, #87CEEB 0%, #B0E0E6 50%, #E0F6FF 100%)";
  //     } else {
  //       // Night gradient: deep blue/purple to dark horizon
  //       return "linear-gradient(to bottom, #0B1026 0%, #1A1A3E 50%, #2A2A5E 100%)";
  //     }
  //   }

  //   // If skyColor is provided by lighting system, use it
  //   // Convert hex/rgb to proper format and create gradient
  //   const parseColor = (color: string): [number, number, number] => {
  //     if (color.startsWith("rgb")) {
  //       const match = color.match(/\d+/g);
  //       if (match) {
  //         return [parseInt(match[0]), parseInt(match[1]), parseInt(match[2])];
  //       }
  //     } else if (color.startsWith("#")) {
  //       const hex = color.slice(1);
  //       return [
  //         parseInt(hex.slice(0, 2), 16),
  //         parseInt(hex.slice(2, 4), 16),
  //         parseInt(hex.slice(4, 6), 16),
  //       ];
  //     }
  //     return [135, 206, 235]; // Default sky blue
  //   };

  //   const [r, g, b] = parseColor(skyColor);

  //   // Create gradient with proper opacity
  //   // Top: full color
  //   // Middle: slightly lighter
  //   // Bottom: much lighter (horizon)
  //   const topColor = `rgb(${r}, ${g}, ${b})`;
  //   const midColor = `rgba(${r}, ${g}, ${b}, 0.85)`;
  //   const bottomColor = `rgba(${Math.min(255, r + 40)}, ${Math.min(
  //     255,
  //     g + 40
  //   )}, ${Math.min(255, b + 40)}, 0.6)`;

  //   return `linear-gradient(to bottom, ${topColor} 0%, ${midColor} 50%, ${bottomColor} 100%)`;
  // }, [skyColor, isDaytime]);

  return (
    <div
      data-component="DayNightCycle-Container"
      className="fixed inset-0 overflow-visible"
      style={{
        width: "100vw",
        height: "100vh",
        // background: skyGradient,
      }}
    >
      {/* Sun - always render but position based on arc */}
      {/* CRITICAL: Position and opacity updated via RAF loop to avoid React re-renders */}
      <div
        ref={sunContainerRef}
        id="day-night-cycle-sun"
        data-component="DayNightCycle-Sun"
        className="absolute"
        style={{
          opacity: 0, // Initial opacity, will be updated by RAF loop
          pointerEvents: "none",
        }}
      >
        <Sun centerX={centerX} centerY={centerY} />
      </div>

      {/* Moon - always render but position based on arc */}
      {/* CRITICAL: Position and opacity updated via RAF loop to avoid React re-renders */}
      <div
        ref={moonContainerRef}
        id="day-night-cycle-moon"
        data-component="DayNightCycle-Moon"
        className="absolute"
        style={{
          opacity: 0, // Initial opacity, will be updated by RAF loop
          pointerEvents: "none",
        }}
      >
        <Moon
          centerX={centerX}
          centerY={centerY}
          progress={moonPhase} // Fallback prop (not used when progressRef is provided)
          progressRef={moonPhaseRef} // Moon phase calculated from progressRef for smooth updates
        />
      </div>
    </div>
  );
}

export default memo(DayNightCycle, (prevProps, nextProps) => {
  // Custom comparison: only re-render if values actually changed
  // Positions are now calculated in RAF loop, so we only care about isDaytime, moonPhase, skyColor
  return (
    prevProps.isDaytime === nextProps.isDaytime &&
    prevProps.moonPhase === nextProps.moonPhase &&
    prevProps.skyColor === nextProps.skyColor &&
    prevProps.progressRef === nextProps.progressRef &&
    prevProps.viewportDimensionsRef === nextProps.viewportDimensionsRef
  );
});
