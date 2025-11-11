"use client";

import { useState, useRef, useEffect } from "react";

export function DevToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState({
    fps: 0,
    frameTime: 0,
    minFrameTime: Infinity,
    maxFrameTime: 0,
    avgFrameTime: 0,
    frameCount: 0,
    droppedFrames: 0,
  });

  // CRITICAL: Use refs for DOM updates to avoid React reconciliation
  const fpsSpanRef = useRef<HTMLSpanElement>(null);
  const frameTimeSpanRef = useRef<HTMLSpanElement>(null);
  const statsRef = useRef(stats);
  statsRef.current = stats; // Keep ref in sync

  const frameTimesRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef<number | null>(null);
  const frameCountRef = useRef(0);
  const droppedFramesRef = useRef(0);
  const animationFrameRef = useRef<number>();
  const minFrameTimeRef = useRef(Infinity);
  const maxFrameTimeRef = useRef(0);

  useEffect(() => {
    // Reset stats when component mounts
    frameTimesRef.current = [];
    lastFrameTimeRef.current = null;
    frameCountRef.current = 0;
    droppedFramesRef.current = 0;
    minFrameTimeRef.current = Infinity;
    maxFrameTimeRef.current = 0;

    setStats({
      fps: 0,
      frameTime: 0,
      minFrameTime: Infinity,
      maxFrameTime: 0,
      avgFrameTime: 0,
      frameCount: 0,
      droppedFrames: 0,
    });

    const updateStats = () => {
      const now = performance.now();

      // Skip first frame (no previous frame to compare)
      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = now;
        animationFrameRef.current = requestAnimationFrame(updateStats);
        return;
      }

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

        // Update min/max tracking
        if (frameTime < minFrameTimeRef.current) {
          minFrameTimeRef.current = frameTime;
        }
        if (frameTime > maxFrameTimeRef.current) {
          maxFrameTimeRef.current = frameTime;
        }

        // Calculate stats
        const fps = 1000 / frameTime;
        const avgFrameTime =
          frameTimesRef.current.reduce((a, b) => a + b, 0) /
          frameTimesRef.current.length;

        // Count dropped frames (frames that took longer than 33.33ms = <30fps)
        if (frameTime > 33.33) {
          droppedFramesRef.current++;
        }

        const roundedFps = Math.round(fps);
        const roundedFrameTime = Math.round(frameTime * 100) / 100;

        // CRITICAL: Update DOM directly to avoid React reconciliation
        // This prevents hundreds of mutations per second from className/text changes
        if (fpsSpanRef.current) {
          const colorClass =
            roundedFps >= 30
              ? "text-green-400"
              : roundedFps >= 20
              ? "text-yellow-400"
              : "text-red-400";
          const newClassName = `font-mono ${colorClass}`;
          // Only update if changed to avoid unnecessary mutations
          if (fpsSpanRef.current.className !== newClassName) {
            fpsSpanRef.current.className = newClassName;
          }
          const newText = roundedFps.toString();
          if (fpsSpanRef.current.textContent !== newText) {
            fpsSpanRef.current.textContent = newText;
          }
        }

        if (frameTimeSpanRef.current) {
          const colorClass =
            roundedFrameTime <= 33.33
              ? "text-green-400"
              : roundedFrameTime <= 50
              ? "text-yellow-400"
              : "text-red-400";
          const newClassName = `font-mono ${colorClass}`;
          // Only update if changed to avoid unnecessary mutations
          if (frameTimeSpanRef.current.className !== newClassName) {
            frameTimeSpanRef.current.className = newClassName;
          }
          const newText = `${roundedFrameTime.toFixed(2)}ms`;
          if (frameTimeSpanRef.current.textContent !== newText) {
            frameTimeSpanRef.current.textContent = newText;
          }
        }

        // Throttle React state updates to ~10fps (only for other stats that don't change frequently)
        const shouldUpdateState = frameCountRef.current % 6 === 0; // Update every 6 frames (~10fps)
        if (shouldUpdateState) {
          setStats({
            fps: roundedFps,
            frameTime: roundedFrameTime,
            minFrameTime:
              minFrameTimeRef.current === Infinity
                ? 0
                : Math.round(minFrameTimeRef.current * 100) / 100,
            maxFrameTime: Math.round(maxFrameTimeRef.current * 100) / 100,
            avgFrameTime: Math.round(avgFrameTime * 100) / 100,
            frameCount: frameCountRef.current,
            droppedFrames: droppedFramesRef.current,
          });
        }
      }

      animationFrameRef.current = requestAnimationFrame(updateStats);
    };

    animationFrameRef.current = requestAnimationFrame(updateStats);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      // Reset on cleanup
      lastFrameTimeRef.current = null;
    };
  }, []);

  return (
    <>
      {/* Toolbar Panel */}
      <div
        className={`fixed bottom-0 right-0 bg-black/95 text-white transition-transform duration-300 ease-out z-[9999] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          width: "340px",
          maxHeight: "80vh",
          borderTopLeftRadius: "12px",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/20 pb-3">
            <h3 className="text-sm font-bold tracking-wider">DEV TOOLBAR</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Info */}
          <div className="space-y-3">
            <div className="bg-white/5 rounded p-3 text-xs space-y-1">
              <div className="text-brand-saffron font-semibold mb-2">
                Performance Stats
              </div>
              <div className="space-y-1 text-white/60">
                <div className="flex justify-between">
                  <span>FPS:</span>
                  <span ref={fpsSpanRef} className="font-mono text-green-400">
                    {stats.fps}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Frame Time:</span>
                  <span
                    ref={frameTimeSpanRef}
                    className="font-mono text-green-400"
                  >
                    {stats.frameTime.toFixed(2)}ms
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Avg:</span>
                  <span className="font-mono">
                    {stats.avgFrameTime.toFixed(2)}ms
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Min:</span>
                  <span className="font-mono text-green-400">
                    {stats.minFrameTime === Infinity
                      ? "-"
                      : `${stats.minFrameTime.toFixed(2)}ms`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Max:</span>
                  <span className="font-mono text-red-400">
                    {stats.maxFrameTime.toFixed(2)}ms
                  </span>
                </div>
                <div className="pt-2 mt-2 border-t border-white/10 space-y-1">
                  <div className="flex justify-between">
                    <span>Frames:</span>
                    <span className="font-mono">
                      {stats.frameCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dropped:</span>
                    <span
                      className={`font-mono ${
                        stats.droppedFrames > 0
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      {stats.droppedFrames}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Drop Rate:</span>
                    <span className="font-mono">
                      {stats.frameCount > 0
                        ? (
                            (stats.droppedFrames / stats.frameCount) *
                            100
                          ).toFixed(1)
                        : "0"}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Tab */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-0 bg-black/95 text-white px-3 py-2 transition-all duration-300 z-[9998] hover:pr-4 group ${
          isOpen ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
        }`}
        style={{
          borderTopLeftRadius: "6px",
          borderBottomLeftRadius: "6px",
          backdropFilter: "blur(10px)",
          fontSize: "11px",
          fontWeight: "600",
          letterSpacing: "0.05em",
        }}
      >
        <span className="flex items-center gap-2">
          <span>DEV</span>
          <span className="text-white/40 group-hover:text-white/60 transition-colors">
            →
          </span>
        </span>
      </button>
    </>
  );
}
