"use client";

import React, {
  createContext,
  useContext,
  useRef,
  ReactNode,
  useEffect,
} from "react";
import { gsap } from "gsap";
import { useIntroContext } from "./IntroContext";
import { useSmoothProgress } from "@/storyboard/hooks/useSmoothProgress";

interface LightingContextType {
  lightSourceRef: React.MutableRefObject<SVGSVGElement | null>;
  sunPositionRef: React.MutableRefObject<{ x: number; y: number }>;
}

const LightingContext = createContext<LightingContextType | null>(null);

export function LightingProvider({ children }: { children: ReactNode }) {
  const { introProgressRef } = useIntroContext();
  // Create refs that will be shared across all scenes
  const lightSourceRef = useRef<SVGSVGElement | null>(null);
  const sunPositionRef = useRef<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const lightSourceTimeline = useRef<GSAPTimeline | null>(null);
  const sunPositionTimeline = useRef<GSAPTimeline | null>(null);

  useEffect(() => {
    if (!lightSourceRef.current) return;

    // Set transform origin to center for proper 3D transforms
    gsap.set(lightSourceRef.current, {
      xPercent: 0,
      yPercent: 0,
      transformOrigin: "center center",
    });

    lightSourceTimeline.current = gsap.timeline({ paused: true });

    lightSourceTimeline.current.fromTo(
      lightSourceRef.current,
      {
        x: 0,
        y: 0,
      },
      {
        x: 0,
        y: -350,
        duration: 1,
        ease: "sine.in",
      }
    );
  }, [lightSourceRef]);

  useEffect(() => {
    if (!sunPositionRef.current) return;
    sunPositionTimeline.current = gsap.timeline({ paused: true });
    sunPositionTimeline.current.fromTo(
      sunPositionRef.current,
      { x: 0, y: 0 },
      { x: 0, y: -350, duration: 1, ease: "sine.in" }
    );
  }, [sunPositionRef]);

  useSmoothProgress(lightSourceTimeline.current, introProgressRef.current, 0.2);
  useSmoothProgress(sunPositionTimeline.current, introProgressRef.current, 0.2);

  return (
    <LightingContext.Provider
      value={{
        lightSourceRef,
        sunPositionRef,
      }}
    >
      {children}
    </LightingContext.Provider>
  );
}

export function useLightingContext() {
  const context = useContext(LightingContext);
  if (!context) {
    throw new Error("useLightingContext must be used within LightingProvider");
  }
  return context;
}
