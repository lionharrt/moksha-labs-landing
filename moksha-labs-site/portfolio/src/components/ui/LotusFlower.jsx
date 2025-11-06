"use client";
import gsap from "gsap";
import { useEffect, useRef } from "react";

// --- Custom Colors (Based on #F2B56A variants) ---
// Define these as CSS variables in your global stylesheet, or hardcode them here if necessary
// const SAFFRON_LIGHT = "#F8DBB5"; // Light fill
// const STROKE_COLOR = "#FEF9F5";  // Near-white outline

export default function LotusFlower({ progress, withTitle = false }) {
  // 1. Create a ref to store the GSAP Timeline instance
  const lotusTimeline = useRef(null);
  const titleTimeline = useRef(null);
  // --- Animation Setup (Runs Once on Mount) ---
  useEffect(() => {
    // Kill any old tweens targeting these classes before creating the new timeline
    gsap.killTweensOf(".petal-left, .petal-right, .petal-center");

    // Create a new timeline instance, PAUSED by default
    const tl = gsap.timeline({ paused: true });
    // --- A. LEFT PETALS ANIMATION (Counter-Clockwise Open) ---
    tl.fromTo(
      ".petal-left",
      // FROM: (the static SVG position defined in JSX)
      { rotation: 0, y: 0, x: 0 },
      // TO: (the fully open position)
      {
        rotation: (i) => -15 + (-60 / 3) * i, // Rotates further counter-clockwise
        y: (i) => -i * 5, // Subtle vertical shift up
        stagger: 0.05,
        ease: "none", // Crucial for scroll-sync
        transformOrigin: "50% 100%",
      },
      0 // Start this animation at the beginning of the timeline (time 0)
    );

    // --- B. RIGHT PETALS ANIMATION (Clockwise Open) ---
    tl.fromTo(
      ".petal-right",
      // FROM: (the static SVG position defined in JSX)
      { rotation: 0, y: 0, x: 0 },
      // TO: (the fully open position)
      {
        rotation: (i) => 15 + (60 / 3) * i, // Rotates further clockwise
        y: (i) => -i * 5, // Subtle vertical shift up
        stagger: 0.05,
        ease: "none", // Crucial for scroll-sync
        transformOrigin: "50% 100%",
      },
      0 // Start this animation at the beginning of the timeline (time 0)
    );

    // 3. Store the timeline in the ref
    lotusTimeline.current = tl;

    // Cleanup: Kill the timeline when the component unmounts
    return () => {
      tl.kill();
    };
  }, []); // Empty dependency array: runs only once on mount

  // --- Scroll Progress Controller ---
  useEffect(() => {
    if (lotusTimeline.current) {
      // Set the timeline's progress (0 to 1) equal to the scroll progress (0 to 1)
      // This is what makes the animation scroll-driven!
      lotusTimeline.current.progress(progress);
    }

    if (titleTimeline.current) {
      titleTimeline.current.progress(progress);
    }
  }, [progress]); // Dependency array: runs every time 'progress' changes

  useEffect(() => {
    const tl = gsap.timeline({ paused: true });

    tl.fromTo(
      ".title-container",
      { opacity: 0, scale: 0.5, transform: "translate(0, 0)" }, // Start slightly scaled down and invisible
      {
        opacity: 1,
        scale: 1,
        transform: "translate(0, 0)",
        duration: 0.5,
        ease: "power2.out",
      },
      // Use the final timeline position (1) so it animates only when the flower is fully open
      0
    );

    titleTimeline.current = tl;

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      className="lotus-flower-container relative"
      style={{ width: "100%", height: "100%" }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="-150 -150 300 300">
          <defs>
            {/* Reusable Petal Shape (Note: Your custom path is defined here) */}
            <path
              id="half-petal-shape"
              stroke="#FBF0DF" // Near-white outline
              strokeWidth="2.5"
              fill="var(--brand-saffron-light)" // Saffron fill
              d="M 0, 50 
              C 75,45 50,-50 0,-100 
              C -50,-50 -75,45 0, 50 Z"
            />
          </defs>

          <g id="lotus-container">
            {/* Petal Structure: Alternating left/right for layering and targeting */}

            {/* Back Petals */}
            <use
              href="#half-petal-shape"
              className="petal-right"
              transform="rotate(60)"
            />
            <use
              href="#half-petal-shape"
              className="petal-left"
              transform="rotate(-60)"
            />

            {/* Middle Petals */}
            <use
              href="#half-petal-shape"
              className="petal-right"
              transform="rotate(45)"
            />
            <use
              href="#half-petal-shape"
              className="petal-left"
              transform="rotate(-45)"
            />

            {/* Front Petals (closest to center line) */}
            <use
              href="#half-petal-shape"
              className="petal-right"
              transform="rotate(15)"
            />
            <use
              href="#half-petal-shape"
              className="petal-left"
              transform="rotate(-15)"
            />

            {/* Center Petal (Static/Hidden Base) */}
            <use href="#half-petal-shape" className="petal-center" />
          </g>
        </svg>
        {withTitle && (
          <div className="absolute title-container z-10">
            <h1
              className="font-bold text-white"
              style={{
                fontSize: "clamp(1rem, 4vw, 3rem)",
              }}
            >
              Moksha Labs
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}
