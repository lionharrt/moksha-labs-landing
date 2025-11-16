/**
 * Position-Based Lighting System
 * Simple, performant lighting calculations based on sun/moon position
 * No time periods, no complex transitions - just position → lighting state
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface PositionBasedLightingState {
  skyColor: string;
  mountainColor: string;
  waterColor: string;
  isDaytime: boolean;
  brightness: number; // 0-1
  heightFactor: number; // 0-1, how high the light is above horizon
  lightAngle: number; // radians
  shadowOpacity: number;
  shadowDirection: { x: number; y: number };
  ambientBrightness: number;
}

// Simple color definitions
const DAY_COLORS = {
  sky: { r: 135, g: 206, b: 235 }, // Sky blue
  mountain: { r: 45, g: 90, b: 90 }, // Teal-green
  water: { r: 7, g: 157, b: 221 }, // Cyan
};

const NIGHT_COLORS = {
  sky: { r: 26, g: 26, b: 62 }, // Deep blue
  mountain: { r: 31, g: 41, b: 55 }, // Dark gray-blue
  water: { r: 20, g: 30, b: 60 }, // Deep blue
};

// Sunrise/sunset colors (used when light is near horizon)
const HORIZON_COLORS = {
  day: {
    sky: { r: 255, g: 179, b: 71 }, // Orange
    mountain: { r: 61, g: 79, b: 90 }, // Gray-blue
    water: { r: 180, g: 120, b: 80 }, // Orange-brown
  },
  night: {
    sky: { r: 42, g: 42, b: 94 }, // Dark blue-gray
    mountain: { r: 42, g: 42, b: 58 }, // Dark blue-gray
    water: { r: 30, g: 40, b: 70 }, // Dark blue
  },
};

function lerpRGB(color1: RGB, color2: RGB, t: number): RGB {
  return {
    r: Math.round(color1.r + (color2.r - color1.r) * t),
    g: Math.round(color1.g + (color2.g - color1.g) * t),
    b: Math.round(color1.b + (color2.b - color1.b) * t),
  };
}

function rgbToString(color: RGB): string {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

/**
 * Calculate lighting state purely from light source position
 * @param lightX - X position of light in pixels
 * @param lightY - Y position of light in pixels
 * @param viewportWidth - Viewport width in pixels
 * @param viewportHeight - Viewport height in pixels
 * @param isDaytime - Whether it's day (sun) or night (moon)
 */
export function calculatePositionBasedLighting(
  lightX: number,
  lightY: number,
  viewportWidth: number,
  viewportHeight: number,
  isDaytime: boolean
): PositionBasedLightingState {
  // 1. Calculate horizon and height factor
  const horizonY = viewportHeight * 0.8; // Same as arc calculation
  const maxHeight = viewportHeight * 0.7; // Maximum arc height
  
  // Height above horizon: 0 = at/below horizon, 1 = at peak
  const heightAboveHorizon = Math.max(0, horizonY - lightY);
  const heightFactor = Math.min(1, heightAboveHorizon / maxHeight);
  
  // 2. Brightness: stronger when light is higher
  // Day: 0.5-1.0, Night: 0.3-0.6
  const baseMin = isDaytime ? 0.5 : 0.3;
  const baseMax = isDaytime ? 1.0 : 0.6;
  const brightness = baseMin + (heightFactor * (baseMax - baseMin));
  
  // 3. Horizon factor: blend with sunset/sunrise colors when near horizon
  // 0 = at peak (no horizon blend), 1 = at horizon (full horizon blend)
  const horizonFactor = 1 - heightFactor;
  
  // 4. Calculate colors based on position
  const baseColors = isDaytime ? DAY_COLORS : NIGHT_COLORS;
  const horizonColors = isDaytime ? HORIZON_COLORS.day : HORIZON_COLORS.night;
  
  // Blend base colors with horizon colors based on height
  const skyBase = lerpRGB(baseColors.sky, horizonColors.sky, horizonFactor);
  const mountainBase = lerpRGB(baseColors.mountain, horizonColors.mountain, horizonFactor);
  const waterBase = lerpRGB(baseColors.water, horizonColors.water, horizonFactor);
  
  // Apply brightness
  const skyColor = rgbToString({
    r: Math.round(skyBase.r * brightness),
    g: Math.round(skyBase.g * brightness),
    b: Math.round(skyBase.b * brightness),
  });
  
  const mountainColor = rgbToString({
    r: Math.round(mountainBase.r * brightness),
    g: Math.round(mountainBase.g * brightness),
    b: Math.round(mountainBase.b * brightness),
  });
  
  const waterColor = rgbToString({
    r: Math.round(waterBase.r * brightness),
    g: Math.round(waterBase.g * brightness),
    b: Math.round(waterBase.b * brightness),
  });
  
  // 5. Light angle for shadows/gradients
  const centerX = viewportWidth / 2;
  const lightAngle = Math.atan2(horizonY - lightY, lightX - centerX);
  
  // 6. Shadow calculations
  const shadowDirection = {
    x: Math.cos(lightAngle + Math.PI),
    y: Math.sin(lightAngle + Math.PI) * 0.3, // Stylized shadows
  };
  
  // Shadow opacity: stronger when light is higher (more defined shadows)
  // Weaker near horizon (softer, ambient lighting)
  const shadowOpacity = heightFactor * (isDaytime ? 0.3 : 0.2);
  
  // 7. Ambient brightness for overall scene
  const ambientBrightness = brightness;
  
  return {
    skyColor,
    mountainColor,
    waterColor,
    isDaytime,
    brightness,
    heightFactor,
    lightAngle,
    shadowOpacity,
    shadowDirection,
    ambientBrightness,
  };
}

