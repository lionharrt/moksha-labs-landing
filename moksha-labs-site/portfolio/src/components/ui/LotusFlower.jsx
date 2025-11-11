"use client";
import gsap from "gsap";
import { useLayoutEffect, useRef, useMemo } from "react";
// Assuming this hook manages playback based on scroll position
import { useSmoothProgress } from "@/storyboard/hooks/useSmoothProgress";

// --- Custom Colors (Based on #F2B56A variants) ---
// Define these as CSS variables in your global stylesheet, or hardcode them here if necessary
// The gradient will transition between these three colors:
// --brand-saffron-light (e.g., #F8DBB5 - near white/highlight)
// --brand-saffron (e.g., #F2B56A - mid-tone orange)
// --brand-saffron-dark (e.g., #CF6B1D - deep/shadow orange)

// Color configurations for phase 2 flowers
const FLOWER_COLORS = {
  0: {
    // Saffron (index 0 stays saffron)
    light: "#FBF0DF",
    mid: "var(--brand-saffron)",
    dark: "var(--brand-saffron-dark)",
  },
  1: {
    // Blue
    light: "#E3F2FD",
    mid: "#2196F3",
    dark: "#1565C0",
  },
  2: {
    // Purple
    light: "#F3E5F5",
    mid: "#9C27B0",
    dark: "#6A1B9A",
  },
  3: {
    // Green
    light: "#E8F5E9",
    mid: "#4CAF50",
    dark: "#2E7D32",
  },
  4: {
    // Yellow
    light: "#FFFDE7",
    mid: "#FFC107",
    dark: "#F57C00",
  },
};

// Petal configuration constants
const PHASE_1_PETALS = 6; // 3 left + 3 right
const PHASE_2_PETALS = 12; //

/**
 * @typedef {Object} LotusFlowerProps
 * @property {number} progress - The progress of the flower (0 to 1) - DEPRECATED: use progressRef instead
 * @property {React.MutableRefObject<number>} [progressRef] - Ref to continuous progress value (preferred)
 * @property {number} index - The index of the flower
 * @property {string} [title] - The title of the flower
 * @property {1 | 2} [phase] - The phase of the flower (1 or 2)
 * @property {number | null} [splitProgress] - The progress of the split animation (0 to 1 or null)
 * @property {number} [finalYPosition] - The final Y position of the flower
 * @property {Function} [mapProgressToSegment] - Function to map overall progress to segment progress
 * @property {Object} [segment] - Segment definition with start and end values
 */

/**
 * This component renders a lotus flower with a title and a gradient.
 * It also renders the petals and the center petal.
 *
 * @param {LotusFlowerProps} props - The component props
 * @returns {React.ReactElement} The rendered LotusFlower component
 */
export default function LotusFlower({
  progress: progressProp, // Keep for backward compatibility
  progressRef, // New: continuous progress ref
  index,
  title = "",
  phase = 1,
  splitProgress = null,
  finalYPosition = 0,
  mapProgressToSegment,
  segment,
}) {
  // 1. Create refs for the timelines and the stop elements
  const lotusTimeline = useRef(null);
  const titleTimeline = useRef(null);
  const phaseTransitionTimeline = useRef(null);
  const petalTransformTimeline = useRef(null); // New timeline for petal 3D transformations
  const gradientTimeline = useRef(null); // Ref for the gradient animation timeline
  const gradientRef = useRef(null); // Ref for the whole SVG group/container
  const stop1Ref = useRef(null); // Ref for the light stop (0%)
  const stop2Ref = useRef(null); // Ref for the mid stop (75%)
  const stop3Ref = useRef(null); // Ref for the dark stop (100%)
  const titleRef = useRef(null); // Ref for the title text element
  const previousPhaseRef = useRef(phase); // Track previous phase for smooth transitions
  
  // CRITICAL: Calculate continuous progress from ref if available
  // This prevents discrete jumps from throttled prop updates
  const continuousProgressRef = useRef(0);
  
  // RAF loop to continuously update progress from ref
  useLayoutEffect(() => {
    if (!progressRef) {
      // Fallback to prop if no ref provided
      continuousProgressRef.current = progressProp || 0;
      return;
    }
    
    let rafId;
    const updateProgress = () => {
      if (progressRef?.current !== undefined) {
        continuousProgressRef.current = progressRef.current;
        
        // Calculate mapped progress if segment mapping function provided
        if (mapProgressToSegment && segment) {
          const mapped = mapProgressToSegment(progressRef.current, segment);
          if (mapped !== null && mapped !== undefined) {
            continuousProgressRef.current = mapped;
          }
        }
        
        // Update GSAP timelines directly for smooth animation
        if (lotusTimeline.current) {
          gsap.set(lotusTimeline.current, { progress: continuousProgressRef.current });
        }
        if (titleTimeline.current) {
          gsap.set(titleTimeline.current, { progress: continuousProgressRef.current });
        }
      }
      rafId = requestAnimationFrame(updateProgress);
    };
    
    rafId = requestAnimationFrame(updateProgress);
    
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [progressRef, progressProp, mapProgressToSegment, segment]);
  
  // Use continuous progress for calculations
  const progress = progressRef ? continuousProgressRef.current : (progressProp || 0);

  // Calculate petal configuration based on phase
  const petalCount = phase === 1 ? PHASE_1_PETALS : PHASE_2_PETALS;
  const petalsPerSide = petalCount / 2;

  // Determine colors based on index and phase
  // Index 0 stays saffron, others use their assigned colors in phase 2
  const colors =
    phase === 2 && index > 0
      ? FLOWER_COLORS[index] || FLOWER_COLORS[0]
      : FLOWER_COLORS[0];

  // Calculate rotation based on Y position
  // Y positions range from ~195 to ~397, with 300 being center
  // Closer to 0 (lower Y) = more rotation
  const calculatePetalTransform = (yPosition) => {
    // Define the actual range of Y positions for the flowers
    const MIN_Y = 195; // Closest to y=0 (should get max rotation)
    const MAX_Y = 397; // Farthest from y=0 (should get min rotation)

    // Normalize Y position within the actual range: 0 (closest) to 1 (farthest)
    const yFactor = Math.min(
      Math.max((yPosition - MIN_Y) / (MAX_Y - MIN_Y), 0),
      1
    );

    // RotateX: 45deg when close to y=0 (yFactor=0), decreasing to 0deg when far (yFactor=1)
    const rotateX = 45 * (1 - yFactor);

    return { rotateX };
  };

  // --- Animation Setup (Runs when phase or index changes) ---
  useLayoutEffect(() => {
    // Scope selectors to this specific flower container
    const containerSelector = `.lotus-flower-container-${index}`;

    // Kill existing timelines before recreating
    if (lotusTimeline.current) lotusTimeline.current.kill();
    if (phaseTransitionTimeline.current) phaseTransitionTimeline.current.kill();

    // --- PART 1: Lotus Open/Close Animation (Scroll Controlled) ---
    gsap.set(`${containerSelector} .petal-left`, { rotation: 0, y: 0, x: 0 });
    gsap.set(`${containerSelector} .petal-right`, { rotation: 0, y: 0, x: 0 });

    const tl = gsap.timeline({ paused: true });

    // Calculate rotation angles based on phase
    const angleRange = phase === 1 ? 60 : 170; // Wider spread in phase 2
    const baseRotation = phase === 1 ? 15 : 15;

    // A. LEFT PETALS ANIMATION (Counter-Clockwise Open)
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

    // B. RIGHT PETALS ANIMATION (Clockwise Open)
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

    // --- PART 2: Title Animation (Scroll Controlled) ---
    const titleElement = titleRef.current;
    const titleTl = gsap.timeline({ paused: true });

    if (titleElement) {
      // Set initial positioning using GSAP xPercent/yPercent for proper scaling
      gsap.set(titleElement, {
        xPercent: -50, // Center horizontally
        yPercent: -50, // Center vertically
        transformOrigin: "50% 50%",
      });

      titleTl.fromTo(
        titleElement,
        {
          opacity: 0,
          scale: 0.5,
          xPercent: -50, // Maintain center positioning
          yPercent: -50, // Maintain center positioning
          y: 0,
          transformOrigin: "50% 50%",
        },
        {
          opacity: 1,
          scale: 1,
          xPercent: -50, // Maintain center positioning
          yPercent: -50, // Maintain center positioning
          y: -100, // Offset above center
          duration: 0.5,
          ease: "back.out",
          transformOrigin: "50% 50%",
        },
        0
      );
    }
    titleTimeline.current = titleTl;

    // --- PART 2.5: Phase Transition Animation ---
    const phaseChanged = previousPhaseRef.current !== phase;
    previousPhaseRef.current = phase;

    const phaseTl = gsap.timeline({ paused: true });

    // Determine target colors based on phase and index
    const targetColors =
      phase === 2 && index > 0
        ? FLOWER_COLORS[index] || FLOWER_COLORS[0]
        : FLOWER_COLORS[0];

    // Animate SVG size change based on phase
    const targetWidth = phase === 2 ? 400 : 100;
    const targetHeight = phase === 2 ? 200 : 60;
    const targetViewBox = phase === 2 ? "-200 -100 400 200" : "-50 -30 100 60";

    if (titleElement) {
      // Set initial state immediately if phase hasn't changed (initial mount)
      // Set initial colors for gradient stops
      const stop1 = stop1Ref.current;
      const stop2 = stop2Ref.current;
      const stop3 = stop3Ref.current;
      if (stop1 && stop2 && stop3) {
        if (!phaseChanged) {
          // Set initial colors immediately if phase hasn't changed
          gsap.set(stop1, { attr: { stopColor: targetColors.light } });
          gsap.set(stop2, { attr: { stopColor: targetColors.mid } });
          gsap.set(stop3, { attr: { stopColor: targetColors.dark } });
        }
      }

      if (!phaseChanged) {
        gsap.set(titleElement, {
          xPercent: -50, // Center horizontally
          yPercent: -50, // Center vertically
          width: `${targetWidth}px`,
          height: `${targetHeight}px`,
          attr: { viewBox: targetViewBox },
          transformOrigin: "50% 50%",
        });
        // Set text fontSize attribute
        const textElement = titleElement.querySelector("text");
        if (textElement) {
          gsap.set(textElement, {
            attr: { fontSize: phase === 2 ? "56" : "14" },
          });
        }
        // Update text path
        const pathElement = titleElement.querySelector("path");
        if (pathElement) {
          gsap.set(pathElement, {
            attr: {
              d:
                phase === 2
                  ? "M -170, 0 Q 0, -60 170, 0"
                  : "M -42.5, 0 Q 0, -15 42.5, 0",
            },
          });
        }
      } else {
        // Animate transition if phase changed
        phaseTl.to(
          titleElement,
          {
            xPercent: -50, // Maintain center positioning
            yPercent: -50, // Maintain center positioning
            width: `${targetWidth}px`,
            height: `${targetHeight}px`,
            attr: { viewBox: targetViewBox },
            transformOrigin: "50% 50%",
            duration: 0.6,
            ease: "power2.inOut",
          },
          0
        );
        // Animate text fontSize
        const textElement = titleElement.querySelector("text");
        if (textElement) {
          phaseTl.to(
            textElement,
            {
              attr: { fontSize: phase === 2 ? "56" : "14" },
              duration: 0.6,
              ease: "power2.inOut",
            },
            0
          );
        }
        // Ensure transform origin is set for proper scaling
        phaseTl.set(
          titleElement,
          {
            transformOrigin: "50% 50%",
          },
          0
        );
        // Animate text path
        const pathElement = titleElement.querySelector("path");
        if (pathElement) {
          phaseTl.to(
            pathElement,
            {
              attr: {
                d:
                  phase === 2
                    ? "M -170, 0 Q 0, -60 170, 0"
                    : "M -42.5, 0 Q 0, -15 42.5, 0",
              },
              duration: 0.6,
              ease: "power2.inOut",
            },
            0
          );
        }

        // Animate color transitions for gradient stops
        if (stop1 && stop2 && stop3) {
          phaseTl.to(
            stop1,
            {
              attr: { stopColor: targetColors.light },
              duration: 0.6,
              ease: "power2.inOut",
            },
            0
          );
          phaseTl.to(
            stop2,
            {
              attr: { stopColor: targetColors.mid },
              duration: 0.6,
              ease: "power2.inOut",
            },
            0
          );
          phaseTl.to(
            stop3,
            {
              attr: { stopColor: targetColors.dark },
              duration: 0.6,
              ease: "power2.inOut",
            },
            0
          );
        }

        phaseTransitionTimeline.current = phaseTl;
        phaseTl.play();
      }
    }

    // --- PART 3: Fire-Glow Gradient Animation (Continuous Loop) ---

    // Get the DOM elements for the stops
    const stop1 = stop1Ref.current;
    const stop2 = stop2Ref.current;
    const stop3 = stop3Ref.current;

    if (stop1 && stop2 && stop3) {
      // Create a repeating loop that cycles the gradient offsets
      // Using a cleaner timeline structure with proper sequencing
      const gradientTl = gsap
        .timeline({
          repeat: -1,
          yoyo: true, // Smoothly reverse the animation instead of jumping back
          defaults: { ease: "power1.inOut", duration: 1.5 },
        })
        // Expand phase: animate all stops outward (more dramatic color movement)
        .to(
          stop1,
          { attr: { offset: "25%" }, ease: "power1.inOut", duration: 1.5 },
          0
        )
        .to(
          stop2,
          { attr: { offset: "55%" }, ease: "power1.inOut", duration: 1.5 },
          0
        )
        .to(
          stop3,
          { attr: { offset: "75%" }, ease: "power1.inOut", duration: 1.5 },
          0
        )
        // Contract phase: animate all stops back inward (starts at 1.5s, right after expand finishes)
        .to(
          stop1,
          { attr: { offset: "0%" }, ease: "power1.inOut", duration: 1.5 },
          1.5
        )
        .to(
          stop2,
          { attr: { offset: "75%" }, ease: "power1.inOut", duration: 1.5 },
          1.5
        )
        .to(
          stop3,
          { attr: { offset: "100%" }, ease: "power1.inOut", duration: 1.5 },
          1.5
        );

      gradientTimeline.current = gradientTl;
      gradientTl.play();
    }

    // Cleanup: Kill the timelines and animations when the component unmounts
    return () => {
      tl.kill();
      titleTl.kill();
      if (phaseTransitionTimeline.current) {
        phaseTransitionTimeline.current.kill();
      }
      if (gradientTimeline.current) {
        gradientTimeline.current.kill();
      }
      // GSAP's automatic garbage collection often handles continuous loops,
      // but explicitly killing the animation timeline on the stops is safer.
      if (stop1) gsap.killTweensOf(stop1);
      if (stop2) gsap.killTweensOf(stop2);
      if (stop3) gsap.killTweensOf(stop3);
    };
  }, [index, phase, petalsPerSide, title]); // Include title since we reference titleRef

  // --- PART 4: Petal 3D Transformation during Split & Shrink (Last 15%) ---
  useLayoutEffect(() => {
    const containerSelector = `.lotus-flower-container-${index}`;

    // Kill existing timeline
    if (petalTransformTimeline.current) petalTransformTimeline.current.kill();

    // Only create animation when we have position data
    // This applies to all flowers during split & shrink, including index 0
    if (!finalYPosition) return;

    // Calculate the transforms based on this flower's final Y position
    const { rotateX } = calculatePetalTransform(finalYPosition);
    console.log(`Flower ${index}: rotateX=${rotateX}°`);

    // Create the timeline for petal transformations
    const transformTl = gsap.timeline({ paused: true });

    // Set initial state for petals (ensure they start flat)
    gsap.set(
      `${containerSelector} .petal-left, ${containerSelector} .petal-right`,
      {
        rotateX: 0,
        transformOrigin: "50% 100%",
        transformStyle: "preserve-3d",
      }
    );

    // Animate left and right petals with rotateX only (scale handled by container)
    transformTl.to(
      `${containerSelector} .petal-left, ${containerSelector} .petal-right`,
      {
        rotateX: rotateX,
        transformOrigin: "50% 100%",
        ease: "power2.out",
        force3D: true,
      },
      0
    );

    // Center petal stays as is (no animation needed)

    petalTransformTimeline.current = transformTl;

    return () => {
      if (petalTransformTimeline.current) {
        petalTransformTimeline.current.kill();
      }
    };
  }, [index, splitProgress, finalYPosition]);

  // Connect the scroll progress hook to the lotus and title animations
  // When progressRef is provided, RAF loop updates timelines directly (smoother)
  // When progressRef is not provided, useSmoothProgress handles smoothing from prop updates
  useSmoothProgress(lotusTimeline.current, progressRef ? null : progress);
  useSmoothProgress(titleTimeline.current, progressRef ? null : progress);

  // Connect the petal transformation to the last 15% of split progress
  // Map splitProgress (0-1) to only animate during 0.85-1.0
  const petalTransformProgress = useMemo(() => {
    if (splitProgress === null || splitProgress < 0.85) return 0;
    if (splitProgress >= 1) return 1;
    // Map 0.85-1.0 to 0-1
    const mapped = (splitProgress - 0.85) / 0.15;
    console.log(
      `Flower ${index}: splitProgress=${splitProgress}, petalTransformProgress=${mapped}`
    );
    return mapped;
  }, [splitProgress, index]);

  useSmoothProgress(petalTransformTimeline.current, petalTransformProgress);

  return (
    <div
      key={index}
      className={`absolute lotus-flower-container-${index} w-[200px] h-[200px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
    >
      <svg
        className="w-full h-full"
        viewBox="-150 -150 300 300"
        style={{ overflow: "visible" }}
      >
        <defs>
          <radialGradient
            id={`lotus-gradient-${index}`}
            cx="0"
            cy="50"
            r="150"
            fx="0"
            fy="150"
            gradientUnits="userSpaceOnUse"
          >
            {/* The refs below allow GSAP to target these specific elements in the DOM */}
            <stop
              ref={stop1Ref}
              offset="0%"
              style={{ stopColor: colors.light }}
            />
            <stop
              ref={stop2Ref}
              offset="75%"
              style={{ stopColor: colors.mid }}
            />
            <stop
              ref={stop3Ref}
              offset="100%"
              style={{ stopColor: colors.dark }}
            />
          </radialGradient>
          <path
            id={`half-petal-shape-${index}`}
            stroke="#FEF9F5" // Near-white outline, using a less variable color
            strokeWidth={phase === 1 ? "1" : "2.5"} // Thicker stroke in phase 2 to prevent graininess when scaled
            fill={`url(#lotus-gradient-${index})`} // Saffron fill
            d="M 0, 50 
              C 75,45 50,-50 0,-100 
              C -50,-50 -75,45 0, 50 Z"
          />
        </defs>

        <g id="lotus-container" ref={gradientRef}>
          {/* Dynamic Petal Structure: Generate petals based on phase */}
          {Array.from({ length: petalsPerSide }).map((_, i) => (
            <use
              key={`left-${i}`}
              href={`#half-petal-shape-${index}`}
              className="petal-left"
              rotation={0}
            />
          ))}
          {Array.from({ length: petalsPerSide }).map((_, i) => (
            <use
              key={`right-${i}`}
              href={`#half-petal-shape-${index}`}
              className="petal-right"
              rotation={0}
            />
          ))}

          {/* Center Petal (Static/Hidden Base) */}
          <use
            href={`#half-petal-shape-${index}`}
            className="petal-center"
            rotation={0}
          />
        </g>
      </svg>

      {/* Text rendered in separate SVG, not affected by flower SVG scaling */}
      {!!title && (
        <svg
          ref={titleRef}
          className="title-container absolute"
          viewBox={phase === 1 ? "-50 -30 100 60" : "-200 -100 400 200"}
          style={{
            width: phase === 1 ? "100px" : "400px",
            height: phase === 1 ? "60px" : "200px",
            mixBlendMode: phase === 2 ? "normal" : "screen",
            opacity: 0, // Controlled by GSAP
            transformOrigin: "50% 50%", // Center transform origin for proper scaling
            top: "65%", // Position at container center
            left: "50%", // Position at container center
          }}
        >
          <defs>
            {/* Curved path for text (convex arch) - scaled for phase */}
            <path
              id={`text-path-${index}`}
              d={
                phase === 1
                  ? "M -42.5, 0 Q 0, -15 42.5, 0"
                  : "M -170, 0 Q 0, -60 170, 0"
              }
              fill="none"
              stroke="none"
            />
          </defs>
          <text
            fontSize={phase === 1 ? "14" : "56"}
            fontWeight={300}
            fontFamily="var(--font-accent)"
            letterSpacing="0.01em"
          >
            <textPath
              href={`#text-path-${index}`}
              startOffset="50%"
              textAnchor="middle"
            >
              {title}
            </textPath>
          </text>
        </svg>
      )}
    </div>
  );
}
