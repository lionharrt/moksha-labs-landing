import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import {
  PreloadedData,
  getColorFromLUT,
  getLightPositionFromLUT,
} from "@/utils/performancePreloader";

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
export const DEFAULT_CONFIG: LightingConfig = {
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
  godRaysIntensity: 0.5,
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
  initialConfig?: Partial<LightingConfig>,
  preloadedData?: PreloadedData | null
): [LightingState, (config: Partial<LightingConfig>) => void] {
  // Merge with default config
  const [config, setConfigState] = useState<LightingConfig>({
    ...DEFAULT_CONFIG,
    ...initialConfig,
  });

  const updateConfig = (updates: Partial<LightingConfig>) => {
    setConfigState((prev) => ({ ...prev, ...updates }));
  };

  // OPTIMIZED: Store progress in ref to avoid recalculations on every change
  const progressRef = useRef(progress);
  const configRef = useRef(config);
  const lightingStateRef = useRef<LightingState | null>(null);
  const lastUpdateTimeRef = useRef(0);

  // Update refs immediately (no re-render)
  progressRef.current = progress;
  configRef.current = config;

  // Extract calculation logic into a pure function (defined before useState)
  const calculateLightingState = useCallback(
    (currentProgress: number, currentConfig: LightingConfig): LightingState => {
      // Calculate which cycle we're in (0-27) and progress within that cycle
      const totalCycles = 28;
      const currentCycle = Math.floor(currentProgress * totalCycles);
      const cycleProgress = (currentProgress * totalCycles) % 1;

      // Get time of day info
      const timeOfDay = getTimeOfDay(cycleProgress);
      const isDaytime = cycleProgress < 0.5;

      // Calculate arc progress and parabola (needed for both lookup and calculation paths)
      const isDayPhase = cycleProgress < 0.5;
      const arcProgress = isDayPhase
        ? cycleProgress / 0.5
        : (cycleProgress - 0.5) / 0.5;
      const parabola = -4 * Math.pow(arcProgress - 0.5, 2) + 1; // 0 at horizon, 1 at peak

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

        // Use pre-calculated light position from lookup table
        const lightPos = getLightPositionFromLUT(
          preloadedData.lightPositionLUT,
          arcProgress
        );
        const viewportWidth =
          typeof window !== "undefined" ? window.innerWidth : 1920;
        const viewportHeight =
          typeof window !== "undefined" ? window.innerHeight : 1080;

        // Normalize to 0-1 for compatibility
        lightX = lightPos.x / viewportWidth;
        lightY = lightPos.y / viewportHeight;
      } else {
        // Fallback to calculation if no preloaded data (shouldn't happen in production)
        const { period, transitionProgress, nextPeriod } = timeOfDay;

        // Color maps
        const skyColors = {
          dawn: currentConfig.dawnSkyColor,
          day: currentConfig.daySkyColor,
          twilight: currentConfig.twilightSkyColor,
          dusk: currentConfig.duskSkyColor,
          night: currentConfig.nightSkyColor,
        };

        const mountainColors = {
          dawn: currentConfig.dawnMountainColor,
          day: currentConfig.dayMountainColor,
          twilight: currentConfig.twilightMountainColor,
          dusk: currentConfig.duskMountainColor,
          night: currentConfig.nightMountainColor,
        };

        const waterColors = {
          dawn: currentConfig.dawnWaterColor,
          day: currentConfig.dayWaterColor,
          twilight: currentConfig.twilightWaterColor,
          dusk: currentConfig.duskWaterColor,
          night: currentConfig.nightWaterColor,
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

        // Calculate light source position
        const viewportWidth =
          typeof window !== "undefined" ? window.innerWidth : 1920;
        const viewportHeight =
          typeof window !== "undefined" ? window.innerHeight : 1080;

        const horizontalStart = viewportWidth + 200;
        const horizontalEnd = -200;
        const lightXPixels =
          horizontalStart + (horizontalEnd - horizontalStart) * arcProgress;

        const skyHeight = viewportHeight * 0.7;
        const horizonY = viewportHeight * 0.8;
        const lightYPixels = horizonY - skyHeight * parabola;

        lightX = lightXPixels / viewportWidth;
        lightY = lightYPixels / viewportHeight;
      }

      // Light angle (for shadow direction)
      const lightAngle = Math.PI * arcProgress; // 0 to PI (east to west)

      // Shadow direction (opposite of light)
      const shadowDirection = {
        x: Math.cos(lightAngle + Math.PI),
        y: Math.sin(lightAngle + Math.PI) * 0.3, // Reduced Y for stylized shadows
      };

      // Shadow opacity (stronger when sun is high/low, weaker at horizon)
      const shadowStrength = Math.sin(lightAngle) * currentConfig.shadowOpacity;
      const shadowOpacity = currentConfig.shadowEnabled
        ? Math.abs(shadowStrength)
        : 0;

      // Mist opacity (more mist at dawn/dusk, less during day/night)
      const mistTransitionFactor = Math.abs(
        Math.sin(cycleProgress * Math.PI * 2)
      );
      const mistBaseOpacity = isDaytime
        ? currentConfig.mistDayOpacity
        : currentConfig.mistNightOpacity;
      const mistOpacity = currentConfig.mistEnabled
        ? mistBaseOpacity * (0.7 + mistTransitionFactor * 0.3)
        : 0;

      // Ambient brightness (dimmer at night)
      const ambientBrightness = isDaytime
        ? 1.0
        : 0.6 + Math.sin(cycleProgress * Math.PI) * 0.2;

      // Fog density (more at dawn/dusk)
      const fogDensity = currentConfig.fogEnabled
        ? currentConfig.fogDensity * (0.5 + mistTransitionFactor * 0.5)
        : 0;

      // God rays (only during day, strongest at dawn/dusk)
      const godRaysIntensity =
        currentConfig.godRaysEnabled && isDaytime
          ? currentConfig.godRaysIntensity *
            (1 - Math.abs(cycleProgress - 0.25) * 2)
          : 0;

      // Lens flare (only when sun/moon is high)
      const lensFlareIntensity = currentConfig.lensFlareEnabled
        ? currentConfig.lensFlareIntensity * parabola
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
        shadowBlur: currentConfig.shadowBlur,
        shadowOffset: 50 * currentConfig.shadowOffsetMultiplier,
        mistOpacity,
        mistLayers: currentConfig.mistLayerCount,
        mistHeight: currentConfig.mistHeight,
        fogDensity,
        ambientBrightness,
        godRaysIntensity,
        lensFlareIntensity,
        behindMountainsDarkness,
        config: currentConfig,
      };
    },
    [preloadedData]
  ); // preloadedData is stable after loading

  // State for React components (throttled updates)
  // Calculate initial state inline since calculateLightingState is defined above
  const [lightingState, setLightingState] = useState<LightingState>(() =>
    calculateLightingState(progress, config)
  );

  // Throttled state update - only update React state at 30fps (33ms intervals)
  // BUT: Update ref every frame so canvas components get latest values immediately
  useEffect(() => {
    const updateInterval = 33; // ~30fps for React state updates

    // Throttled updates via requestAnimationFrame
    let rafId: number;
    const tick = () => {
      const now = performance.now();

      // Always update ref with latest progress (for canvas components)
      const latestState = calculateLightingState(
        progressRef.current,
        configRef.current
      );
      lightingStateRef.current = latestState;

      // Only update React state at throttled interval (for UI components)
      if (now - lastUpdateTimeRef.current >= updateInterval) {
        setLightingState(latestState);
        lastUpdateTimeRef.current = now;
      }

      rafId = requestAnimationFrame(tick);
    };

    // Initial calculation
    const initialState = calculateLightingState(progress, config);
    lightingStateRef.current = initialState;
    setLightingState(initialState);
    lastUpdateTimeRef.current = performance.now();

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculateLightingState, config]); // Recreate when config changes
  // Note: progress is intentionally excluded - we use progressRef.current instead

  // Expose function to get current lighting state from ref (for canvas components)
  // This allows canvas components to read the latest progress without waiting for React state
  const getCurrentLightingState = useCallback((): LightingState => {
    if (!lightingStateRef.current) {
      // Fallback: calculate on demand if ref is null
      return calculateLightingState(progressRef.current, configRef.current);
    }
    // Update ref with latest progress before returning
    lightingStateRef.current = calculateLightingState(
      progressRef.current,
      configRef.current
    );
    return lightingStateRef.current;
  }, [calculateLightingState]);

  // Store getCurrentLightingState in ref so canvas components can access it
  const getCurrentLightingStateRef = useRef(getCurrentLightingState);
  getCurrentLightingStateRef.current = getCurrentLightingState;

  return [lightingState, updateConfig];
}
