'use client';

import { useRef, useMemo, useEffect } from 'react';
import { InstancedMesh, Matrix4, Vector3 } from 'three';
import { createInnerPetal, createMiddlePetal, createOuterPetal } from '../utils/createPetalVariants';
import { LotusStamen } from './LotusStamen';

/**
 * Lotus Flower Component
 * 
 * Botanically accurate lotus structure:
 * - 3 layers with distinct petal geometries
 * - Aggressive tilt differentiation (tight inner → wide outer)
 * - Stamen center
 * - Golden angle rotation offsets
 * 
 * Performance:
 * - InstancedMesh (3 draw calls for petals)
 * - Reasonable petal counts to avoid collision
 */

interface LotusFlowerProps {
  /** Scale of entire flower */
  scale?: number;
}

export function LotusFlower({ scale = 1 }: LotusFlowerProps) {
  const innerLayerRef = useRef<InstancedMesh>(null);
  const middleLayerRef = useRef<InstancedMesh>(null);
  const outerLayerRef = useRef<InstancedMesh>(null);
  
  // Golden angle for natural spiral pattern (137.5°)
  const GOLDEN_ANGLE = 137.5 * (Math.PI / 180);
  
  // Create distinct geometries for each layer
  const innerGeometry = useMemo(() => createInnerPetal(), []);
  const middleGeometry = useMemo(() => createMiddlePetal(), []);
  const outerGeometry = useMemo(() => createOuterPetal(), []);
  
  /**
   * Position petals radiating from center stem
   * 
   * @param mesh - InstancedMesh to update
   * @param count - Number of petals in this layer
   * @param tiltAngle - Angle from vertical (0 = straight up, PI/2 = horizontal)
   * @param zOffset - Vertical offset of layer
   * @param petalScale - Scale of petals in this layer
   * @param rotationOffset - Starting rotation offset (golden angle for natural look)
   */
  const positionLayer = (
    mesh: InstancedMesh,
    count: number,
    tiltAngle: number,
    zOffset: number,
    petalScale: number,
    rotationOffset: number = 0
  ) => {
    const matrix = new Matrix4();
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + rotationOffset;
      
      // Manual matrix construction for correct order:
      // 1. Translate petal so base is at origin (move up by 1.75)
      // 2. Tilt away from vertical (rotate around X)
      // 3. Rotate around vertical stem (rotate around Z)
      // 4. Scale
      
      const translateToOrigin = new Matrix4().makeTranslation(0, 1.75, 0);
      const tiltMatrix = new Matrix4().makeRotationX(tiltAngle);
      const stemRotation = new Matrix4().makeRotationZ(angle);
      const scaleMatrix = new Matrix4().makeScale(petalScale, petalScale, petalScale);
      const finalPosition = new Matrix4().makeTranslation(0, 0, zOffset);
      
      // Combine: scale * translateToOrigin * tilt * stemRotation * finalPosition
      matrix.identity();
      matrix.multiply(finalPosition);      // 5. Move to layer height
      matrix.multiply(stemRotation);       // 4. Spin around stem
      matrix.multiply(tiltMatrix);         // 3. Tilt outward
      matrix.multiply(translateToOrigin);  // 2. Move base to origin
      matrix.multiply(scaleMatrix);        // 1. Scale first
      
      mesh.setMatrixAt(i, matrix);
    }
    
    mesh.instanceMatrix.needsUpdate = true;
  };
  
  // Initialize all layers when refs are ready
  useEffect(() => {
    if (!innerLayerRef.current || !middleLayerRef.current || !outerLayerRef.current) return;
    
    // INNER LAYER: 10 petals, MORE RELAXED (closer to middle layer)
    positionLayer(
      innerLayerRef.current,
      10,           // count
      0.6,          // tilt (~34°) - much more relaxed, closer to middle
      0.4 * scale,  // z offset (above center)
      0.5 * scale,  // petal scale (smallest)
      0             // no rotation offset
    );
    
    // MIDDLE LAYER: 13 petals, MEDIUM opening
    positionLayer(
      middleLayerRef.current,
      13,                  // count
      0.9,                 // tilt (~52°) - 30° more than inner
      0.0,                 // z offset (at center)
      0.8 * scale,         // petal scale (medium)
      GOLDEN_ANGLE / 2     // offset by half golden angle
    );
    
    // OUTER LAYER: 13 petals, WIDE OPEN (nearly horizontal)
    positionLayer(
      outerLayerRef.current,
      13,                  // count
      1.35,                // tilt (almost flat, fully relaxed)
      -0.5 * scale,        // z offset (below center)
      1.15 * scale,        // petal scale (largest)
      GOLDEN_ANGLE         // offset by golden angle
    );
  }, [scale, GOLDEN_ANGLE]);
  
  return (
    <group>
      {/* Stamen Center - Sacred Geometry Disc */}
      <LotusStamen radius={0.35} scale={scale} />
      
      {/* Inner Layer: 10 petals, tight */}
      <instancedMesh
        ref={innerLayerRef}
        args={[innerGeometry, undefined, 10]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#e89f4c" // Saffron
          roughness={0.6}
          metalness={0.1}
          side={2} // Double-sided
        />
      </instancedMesh>
      
      {/* Middle Layer: 13 petals, medium */}
      <instancedMesh
        ref={middleLayerRef}
        args={[middleGeometry, undefined, 13]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#e89f4c"
          roughness={0.6}
          metalness={0.1}
          side={2}
        />
      </instancedMesh>
      
      {/* Outer Layer: 13 petals, wide open */}
      <instancedMesh
        ref={outerLayerRef}
        args={[outerGeometry, undefined, 13]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#e89f4c"
          roughness={0.6}
          metalness={0.1}
          side={2}
        />
      </instancedMesh>
    </group>
  );
}

