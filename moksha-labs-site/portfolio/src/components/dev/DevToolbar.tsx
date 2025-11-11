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

  const frameTimesRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef(performance.now());
  const frameCountRef = useRef(0);
  const droppedFramesRef = useRef(0);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
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
                  <span
                    className={`font-mono ${
                      stats.fps >= 30
                        ? "text-green-400"
                        : stats.fps >= 20
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {stats.fps}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Frame Time:</span>
                  <span
                    className={`font-mono ${
                      stats.frameTime <= 33.33
                        ? "text-green-400"
                        : stats.frameTime <= 50
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
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
