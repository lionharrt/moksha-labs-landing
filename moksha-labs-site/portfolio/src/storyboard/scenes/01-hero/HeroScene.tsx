"use client";

import { useRef, useMemo, useState, useLayoutEffect, useCallback } from "react"; // Added useMemo
import { useScene } from "../../hooks/useScene";
import { heroSceneConfig } from "./HeroScene.config";
import LotusFlower from "@/components/ui/LotusFlower";
import { gsap } from "gsap"; // Ensure gsap/GSAPTimeline is imported
import { useSmoothProgress } from "@/storyboard/hooks/useSmoothProgress";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { WaterSurface, WaterSurfaceRef } from "@/components/ui/WaterSurface";
import DayNightCycle from "@/components/ui/DayNightCycle";
import MountainBackground from "@/components/ui/MountainBackground";
import { useLighting } from "@/hooks/useLighting";
import LightingControls from "@/components/ui/LightingControls";
import AtmosphericEffects from "@/components/ui/AtmosphericEffects";
gsap.registerPlugin(MotionPathPlugin);
// Define the structure for clarity
interface ProgressSegment {
  start: number;
  end: number;
}

const progressBreakup: Record<string, ProgressSegment> = {
  // Total 10000vh scroll
  // Intro (0% to 10% of total scroll)
  entrance: { start: 0, end: 0.01 },
  intro: { start: 0.01, end: 0.02 },
  // Outro (60% to 100% of total scroll)
  outro: { start: 0.02, end: 0.03 },
  splitAndShrink: { start: 0.03, end: 0.04 },
  aboutUsEntrance: { start: 0.04, end: 0.05 },
  ourServicesEntrance: { start: 0.05, end: 0.06 },
  ourWorkEntrance: { start: 0.06, end: 0.07 },
  contactUsEntrance: { start: 0.07, end: 0.08 },
};

// --- Helper Function ---
/**
 * Maps the overall scene progress (0-1) to the local progress (0-1)
 * of a specific segment defined in progressBreakup.
 *
 * @param overallProgress The progress from the useScene hook (0 to 1)
 * @param segment Segment object with start and end normalized values
 * @returns Local progress within the segment (0 to 1), or null if outside.
 */
const mapProgressToSegment = (
  overallProgress: number,
  segment: ProgressSegment
): number | null => {
  const { start, end } = segment;

  if (overallProgress < start) {
    return null; // Not in this segment
  }

  if (overallProgress > end) {
    return 1; // Not in this segment
  }

  const segmentLength = end - start;
  // Calculate local progress: (current - start) / total segment length
  const localProgress = (overallProgress - start) / segmentLength;

  return localProgress;
};

// Flower configuration with positions and progress keys
const FLOWER_CONFIG = [
  {
    index: 0,
    title: "Moksha Labs",
    position: { x: 0, y: 300 }, // Center position
    progressKey: "heroLotusProgress" as const,
  },
  {
    index: 1,
    title: "About Us",
    position: { x: -800, y: 228 }, // Left side
    progressKey: "aboutUsLotusProgress" as const,
  },
  {
    index: 2,
    title: "Our Services",
    position: { x: -500, y: 397 }, // Left-center
    progressKey: "ourServicesLotusProgress" as const,
  },
  {
    index: 3,
    title: "Our Work",
    position: { x: 320, y: 195 }, // Right-center
    progressKey: "ourWorkLotusProgress" as const,
  },
  {
    index: 4,
    title: "Contact Us",
    position: { x: 800, y: 320 }, // Right side
    progressKey: "contactUsLotusProgress" as const,
  },
] as const;

const BASE_DESIGN_WIDTH = 1920;

// Helper function to calculate responsive position
const getResponsivePosition = (
  basePosition: number,
  viewportWidth: number = typeof window !== "undefined"
    ? window.innerWidth
    : BASE_DESIGN_WIDTH
): number => {
  return (basePosition / BASE_DESIGN_WIDTH) * viewportWidth;
};

export function HeroScene() {
  const { sceneRef, progress } = useScene(heroSceneConfig);
  const [numberOfExtraFlowers, setNumberOfExtraFlowers] = useState(1);
  const waterSurfaceRef = useRef<WaterSurfaceRef>(null);

  const splitAndShrinkTimeline = useRef<GSAPTimeline | null>(null);
  const entranceTimeline = useRef<GSAPTimeline | null>(null);
  const aboutUsEntranceTimeline = useRef<GSAPTimeline | null>(null);

  // Initialize lighting system
  const [lightingState, updateLightingConfig] = useLighting(progress);
  // --- Calculate Mapped Progress Values ---
  // Use useMemo to re-calculate only when 'progress' changes
  const mappedProgress = useMemo(() => {
    // 1. Lotus Animation Progress (e.g., scale up/down)
    // We want the lotus to be animated during 'intro' and reverse during 'outro'.
    const introProgress = mapProgressToSegment(progress, progressBreakup.intro);
    const outroProgress = mapProgressToSegment(progress, progressBreakup.outro);
    const entranceProgress = mapProgressToSegment(
      progress,
      progressBreakup.entrance
    );
    const splitAndShrinkProgress = mapProgressToSegment(
      progress,
      progressBreakup.splitAndShrink
    );
    const aboutUsEntranceProgress = mapProgressToSegment(
      progress,
      progressBreakup.aboutUsEntrance
    );
    const ourServicesEntranceProgress = mapProgressToSegment(
      progress,
      progressBreakup.ourServicesEntrance
    );
    const ourWorkEntranceProgress = mapProgressToSegment(
      progress,
      progressBreakup.ourWorkEntrance
    );
    const contactUsEntranceProgress = mapProgressToSegment(
      progress,
      progressBreakup.contactUsEntrance
    );

    let heroLotusProgress = 0;
    let aboutUsLotusProgress = 0;
    let ourServicesLotusProgress = 0;
    let ourWorkLotusProgress = 0;
    let contactUsLotusProgress = 0;

    if (introProgress !== null && introProgress !== 1) {
      heroLotusProgress = introProgress;
    }

    if (outroProgress !== null && outroProgress !== 1) {
      heroLotusProgress = 1 - outroProgress;
    }

    //for transition if intro 1 and outro null then lotusProgress = 1
    if (introProgress === 1 && outroProgress === null) {
      heroLotusProgress = 1;
    }

    if (introProgress === 1 && outroProgress === 1) {
      heroLotusProgress = 0;
    }

    if (aboutUsEntranceProgress !== null && aboutUsEntranceProgress !== 1) {
      aboutUsLotusProgress = aboutUsEntranceProgress;
    } else if (aboutUsEntranceProgress === 1) {
      aboutUsLotusProgress = 1;
    }

    if (
      ourServicesEntranceProgress !== null &&
      ourServicesEntranceProgress !== 1
    ) {
      ourServicesLotusProgress = ourServicesEntranceProgress;
    } else if (ourServicesEntranceProgress === 1) {
      ourServicesLotusProgress = 1;
    }

    if (ourWorkEntranceProgress !== null && ourWorkEntranceProgress !== 1) {
      ourWorkLotusProgress = ourWorkEntranceProgress;
    } else if (ourWorkEntranceProgress === 1) {
      ourWorkLotusProgress = 1;
    }

    if (contactUsEntranceProgress !== null && contactUsEntranceProgress !== 1) {
      contactUsLotusProgress = contactUsEntranceProgress;
    } else if (contactUsEntranceProgress === 1) {
      contactUsLotusProgress = 1;
    }

    return {
      entranceProgress,
      aboutUsLotusProgress,
      ourServicesLotusProgress,
      ourWorkLotusProgress,
      contactUsLotusProgress,
      heroLotusProgress,
      splitAndShrinkProgress,
      aboutUsEntranceProgress,
      ourServicesEntranceProgress,
      ourWorkEntranceProgress,
      contactUsEntranceProgress,
    };
  }, [progress]);

  // Destructure for cleaner access in the render and effects
  const {
    entranceProgress,
    heroLotusProgress,
    aboutUsLotusProgress,
    ourServicesLotusProgress,
    ourWorkLotusProgress,
    contactUsLotusProgress,
    splitAndShrinkProgress,
    aboutUsEntranceProgress,
  } = mappedProgress;

  const isFlowerInPhase2 = useCallback(
    (index: number) => {
      switch (index) {
        case 0:
          return heroLotusProgress === 1;
        case 1:
          return aboutUsLotusProgress === 1;
        case 2:
          return ourServicesLotusProgress === 1;
        case 3:
          return ourWorkLotusProgress === 1;
        case 4:
          return contactUsLotusProgress === 1;
        default:
          return false;
      }
    },
    [
      heroLotusProgress,
      aboutUsLotusProgress,
      ourServicesLotusProgress,
      ourWorkLotusProgress,
      contactUsLotusProgress,
    ]
  );

  // Memoize flowerPositions array to prevent unnecessary re-renders
  const flowerPositions = useMemo(() => {
    return FLOWER_CONFIG.slice(0, numberOfExtraFlowers + 1).map(
      (flower, index) => {
        // Match the bobbing parameters from the animation
        const verticalBob = 5 + index * 0.2;
        const duration = 3 + index * 0.3;
        const delay = index * 0.2;

        return {
          x: flower.position.x,
          y: flower.position.y,
          phase: isFlowerInPhase2(flower.index) ? 2 : 1,
          verticalBob,
          bobDuration: duration / 2, // Vertical bob uses half duration
          bobDelay: delay,
        };
      }
    );
  }, [numberOfExtraFlowers, isFlowerInPhase2]);
  //Entrace scale up and fall from the top
  useLayoutEffect(() => {
    gsap.set(".lotus-flower-container-0", {
      scale: 0.001,
      x: 0,
      y: -500,
      z: -1000,
      opacity: 0,
    });

    entranceTimeline.current = gsap.timeline({
      paused: true,
    });

    entranceTimeline.current?.fromTo(
      ".lotus-flower-container-0",
      // FROM: (Start way up and small)
      { scale: 0.001, x: 0, y: -500, z: -1000, opacity: 0 },
      // TO: (The main flight)
      {
        scale: 2.5,
        opacity: 1,
        z: 0,
        ease: "sine.in", // Use an ease that simulates gravity, like power1.in
        force3D: true,
        x: 0,
        y: 0,
      },
      0
    );

    // Cleanup function
    return () => {
      entranceTimeline.current?.kill();
    };
  }, []);

  // Split and shrink - set the number of flowers to 5
  useLayoutEffect(() => {
    if (splitAndShrinkProgress !== null) {
      setNumberOfExtraFlowers(4);
    } else {
      setNumberOfExtraFlowers(0);
    }
  }, [splitAndShrinkProgress]);

  useLayoutEffect(() => {
    if (numberOfExtraFlowers > 0) {
      // 1. Create a single array of ALL flower selectors
      const targets = Array.from(
        { length: numberOfExtraFlowers + 1 },
        (_, i) => `.lotus-flower-container-${i}`
      );

      splitAndShrinkTimeline.current = gsap.timeline({
        paused: true,
      });

      // Set z-index immediately: index 0 on top, others below
      gsap.set(".lotus-flower-container-0", { zIndex: 10 });
      targets.slice(1).forEach((selector) => {
        gsap.set(selector, { zIndex: 1 });
      });

      // Helper function to calculate scale based on Y position
      const calculateScale = (yPosition: number) => {
        // Define the actual range of Y positions for the flowers
        const MIN_Y = 195; // Closest to y=0 (should get min scale)
        const MAX_Y = 397; // Farthest from y=0 (should get max scale)

        // Normalize Y position within the actual range: 0 (closest) to 1 (farthest)
        const yFactor = Math.min(
          Math.max((yPosition - MIN_Y) / (MAX_Y - MIN_Y), 0),
          1
        );

        // Scale: 0.25 when close to y=0 (yFactor=0), increasing to 0.4 when far (yFactor=1)
        return 0.25 + 0.15 * yFactor;
      };

      // 2. Use a single fromTo call with the targets array
      const viewportWidth =
        typeof window !== "undefined" ? window.innerWidth : BASE_DESIGN_WIDTH;

      splitAndShrinkTimeline.current?.fromTo(
        targets, // <-- Target is the array of all elements
        {
          scale: 2.5,
          x: 0,
          y: 0,
          transformOrigin: "50% 50%", // Explicitly set center origin
          zIndex: (i) => (i === 0 ? 10 : 1), // Index 0 on top, others below
        },
        {
          scale: (i) => {
            const flowerConfig = FLOWER_CONFIG[i];
            return flowerConfig
              ? calculateScale(flowerConfig.position.y)
              : 0.33;
          },
          transformOrigin: "50% 50%", // Keep center origin when scaling
          zIndex: (i) => (i === 0 ? 10 : 1), // Keep index 0 on top throughout
          motionPath: {
            path: (i) => {
              const flowerConfig = FLOWER_CONFIG[i];
              if (!flowerConfig) return "M 0,0";

              const startX = 0;
              const startY = 0;
              const endX = getResponsivePosition(
                flowerConfig.position.x,
                viewportWidth
              );
              const endY = flowerConfig.position.y;

              // Create a downward parabolic Bezier curve with early curve start
              // First control point stays close to x:0 but curves up dramatically
              const control1X = startX + (endX - startX) * 0.05; // Only 5% along x-axis - keeps beginning close to x:0
              const control1Y = startY - 150; // Strong upward curve from the start

              // Second control point creates the swoosh down
              const control2X = startX + (endX - startX) * 0.5; // Midpoint for smooth transition
              const control2Y = endY + 100; // Curve downward toward end

              // Cubic Bezier curve: M start, C control1, control2, end
              return `M ${startX},${startY} C ${control1X},${control1Y} ${control2X},${control2Y} ${endX},${endY}`;
            },
            autoRotate: false,
          },
          stagger: (i) => {
            // Index 0 goes last, others stagger normally
            if (i === 0) {
              return numberOfExtraFlowers * 0.1; // Delay index 0 to be last
            }
            return (i - 1) * 0.1; // Stagger indices 1-4 normally
          },
          ease: "expo.out",
          force3D: true,
        },
        0
      );
    }
    return () => {
      splitAndShrinkTimeline.current?.kill();
    };
  }, [numberOfExtraFlowers]);

  useSmoothProgress(splitAndShrinkTimeline.current, splitAndShrinkProgress);

  useSmoothProgress(entranceTimeline.current, entranceProgress);

  // Subtle bobbing and swaying animation for flowers in water
  useLayoutEffect(() => {
    // Only animate if flowers are positioned (hero flower is open OR split has started)
    if (heroLotusProgress < 1 && splitAndShrinkProgress === null) return;

    const targets = Array.from(
      { length: numberOfExtraFlowers + 1 },
      (_, i) => `.lotus-flower-container-${i}`
    );

    targets.forEach((selector, index) => {
      // Create unique animation for each flower with slight variations
      const verticalBob = 5 + index * 0.2; // 1.5-2.5px vertical movement
      const duration = 3 + index * 0.3; // 3-4.2 seconds per cycle
      const delay = index * 0.2; // Stagger start times slightly

      // Get flower config for ripple emission
      const flower = FLOWER_CONFIG[index];
      if (!flower) return;

      // Vertical bobbing (up and down) with ripple emission at lowest point
      // GSAP yoyo: goes down (0->amplitude), then up (amplitude->0)
      // Lowest point is at the end of the first tween (when it completes)
      const verticalTimeline = gsap.timeline({ repeat: -1, delay: delay });
      verticalTimeline.to(selector, {
        y: `+=${verticalBob}`,
        duration: duration / 2,
        ease: "sine.inOut",
        onComplete: function () {
          // This fires when flower reaches lowest point (end of downward motion)
          if (waterSurfaceRef.current && splitAndShrinkProgress === 1) {
            const phase = isFlowerInPhase2(flower.index) ? 2 : 1;

            // Get the actual DOM element - its position already includes all GSAP transforms
            const element = document.querySelector(selector) as HTMLElement;
            if (element && waterSurfaceRef.current) {
              // Pass the element directly - WaterSurface will use getBoundingClientRect()
              // This automatically accounts for all transforms (bob, motion path)
              waterSurfaceRef.current.emitRippleFromElement(
                index,
                element,
                phase
              );
            }
          }
        },
      });
      verticalTimeline.to(selector, {
        y: `-=${verticalBob}`,
        duration: duration / 2,
        ease: "sine.inOut",
      });
    });

    return () => {
      // Cleanup: kill all bobbing animations (only vertical now)
      targets.forEach((selector) => {
        gsap.killTweensOf(selector, "y");
      });
    };
  }, [
    numberOfExtraFlowers,
    splitAndShrinkProgress,
    heroLotusProgress,
    isFlowerInPhase2,
  ]);

  return (
    <section
      ref={sceneRef}
      id={heroSceneConfig.id}
      data-scene={heroSceneConfig.id}
      style={{ transform: "none !important" }}
      className="relative h-screen overflow-hidden hero-scene-container"
    >
      {/* Lighting Controls Overlay */}
      <LightingControls
        lightingState={lightingState}
        onConfigChange={updateLightingConfig}
      />

      {/* Layer 1: Sky Background with Day/Night colors */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <DayNightCycle progress={progress} skyColor={lightingState.skyColor} />
      </div>

      {/* Layer 2: Atmospheric Effects BEHIND mountains (God Rays, Lens Flare) */}
      <div
        className="absolute inset-0"
        style={{ zIndex: 1, pointerEvents: "none" }}
      >
        <AtmosphericEffects lightingState={lightingState} />
      </div>

      {/* Layer 3: Mountains (solid, occludes atmospheric effects) */}
      <div className="absolute inset-0" style={{ zIndex: 2 }}>
        <MountainBackground lightingState={lightingState} />
      </div>

      {/* Layer 4: Water Surface with Lighting */}
      <div className="absolute inset-0" style={{ zIndex: 3 }}>
        <WaterSurface
          ref={waterSurfaceRef}
          flowerPositions={flowerPositions}
          splitAndShrinkProgress={splitAndShrinkProgress}
          lightingState={lightingState}
        />
      </div>

      {/* Layer 5: Flowers on top of everything */}
      <div className="absolute inset-0" style={{ zIndex: 10 }}>
        {FLOWER_CONFIG.slice(0, numberOfExtraFlowers + 1).map((flower) => (
          <LotusFlower
            key={flower.index}
            progress={mappedProgress[flower.progressKey]}
            phase={
              flower.index === 0 ? 1 : splitAndShrinkProgress !== null ? 2 : 1
            }
            index={flower.index}
            title={flower.title}
            splitProgress={splitAndShrinkProgress}
            finalYPosition={flower.position.y}
          />
        ))}
      </div>
    </section>
  );
}
