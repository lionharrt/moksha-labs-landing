"use client";

import React, { useRef, useEffect, useState } from "react";
import { useScene } from "@/storyboard/hooks/useScene";
import { aboutUsSceneConfig } from "./AboutUsScene.config";
import { useLightingContext } from "@/contexts/LightingContext";
import { calculateLightingState } from "@/utils/calculateLightingState";

const AboutUsScene = () => {
  const { sceneRef, progress } = useScene(aboutUsSceneConfig);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [waterColor, setWaterColor] = useState("rgb(7, 157, 221)"); // Match DEFAULT_CONFIG.dayWaterColor

  // Get shared lighting state from context
  const {
    progressRef,
    lightingConfigRef,
    viewportDimensionsRef,
  } = useLightingContext();

  // CRITICAL: Use refs for smooth interpolation (same as WaterSurface)
  const currentColorRef = useRef<[number, number, number]>([7, 157, 221]);
  const targetColorRef = useRef<[number, number, number]>([7, 157, 221]);

  // Parse color helper (same as WaterSurface)
  const parseColor = (color: string): [number, number, number] => {
    if (color.startsWith("rgb")) {
      const match = color.match(/\d+/g);
      if (match) {
        return [parseInt(match[0]), parseInt(match[1]), parseInt(match[2])];
      }
    } else if (color.startsWith("#")) {
      const hex = color.slice(1);
      return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16),
      ];
    }
    return [4, 148, 180]; // Default water blue
  };

  // CRITICAL: Smooth color interpolation using RAF (same as WaterSurface)
  // This syncs the About Us top color with the HeroScene water color
  useEffect(() => {
    let rafId: number;

    const updateWaterColor = () => {
      // CRITICAL: Use EXACT same logic as WaterSurface
      let calculatedWaterColor: string | null = null;

      if (
        progressRef &&
        lightingConfigRef?.current &&
        viewportDimensionsRef?.current
      ) {
        // Calculate water color using position-based lighting
        const lightingState = calculateLightingState(
          progressRef.current,
          lightingConfigRef.current,
          viewportDimensionsRef.current.width,
          viewportDimensionsRef.current.height
        );
        calculatedWaterColor = lightingState.waterColor;
      } else {
        calculatedWaterColor = "rgb(7, 157, 221)"; // Default
      }

      if (calculatedWaterColor) {
        const newColor = parseColor(calculatedWaterColor);

        // Update target color if it changed
        if (
          newColor[0] !== targetColorRef.current[0] ||
          newColor[1] !== targetColorRef.current[1] ||
          newColor[2] !== targetColorRef.current[2]
        ) {
          targetColorRef.current = newColor;
          // Initialize current color if not set
          if (
            !currentColorRef.current ||
            currentColorRef.current.length !== 3
          ) {
            currentColorRef.current = newColor;
          }
        }

        // Smooth interpolation between current and target (same as WaterSurface)
        const current = currentColorRef.current;
        const target = targetColorRef.current;
        const lerpFactor = 0.02; // Very slow - 2% per frame (same as WaterSurface)

        // Interpolate each RGB component smoothly
        const r = Math.round(
          current[0] + (target[0] - current[0]) * lerpFactor
        );
        const g = Math.round(
          current[1] + (target[1] - current[1]) * lerpFactor
        );
        const b = Math.round(
          current[2] + (target[2] - current[2]) * lerpFactor
        );

        // Update current color for next frame
        currentColorRef.current = [r, g, b];

        // Use interpolated color (WITH commas, EXACT same as WaterSurface)
        setWaterColor(`rgb(${r}, ${g}, ${b})`);
      }

      rafId = requestAnimationFrame(updateWaterColor);
    };

    rafId = requestAnimationFrame(updateWaterColor);

    return () => cancelAnimationFrame(rafId);
  }, [progressRef, lightingConfigRef, viewportDimensionsRef]);

  // Underwater particle effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    // Underwater particles (bubbles)
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
    }> = [];

    // Initialize particles with proper full-screen distribution
    const initParticles = () => {
      particles.length = 0; // Clear existing particles
      resizeCanvas(); // Ensure canvas is sized before initializing particles
      for (let i = 0; i < 80; i++) {
        // Increased count for better coverage
        particles.push({
          x: Math.random() * canvas.width, // Full width distribution
          y: Math.random() * canvas.height, // Full height distribution
          size: Math.random() * 4 + 1, // Slightly larger bubbles
          speed: Math.random() * 0.8 + 0.2, // Varied speeds
          opacity: Math.random() * 0.4 + 0.1,
        });
      }
    };

    initParticles(); // Initialize particles after canvas is sized

    // Handle resize - reinitialize particles when canvas size changes
    const handleResize = () => {
      initParticles();
    };

    window.addEventListener("resize", handleResize);

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle) => {
        particle.y -= particle.speed;

        // Reset particle when it goes off screen
        if (particle.y < -particle.size) {
          particle.y = canvas.height + particle.size;
          particle.x = Math.random() * canvas.width;
        }

        // Calculate fade out opacity for bubbles approaching the top (last 100px)
        const fadeZone = 250;
        let finalOpacity = particle.opacity;
        if (particle.y < fadeZone) {
          // Fade from full opacity at y=100 to 0 at y=0
          const fadeProgress = particle.y / fadeZone;
          finalOpacity = particle.opacity * fadeProgress;
        }

        // Draw bubble
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity})`;
        ctx.fill();

        // Add highlight
        ctx.beginPath();
        ctx.arc(
          particle.x - particle.size * 0.3,
          particle.y - particle.size * 0.3,
          particle.size * 0.3,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity * 0.8})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section
      ref={sceneRef}
      id={aboutUsSceneConfig.id}
      className="relative h-screen overflow-hidden"
      style={{
        // First quarter of underwater gradient (0%-25%)
        background: `linear-gradient(to bottom,
          ${waterColor} 0%,
          rgba(3, 111, 135, 0.92) 25%,
          rgba(2, 89, 112, 0.94) 50%,
          rgba(2, 74, 90, 0.95) 75%,
          rgba(2, 74, 90, 0.95) 100%
        )`,
        marginTop: "-1px", // Remove potential white line gap
      }}
    >
      {/* Underwater particle effects */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none h-full w-full"
        style={{ opacity: 0.6 }}
      />

      {/* About Us content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-8 text-white/90">About Us</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Beneath the surface, our story unfolds. We&apos;re diving deep into
            innovation, exploring the depths of technology and creativity to
            bring your vision to life.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUsScene;
