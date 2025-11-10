"use client";

import SVGWorkspace from "./components/SVGWorkspace";
import { useScrollProgress } from "./hooks/useScrollProgress";

export default function Home() {
  const scrollProgress = useScrollProgress();

  return (
    <main
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      <div style={{ pointerEvents: "auto" }}>
        {/* Scroll progress indicator */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "4px",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: `${scrollProgress * 100}%`,
              height: "100%",
              backgroundColor: "#0070f3",
              transition: "width 0.1s ease",
            }}
          />
        </div>

        {/* Scroll progress value display */}
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "10px 15px",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "#fff",
            borderRadius: "8px",
            fontFamily: "monospace",
            fontSize: "14px",
            zIndex: 1000,
          }}
        >
          Scroll: {(scrollProgress * 100).toFixed(1)}%
        </div>

        <SVGWorkspace scrollProgress={scrollProgress} />
      </div>
    </main>
  );
}
