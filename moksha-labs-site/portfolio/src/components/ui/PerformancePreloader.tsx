"use client";

import { useEffect, useState, useRef } from "react";
import {
  precalculateColorLUT,
  precalculateLightPositionLUT,
  precalculateNoiseLUT,
  ColorLUT,
  LightPositionLUT,
  NoiseLUT,
} from "@/utils/performancePreloader";

// Define config interface locally to avoid circular dependency
interface LightingConfig {
  daySkyColor: string;
  twilightSkyColor: string;
  duskSkyColor: string;
  nightSkyColor: string;
  dawnSkyColor: string;
  dayMountainColor: string;
  twilightMountainColor: string;
  duskMountainColor: string;
  nightMountainColor: string;
  dawnMountainColor: string;
  dayWaterColor: string;
  twilightWaterColor: string;
  duskWaterColor: string;
  nightWaterColor: string;
  dawnWaterColor: string;
}

interface PerformancePreloaderProps {
  config: LightingConfig;
  viewportWidth: number;
  viewportHeight: number;
  onComplete: (preloaded: PreloadedData) => void;
}

export interface PreloadedData {
  colorLUT: ColorLUT;
  lightPositionLUT: LightPositionLUT;
  noiseLUT: NoiseLUT;
}

export function PerformancePreloader({
  config,
  viewportWidth,
  viewportHeight,
  onComplete,
}: PerformancePreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing...");
  const preloadedDataRef = useRef<PreloadedData | null>(null);

  useEffect(() => {
    let startTime = performance.now();
    const totalSteps = 3;
    let currentStep = 0;

    const preload = async () => {
      // Step 1: Pre-calculate color lookup tables
      setStatus("Pre-calculating colors...");
      setProgress(0);
      const colorLUT = precalculateColorLUT(config, 1000);
      currentStep++;
      setProgress(currentStep / totalSteps);

      // Step 2: Pre-calculate light position lookup table
      setStatus("Pre-calculating light positions...");
      await new Promise((resolve) => setTimeout(resolve, 0)); // Yield to UI
      const lightPositionLUT = precalculateLightPositionLUT(
        viewportWidth,
        viewportHeight,
        1000
      );
      currentStep++;
      setProgress(currentStep / totalSteps);

      // Step 3: Pre-calculate noise lookup tables
      setStatus("Pre-calculating noise patterns...");
      await new Promise((resolve) => setTimeout(resolve, 0)); // Yield to UI
      const noiseLUT = precalculateNoiseLUT(0.01, 10000);
      currentStep++;
      setProgress(currentStep / totalSteps);

      const preloaded: PreloadedData = {
        colorLUT,
        lightPositionLUT,
        noiseLUT,
      };

      preloadedDataRef.current = preloaded;
      const elapsed = performance.now() - startTime;
      setStatus(`Ready! (${elapsed.toFixed(0)}ms)`);
      
      // Small delay to show completion, then notify
      setTimeout(() => {
        onComplete(preloaded);
      }, 200);
    };

    preload();
  }, [config, viewportWidth, viewportHeight, onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#1A1A3E",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999999,
        color: "#fff",
        fontFamily: "monospace",
      }}
    >
      <div style={{ marginBottom: "20px", fontSize: "18px" }}>
        {status}
      </div>
      <div
        style={{
          width: "400px",
          height: "8px",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            backgroundColor: "#4ade80",
            transition: "width 0.1s ease",
          }}
        />
      </div>
      <div style={{ marginTop: "10px", fontSize: "14px", opacity: 0.7 }}>
        {Math.round(progress * 100)}%
      </div>
    </div>
  );
}

