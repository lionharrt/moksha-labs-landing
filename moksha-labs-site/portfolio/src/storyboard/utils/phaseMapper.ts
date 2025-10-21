/**
 * Phase Mapping Utilities
 * 
 * Core utilities for mapping scroll progress to animation phases.
 * Based on the Single Source of Truth pattern from 14-SCROLL-PHASING-PATTERNS.md
 */

import { PhaseDefinition, ScenePhases } from '../types/Scene.types';

/**
 * Map overall scroll progress (0-1) to a specific phase's progress (0-1)
 * 
 * @param scrollProgress - Overall scroll progress through scene (0-1)
 * @param start - Phase start point (0-1)
 * @param end - Phase end point (0-1)
 * @returns Progress through this specific phase (0-1)
 * 
 * @example
 * // If scene is 40% scrolled and phase is 0.3-0.7
 * mapPhase(0.4, 0.3, 0.7) // Returns 0.25 (25% through this phase)
 */
export function mapPhase(
  scrollProgress: number,
  start: number,
  end: number
): number {
  // Before phase starts
  if (scrollProgress < start) return 0;
  
  // After phase ends
  if (scrollProgress > end) return 1;
  
  // Within phase - normalize to 0-1 range
  return (scrollProgress - start) / (end - start);
}

/**
 * Map scroll progress to a phase definition with optional easing
 * 
 * @param scrollProgress - Overall scroll progress (0-1)
 * @param phase - Phase definition with start/end/ease
 * @returns Progress through phase (0-1), with easing applied if specified
 */
export function mapPhaseDefinition(
  scrollProgress: number,
  phase: PhaseDefinition
): number {
  const linear = mapPhase(scrollProgress, phase.start, phase.end);
  
  // Apply easing if specified
  if (phase.ease) {
    return applyEasing(linear, phase.ease);
  }
  
  return linear;
}

/**
 * Map scroll progress to all phases in a scene
 * 
 * @param scrollProgress - Overall scroll progress (0-1)
 * @param phases - All phase definitions for the scene
 * @returns Object with progress for each phase
 * 
 * @example
 * const progress = mapAllPhases(0.5, {
 *   intro: { start: 0, end: 0.2 },
 *   build: { start: 0.2, end: 0.7 },
 *   hold: { start: 0.7, end: 0.9 }
 * });
 * // Returns { intro: 1, build: 0.6, hold: 0 }
 */
export function mapAllPhases(
  scrollProgress: number,
  phases: ScenePhases
): Record<string, number> {
  const result: Record<string, number> = {};
  
  for (const [name, phase] of Object.entries(phases)) {
    if (phase) {
      result[name] = mapPhaseDefinition(scrollProgress, phase);
    }
  }
  
  return result;
}

/**
 * Check if scroll progress is within a specific phase
 * 
 * @param scrollProgress - Overall scroll progress (0-1)
 * @param phase - Phase definition
 * @returns Whether progress is within this phase
 */
export function isInPhase(
  scrollProgress: number,
  phase: PhaseDefinition
): boolean {
  return scrollProgress >= phase.start && scrollProgress <= phase.end;
}

/**
 * Get the currently active phase name(s)
 * 
 * @param scrollProgress - Overall scroll progress (0-1)
 * @param phases - All phase definitions
 * @returns Array of active phase names (can be multiple if overlapping)
 */
export function getActivePhases(
  scrollProgress: number,
  phases: ScenePhases
): string[] {
  const active: string[] = [];
  
  for (const [name, phase] of Object.entries(phases)) {
    if (phase && isInPhase(scrollProgress, phase)) {
      active.push(name);
    }
  }
  
  return active;
}

/**
 * Validate phase definitions (ensure no gaps/overlaps, valid ranges)
 * 
 * @param phases - Phase definitions to validate
 * @returns Validation result with errors if any
 */
export function validatePhases(phases: ScenePhases): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const phaseArray = Object.entries(phases)
    .filter(([_, phase]) => phase !== undefined)
    .map(([name, phase]) => ({ name, ...phase! }))
    .sort((a, b) => a.start - b.start);
  
  for (let i = 0; i < phaseArray.length; i++) {
    const phase = phaseArray[i];
    
    // Check valid range
    if (phase.start < 0 || phase.start > 1) {
      errors.push(`Phase "${phase.name}" has invalid start: ${phase.start}`);
    }
    if (phase.end < 0 || phase.end > 1) {
      errors.push(`Phase "${phase.name}" has invalid end: ${phase.end}`);
    }
    if (phase.start >= phase.end) {
      errors.push(`Phase "${phase.name}" start >= end: ${phase.start} >= ${phase.end}`);
    }
    
    // Check for gaps with next phase
    if (i < phaseArray.length - 1) {
      const nextPhase = phaseArray[i + 1];
      const gap = nextPhase.start - phase.end;
      
      if (gap > 0.01) {
        warnings.push(
          `Gap between "${phase.name}" and "${nextPhase.name}": ${gap.toFixed(3)}`
        );
      } else if (gap < 0) {
        warnings.push(
          `Overlap between "${phase.name}" and "${nextPhase.name}": ${Math.abs(gap).toFixed(3)}`
        );
      }
    }
  }
  
  // Check if phases cover full range
  if (phaseArray.length > 0) {
    if (phaseArray[0].start > 0.01) {
      warnings.push(`First phase starts at ${phaseArray[0].start}, not 0`);
    }
    if (phaseArray[phaseArray.length - 1].end < 0.99) {
      warnings.push(`Last phase ends at ${phaseArray[phaseArray.length - 1].end}, not 1`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Apply easing function to linear progress
 * Supports GSAP easing strings and common CSS easings
 */
export function applyEasing(progress: number, easingName: string): number {
  // Clamp to 0-1
  progress = Math.max(0, Math.min(1, progress));
  
  switch (easingName) {
    // Linear
    case 'linear':
    case 'none':
      return progress;
    
    // Ease in
    case 'ease-in':
    case 'power2.in':
      return progress * progress;
    
    case 'power3.in':
      return progress * progress * progress;
    
    case 'power4.in':
      return progress * progress * progress * progress;
    
    // Ease out
    case 'ease-out':
    case 'power2.out':
      return 1 - Math.pow(1 - progress, 2);
    
    case 'power3.out':
      return 1 - Math.pow(1 - progress, 3);
    
    case 'power4.out':
      return 1 - Math.pow(1 - progress, 4);
    
    // Ease in-out
    case 'ease-in-out':
    case 'power2.inOut':
      return progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    
    // Cubic Bezier approximations
    case 'ease':
      return cubicBezier(progress, 0.25, 0.1, 0.25, 1);
    
    // Elastic (simplified)
    case 'elastic.out':
      if (progress === 0 || progress === 1) return progress;
      return Math.pow(2, -10 * progress) * Math.sin((progress - 0.1) * 5 * Math.PI) + 1;
    
    // Back
    case 'back.out':
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(progress - 1, 3) + c1 * Math.pow(progress - 1, 2);
    
    default:
      console.warn(`Unknown easing: ${easingName}, using linear`);
      return progress;
  }
}

/**
 * Cubic Bezier easing implementation
 * Approximation for simplicity - for exact bezier, use GSAP
 */
function cubicBezier(t: number, p1x: number, p1y: number, p2x: number, p2y: number): number {
  // Simplified cubic bezier - good enough for most cases
  const cx = 3 * p1x;
  const bx = 3 * (p2x - p1x) - cx;
  const ax = 1 - cx - bx;
  
  const cy = 3 * p1y;
  const by = 3 * (p2y - p1y) - cy;
  const ay = 1 - cy - by;
  
  return ay * t * t * t + by * t * t + cy * t;
}

/**
 * Smooth step function (ease-in-out alternative)
 * Useful for smooth transitions between phases
 */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Smoother step function (higher-order smooth step)
 */
export function smootherstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * t * (t * (t * 6 - 15) + 10);
}

/**
 * Create a custom phase mapper with easing
 * Useful for reusable animation patterns
 */
export function createPhaseMapper(
  start: number,
  end: number,
  ease?: string
) {
  return (scrollProgress: number): number => {
    const linear = mapPhase(scrollProgress, start, end);
    return ease ? applyEasing(linear, ease) : linear;
  };
}

