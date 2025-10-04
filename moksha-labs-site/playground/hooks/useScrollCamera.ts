/**
 * Scroll-Based Camera Animation Hook
 * Award-winning pattern: Section-based camera transitions
 * Based on docs/12-AWARD-WINNING-EXAMPLES.md (lines 294-316)
 */

'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

interface UseScrollCameraOptions {
  planetRef: React.RefObject<THREE.Mesh>;
  orbitRadius?: number;
  orbitHeight?: number;
}

export function useScrollCamera({
  planetRef,
  orbitRadius = 5,
  orbitHeight = 2,
}: UseScrollCameraOptions) {
  const { camera } = useThree();
  const scrollProgress = useRef(0);
  const currentSection = useRef(0);
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));

  // Track scroll position (0-1)
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      scrollProgress.current = Math.min(Math.max(scrolled / scrollHeight, 0), 1);

      console.log('📜 Scroll Progress:', scrollProgress.current.toFixed(2));

      // Section-based transitions (like award-winning sites)
      const newSection = scrollProgress.current < 0.5 ? 0 : 1;
      
      if (newSection !== currentSection.current && planetRef.current) {
        currentSection.current = newSection;
        
        console.log('🎬 SECTION CHANGE:', newSection === 0 ? 'SUN' : 'PLANET');
        
        if (newSection === 0) {
          // Section 0: Sun view
          console.log('☀️ Animating to SUN view (0, 0, 15)');
          gsap.to(camera.position, {
            x: 0,
            y: 0,
            z: 15,
            duration: 1.5,
            ease: 'power2.inOut',
            onUpdate: () => {
              console.log('  Camera pos:', camera.position.x.toFixed(1), camera.position.y.toFixed(1), camera.position.z.toFixed(1));
            }
          });
          
          gsap.to(lookAtTarget.current, {
            x: 0,
            y: 0,
            z: 0,
            duration: 1.5,
            ease: 'power2.inOut',
          });
        } else {
          // Section 1: Planet view - lock to planet's orbital position
          const planetWorldPos = new THREE.Vector3();
          planetRef.current.getWorldPosition(planetWorldPos);
          
          console.log('🪐 Planet position:', planetWorldPos.x.toFixed(1), planetWorldPos.y.toFixed(1), planetWorldPos.z.toFixed(1));
          console.log('🎥 Animating to PLANET view');
          
          gsap.to(camera.position, {
            x: planetWorldPos.x,
            y: planetWorldPos.y + orbitHeight,
            z: planetWorldPos.z + orbitRadius,
            duration: 2,
            ease: 'power2.inOut',
            onUpdate: () => {
              console.log('  Camera pos:', camera.position.x.toFixed(1), camera.position.y.toFixed(1), camera.position.z.toFixed(1));
            }
          });
          
          gsap.to(lookAtTarget.current, {
            x: planetWorldPos.x,
            y: planetWorldPos.y,
            z: planetWorldPos.z,
            duration: 2,
            ease: 'power2.inOut',
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [camera, planetRef, orbitRadius, orbitHeight]);

  // Follow planet when in planet section
  useFrame((state) => {
    if (currentSection.current === 1 && planetRef.current) {
      const planetWorldPos = new THREE.Vector3();
      planetRef.current.getWorldPosition(planetWorldPos);
      
      // Log every 60 frames (1 second at 60fps)
      if (Math.floor(state.clock.elapsedTime * 60) % 60 === 0) {
        console.log('🔄 Following planet - Planet at:', planetWorldPos.x.toFixed(1), planetWorldPos.y.toFixed(1), planetWorldPos.z.toFixed(1));
        console.log('   Camera at:', camera.position.x.toFixed(1), camera.position.y.toFixed(1), camera.position.z.toFixed(1));
      }
      
      // Smoothly follow planet's orbital position
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, planetWorldPos.x, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, planetWorldPos.y + orbitHeight, 0.05);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, planetWorldPos.z + orbitRadius, 0.05);
      
      lookAtTarget.current.copy(planetWorldPos);
    }
    
    camera.lookAt(lookAtTarget.current);
  });
}

