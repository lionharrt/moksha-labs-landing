/**
 * Boid Swarm - Core flocking simulation
 * 
 * Implements:
 * - Separation (avoid crowding)
 * - Alignment (match neighbors' direction)
 * - Cohesion (move toward group center)
 * - Mouse Avoidance (flee from cursor as physical obstacle)
 * 
 * Optimizations:
 * - Spatial grid for O(n) neighbor detection instead of O(n²)
 * - InstancedMesh for single draw call
 * - Limited perception radius
 */

'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface BoidSwarmProps {
  breakProgress: number;
}

// Boid configuration
const CONFIG = {
  COUNT: 500, // Number of boids
  PERCEPTION_RADIUS: 1.5, // How far boids can "see"
  SEPARATION_RADIUS: 0.8, // Minimum distance from neighbors
  MOUSE_FLEE_RADIUS: 3.0, // Distance to flee from mouse
  MAX_SPEED: 0.05, // Maximum velocity
  MAX_FORCE: 0.002, // Maximum steering force
  
  // Behavior weights
  SEPARATION_WEIGHT: 1.5,
  ALIGNMENT_WEIGHT: 1.0,
  COHESION_WEIGHT: 1.0,
  MOUSE_FLEE_WEIGHT: 2.5, // Strongest force
  
  // Bounds
  BOUNDS: { x: 6, y: 4, z: 3 },
  BOUNDARY_MARGIN: 0.5,
  TURN_FORCE: 0.005,
};

class Boid {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;
  
  constructor() {
    // Random initial position within bounds
    this.position = new THREE.Vector3(
      (Math.random() - 0.5) * CONFIG.BOUNDS.x,
      (Math.random() - 0.5) * CONFIG.BOUNDS.y,
      (Math.random() - 0.5) * CONFIG.BOUNDS.z
    );
    
    // Random initial velocity
    this.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02
    );
    
    this.acceleration = new THREE.Vector3();
  }
  
  applyForce(force: THREE.Vector3) {
    this.acceleration.add(force);
  }
  
  update() {
    // Update velocity
    this.velocity.add(this.acceleration);
    
    // Limit speed
    if (this.velocity.length() > CONFIG.MAX_SPEED) {
      this.velocity.normalize().multiplyScalar(CONFIG.MAX_SPEED);
    }
    
    // Update position
    this.position.add(this.velocity);
    
    // Reset acceleration
    this.acceleration.set(0, 0, 0);
  }
  
  // Keep boids within bounds with smooth turning
  containWithinBounds() {
    const margin = CONFIG.BOUNDARY_MARGIN;
    
    if (this.position.x < -CONFIG.BOUNDS.x + margin) {
      this.applyForce(new THREE.Vector3(CONFIG.TURN_FORCE, 0, 0));
    }
    if (this.position.x > CONFIG.BOUNDS.x - margin) {
      this.applyForce(new THREE.Vector3(-CONFIG.TURN_FORCE, 0, 0));
    }
    
    if (this.position.y < -CONFIG.BOUNDS.y + margin) {
      this.applyForce(new THREE.Vector3(0, CONFIG.TURN_FORCE, 0));
    }
    if (this.position.y > CONFIG.BOUNDS.y - margin) {
      this.applyForce(new THREE.Vector3(0, -CONFIG.TURN_FORCE, 0));
    }
    
    if (this.position.z < -CONFIG.BOUNDS.z + margin) {
      this.applyForce(new THREE.Vector3(0, 0, CONFIG.TURN_FORCE));
    }
    if (this.position.z > CONFIG.BOUNDS.z - margin) {
      this.applyForce(new THREE.Vector3(0, 0, -CONFIG.TURN_FORCE));
    }
  }
}

// Spatial grid for efficient neighbor detection
class SpatialGrid {
  cellSize: number;
  grid: Map<string, Boid[]>;
  
  constructor(cellSize: number) {
    this.cellSize = cellSize;
    this.grid = new Map();
  }
  
  clear() {
    this.grid.clear();
  }
  
  getCellKey(position: THREE.Vector3): string {
    const x = Math.floor(position.x / this.cellSize);
    const y = Math.floor(position.y / this.cellSize);
    const z = Math.floor(position.z / this.cellSize);
    return `${x},${y},${z}`;
  }
  
  insert(boid: Boid) {
    const key = this.getCellKey(boid.position);
    if (!this.grid.has(key)) {
      this.grid.set(key, []);
    }
    this.grid.get(key)!.push(boid);
  }
  
  getNearby(position: THREE.Vector3): Boid[] {
    const nearby: Boid[] = [];
    const cellX = Math.floor(position.x / this.cellSize);
    const cellY = Math.floor(position.y / this.cellSize);
    const cellZ = Math.floor(position.z / this.cellSize);
    
    // Check surrounding cells
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          const key = `${cellX + dx},${cellY + dy},${cellZ + dz}`;
          const cell = this.grid.get(key);
          if (cell) {
            nearby.push(...cell);
          }
        }
      }
    }
    
    return nearby;
  }
}

export function BoidSwarm({ breakProgress }: BoidSwarmProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport, camera, pointer } = useThree();
  
  // Mouse position in 3D space
  const mousePos = useRef(new THREE.Vector3(0, 0, 0));
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  
  // Initialize boids
  const boids = useMemo(() => {
    return Array.from({ length: CONFIG.COUNT }, () => new Boid());
  }, []);
  
  // Spatial grid for performance
  const spatialGrid = useMemo(() => new SpatialGrid(CONFIG.PERCEPTION_RADIUS), []);
  
  // Update mouse position in 3D space
  useEffect(() => {
    raycaster.setFromCamera(pointer, camera);
    const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const intersect = new THREE.Vector3();
    raycaster.ray.intersectPlane(planeZ, intersect);
    
    if (intersect) {
      mousePos.current.copy(intersect);
    }
  });
  
  // Flocking behaviors
  const separation = (boid: Boid, neighbors: Boid[]): THREE.Vector3 => {
    const steering = new THREE.Vector3();
    let total = 0;
    
    for (const other of neighbors) {
      const distance = boid.position.distanceTo(other.position);
      
      if (other !== boid && distance < CONFIG.SEPARATION_RADIUS && distance > 0) {
        const diff = new THREE.Vector3()
          .subVectors(boid.position, other.position)
          .normalize()
          .divideScalar(distance); // Weight by distance
        steering.add(diff);
        total++;
      }
    }
    
    if (total > 0) {
      steering.divideScalar(total);
      steering.normalize().multiplyScalar(CONFIG.MAX_SPEED);
      steering.sub(boid.velocity);
      steering.clampLength(0, CONFIG.MAX_FORCE);
    }
    
    return steering;
  };
  
  const alignment = (boid: Boid, neighbors: Boid[]): THREE.Vector3 => {
    const steering = new THREE.Vector3();
    let total = 0;
    
    for (const other of neighbors) {
      const distance = boid.position.distanceTo(other.position);
      
      if (other !== boid && distance < CONFIG.PERCEPTION_RADIUS) {
        steering.add(other.velocity);
        total++;
      }
    }
    
    if (total > 0) {
      steering.divideScalar(total);
      steering.normalize().multiplyScalar(CONFIG.MAX_SPEED);
      steering.sub(boid.velocity);
      steering.clampLength(0, CONFIG.MAX_FORCE);
    }
    
    return steering;
  };
  
  const cohesion = (boid: Boid, neighbors: Boid[]): THREE.Vector3 => {
    const steering = new THREE.Vector3();
    let total = 0;
    
    for (const other of neighbors) {
      const distance = boid.position.distanceTo(other.position);
      
      if (other !== boid && distance < CONFIG.PERCEPTION_RADIUS) {
        steering.add(other.position);
        total++;
      }
    }
    
    if (total > 0) {
      steering.divideScalar(total);
      steering.sub(boid.position);
      steering.normalize().multiplyScalar(CONFIG.MAX_SPEED);
      steering.sub(boid.velocity);
      steering.clampLength(0, CONFIG.MAX_FORCE);
    }
    
    return steering;
  };
  
  const fleeFromMouse = (boid: Boid): THREE.Vector3 => {
    const steering = new THREE.Vector3();
    const distance = boid.position.distanceTo(mousePos.current);
    
    if (distance < CONFIG.MOUSE_FLEE_RADIUS && distance > 0) {
      // Flee away from mouse
      steering.subVectors(boid.position, mousePos.current)
        .normalize()
        .multiplyScalar(CONFIG.MAX_SPEED);
      
      // Stronger force when closer
      const strength = 1 - (distance / CONFIG.MOUSE_FLEE_RADIUS);
      steering.multiplyScalar(strength);
      
      steering.sub(boid.velocity);
      steering.clampLength(0, CONFIG.MAX_FORCE * 3); // Allow stronger flee force
    }
    
    return steering;
  };
  
  // Animation loop
  useFrame(() => {
    if (!meshRef.current) return;
    
    // Rebuild spatial grid each frame
    spatialGrid.clear();
    boids.forEach(boid => spatialGrid.insert(boid));
    
    // Update each boid
    const dummy = new THREE.Object3D();
    const tempColor = new THREE.Color();
    
    boids.forEach((boid, i) => {
      // Get nearby boids for flocking
      const neighbors = spatialGrid.getNearby(boid.position);
      
      // Apply flocking forces
      const separationForce = separation(boid, neighbors).multiplyScalar(CONFIG.SEPARATION_WEIGHT);
      const alignmentForce = alignment(boid, neighbors).multiplyScalar(CONFIG.ALIGNMENT_WEIGHT);
      const cohesionForce = cohesion(boid, neighbors).multiplyScalar(CONFIG.COHESION_WEIGHT);
      const mouseFleeForce = fleeFromMouse(boid).multiplyScalar(CONFIG.MOUSE_FLEE_WEIGHT);
      
      boid.applyForce(separationForce);
      boid.applyForce(alignmentForce);
      boid.applyForce(cohesionForce);
      boid.applyForce(mouseFleeForce);
      
      // Boundary behavior
      boid.containWithinBounds();
      
      // Update physics
      boid.update();
      
      // Update instance matrix (position + rotation)
      dummy.position.copy(boid.position);
      
      // Orient boid in direction of movement
      if (boid.velocity.length() > 0.001) {
        dummy.lookAt(
          boid.position.x + boid.velocity.x,
          boid.position.y + boid.velocity.y,
          boid.position.z + boid.velocity.z
        );
      }
      
      // Scale based on breakProgress (scatter effect)
      const scatterScale = 1 + breakProgress * 0.5;
      dummy.scale.set(scatterScale, scatterScale, scatterScale);
      
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      
      // Bright white with slight speed-based variation
      const speedFactor = boid.velocity.length() / CONFIG.MAX_SPEED;
      const brightness = 0.85 + speedFactor * 0.15; // 0.85-1.0 brightness
      tempColor.setRGB(brightness, brightness, brightness);
      meshRef.current!.setColorAt(i, tempColor);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
    
    // Rotate entire swarm slowly
    meshRef.current.rotation.z = Date.now() * 0.00005;
  });
  
  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, CONFIG.COUNT]}>
      {/* Larger cone pointing forward (boid shape) */}
      <coneGeometry args={[0.08, 0.25, 4]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.95}
      />
    </instancedMesh>
  );
}

