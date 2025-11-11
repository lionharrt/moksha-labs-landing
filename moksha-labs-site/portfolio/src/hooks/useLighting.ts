import { useMemo, useState } from "react";

// Lighting configuration that can be tweaked via controls
export interface LightingConfig {
  // Sky colors for different times
  daySkyColor: string;
  twilightSkyColor: string;
  duskSkyColor: string;
  nightSkyColor: string;
  dawnSkyColor: string;

  // Mountain colors
  dayMountainColor: string;
  twilightMountainColor: string;
  duskMountainColor: string;
  nightMountainColor: string;
  dawnMountainColor: string;

  // Water colors
  dayWaterColor: string;
  twilightWaterColor: string;
  duskWaterColor: string;
  nightWaterColor: string;
  dawnWaterColor: string;

  // Shadow parameters
  shadowEnabled: boolean;
  shadowOpacity: number;
  shadowBlur: number;
  shadowOffsetMultiplier: number;

  // Mist/Fog parameters
  mistEnabled: boolean;
  mistDayOpacity: number;
  mistNightOpacity: number;
  mistLayerCount: number;
  mistHeight: number; // 0-1 from base

  // Atmospheric effects
  godRaysEnabled: boolean;
  godRaysIntensity: number;
  lensFlareEnabled: boolean;
  lensFlareIntensity: number;
  fogEnabled: boolean;
  fogDensity: number;
}

// Default anime/line-art aesthetic configuration
const DEFAULT_CONFIG: LightingConfig = {
  // Sky colors (bright, saturated anime style)
  daySkyColor: "#87CEEB", // Bright sky blue
  twilightSkyColor: "#6B4C93", // Purple twilight (between day and night)
  duskSkyColor: "#2A2A5E", // Dark blue-gray (transitioning from night to dawn, not purple)
  nightSkyColor: "#1A1A3E", // Deep blue night
  dawnSkyColor: "#FFB347", // Orange dawn

  // Mountain colors (muted but clear)
  dayMountainColor: "#2D5A5A", // Teal-green
  twilightMountainColor: "#3A4550", // Dark gray-blue (between day and night)
  duskMountainColor: "#2A2A3A", // Dark blue-gray (transitioning from night to dawn, not purple)
  nightMountainColor: "#1F2937", // Dark gray-blue
  dawnMountainColor: "#3D4F5A", // Gray-blue

  // Water colors (reflective and clear)
  dayWaterColor: "rgb(4, 148, 180)", // Cyan
  twilightWaterColor: "rgb(60, 80, 120)", // Dark blue-purple (between day and night)
  duskWaterColor: "rgb(30, 40, 70)", // Dark blue (transitioning from night to dawn, not purple)
  nightWaterColor: "rgb(20, 30, 60)", // Deep blue
  dawnWaterColor: "rgb(180, 120, 80)", // Orange-brown

  // Shadows (anime-style crisp but soft)
  shadowEnabled: true,
  shadowOpacity: 0.3,
  shadowBlur: 30,
  shadowOffsetMultiplier: 1.0,

  // Mist (ethereal anime fog)
  mistEnabled: true,
  mistDayOpacity: 0.2,
  mistNightOpacity: 0.4,
  mistLayerCount: 3,
  mistHeight: 0.3,

  // Atmospheric effects
  godRaysEnabled: true,
  godRaysIntensity: 1,
  lensFlareEnabled: true,
  lensFlareIntensity: 0.3,
  fogEnabled: true,
  fogDensity: 0.15,
};

// Time of day periods for smooth transitions
type TimeOfDay = "dawn" | "day" | "twilight" | "dusk" | "night";

interface TimeOfDayInfo {
  period: TimeOfDay;
  periodProgress: number; // 0-1 within the current period
  transitionProgress: number; // 0-1 for smooth color blending
  nextPeriod: TimeOfDay;
}

// Calculate which period we're in based on cycle progress
function getTimeOfDay(cycleProgress: number): TimeOfDayInfo {
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
function lerpColor(color1: string, color2: string, t: number): string {
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

// Smooth easing function for color transitions (ease-in-out)
function easeInOut(t: number): number {
  // Smooth ease-in-out curve (similar to CSS ease-in-out)
  return t < 0.5
    ? 2 * t * t // Ease in
    : 1 - Math.pow(-2 * t + 2, 2) / 2; // Ease out
}

// Smooth easing function with longer transition period
function smoothEase(t: number): number {
  // Even smoother curve for gradual transitions
  return t < 0.5
    ? 4 * t * t * t // Cubic ease in
    : 1 - Math.pow(-2 * t + 2, 3) / 2; // Cubic ease out
}

// Exported lighting state that components will consume
export interface LightingState {
  // Current colors
  skyColor: string;
  mountainColor: string;
  waterColor: string;

  // Time info
  timeOfDay: TimeOfDayInfo;
  isDaytime: boolean;

  // Light source (sun/moon position from DayNightCycle)
  lightX: number; // 0-1 normalized viewport position
  lightY: number; // 0-1 normalized viewport position
  lightAngle: number; // Angle of light direction in radians

  // Shadow parameters
  shadowDirection: { x: number; y: number }; // Normalized vector
  shadowOpacity: number;
  shadowBlur: number;
  shadowOffset: number;

  // Mist parameters
  mistOpacity: number;
  mistLayers: number;
  mistHeight: number;

  // Atmospheric parameters
  fogDensity: number;
  ambientBrightness: number; // 0-1 overall brightness multiplier
  godRaysIntensity: number;
  lensFlareIntensity: number;

  // Behind mountains darkness (when sun/moon is behind mountains)
  behindMountainsDarkness: number; // 0-1, how dark mountains should be (0 = normal, 1 = very dark)

  // Config (for controls)
  config: LightingConfig;
}

export function useLighting(
  progress: number,
  initialConfig?: Partial<LightingConfig>
): [LightingState, (config: Partial<LightingConfig>) => void] {
  // Merge with default config
  const [config, setConfigState] = useState<LightingConfig>({
    ...DEFAULT_CONFIG,
    ...initialConfig,
  });

  const updateConfig = (updates: Partial<LightingConfig>) => {
    setConfigState((prev) => ({ ...prev, ...updates }));
  };

  const lightingState = useMemo(() => {
    // Calculate which cycle we're in (0-27) and progress within that cycle
    const totalCycles = 28;
    const currentCycle = Math.floor(progress * totalCycles);
    const cycleProgress = (progress * totalCycles) % 1;

    // Get time of day info
    const timeOfDay = getTimeOfDay(cycleProgress);
    const isDaytime = cycleProgress < 0.5;

    // Interpolate colors based on time of day
    let skyColor: string;
    let mountainColor: string;
    let waterColor: string;

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
    // Slow down transitions when light source is overhead (high parabola) to prevent jarring changes

    // Calculate arc progress and parabola first (needed for transition speed and light position)
    const isDayPhase = cycleProgress < 0.5;
    const arcProgress = isDayPhase
      ? cycleProgress / 0.5
      : (cycleProgress - 0.5) / 0.5;
    const parabola = -4 * Math.pow(arcProgress - 0.5, 2) + 1; // 0 at horizon, 1 at peak

    // Slow down transitions when light is overhead (parabola > 0.7)
    // When overhead, use a slower easing curve to prevent sharp changes
    const overheadFactor = Math.max(0, (parabola - 0.7) / 0.3); // 0 when low, 1 when overhead
    const transitionSpeed = 1 - overheadFactor * 0.6; // Slow down by up to 60% when overhead

    // Apply slower transition when overhead
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

    // Calculate light source position (matching DayNightCycle arc exactly)
    // This MUST match the exact calculation in DayNightCycle.tsx
    // arcProgress and parabola already calculated above for transition speed

    // Get viewport dimensions (matching DayNightCycle - use current window dimensions)
    // This ensures we always have the latest dimensions
    const viewportWidth =
      typeof window !== "undefined" ? window.innerWidth : 1920;
    const viewportHeight =
      typeof window !== "undefined" ? window.innerHeight : 1080;

    // Match DayNightCycle's EXACT arc calculation
    // Horizontal: starts at right (east), moves to left (west)
    const horizontalStart = viewportWidth + 200; // Start off-screen right
    const horizontalEnd = -200; // End off-screen left
    const lightXPixels =
      horizontalStart + (horizontalEnd - horizontalStart) * arcProgress;

    // Vertical: parabolic arc (parabola already calculated above)
    const skyHeight = viewportHeight * 0.7; // How high the arc goes
    const horizonY = viewportHeight * 0.8; // Horizon line
    const lightYPixels = horizonY - skyHeight * parabola;

    // IMPORTANT: lightXPixels and lightYPixels are the EXACT center of the sun/moon SVG
    // The SVG is positioned at (lightXPixels - centerX, lightYPixels - centerY)
    // where centerX = centerY = 200, so the center is at (lightXPixels, lightYPixels)

    // Normalize to 0-1 for compatibility (but store pixel values too)
    const lightX = lightXPixels / viewportWidth;
    const lightY = lightYPixels / viewportHeight;

    // Light angle (for shadow direction)
    const lightAngle = Math.PI * arcProgress; // 0 to PI (east to west)

    // Shadow direction (opposite of light)
    const shadowDirection = {
      x: Math.cos(lightAngle + Math.PI),
      y: Math.sin(lightAngle + Math.PI) * 0.3, // Reduced Y for stylized shadows
    };

    // Shadow opacity (stronger when sun is high/low, weaker at horizon)
    const shadowStrength = Math.sin(lightAngle) * config.shadowOpacity;
    const shadowOpacity = config.shadowEnabled ? Math.abs(shadowStrength) : 0;

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
        ? config.godRaysIntensity * (1 - Math.abs(cycleProgress - 0.25) * 2)
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
  }, [progress, config]);

  return [lightingState, updateConfig];
}
