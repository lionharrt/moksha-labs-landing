"use client";
import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

// Phase 1 configuration - single static flower
const PHASE_1_PETALS = 6; // 3 left + 3 right

// Saffron color palette (static)
const FLOWER_COLORS = {
  light: "#FBF0DF",
  mid: "var(--brand-saffron)",
  dark: "var(--brand-saffron-dark)",
};

interface LotusFlowerProps {
  progress: number; // The progress of the flower (0 to 1)
  title?: string; // Optional title
}

/**
 * Single static lotus flower with phase 1 values only
 */
export default function LotusFlower({
  progress,
  title = "",
}: LotusFlowerProps) {
  // Refs for the timelines
  const lotusTimeline = useRef<gsap.core.Timeline | null>(null);
  const titleTimeline = useRef<gsap.core.Timeline | null>(null);
  const gradientTimeline = useRef<gsap.core.Timeline | null>(null);

  // Refs for gradient stops
  const stop1Ref = useRef<SVGStopElement>(null);
  const stop2Ref = useRef<SVGStopElement>(null);
  const stop3Ref = useRef<SVGStopElement>(null);
  const titleRef = useRef<SVGSVGElement>(null);

  const petalsPerSide = PHASE_1_PETALS / 2;

  // --- Animation Setup ---
  useLayoutEffect(() => {
    const containerSelector = ".lotus-flower-container";

    // Kill existing timelines before recreating
    if (lotusTimeline.current) lotusTimeline.current.kill();
    if (titleTimeline.current) titleTimeline.current.kill();

    // --- Lotus Open/Close Animation (Scroll Controlled) ---
    gsap.set(`${containerSelector} .petal-left`, { rotation: 0, y: 0, x: 0 });
    gsap.set(`${containerSelector} .petal-right`, { rotation: 0, y: 0, x: 0 });

    const tl = gsap.timeline({ paused: true });

    // Phase 1 angles
    const angleRange = 60;
    const baseRotation = 15;

    // LEFT PETALS (Counter-Clockwise)
    tl.fromTo(
      `${containerSelector} .petal-left`,
      { rotation: 0, y: 0, x: 0 },
      {
        rotation: (i) => -baseRotation + (-angleRange / petalsPerSide) * i,
        y: (i) => -i * 5,
        stagger: 0.05,
        ease: "back.out",
        transformOrigin: "50% 100%",
      },
      0
    );

    // RIGHT PETALS (Clockwise)
    tl.fromTo(
      `${containerSelector} .petal-right`,
      { rotation: 0, y: 0, x: 0 },
      {
        rotation: (i) => baseRotation + (angleRange / petalsPerSide) * i,
        y: (i) => -i * 5,
        stagger: 0.05,
        ease: "back.out",
        transformOrigin: "50% 100%",
      },
      0
    );
    lotusTimeline.current = tl;

    // --- Title Animation ---
    const titleElement = titleRef.current;
    const titleTl = gsap.timeline({ paused: true });

    if (titleElement) {
      gsap.set(titleElement, {
        xPercent: -50,
        yPercent: -50,
        transformOrigin: "50% 50%",
      });

      titleTl.fromTo(
        titleElement,
        {
          opacity: 0,
          scale: 0.5,
          xPercent: -50,
          yPercent: -50,
          y: 0,
          transformOrigin: "50% 50%",
        },
        {
          opacity: 1,
          scale: 1,
          xPercent: -50,
          yPercent: -50,
          y: -100,
          duration: 0.5,
          ease: "back.out",
          transformOrigin: "50% 50%",
        },
        0
      );
    }
    titleTimeline.current = titleTl;

    // --- Fire-Glow Gradient Animation (Continuous Loop) ---
    const stop1 = stop1Ref.current;
    const stop2 = stop2Ref.current;
    const stop3 = stop3Ref.current;

    if (stop1 && stop2 && stop3) {
      const gradientTl = gsap
        .timeline({
          repeat: -1,
          yoyo: true,
          defaults: { ease: "power1.inOut", duration: 1.5 },
        })
        .to(stop1, { attr: { offset: "25%" } }, 0)
        .to(stop2, { attr: { offset: "55%" } }, 0)
        .to(stop3, { attr: { offset: "75%" } }, 0)
        .to(stop1, { attr: { offset: "0%" } }, 1.5)
        .to(stop2, { attr: { offset: "75%" } }, 1.5)
        .to(stop3, { attr: { offset: "100%" } }, 1.5);

      gradientTimeline.current = gradientTl;
      gradientTl.play();
    }

    // Cleanup
    return () => {
      tl.kill();
      titleTl.kill();
      if (gradientTimeline.current) gradientTimeline.current.kill();
      if (stop1) gsap.killTweensOf(stop1);
      if (stop2) gsap.killTweensOf(stop2);
      if (stop3) gsap.killTweensOf(stop3);
    };
  }, [petalsPerSide]);

  // Update timelines based on progress
  useLayoutEffect(() => {
    if (lotusTimeline.current) {
      gsap.set(lotusTimeline.current, { progress });
    }
    if (titleTimeline.current) {
      gsap.set(titleTimeline.current, { progress });
    }
  }, [progress]);

  return (
    <div className="absolute lotus-flower-container w-[200px] h-[200px] top-3/4 left-1/2 -translate-x-1/2 -translate-y-1/2">
      {/* Title SVG */}
      {!!title && (
        <svg
          ref={titleRef}
          className="title-container absolute"
          viewBox="-50 -30 100 60"
          style={{
            width: "100px",
            height: "60px",
            mixBlendMode: "screen",
            opacity: 0,
            transformOrigin: "50% 50%",
            top: "65%",
            left: "50%",
          }}
        >
          <defs>
            <path
              id="text-path"
              d="M -42.5, 0 Q 0, -15 42.5, 0"
              fill="none"
              stroke="none"
            />
          </defs>
          <text
            fontSize="14"
            fontWeight={300}
            fontFamily="var(--font-accent)"
            letterSpacing="0.01em"
          >
            <textPath href="#text-path" startOffset="50%" textAnchor="middle">
              {title}
            </textPath>
          </text>
        </svg>
      )}

      {/* Flower SVG */}
      <svg
        className="w-full h-full"
        viewBox="-150 -150 300 300"
        style={{ overflow: "visible" }}
      >
        <defs>
          <radialGradient
            id="lotus-gradient"
            cx="0"
            cy="50"
            r="150"
            fx="0"
            fy="150"
            gradientUnits="userSpaceOnUse"
          >
            <stop
              ref={stop1Ref}
              offset="0%"
              style={{ stopColor: FLOWER_COLORS.light }}
            />
            <stop
              ref={stop2Ref}
              offset="75%"
              style={{ stopColor: FLOWER_COLORS.mid }}
            />
            <stop
              ref={stop3Ref}
              offset="100%"
              style={{ stopColor: FLOWER_COLORS.dark }}
            />
          </radialGradient>
          <path
            id="half-petal-shape"
            stroke="#FEF9F5"
            strokeWidth="1"
            fill="url(#lotus-gradient)"
            d="M 0, 50 
              C 75,45 50,-50 0,-100 
              C -50,-50 -75,45 0, 50 Z"
          />
        </defs>

        <g id="lotus-container">
          {/* Left Petals */}
          {Array.from({ length: petalsPerSide }).map((_, i) => (
            <use
              key={`left-${i}`}
              href="#half-petal-shape"
              className="petal-left"
            />
          ))}
          {/* Right Petals */}
          {Array.from({ length: petalsPerSide }).map((_, i) => (
            <use
              key={`right-${i}`}
              href="#half-petal-shape"
              className="petal-right"
            />
          ))}
          {/* Center Petal */}
          <use href="#half-petal-shape" className="petal-center" />
        </g>
      </svg>
    </div>
  );
}
