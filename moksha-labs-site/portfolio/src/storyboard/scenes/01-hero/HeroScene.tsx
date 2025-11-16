"use client";

import { useRef, useMemo, useLayoutEffect, useEffect } from "react";
import { useScene } from "../../hooks/useScene";
import { heroSceneConfig } from "./HeroScene.config";
import { IntroState } from "@/hooks/useIntroController";
import { gsap } from "gsap"; // Ensure gsap/GSAPTimeline is imported
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";
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
  intro: { start: 0, end: 0.75 },
  // Outro (60% to 100% of total scroll)
  outro: { start: 0.75, end: 1.0 },
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
export const mapProgressToSegment = (
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

interface HeroSceneProps {
  introState?: IntroState;
  onIntroComplete?: () => void;
}

export function HeroScene({ introState, onIntroComplete }: HeroSceneProps) {
  performanceLogger.logRender("HeroScene");

  // Get scene ref but don't use scroll progress
  const { sceneRef } = useScene(heroSceneConfig);

  return (
    <>
      {/* Always render scene - preloader overlays on top */}
      <section
        ref={sceneRef}
        id={heroSceneConfig.id}
        data-scene={heroSceneConfig.id}
        style={{ transform: "none !important" }}
        className="relative h-screen overflow-hidden hero-scene-container"
      ></section>
    </>
  );
}
