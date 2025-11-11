"use client";

import {
  useRef,
  useMemo,
  useState,
  useLayoutEffect,
  useCallback,
  useEffect,
} from "react"; // Added useEffect
import { useScene } from "../../hooks/useScene";
import { heroSceneConfig } from "./HeroScene.config";
import LotusFlower from "@/components/ui/LotusFlower";
import { gsap } from "gsap"; // Ensure gsap/GSAPTimeline is imported
import { useSmoothProgress } from "@/storyboard/hooks/useSmoothProgress";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { WaterSurface, WaterSurfaceRef } from "@/components/ui/WaterSurface";
import DayNightCycle from "@/components/ui/DayNightCycle";
import MountainBackground from "@/components/ui/MountainBackground";
import LightingControls from "@/components/ui/LightingControls";
import AtmosphericEffectsWebGL from "@/components/ui/AtmosphericEffectsWebGL";
import {
  PerformancePreloader,
  PreloadedData,
} from "@/components/ui/PerformancePreloader";
import { DEFAULT_CONFIG } from "@/hooks/useLighting";
import { calculateLightPosition } from "@/utils/lightPosition";
import { calculateLightingState } from "@/utils/calculateLightingState";
import { LightingConfig, LightingState } from "@/hooks/useLighting";
import { performanceLogger } from "@/utils/performanceLogger";
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
  performanceLogger.logRender("HeroScene");

  // TEMPORARY: Timer-based progress for performance testing (0-1 over 30 seconds)
  // Comment out scroll progress for now
  const progressRef = useRef(0);
  const [timerProgress, setTimerProgress] = useState(0);
  const updateTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const startTime = performance.now();
    const duration = 300000; // 30 seconds
    let lastReportedProgress = -1;

    const updateProgress = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // CRITICAL: Update ref immediately (for canvas components to read)
      progressRef.current = progress;

      // Only update React state when progress changes significantly (every ~1%)
      // This prevents re-renders every frame - sun position updates via RAF anyway
      const progressThreshold = 0.01; // 1% change = ~10 updates per second
      if (Math.abs(progress - lastReportedProgress) >= progressThreshold) {
        lastReportedProgress = progress;
        setTimerProgress(progress);
      }

      if (progress < 1) {
        requestAnimationFrame(updateProgress);
      }
    };

    requestAnimationFrame(updateProgress);
  }, []);

  // COMMENTED OUT: Scroll-driven progress
  // const { sceneRef, progress } = useScene(heroSceneConfig);
  const sceneRef = useRef<HTMLElement>(null);
  const progress = timerProgress; // Use throttled timer progress for React
  const [numberOfExtraFlowers, setNumberOfExtraFlowers] = useState(1);
  const waterSurfaceRef = useRef<WaterSurfaceRef>(null);
  const [preloadedData, setPreloadedData] = useState<PreloadedData | null>(
    null
  );
  const preloadedDataRef = useRef<PreloadedData | null>(null);
  preloadedDataRef.current = preloadedData;
  const [isPreloading, setIsPreloading] = useState(true);

  const splitAndShrinkTimeline = useRef<GSAPTimeline | null>(null);
  const entranceTimeline = useRef<GSAPTimeline | null>(null);
  const aboutUsEntranceTimeline = useRef<GSAPTimeline | null>(null);

  // Refs for canvas component render functions (unified RAF loop)
  const atmosphericEffectsRenderRef = useRef<(() => void) | null>(null);
  const mountainBackgroundRenderRef = useRef<(() => void) | null>(null);
  const waterSurfaceRenderRef = useRef<(() => void) | null>(null);

  // Cache flower element refs to avoid DOM queries in GSAP callbacks
  const flowerElementRefs = useRef<Map<number, HTMLElement>>(new Map());

  // CRITICAL: Calculate light positions once in HeroScene, pass as props
  // This removes all calculation logic from DayNightCycle
  const viewportDimensionsRef = useRef({
    width: typeof window !== "undefined" ? window.innerWidth : 1920,
    height: typeof window !== "undefined" ? window.innerHeight : 1080,
  });

  useEffect(() => {
    const updateDimensions = () => {
      viewportDimensionsRef.current = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    };
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Lighting config state (managed separately, doesn't watch progress)
  const [lightingConfig, setLightingConfig] =
    useState<LightingConfig>(DEFAULT_CONFIG);

  // CRITICAL: Create ref for lightingConfig so MountainBackground can read it every frame
  const lightingConfigRef = useRef<LightingConfig>(lightingConfig);
  lightingConfigRef.current = lightingConfig;

  // CRITICAL: Memoize sunPosition and moonPosition separately to prevent re-renders
  // React.memo does shallow comparison, so we need stable object references
  // Also round positions to nearest pixel to prevent micro-changes from triggering re-renders
  // BUT: Don't round too aggressively or sun will stutter - use sub-pixel precision
  const sunPosition = useMemo(() => {
    const totalCycles = 28;
    const currentCycle = Math.floor(progress * totalCycles);
    const cycleProgress = (progress * totalCycles) % 1;
    const isDaytime = cycleProgress < 0.5;

    const viewportWidth = viewportDimensionsRef.current.width;
    const viewportHeight = viewportDimensionsRef.current.height;
    const lightPosition = calculateLightPosition(
      progress,
      viewportWidth,
      viewportHeight
    );

    if (isDaytime) {
      // Use sub-pixel precision (0.1px) to prevent stuttering while still reducing re-renders
      return {
        x: Math.round(lightPosition.x * 10) / 10,
        y: Math.round(lightPosition.y * 10) / 10,
      };
    } else {
      return { x: viewportWidth + 200, y: Math.round(viewportHeight * 0.8) };
    }
  }, [progress]);

  const moonPosition = useMemo(() => {
    const totalCycles = 28;
    const currentCycle = Math.floor(progress * totalCycles);
    const cycleProgress = (progress * totalCycles) % 1;
    const isDaytime = cycleProgress < 0.5;

    const viewportWidth = viewportDimensionsRef.current.width;
    const viewportHeight = viewportDimensionsRef.current.height;
    const lightPosition = calculateLightPosition(
      progress,
      viewportWidth,
      viewportHeight
    );

    if (isDaytime) {
      return { x: -200, y: Math.round(viewportHeight * 0.8) };
    } else {
      // Use sub-pixel precision (0.1px) to prevent stuttering while still reducing re-renders
      return {
        x: Math.round(lightPosition.x * 10) / 10,
        y: Math.round(lightPosition.y * 10) / 10,
      };
    }
  }, [progress]);

  // Calculate light positions and cycle info
  const lightPositions = useMemo(() => {
    performanceLogger.logEffect("HeroScene", "lightPositions-calc");
    const totalCycles = 28;
    const currentCycle = Math.floor(progress * totalCycles);
    const cycleProgress = (progress * totalCycles) % 1;
    const isDaytime = cycleProgress < 0.5;
    const moonPhase = currentCycle / totalCycles;

    return {
      sunPosition,
      moonPosition,
      isDaytime,
      moonPhase,
    };
  }, [progress, sunPosition, moonPosition]);

  // CRITICAL: Calculate lighting state in HeroScene, pass as props
  // This removes the useEffect watching progress in useLighting hook
  const lightingState = useMemo(() => {
    performanceLogger.logEffect("HeroScene", "lightingState-calc");
    const viewportWidth = viewportDimensionsRef.current.width;
    const viewportHeight = viewportDimensionsRef.current.height;

    return calculateLightingState(
      progress,
      lightingConfig,
      viewportWidth,
      viewportHeight,
      preloadedData || undefined
    );
  }, [progress, lightingConfig, preloadedData]);

  // Ref for canvas components to read latest lighting state
  const lightingStateRef = useRef<LightingState>(lightingState);
  lightingStateRef.current = lightingState;

  // CRITICAL: Memoize shadowDirection object to prevent unnecessary re-renders
  // React.memo does shallow comparison, so object references matter
  const shadowDirection = useMemo(
    () => ({
      x: lightingState.shadowDirection.x,
      y: lightingState.shadowDirection.y,
    }),
    [lightingState.shadowDirection.x, lightingState.shadowDirection.y]
  );

  // Unified RAF loop - coordinates all canvas updates with frame budgeting
  useEffect(() => {
    if (isPreloading) return; // Don't start loop until preloading is done

    let rafId: number;
    let lastFrameTime = performance.now();
    const targetFrameTime = 16.67; // 60fps target
    const maxFrameTime = 33.33; // 30fps minimum
    const frameBudget = 16; // ms budget per frame

    const unifiedRenderLoop = (currentTime: number) => {
      const frameStart = performance.now();
      const frameTime = frameStart - lastFrameTime;
      lastFrameTime = frameStart;

      // Skip frame if we're over budget (maintain smooth FPS)
      if (frameTime > maxFrameTime) {
        rafId = requestAnimationFrame(() => {
          rafId = requestAnimationFrame(unifiedRenderLoop);
        });
        return;
      }

      // Frame budgeting: track time spent and skip expensive operations if over budget
      let timeSpent = 0;
      const checkBudget = () => performance.now() - frameStart;

      // Call all render functions in order (back to front)
      // 1. Atmospheric Effects (behind mountains) - WebGL only
      if (atmosphericEffectsRenderRef.current && timeSpent < frameBudget) {
        atmosphericEffectsRenderRef.current();
        timeSpent = checkBudget();
      }

      // 2. Mountain Background - most expensive, skip if we're over budget
      if (mountainBackgroundRenderRef.current && timeSpent < frameBudget) {
        mountainBackgroundRenderRef.current();
        timeSpent = checkBudget();
      }

      // 3. Water Surface - medium cost, skip if we're over budget
      if (waterSurfaceRenderRef.current && timeSpent < frameBudget) {
        waterSurfaceRenderRef.current();
        timeSpent = checkBudget();
      }

      // Schedule next frame
      rafId = requestAnimationFrame(unifiedRenderLoop);
    };

    rafId = requestAnimationFrame(unifiedRenderLoop);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isPreloading]);

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
  // CRITICAL: Only run when flowers should be animated (not on every progress change)
  // Use refs to track previous values and only update when actually needed
  const prevAnimationStateRef = useRef({
    heroLotusProgress: 0,
    splitAndShrinkProgress: null as number | null,
    numberOfExtraFlowers: 0,
  });

  useLayoutEffect(() => {
    // Only animate if flowers are positioned (hero flower is open OR split has started)
    if (heroLotusProgress < 1 && splitAndShrinkProgress === null) return;

    // CRITICAL: Only recreate animations if state actually changed significantly
    // This prevents expensive DOM queries and GSAP timeline creation on every scroll
    const prevState = prevAnimationStateRef.current;
    const shouldRecreate =
      prevState.numberOfExtraFlowers !== numberOfExtraFlowers ||
      (heroLotusProgress >= 1 && prevState.heroLotusProgress < 1) ||
      (splitAndShrinkProgress !== null &&
        prevState.splitAndShrinkProgress === null);

    if (!shouldRecreate && prevState.numberOfExtraFlowers > 0) {
      // Animations already set up, just update refs
      prevAnimationStateRef.current = {
        heroLotusProgress,
        splitAndShrinkProgress,
        numberOfExtraFlowers,
      };
      return;
    }

    prevAnimationStateRef.current = {
      heroLotusProgress,
      splitAndShrinkProgress,
      numberOfExtraFlowers,
    };

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

      // PERFORMANCE: Cache element ref ONCE to avoid DOM queries in callback
      // This prevents expensive getBoundingClientRect() calls from blocking GSAP animation
      // CRITICAL: Only query DOM if element not already cached
      if (!flowerElementRefs.current.has(index)) {
        const element = document.querySelector(selector) as HTMLElement;
        if (element) {
          flowerElementRefs.current.set(index, element);
        }
      }

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
          // PERFORMANCE: Use cached element ref and defer expensive getBoundingClientRect() call
          if (waterSurfaceRef.current && splitAndShrinkProgress === 1) {
            const phase = isFlowerInPhase2(flower.index) ? 2 : 1;

            // Use cached element ref instead of querying DOM (avoids DOM query)
            const cachedElement = flowerElementRefs.current.get(index);
            if (cachedElement && waterSurfaceRef.current) {
              // Defer getBoundingClientRect() to next frame to avoid blocking GSAP animation
              // This prevents the 150ms frame spike
              requestAnimationFrame(() => {
                waterSurfaceRef.current?.emitRippleFromElement(
                  index,
                  cachedElement,
                  phase
                );
              });
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

    // Capture refs for cleanup
    const elementRefsMap = flowerElementRefs.current;

    return () => {
      // Cleanup: kill all bobbing animations (only vertical now)
      targets.forEach((selector) => {
        gsap.killTweensOf(selector, "y");
      });
      // Clear cached element refs
      elementRefsMap.clear();
    };
  }, [
    numberOfExtraFlowers,
    splitAndShrinkProgress,
    heroLotusProgress,
    isFlowerInPhase2,
  ]);

  return (
    <>
      {isPreloading && (
        <PerformancePreloader
          config={DEFAULT_CONFIG}
          viewportWidth={
            typeof window !== "undefined" ? window.innerWidth : 1920
          }
          viewportHeight={
            typeof window !== "undefined" ? window.innerHeight : 1080
          }
          onComplete={(data) => {
            setPreloadedData(data);
            setIsPreloading(false);
          }}
        />
      )}

      {/* Always render scene - preloader overlays on top */}
      <section
        ref={sceneRef}
        id={heroSceneConfig.id}
        data-scene={heroSceneConfig.id}
        style={{ transform: "none !important" }}
        className="relative h-screen overflow-hidden hero-scene-container"
      >
        {/* Lighting Controls Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10000,
            pointerEvents: "none",
          }}
        >
          <div style={{ pointerEvents: "auto" }}>
            <LightingControls
              lightingState={lightingState}
              onConfigChange={(updates) => {
                setLightingConfig((prev) => ({ ...prev, ...updates }));
              }}
            />
          </div>
        </div>

        {/* Layer 1: Sky Background with Day/Night colors */}
        <div
          className="absolute inset-0"
          style={{ zIndex: 0 }}
          data-component="HeroScene-Sky"
        >
          <DayNightCycle
            progressRef={progressRef}
            viewportDimensionsRef={viewportDimensionsRef}
            isDaytime={lightPositions.isDaytime}
            moonPhase={lightPositions.moonPhase}
            skyColor={lightingState.skyColor}
            lightingConfigRef={lightingConfigRef}
            preloadedDataRef={preloadedDataRef}
          />
        </div>

        {/* Layer 2: Atmospheric Effects BEHIND mountains (God Rays, Lens Flare) */}
        {/* TEMPORARILY DISABLED */}
        {/* <div
          className="absolute inset-0"
          style={{ zIndex: 1, pointerEvents: "none" }}
        >
          <AtmosphericEffectsWebGL
            lightingState={lightingState}
            lightingStateRef={lightingStateRef}
            renderRef={atmosphericEffectsRenderRef}
          />
        </div> */}

        {/* Layer 3: Mountains (solid, occludes atmospheric effects) */}
        <div
          className="absolute inset-0"
          style={{ zIndex: 2, pointerEvents: "none" }}
          data-component="HeroScene-Mountains"
        >
          <MountainBackground
            progressRef={progressRef}
            lightingConfigRef={lightingConfigRef}
            viewportDimensionsRef={viewportDimensionsRef}
            preloadedDataRef={preloadedDataRef}
            renderRef={mountainBackgroundRenderRef}
          />
        </div>

        {/* Layer 4: Water Surface with Lighting */}
        <div
          className="absolute inset-0"
          style={{ zIndex: 3, pointerEvents: "none" }}
        >
          <WaterSurface
            ref={waterSurfaceRef}
            flowerPositions={flowerPositions}
            splitAndShrinkProgress={splitAndShrinkProgress}
            lightingState={lightingState}
            progressRef={progressRef}
            lightingConfigRef={lightingConfigRef}
            preloadedDataRef={preloadedDataRef}
            viewportDimensionsRef={viewportDimensionsRef}
            renderRef={waterSurfaceRenderRef}
          />
        </div>

        {/* Layer 5: Flowers on top of everything */}
        {/* TEMPORARILY DISABLED */}
        {/* <div className="absolute inset-0" style={{ zIndex: 10 }}>
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
        </div> */}
      </section>
    </>
  );
}
