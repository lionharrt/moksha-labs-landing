"use client";

import { useState } from "react";

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
}

export function PerformancePreloader({
  config,
  viewportWidth,
  viewportHeight,
}: PerformancePreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing...");

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
      <div style={{ marginBottom: "20px", fontSize: "18px" }}>{status}</div>
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
