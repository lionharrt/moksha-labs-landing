"use client";

import { useMemo, useState, useEffect, memo } from "react";
import Sun from "./Sun";
import Moon from "./Moon";

interface DayNightCycleProps {
  progress: number; // 0-1 representing all 28 cycles
  skyColor?: string; // Optional sky color from lighting system
}

function DayNightCycle({ progress, skyColor }: DayNightCycleProps) {
  // SVG is 400x400, so center is at 200, 200
  const centerX = 200;
  const centerY = 200;

  // Get viewport dimensions for arc calculations
  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1920,
    height: typeof window !== "undefined" ? window.innerHeight : 1080,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate which cycle (day) we're on (0-27)
  const totalCycles = 28;
  const currentCycle = Math.floor(progress * totalCycles);

  // Progress within the current cycle (0-1)
  const cycleProgress = (progress * totalCycles) % 1;

  // Split each cycle: 0-0.5 = day (sun), 0.5-1 = night (moon)
  const isDaytime = cycleProgress < 0.5;

  // Calculate sun position (arc from east to west)
  // cycleProgress 0-0.5 maps to sun arc 0-1
  const sunArcProgress = useMemo(() => {
    if (!isDaytime) return 1; // Sun has set
    return cycleProgress / 0.5; // 0-0.5 -> 0-1
  }, [cycleProgress, isDaytime]);

  // Calculate moon position (arc from east to west)
  // cycleProgress 0.5-1 maps to moon arc 0-1
  const moonArcProgress = useMemo(() => {
    if (isDaytime) return 0; // Moon hasn't risen yet
    return (cycleProgress - 0.5) / 0.5; // 0.5-1 -> 0-1
  }, [cycleProgress, isDaytime]);

  // Calculate moon phase based on which cycle we're in
  // Each cycle shows a different phase (0 = full moon, 0.5 = new moon, 1 = full moon again)
  const moonPhase = useMemo(() => {
    return currentCycle / totalCycles; // 0-27 cycles -> 0-1 phase
  }, [currentCycle, totalCycles]);

  // Calculate arc position (east to west)
  // x: starts at right (east), moves to left (west)
  // y: follows parabolic arc (rises to peak at middle, descends to horizon)
  const calculateArcPosition = useMemo(() => {
    return (arcProgress: number) => {
      // Horizontal: 0 = far right (east), 1 = far left (west)
      const horizontalStart = dimensions.width + 200; // Start off-screen right
      const horizontalEnd = -200; // End off-screen left
      const x =
        horizontalStart + (horizontalEnd - horizontalStart) * arcProgress;

      // Vertical: parabolic arc
      // Peak at 50% progress (noon/midnight)
      const skyHeight = dimensions.height * 0.7; // How high the arc goes
      const horizonY = dimensions.height * 0.8; // Horizon line
      const parabola = -4 * Math.pow(arcProgress - 0.5, 2) + 1; // Peaks at 0.5
      const y = horizonY - skyHeight * parabola;

      return { x, y };
    };
  }, [dimensions]);

  const sunPosition = calculateArcPosition(sunArcProgress);
  const moonPosition = calculateArcPosition(moonArcProgress);

  // Calculate background gradient colors
  const getSkyGradient = () => {
    // Default gradients if no lighting system or during transitions
    if (!skyColor) {
      if (isDaytime) {
        // Day gradient: bright blue sky to lighter blue/white horizon
        return "linear-gradient(to bottom, #87CEEB 0%, #B0E0E6 50%, #E0F6FF 100%)";
      } else {
        // Night gradient: deep blue/purple to dark horizon
        return "linear-gradient(to bottom, #0B1026 0%, #1A1A3E 50%, #2A2A5E 100%)";
      }
    }

    // If skyColor is provided by lighting system, use it
    // Convert hex/rgb to proper format and create gradient
    const parseColor = (color: string): [number, number, number] => {
      if (color.startsWith("rgb")) {
        const match = color.match(/\d+/g);
        if (match) {
          return [parseInt(match[0]), parseInt(match[1]), parseInt(match[2])];
        }
      } else if (color.startsWith("#")) {
        const hex = color.slice(1);
        return [
          parseInt(hex.slice(0, 2), 16),
          parseInt(hex.slice(2, 4), 16),
          parseInt(hex.slice(4, 6), 16),
        ];
      }
      return [135, 206, 235]; // Default sky blue
    };

    const [r, g, b] = parseColor(skyColor);

    // Create gradient with proper opacity
    // Top: full color
    // Middle: slightly lighter
    // Bottom: much lighter (horizon)
    const topColor = `rgb(${r}, ${g}, ${b})`;
    const midColor = `rgba(${r}, ${g}, ${b}, 0.85)`;
    const bottomColor = `rgba(${Math.min(255, r + 40)}, ${Math.min(
      255,
      g + 40
    )}, ${Math.min(255, b + 40)}, 0.6)`;

    return `linear-gradient(to bottom, ${topColor} 0%, ${midColor} 50%, ${bottomColor} 100%)`;
  };

  return (
    <div
      className="fixed inset-0 overflow-visible"
      style={{
        width: "100vw",
        height: "100vh",
        background: getSkyGradient(),
        transition: "background 2s ease-in-out",
      }}
    >
      {/* Sun - always render but position based on arc */}
      <div
        id="day-night-cycle-sun"
        className="absolute transition-opacity duration-1000"
        style={{
          left: sunPosition.x - centerX, // Center the 300px SVG (centerX = 200)
          top: sunPosition.y - centerY, // Center the 300px SVG (centerY = 200)
          opacity: isDaytime ? 1 : 0,
          pointerEvents: "none",
        }}
      >
        <Sun centerX={centerX} centerY={centerY} />
      </div>

      {/* Moon - always render but position based on arc */}
      <div
        id="day-night-cycle-moon"
        className="absolute transition-opacity duration-1000"
        style={{
          left: moonPosition.x - centerX, // Center the 300px SVG (centerX = 200)
          top: moonPosition.y - centerY, // Center the 300px SVG (centerY = 200)
          opacity: !isDaytime ? 1 : 0,
          pointerEvents: "none",
        }}
      >
        <Moon
          centerX={centerX}
          centerY={centerY}
          progress={moonPhase} // Moon phase based on which cycle we're in
        />
      </div>
    </div>
  );
}

export default memo(DayNightCycle);
