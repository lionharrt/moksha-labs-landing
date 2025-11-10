"use client";

import MountainBackground from "./MountainBackground";

interface SVGWorkspaceProps {
  scrollProgress: number;
}

export default function SVGWorkspace({ scrollProgress }: SVGWorkspaceProps) {
  return (
    <div
      className="workspace"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        minHeight: "100vh",
        backgroundColor: "black",
        position: "relative",
      }}
    >
      <MountainBackground />
    </div>
  );
}
