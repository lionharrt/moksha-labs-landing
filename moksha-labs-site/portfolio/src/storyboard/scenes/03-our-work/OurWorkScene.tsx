"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useScene } from "@/storyboard/hooks/useScene";
import { ourWorkSceneConfig } from "./OurWorkScene.config";

const OurWorkScene = () => {
  const { sceneRef, progress } = useScene(ourWorkSceneConfig);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Use midday water color (matching HeroScene MIDDAY_PROGRESS)
  const waterColor = useMemo(() => {
    // Midday water color: rgb(4, 148, 180)
    return `rgb(4, 148, 180)`;
  }, []);

  // Underwater particle effect (similar to AboutUs but with different behavior)
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

    // Underwater particles (bubbles - slower and fewer for deeper water)
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
      for (let i = 0; i < 60; i++) { // Fewer bubbles for deeper water
        particles.push({
          x: Math.random() * canvas.width, // Full width distribution
          y: Math.random() * canvas.height, // Full height distribution
          size: Math.random() * 3 + 1, // Smaller bubbles for depth
          speed: Math.random() * 0.4 + 0.1, // Slower bubbles for depth
          opacity: Math.random() * 0.3 + 0.05, // More subtle
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

        // Draw bubble
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();

        // Add subtle highlight
        ctx.beginPath();
        ctx.arc(
          particle.x - particle.size * 0.3,
          particle.y - particle.size * 0.3,
          particle.size * 0.3,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity * 0.6})`;
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
      id={ourWorkSceneConfig.id}
      className="relative h-screen overflow-hidden"
      style={{
        // Second quarter of underwater gradient (25%-50%)
        background: `linear-gradient(to bottom,
          rgba(2, 74, 90, 0.95) 0%,
          rgba(1, 50, 60, 0.96) 25%,
          rgba(1, 37, 45, 0.97) 50%,
          rgba(0, 25, 30, 0.98) 75%,
          rgba(0, 20, 24, 0.99) 100%
        )`,
      }}
    >
      {/* Underwater particle effects */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none h-full w-full"
        style={{ opacity: 0.4 }}
      />

      {/* Our Work content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white max-w-4xl">
          <h1 className="text-6xl font-bold mb-8 text-white/90">
            Our Work
          </h1>
          <p className="text-xl text-white/70 mb-12">
            Diving deeper into our portfolio of innovative projects and creative solutions.
          </p>

          {/* Work showcase grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-2xl font-semibold mb-4 text-white/90">Web Experiences</h3>
              <p className="text-white/70">Immersive digital experiences that captivate and engage.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-2xl font-semibold mb-4 text-white/90">3D Visualizations</h3>
              <p className="text-white/70">Bringing ideas to life through stunning three-dimensional art.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-2xl font-semibold mb-4 text-white/90">Interactive Design</h3>
              <p className="text-white/70">Engaging interfaces that create meaningful connections.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurWorkScene;
