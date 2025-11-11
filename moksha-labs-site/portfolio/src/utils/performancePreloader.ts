/**
 * Performance Preloader
 * Pre-calculates and caches expensive operations during loading phase
 */

// Import only the interface, not the hook
interface LightingConfig {
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
}

// Pre-calculated color interpolation lookup table
// Maps progress (0-1) to interpolated colors
export interface ColorLUT {
  skyColors: string[];
  mountainColors: string[];
  waterColors: string[];
  // 1000 samples for smooth interpolation
  samples: number;
}

// Pre-calculated gradient cache
export interface GradientCache {
  [key: string]: CanvasGradient;
}

// Pre-rendered mountain paths
export interface MountainPathCache {
  [key: string]: Path2D;
}

/**
 * Pre-calculated data structure for performance optimization
 */
export interface PreloadedData {
  colorLUT: ColorLUT;
  lightPositionLUT: LightPositionLUT;
  noiseLUT: NoiseLUT;
}
export function precalculateColorLUT(
  config: LightingConfig,
  samples: number = 1000
): ColorLUT {
  const skyColors: string[] = [];
  const mountainColors: string[] = [];
  const waterColors: string[] = [];

  // Helper to parse color to RGB
  const parseColor = (colorStr: string): [number, number, number] => {
    if (colorStr.startsWith("rgb")) {
      const match = colorStr.match(/\d+/g);
      if (match) {
        return [parseFloat(match[0]), parseFloat(match[1]), parseFloat(match[2])];
      }
    } else if (colorStr.startsWith("#")) {
      const hex = colorStr.slice(1);
      return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16),
      ];
    }
    return [0, 0, 0];
  };

  // Helper to interpolate colors
  const lerpColor = (
    c1: [number, number, number],
    c2: [number, number, number],
    t: number
  ): string => {
    const r = Math.round(c1[0] * (1 - t) + c2[0] * t);
    const g = Math.round(c1[1] * (1 - t) + c2[1] * t);
    const b = Math.round(c1[2] * (1 - t) + c2[2] * t);
    return `rgb(${r},${g},${b})`;
  };

  // Pre-calculate colors for each sample point
  for (let i = 0; i < samples; i++) {
    const progress = i / (samples - 1);
    
    // Map progress to time of day periods
    let period: string;
    let nextPeriod: string;
    let transitionProgress: number;

    if (progress < 0.12) {
      period = "dawn";
      nextPeriod = "day";
      transitionProgress = progress / 0.12;
    } else if (progress < 0.47) {
      period = "day";
      nextPeriod = "twilight";
      transitionProgress = (progress - 0.12) / 0.35;
    } else if (progress < 0.53) {
      period = "twilight";
      nextPeriod = "night";
      transitionProgress = (progress - 0.47) / 0.06;
    } else if (progress < 0.88) {
      period = "night";
      nextPeriod = "dusk";
      transitionProgress = (progress - 0.53) / 0.35;
    } else {
      period = "dusk";
      nextPeriod = "dawn";
      transitionProgress = (progress - 0.88) / 0.12;
    }

    // Get color maps
    const skyColorMap: Record<string, string> = {
      dawn: config.dawnSkyColor,
      day: config.daySkyColor,
      twilight: config.twilightSkyColor,
      dusk: config.duskSkyColor,
      night: config.nightSkyColor,
    };

    const mountainColorMap: Record<string, string> = {
      dawn: config.dawnMountainColor,
      day: config.dayMountainColor,
      twilight: config.twilightMountainColor,
      dusk: config.duskMountainColor,
      night: config.nightMountainColor,
    };

    const waterColorMap: Record<string, string> = {
      dawn: config.dawnWaterColor,
      day: config.dayWaterColor,
      twilight: config.twilightWaterColor,
      dusk: config.duskWaterColor,
      night: config.nightWaterColor,
    };

    // Interpolate colors
    const sky1 = parseColor(skyColorMap[period]);
    const sky2 = parseColor(skyColorMap[nextPeriod]);
    skyColors.push(lerpColor(sky1, sky2, transitionProgress));

    const mountain1 = parseColor(mountainColorMap[period]);
    const mountain2 = parseColor(mountainColorMap[nextPeriod]);
    mountainColors.push(lerpColor(mountain1, mountain2, transitionProgress));

    const water1 = parseColor(waterColorMap[period]);
    const water2 = parseColor(waterColorMap[nextPeriod]);
    waterColors.push(lerpColor(water1, water2, transitionProgress));
  }

  return {
    skyColors,
    mountainColors,
    waterColors,
    samples,
  };
}

/**
 * Get color from lookup table (fast O(1) lookup)
 */
export function getColorFromLUT(
  lut: ColorLUT,
  progress: number,
  type: "sky" | "mountain" | "water"
): string {
  const index = Math.floor(progress * (lut.samples - 1));
  const clampedIndex = Math.max(0, Math.min(index, lut.samples - 1));
  
  switch (type) {
    case "sky":
      return lut.skyColors[clampedIndex];
    case "mountain":
      return lut.mountainColors[clampedIndex];
    case "water":
      return lut.waterColors[clampedIndex];
  }
}

/**
 * Pre-calculate light position lookup table
 * Maps progress to light X, Y positions
 */
export interface LightPositionLUT {
  x: number[];
  y: number[];
  samples: number;
}

export function precalculateLightPositionLUT(
  viewportWidth: number,
  viewportHeight: number,
  samples: number = 1000
): LightPositionLUT {
  const x: number[] = [];
  const y: number[] = [];

  for (let i = 0; i < samples; i++) {
    const progress = i / (samples - 1);
    
    // Calculate arc progress (0-1 for day, 0-1 for night)
    const isDayPhase = progress < 0.5;
    const arcProgress = isDayPhase ? progress / 0.5 : (progress - 0.5) / 0.5;
    
    // Parabola: 0 at horizon, 1 at peak
    const parabola = -4 * Math.pow(arcProgress - 0.5, 2) + 1;
    
    // Horizontal: starts at right (east), moves to left (west)
    const horizontalStart = viewportWidth + 200;
    const horizontalEnd = -200;
    const lightXPixels = horizontalStart + (horizontalEnd - horizontalStart) * arcProgress;
    
    // Vertical: parabolic arc
    const skyHeight = viewportHeight * 0.7;
    const horizonY = viewportHeight * 0.8;
    const lightYPixels = horizonY - skyHeight * parabola;
    
    x.push(lightXPixels);
    y.push(lightYPixels);
  }

  return { x, y, samples };
}

/**
 * Get light position from lookup table
 */
export function getLightPositionFromLUT(
  lut: LightPositionLUT,
  progress: number
): { x: number; y: number } {
  const index = Math.floor(progress * (lut.samples - 1));
  const clampedIndex = Math.max(0, Math.min(index, lut.samples - 1));
  return {
    x: lut.x[clampedIndex],
    y: lut.y[clampedIndex],
  };
}

/**
 * Pre-calculate noise lookup table
 * Pre-generates noise values for common ranges
 */
export interface NoiseLUT {
  values: Float32Array;
  scale: number;
  samples: number;
}

export function precalculateNoiseLUT(
  scale: number,
  samples: number = 10000
): NoiseLUT {
  const values = new Float32Array(samples);
  
  // Simple noise function (can be replaced with better implementation)
  for (let i = 0; i < samples; i++) {
    const x = i * scale;
    const n1 = Math.sin(x * 0.003) * 0.5 + 0.5;
    const n2 = Math.sin(x * 0.007) * 0.3 + 0.5;
    const n3 = Math.sin(x * 0.015) * 0.2 + 0.5;
    values[i] = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
  }

  return { values, scale, samples };
}

/**
 * Get noise value from lookup table
 */
export function getNoiseFromLUT(lut: NoiseLUT, x: number): number {
  const index = Math.floor(x / lut.scale);
  const clampedIndex = Math.max(0, Math.min(index, lut.samples - 1));
  return lut.values[clampedIndex];
}

