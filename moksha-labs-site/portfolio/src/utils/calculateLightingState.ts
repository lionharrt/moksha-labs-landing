/**
 * Pure calculation functions for lighting state
 * Extracted from useLighting hook to allow calculation in parent components
 */

import {
  PreloadedData,
  getColorFromLUT,
} from "@/utils/performancePreloader";
import { calculateLightPosition } from "@/utils/lightPosition";
import { LightingConfig, LightingState } from "./useLighting";

// Time of day periods for smooth transitions
export type TimeOfDay = "dawn" | "day" | "twilight" | "dusk" | "night";

export interface TimeOfDayInfo {
  period: TimeOfDay;
  periodProgress: number; // 0-1 within the current period
  transitionProgress: number; // 0-1 for smooth color blending
  nextPeriod: TimeOfDay;
}

// Calculate which period we're in based on cycle progress
export function getTimeOfDay(cycleProgress: number): TimeOfDayInfo {
  // cycleProgress is 0-1 for one full day/night cycle
  // Restructured so dawn/dusk occur when sun/moon are not visible (at horizon edges)
  // More night time, slower transitions when light is overhead

  // 0.0 - 0.12: dawn (sun rising, low on horizon, barely visible)
  // 0.12 - 0.47: day (sun visible and overhead)
  // 0.47 - 0.53: twilight (brief transition, sun setting/moon rising) - SHORT period
  // 0.53 - 0.88: night (moon visible and overhead) - INCREASED night time
  // 0.88 - 1.0: dusk (moon setting, low on horizon, barely visible)

  if (cycleProgress < 0.12) {
    return {
      period: "dawn",
      periodProgress: cycleProgress / 0.12,
      transitionProgress: cycleProgress / 0.12,
      nextPeriod: "day",
    };
  } else if (cycleProgress < 0.47) {
    const progress = (cycleProgress - 0.12) / 0.35;
    return {
      period: "day",
      periodProgress: progress,
      transitionProgress: progress,
      nextPeriod: "twilight",
    };
  } else if (cycleProgress < 0.53) {
    const progress = (cycleProgress - 0.47) / 0.06;
    return {
      period: "twilight",
      periodProgress: progress,
      transitionProgress: progress,
      nextPeriod: "night",
    };
  } else if (cycleProgress < 0.88) {
    const progress = (cycleProgress - 0.53) / 0.35;
    return {
      period: "night",
      periodProgress: progress,
      transitionProgress: progress,
      nextPeriod: "dusk",
    };
  } else {
    const progress = (cycleProgress - 0.88) / 0.12;
    return {
      period: "dusk",
      periodProgress: progress,
      transitionProgress: progress,
      nextPeriod: "dawn",
    };
  }
}

// Color interpolation helper
export function lerpColor(color1: string, color2: string, t: number): string {
  // Parse RGB/Hex colors
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
    return [0, 0, 0];
  };

  const c1 = parseColor(color1);
  const c2 = parseColor(color2);

  const r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
  const g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
  const b = Math.round(c1[2] + (c2[2] - c1[2]) * t);

  return `rgb(${r}, ${g}, ${b})`;
}

// Smooth easing function with longer transition period
export function smoothEase(t: number): number {
  // Even smoother curve for gradual transitions
  return t < 0.5
    ? 4 * t * t * t // Cubic ease in
    : 1 - Math.pow(-2 * t + 2, 3) / 2; // Cubic ease out
}

/**
 * Pure function to calculate lighting state from progress and config
 * This can be called in parent components (like HeroScene) instead of watching progress in a hook
 */
export function calculateLightingState(
  progress: number,
  config: LightingConfig,
  viewportWidth: number,
  viewportHeight: number,
  preloadedData?: PreloadedData | null
): LightingState {
  // Calculate which cycle we're in (0-27) and progress within that cycle
  const totalCycles = 28;
  const currentCycle = Math.floor(progress * totalCycles);
  const cycleProgress = (progress * totalCycles) % 1;

  // Get time of day info
  const timeOfDay = getTimeOfDay(cycleProgress);
  const isDaytime = cycleProgress < 0.5;

  const lightPosition = calculateLightPosition(
    progress,
    viewportWidth,
    viewportHeight
  );
  const lightXPixels = lightPosition.x;
  const lightYPixels = lightPosition.y;
  const arcProgress = lightPosition.arcProgress;
  const parabola = -4 * Math.pow(arcProgress - 0.5, 2) + 1; // Needed for other calculations

  // CRITICAL: Calculate continuous light angle for smooth gradient rotation
  // Calculate directly from the continuous normalized angle using a smooth mapping
  // The key insight: we want lightAngle to go 0→π as light moves right→left
  // But we need it to be continuous across the full 2π orbit
  // Solution: Use the normalizedAngle directly for the top half, and continue smoothly for bottom half
  // Use a continuous function that avoids the discontinuity at π/2 (apex)
  const continuousAngle = (progress * totalCycles) * Math.PI * 2;
  const normalizedAngle = continuousAngle % (Math.PI * 2);
  
  // Map normalizedAngle (0-2π) to lightAngle (0-π) matching the light's actual position
  // CRITICAL: For the visible arc (0-π), lightAngle should match normalizedAngle directly
  // This ensures gradient direction matches light position (right→left = 0→π)
  // For the hidden arc (π-2π), continue smoothly by mirroring
  // Use a continuous piecewise function that's smooth at boundaries
  let lightAngle: number;
  if (normalizedAngle <= Math.PI) {
    // Visible arc (0-π): light moves right→left, angle goes 0→π directly
    // This matches the light's actual horizontal movement
    lightAngle = normalizedAngle;
  } else {
    // Hidden arc (π-2π): light reverses direction (left→right)
    // Map π-2π to π-0 smoothly for continuous gradient rotation
    // Use smooth interpolation to avoid discontinuity at π boundary
    const t = (normalizedAngle - Math.PI) / Math.PI; // 0 to 1 as angle goes π to 2π
    // Linear interpolation: π → 0
    lightAngle = Math.PI * (1 - t);
  }
  
  // CRITICAL: Quantize lightAngle to prevent micro-changes from causing gradient direction flips
  // Round to 3 decimal places (0.001 precision = ~0.057 degree precision) for stability
  // This prevents 360° rotation at apex while maintaining smooth rotation
  const quantizedLightAngle = Math.round(lightAngle * 1000) / 1000;

  // OPTIMIZED: Use lookup tables if available (fast O(1) lookup instead of calculations)
  let skyColor: string;
  let mountainColor: string;
  let waterColor: string;
  let lightX: number;
  let lightY: number;

  if (preloadedData) {
    // Use pre-calculated colors from lookup table
    skyColor = getColorFromLUT(
      preloadedData.colorLUT,
      cycleProgress,
      "sky"
    );
    mountainColor = getColorFromLUT(
      preloadedData.colorLUT,
      cycleProgress,
      "mountain"
    );
    waterColor = getColorFromLUT(
      preloadedData.colorLUT,
      cycleProgress,
      "water"
    );

    // Normalize pixel positions to 0-1 for compatibility
    lightX = lightXPixels / viewportWidth;
    lightY = lightYPixels / viewportHeight;
  } else {
    // Fallback to calculation if no preloaded data (shouldn't happen in production)
    const { period, transitionProgress, nextPeriod } = timeOfDay;

    // Color maps
    const skyColors = {
      dawn: config.dawnSkyColor,
      day: config.daySkyColor,
      twilight: config.twilightSkyColor,
      dusk: config.duskSkyColor,
      night: config.nightSkyColor,
    };

    const mountainColors = {
      dawn: config.dawnMountainColor,
      day: config.dayMountainColor,
      twilight: config.twilightMountainColor,
      dusk: config.duskMountainColor,
      night: config.nightMountainColor,
    };

    const waterColors = {
      dawn: config.dawnWaterColor,
      day: config.dayWaterColor,
      twilight: config.twilightWaterColor,
      dusk: config.duskWaterColor,
      night: config.nightWaterColor,
    };

    // Smooth transition between periods using eased progress
    const overheadFactor = Math.max(0, (parabola - 0.7) / 0.3);
    const transitionSpeed = 1 - overheadFactor * 0.6;
    const adjustedTransitionProgress =
      transitionProgress * transitionSpeed + (1 - transitionSpeed) * 0.5;
    const easedTransitionProgress = smoothEase(adjustedTransitionProgress);

    skyColor = lerpColor(
      skyColors[period],
      skyColors[nextPeriod],
      easedTransitionProgress
    );
    mountainColor = lerpColor(
      mountainColors[period],
      mountainColors[nextPeriod],
      easedTransitionProgress
    );
    waterColor = lerpColor(
      waterColors[period],
      waterColors[nextPeriod],
      easedTransitionProgress
    );

    // Normalize pixel positions to 0-1 for compatibility
    lightX = lightXPixels / viewportWidth;
    lightY = lightYPixels / viewportHeight;
  }

  // Shadow direction (opposite of light)
  // Use quantized angle to prevent numerical precision issues
  const shadowDirection = {
    x: Math.cos(quantizedLightAngle + Math.PI),
    y: Math.sin(quantizedLightAngle + Math.PI) * 0.3, // Reduced Y for stylized shadows
  };

  // Shadow opacity (MINIMUM when sun is overhead, MAXIMUM when sun is at horizon)
  // CRITICAL FIX: Use cos instead of sin - shadows are weakest when light is directly overhead
  // At apex (π/2): cos(π/2) = 0 → minimal shadows ✓
  // At horizon (0 or π): cos(0) = 1, cos(π) = -1 → maximum shadows ✓
  // Use quantizedLightAngle for consistency
  const shadowStrength = Math.abs(Math.cos(quantizedLightAngle)) * config.shadowOpacity;
  const shadowOpacity = config.shadowEnabled
    ? shadowStrength
    : 0;

  // Mist opacity (more mist at dawn/dusk, less during day/night)
  const mistTransitionFactor = Math.abs(
    Math.sin(cycleProgress * Math.PI * 2)
  );
  const mistBaseOpacity = isDaytime
    ? config.mistDayOpacity
    : config.mistNightOpacity;
  const mistOpacity = config.mistEnabled
    ? mistBaseOpacity * (0.7 + mistTransitionFactor * 0.3)
    : 0;

  // Ambient brightness (dimmer at night)
  const ambientBrightness = isDaytime
    ? 1.0
    : 0.6 + Math.sin(cycleProgress * Math.PI) * 0.2;

  // Fog density (more at dawn/dusk)
  const fogDensity = config.fogEnabled
    ? config.fogDensity * (0.5 + mistTransitionFactor * 0.5)
    : 0;

  // God rays (only during day, strongest at dawn/dusk)
  const godRaysIntensity =
    config.godRaysEnabled && isDaytime
      ? config.godRaysIntensity *
        (1 - Math.abs(cycleProgress - 0.25) * 2)
      : 0;

  // Lens flare (only when sun/moon is high)
  const lensFlareIntensity = config.lensFlareEnabled
    ? config.lensFlareIntensity * parabola
    : 0;

  // Calculate "behind mountains" darkness factor
  // Mountains should be dark when sun/moon is behind them (low on horizon, at edges)
  // This happens during sunrise (arcProgress ~0.0-0.15) and sunset (arcProgress ~0.85-1.0)
  // Also during transitions between day/night cycles

  // Factor 1: How close to edges (sun rising/setting behind mountains)
  // arcProgress: 0 = sunrise (right), 1 = sunset (left), 0.5 = midday
  // Darkness peaks at edges (0 and 1), minimum at center (0.5)
  const distanceFromCenter = Math.abs(arcProgress - 0.5) * 2; // 0 at center, 1 at edges
  const edgeDarkness = Math.pow(distanceFromCenter, 1.5); // Smooth curve, stronger at edges

  // Factor 2: How low on horizon (parabola is low at edges)
  // Lower parabola = darker (light source is behind mountains)
  const horizonHeight = parabola; // 0-1, lower = closer to horizon
  const lowHorizonDarkness = 1 - horizonHeight; // Inverse: lower horizon = darker

  // Factor 3: Transition periods (dusk/dawn) - mountains are darker during transitions
  // Peak darkness at cycleProgress = 0.5 (dusk) and 0.0/1.0 (dawn)
  const transitionFactor = Math.abs(Math.sin(cycleProgress * Math.PI * 2));
  const transitionDarkness = transitionFactor * 0.5; // Moderate contribution

  // Combine factors with smooth transitions
  // Primary: edge position (sun behind mountains), Secondary: low horizon, Tertiary: transitions
  const behindMountainsDarkness = Math.min(
    1,
    edgeDarkness * 0.8 + // Primary: position at edges
      lowHorizonDarkness * 0.6 + // Secondary: low on horizon
      transitionDarkness // Tertiary: transition periods
  );

  return {
    skyColor,
    mountainColor,
    waterColor,
    timeOfDay,
    isDaytime,
    lightX,
    lightY,
    lightXPixels, // GAME DEV: Expose pixel positions directly for perfect sync
    lightYPixels, // GAME DEV: Expose pixel positions directly for perfect sync
    lightAngle,
    shadowDirection,
    shadowOpacity,
    shadowBlur: config.shadowBlur,
    shadowOffset: 50 * config.shadowOffsetMultiplier,
    mistOpacity,
    mistLayers: config.mistLayerCount,
    mistHeight: config.mistHeight,
    fogDensity,
    ambientBrightness,
    godRaysIntensity,
    lensFlareIntensity,
    behindMountainsDarkness,
    config,
  };
}

