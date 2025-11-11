"use client";

import { useRef, useEffect, useState } from "react";

interface PerformanceStatsProps {
  enabled?: boolean;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export function PerformanceStats({
  enabled = true,
  position = "top-right",
}: PerformanceStatsProps) {
  const [stats, setStats] = useState({
    fps: 0,
    frameTime: 0,
    minFrameTime: Infinity,
    maxFrameTime: 0,
    avgFrameTime: 0,
    frameCount: 0,
    droppedFrames: 0,
  });

  const frameTimesRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef(performance.now());
  const frameCountRef = useRef(0);
  const droppedFramesRef = useRef(0);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!enabled) return;

    const updateStats = () => {
      const now = performance.now();
      const frameTime = now - lastFrameTimeRef.current;
      lastFrameTimeRef.current = now;

      if (frameTime > 0 && frameTime < 1000) {
        // Only count valid frame times (not huge gaps)
        frameTimesRef.current.push(frameTime);
        frameCountRef.current++;

        // Keep only last 60 frames for rolling average
        if (frameTimesRef.current.length > 60) {
          frameTimesRef.current.shift();
        }

        // Calculate stats
        const fps = 1000 / frameTime;
        const avgFrameTime =
          frameTimesRef.current.reduce((a, b) => a + b, 0) /
          frameTimesRef.current.length;
        const minFrameTime = Math.min(...frameTimesRef.current);
        const maxFrameTime = Math.max(...frameTimesRef.current);

        // Count dropped frames (frames that took longer than 33.33ms = <30fps)
        if (frameTime > 33.33) {
          droppedFramesRef.current++;
        }

        setStats({
          fps: Math.round(fps),
          frameTime: Math.round(frameTime * 100) / 100,
          minFrameTime: Math.round(minFrameTime * 100) / 100,
          maxFrameTime: Math.round(maxFrameTime * 100) / 100,
          avgFrameTime: Math.round(avgFrameTime * 100) / 100,
          frameCount: frameCountRef.current,
          droppedFrames: droppedFramesRef.current,
        });
      }

      animationFrameRef.current = requestAnimationFrame(updateStats);
    };

    animationFrameRef.current = requestAnimationFrame(updateStats);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enabled]);

  if (!enabled) return null;

  const positionStyles = {
    "top-left": { top: 10, left: 10 },
    "top-right": { top: 10, right: 10 },
    "bottom-left": { bottom: 10, left: 10 },
    "bottom-right": { bottom: 10, right: 10 },
  };

  const fpsColor =
    stats.fps >= 30
      ? "#4ade80" // green
      : stats.fps >= 20
      ? "#fbbf24" // yellow
      : "#ef4444"; // red

  const frameTimeColor =
    stats.frameTime <= 33.33
      ? "#4ade80" // green
      : stats.frameTime <= 50
      ? "#fbbf24" // yellow
      : "#ef4444"; // red

  return (
    <div
      style={{
        position: "fixed",
        ...positionStyles[position],
        background: "rgba(0, 0, 0, 0.85)",
        color: "#fff",
        padding: "12px 16px",
        borderRadius: "8px",
        fontFamily: "monospace",
        fontSize: "12px",
        lineHeight: "1.6",
        zIndex: 100000,
        pointerEvents: "none",
        userSelect: "none",
        minWidth: "200px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "14px" }}>
        Performance Stats
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>FPS:</span>
        <span style={{ color: fpsColor, fontWeight: "bold" }}>{stats.fps}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Frame Time:</span>
        <span style={{ color: frameTimeColor }}>
          {stats.frameTime.toFixed(2)}ms
        </span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Avg:</span>
        <span>{stats.avgFrameTime.toFixed(2)}ms</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Min:</span>
        <span style={{ color: "#4ade80" }}>
          {stats.minFrameTime === Infinity ? "-" : stats.minFrameTime.toFixed(2)}ms
        </span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Max:</span>
        <span style={{ color: "#ef4444" }}>{stats.maxFrameTime.toFixed(2)}ms</span>
      </div>
      <div
        style={{
          marginTop: "8px",
          paddingTop: "8px",
          borderTop: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Frames:</span>
          <span>{stats.frameCount.toLocaleString()}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Dropped:</span>
          <span style={{ color: stats.droppedFrames > 0 ? "#ef4444" : "#4ade80" }}>
            {stats.droppedFrames}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Drop Rate:</span>
          <span>
            {stats.frameCount > 0
              ? ((stats.droppedFrames / stats.frameCount) * 100).toFixed(1)
              : "0"}
            %
          </span>
        </div>
      </div>
    </div>
  );
}

