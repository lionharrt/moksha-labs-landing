/**
 * Position-Based Lighting State Calculation
 * Simplified to use light position instead of time periods
 */

import { calculateLightPosition } from "@/utils/lightPosition";
import { calculatePositionBasedLighting } from "@/utils/positionBasedLighting";
import { LightingConfig, LightingState } from "@/hooks/useLighting";
import { TOTAL_CYCLES } from "@/components/ui/DayNightCycle";

/**
 * Pure function to calculate lighting state from progress and config
 * Now simplified to use position-based lighting
 */
export function calculateLightingState(
  progress: number,
  config: LightingConfig,
  viewportWidth: number,
  viewportHeight: number
): LightingState {
  // Calculate which cycle we're in and if it's day or night
  const totalCycles = TOTAL_CYCLES;
  const cycleProgress = (progress * totalCycles) % 1;
  const isDaytime = cycleProgress < 0.5;

  // Get light position (sun or moon)
  const lightPosition = calculateLightPosition(
    progress,
    viewportWidth,
    viewportHeight
  );
  const lightXPixels = lightPosition.x;
  const lightYPixels = lightPosition.y;

  // Use new position-based lighting calculation
  const positionLighting = calculatePositionBasedLighting(
    lightXPixels,
    lightYPixels,
    viewportWidth,
    viewportHeight,
    isDaytime
  );

  // Normalize pixel positions to 0-1 for compatibility
  const lightX = lightXPixels / viewportWidth;
  const lightY = lightYPixels / viewportHeight;

  // Optional atmospheric effects from config
  const mistOpacity = config.mistEnabled
    ? (isDaytime ? config.mistDayOpacity : config.mistNightOpacity) *
      positionLighting.heightFactor
    : 0;

  const fogDensity = config.fogEnabled
    ? config.fogDensity * (1 - positionLighting.heightFactor * 0.5)
    : 0;

  const godRaysIntensity =
    config.godRaysEnabled && isDaytime
      ? config.godRaysIntensity * positionLighting.heightFactor
      : 0;

  const lensFlareIntensity = config.lensFlareEnabled
    ? config.lensFlareIntensity * positionLighting.heightFactor
    : 0;

  // Behind mountains darkness (when light is low near horizon)
  const behindMountainsDarkness = 1 - positionLighting.heightFactor;

  return {
    skyColor: positionLighting.skyColor,
    mountainColor: positionLighting.mountainColor,
    waterColor: positionLighting.waterColor,
    isDaytime: positionLighting.isDaytime,
    lightX,
    lightY,
    lightXPixels,
    lightYPixels,
    lightAngle: positionLighting.lightAngle,
    shadowDirection: positionLighting.shadowDirection,
    shadowOpacity: config.shadowEnabled
      ? positionLighting.shadowOpacity
      : 0,
    shadowBlur: config.shadowBlur,
    shadowOffset: 50 * config.shadowOffsetMultiplier,
    mistOpacity,
    mistLayers: config.mistLayerCount,
    mistHeight: config.mistHeight,
    fogDensity,
    ambientBrightness: positionLighting.ambientBrightness,
    godRaysIntensity,
    lensFlareIntensity,
    behindMountainsDarkness,
    brightness: positionLighting.brightness,
    heightFactor: positionLighting.heightFactor,
    config,
  };
}
