/**
 * Sun Component with Fresnel Shader
 * Following best practices from docs:
 * - Fresnel shader for rim lighting (03-SHADER-PROGRAMMING.md)
 * - Custom ShaderMaterial (03-SHADER-PROGRAMMING.md)
 * - Text billboarding (02-REACT-THREE-FIBER.md)
 */

'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export function Sun() {
  const sunRef = useRef<THREE.Mesh>(null);
  const textGroupRef = useRef<THREE.Group>(null);

  // Custom sun shader with Fresnel effect (from docs 03-SHADER-PROGRAMMING.md)
  const sunShader = useMemo(() => ({
    uniforms: {
      time: { value: 0 },
      color1: { value: new THREE.Color('#ff4400') }, // Core color
      color2: { value: new THREE.Color('#ffff00') }, // Edge color (brighter)
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      uniform float time;
      
      // Simple noise function
      float noise(vec3 p) {
        return fract(sin(dot(p, vec3(12.9898, 78.233, 45.5432))) * 43758.5453);
      }
      
      void main() {
        vNormal = normalize(normalMatrix * normal);
        
        // Add subtle surface displacement for texture
        vec3 pos = position;
        float n = noise(pos * 3.0 + time * 0.1) * 0.05;
        pos += normal * n;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 color1;
      uniform vec3 color2;
      uniform float time;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      
      void main() {
        // Fresnel effect - edges brighter than center
        vec3 viewDir = normalize(vViewPosition);
        float fresnel = pow(1.0 - dot(viewDir, vNormal), 3.0);
        
        // Mix core and edge colors based on fresnel
        vec3 color = mix(color1, color2, fresnel);
        
        // Add pulsing effect
        float pulse = sin(time * 2.0) * 0.1 + 0.9;
        color *= pulse;
        
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  }), []);

  // Animate
  useFrame((state) => {
    if (sunRef.current) {
      const material = sunRef.current.material as THREE.ShaderMaterial;
      material.uniforms.time.value = state.clock.elapsedTime;
    }
    
    if (textGroupRef.current) {
      textGroupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group>
      {/* Sun with custom Fresnel shader */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[1, 128, 128]} />
        <shaderMaterial
          attach="material"
          args={[sunShader]}
        />
      </mesh>

      {/* Strong point light from sun */}
      <pointLight 
        position={[0, 0, 0]} 
        intensity={4} 
        color="#ff9500" 
        distance={25}
        decay={1.5}
      />

      {/* Text curved around sun's surface */}
      <group ref={textGroupRef}>
        {(() => {
          const text = 'MOKSHA LABS'.split('').reverse().join(''); // Reverse for correct reading
          const radius = 1.25;
          const chars = text.split('');
          const totalChars = chars.length;
          // Spread text over an arc (in radians)
          const arcLength = 2.0; // Increased spacing - about 115 degrees
          const angleStep = arcLength / (totalChars - 1);
          const startAngle = -arcLength / 2; // Center the text
          
          return chars.map((char, i) => {
            const angle = startAngle + (i * angleStep);
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            return (
              <Text
                key={i}
                position={[x, 0, z]}
                rotation={[0, -angle + Math.PI / 2, 0]}
                fontSize={0.3}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.04}
                outlineColor="#ff6600"
                fontWeight="bold"
              >
                {char}
              </Text>
            );
          });
        })()}
      </group>
    </group>
  );
}

