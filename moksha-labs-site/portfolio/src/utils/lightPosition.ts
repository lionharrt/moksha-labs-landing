/**
 * Single source of truth for light position calculations
 * Used by DayNightCycle, useLighting, and AtmosphericEffects
 * 
 * Calculates the sun/moon position in viewport pixel coordinates
 * based on scroll progress using a continuous parabolic arc.
 * The arc smoothly loops by using a parabola above horizon and mirrored below.
 * This prevents teleporting and ensures smooth lighting transitions.
 */
export function calculateLightPosition(
  progress: number,
  viewportWidth: number,
  viewportHeight: number
): { x: number; y: number; arcProgress: number; isDaytime: boolean } {
  // Calculate which cycle we're in (0-27) and progress within that cycle
  const totalCycles = 28;
  const currentCycle = Math.floor(progress * totalCycles);
  const cycleProgress = (progress * totalCycles) % 1;

  // Split each cycle: 0-0.5 = day (sun), 0.5-1 = night (moon)
  const isDaytime = cycleProgress < 0.5;

  // CRITICAL: Use continuous parabolic arc across ALL cycles (no resetting)
  // Map progress to continuous angle: 0 → 2π per cycle, continuous across all cycles
  // This creates a smooth loop: progress 0.0 → 1.0 maps to 0 → 28*2π
  const continuousAngle = (progress * totalCycles) * Math.PI * 2;
  
  // Normalize angle to 0-2π range for parabolic calculation
  const normalizedAngle = continuousAngle % (Math.PI * 2);
  
  // For backward compatibility, calculate arcProgress (0-1) for sun/moon phase
  // This is used by lighting calculations
  const arcProgress = isDaytime
    ? cycleProgress / 0.5 // 0-1 for sun phase
    : (cycleProgress - 0.5) / 0.5; // 0-1 for moon phase

  // Parabolic arc parameters (same as original)
  const horizontalStart = viewportWidth + 200; // Start off-screen right
  const horizontalEnd = -200; // End off-screen left
  const skyHeight = viewportHeight * 0.7; // How high the arc goes
  const horizonY = viewportHeight * 0.8; // Horizon line

  // Create continuous parabolic arc that loops smoothly
  // Top half (0 to π): original parabola above horizon (visible arc)
  // Bottom half (π to 2π): mirrored parabola below horizon (hidden arc, curves back)
  let x: number;
  let y: number;

  if (normalizedAngle <= Math.PI) {
    // Top half: original parabolic arc (sunrise to sunset, visible)
    // Map angle 0-π to progress 0-1 for the parabola
    const parabolaProgress = normalizedAngle / Math.PI;
    
    // Horizontal: linear interpolation from right to left
    x = horizontalStart + (horizontalEnd - horizontalStart) * parabolaProgress;
    
    // Vertical: parabolic arc (peaks at 50% = π/2)
    const parabola = -4 * Math.pow(parabolaProgress - 0.5, 2) + 1; // Peaks at 0.5
    y = horizonY - skyHeight * parabola;
  } else {
    // Bottom half: mirrored parabolic arc (sunset to sunrise, hidden below horizon)
    // Map angle π-2π to progress 1-0 (reversed) for smooth connection
    const parabolaProgress = 1 - ((normalizedAngle - Math.PI) / Math.PI);
    
    // Horizontal: linear interpolation from left back to right (reversed)
    x = horizontalEnd + (horizontalStart - horizontalEnd) * parabolaProgress;
    
    // Vertical: mirrored parabola below horizon (curves down and back up)
    // Use negative parabola to go below horizon, then curve back up
    const parabola = -4 * Math.pow(parabolaProgress - 0.5, 2) + 1; // Same shape
    // Mirror it below horizon by adding instead of subtracting
    y = horizonY + skyHeight * parabola * 0.3; // Smaller curve below horizon
  }

  return { x, y, arcProgress, isDaytime };
}

