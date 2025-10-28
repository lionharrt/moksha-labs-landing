import { BufferGeometry } from 'three';
import { createPetalGeometry, PETAL_LOD } from './createPetalGeometry';
import { createInnerPetalGeometry } from './createInnerPetalGeometry';

/**
 * Create 3 distinct petal geometry variants for different flower layers
 * 
 * - Inner: Shorter (20% less), rounder tip, more cupped
 * - Middle: Standard proportions
 * - Outer: Standard proportions (long, pointed)
 */

export function createInnerPetal(): BufferGeometry {
  // Inner petals: Shorter, rounder, more cupped
  return createInnerPetalGeometry(PETAL_LOD.MEDIUM.u, PETAL_LOD.MEDIUM.v);
}

export function createMiddlePetal(): BufferGeometry {
  // Middle petals: standard
  return createPetalGeometry(PETAL_LOD.MEDIUM.u, PETAL_LOD.MEDIUM.v);
}

export function createOuterPetal(): BufferGeometry {
  // Outer petals: standard (long, pointed)
  return createPetalGeometry(PETAL_LOD.MEDIUM.u, PETAL_LOD.MEDIUM.v);
}

