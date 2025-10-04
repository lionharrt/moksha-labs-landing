/**
 * Example 3: Particle Field - Realistic Star Field
 * 8000 stars with realistic colors and brightness variation
 * Based on best practices from docs/09-PARTICLE-SYSTEMS.md
 * 
 * Features:
 * - Spherical distribution (more natural than cube)
 * - Realistic star colors (blue-white, white, yellow, orange, red)
 * - Weighted color distribution matching real astronomy
 * - Brightness variation for depth perception
 */

'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

export function ParticleField() {
  // Generate realistic star field
  const particles = useMemo(() => {
    const count = 8000; // More stars for dense space feel
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    // Realistic star colors based on temperature
    // Most stars are white/blue-white, some yellow, few orange/red
    const starColors = [
      new THREE.Color(0.8, 0.8, 1.0),    // Blue-white (hot) - 40%
      new THREE.Color(1.0, 1.0, 1.0),    // White - 30%
      new THREE.Color(1.0, 0.95, 0.8),   // Yellow-white - 20%
      new THREE.Color(1.0, 0.85, 0.6),   // Yellow - 7%
      new THREE.Color(1.0, 0.7, 0.4),    // Orange - 2%
      new THREE.Color(1.0, 0.5, 0.3),    // Red (cool) - 1%
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Spherical distribution for more natural look
      // (instead of uniform cube which looks artificial)
      const radius = 15 + Math.random() * 35; // 15-50 units away
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Star color based on type (weighted distribution)
      let colorIndex;
      const rand = Math.random();
      if (rand < 0.4) colorIndex = 0;        // Blue-white
      else if (rand < 0.7) colorIndex = 1;   // White
      else if (rand < 0.9) colorIndex = 2;   // Yellow-white
      else if (rand < 0.97) colorIndex = 3;  // Yellow
      else if (rand < 0.99) colorIndex = 4;  // Orange
      else colorIndex = 5;                    // Red
      
      const color = starColors[colorIndex];
      
      // Vary brightness for depth perception
      const brightness = 0.5 + Math.random() * 0.5; // 50-100% brightness
      colors[i3] = color.r * brightness;
      colors[i3 + 1] = color.g * brightness;
      colors[i3 + 2] = color.b * brightness;
    }

    return { positions, colors };
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        vertexColors
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

