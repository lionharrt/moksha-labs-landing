"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useScene } from "@/storyboard/hooks/useScene";
import { contactUsSceneConfig } from "./ContactUsScene.config";

const ContactUsScene = () => {
  const { sceneRef, progress } = useScene(contactUsSceneConfig);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Use midday water color (matching HeroScene MIDDAY_PROGRESS)
  const waterColor = useMemo(() => {
    // Midday water color: rgb(4, 148, 180)
    return `rgb(4, 148, 180)`;
  }, []);

  // Underwater particle effect (deep sea - minimal bubbles only)
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

    // Deep sea particles (only rare bubbles)
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
      for (let i = 0; i < 15; i++) { // Very few bubbles for deep sea
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1 + 0.3, // Tiny bubbles
          speed: Math.random() * 0.08 + 0.01, // Extremely slow
          opacity: Math.random() * 0.1 + 0.01, // Very subtle
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

      // Update and draw bubbles
      particles.forEach((particle) => {
        particle.y -= particle.speed;

        // Reset bubble when it goes off screen
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
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity * 0.3})`;
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
      id={contactUsSceneConfig.id}
      className="relative h-screen overflow-hidden"
      style={{
        // Final quarter of underwater gradient (75%-100%) - sea floor
        background: `linear-gradient(to bottom,
          rgba(0, 8, 10, 1.0) 0%,
          rgba(0, 6, 8, 1.0) 25%,
          rgba(0, 4, 5, 1.0) 50%,
          rgba(0, 2, 3, 1.0) 75%,
          rgba(0, 1, 2, 1.0) 100%
        )`,
      }}
    >
      {/* Deep sea particle effects */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none h-full w-full"
        style={{ opacity: 0.15 }}
      />

      {/* Contact Us content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white max-w-4xl">
          <h1 className="text-6xl font-bold mb-8 text-white/90">
            Contact Us
          </h1>
          <p className="text-xl text-white/70 mb-12">
            Reach out from the depths. Let&apos;s start a conversation.
          </p>

          {/* Contact information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-4 text-white/90">Email</h3>
              <p className="text-white/70">hello@mokshalabs.com</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-4 text-white/90">Location</h3>
              <p className="text-white/70">Deep in the digital ocean</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-4 text-white/90">Response Time</h3>
              <p className="text-white/70">Within 24 hours</p>
            </div>
          </div>

          {/* Call to action */}
          <div className="mt-16">
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg px-8 py-4 text-white font-semibold transition-all duration-300">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUsScene;
