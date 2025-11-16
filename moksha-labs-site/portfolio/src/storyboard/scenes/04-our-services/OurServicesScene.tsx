"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useScene } from "@/storyboard/hooks/useScene";
import { ourServicesSceneConfig } from "./OurServicesScene.config";

const OurServicesScene = () => {
  const { sceneRef, progress } = useScene(ourServicesSceneConfig);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Use midday water color (matching HeroScene MIDDAY_PROGRESS)
  const waterColor = useMemo(() => {
    // Midday water color: rgb(4, 148, 180)
    return `rgb(4, 148, 180)`;
  }, []);

  // Underwater particle effect (even deeper - slower, fewer bubbles)
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

    // Underwater particles (bubbles - very slow and sparse for deep water)
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
      for (let i = 0; i < 40; i++) { // Even fewer bubbles for deeper water
        particles.push({
          x: Math.random() * canvas.width, // Full width distribution
          y: Math.random() * canvas.height, // Full height distribution
          size: Math.random() * 2 + 0.5, // Tiny bubbles for depth
          speed: Math.random() * 0.2 + 0.05, // Very slow bubbles
          opacity: Math.random() * 0.2 + 0.02, // Very subtle
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

        // Add very subtle highlight
        ctx.beginPath();
        ctx.arc(
          particle.x - particle.size * 0.3,
          particle.y - particle.size * 0.3,
          particle.size * 0.3,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity * 0.4})`;
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
      id={ourServicesSceneConfig.id}
      className="relative h-screen overflow-hidden"
      style={{
        // Third quarter of underwater gradient (50%-75%) - getting very deep
        background: `linear-gradient(to bottom,
          rgba(0, 20, 24, 0.99) 0%,
          rgba(0, 18, 22, 0.995) 25%,
          rgba(0, 15, 18, 0.998) 50%,
          rgba(0, 12, 15, 0.999) 75%,
          rgba(0, 8, 10, 1.0) 100%
        )`,
      }}
    >
      {/* Underwater particle effects */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none h-full w-full"
        style={{ opacity: 0.3 }}
      />

      {/* Our Services content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white max-w-6xl">
          <h1 className="text-7xl font-bold mb-8 text-white/90">
            Our Services
          </h1>
          <p className="text-xl text-white/70 mb-16">
            Exploring the depths of digital innovation with comprehensive solutions.
          </p>

          {/* Services grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
                <h3 className="text-3xl font-semibold mb-4 text-white/90">Web Development</h3>
                <p className="text-white/70 text-lg">
                  Crafting responsive, performant web applications with cutting-edge technologies.
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
                <h3 className="text-3xl font-semibold mb-4 text-white/90">3D Graphics</h3>
                <p className="text-white/70 text-lg">
                  Immersive three-dimensional experiences that push the boundaries of digital art.
                </p>
              </div>
            </div>
            <div className="space-y-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
                <h3 className="text-3xl font-semibold mb-4 text-white/90">UI/UX Design</h3>
                <p className="text-white/70 text-lg">
                  Intuitive, beautiful interfaces that create meaningful user experiences.
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
                <h3 className="text-3xl font-semibold mb-4 text-white/90">Consultation</h3>
                <p className="text-white/70 text-lg">
                  Strategic guidance to help bring your digital vision to life.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurServicesScene;
