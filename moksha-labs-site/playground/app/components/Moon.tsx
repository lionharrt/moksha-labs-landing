"use client";

import { useLayoutEffect, useRef, useEffect } from "react";
import { useSmoothProgress } from "../hooks/useSmoothProgress";
import { gsap } from "gsap";

interface MoonProps {
  centerX: number;
  centerY: number;
  radius?: number;
  progress: number;
}

export default function Moon({
  centerX,
  centerY,
  radius = 50,
  progress,
}: MoonProps) {
  const groupRef = useRef<SVGSVGElement>(null);
  const timeline = useRef<GSAPTimeline | null>(null);
  const maskId = `moon-mask-${centerX}-${centerY}`;
  const gradientId = `moonGradient-${centerX}-${centerY}`;
  const shadowCircleId = `moon-shadow-${centerX}-${centerY}`;
  const earthShadowId = `earth-shadow-${centerX}-${centerY}`;
  const moonCircleId = `moon-circle-${centerX}-${centerY}`;
  const glowFilterId = `moon-glow-filter-${centerX}-${centerY}`;

  useLayoutEffect(() => {
    if (!groupRef.current) return;

    // Clean up previous timeline
    if (timeline.current) {
      timeline.current.kill();
    }

    const group = groupRef.current;
    const shadowCircle = group.querySelector(
      `#${shadowCircleId}`
    ) as SVGCircleElement;
    const earthShadow = group.querySelector(
      `#${earthShadowId}`
    ) as SVGCircleElement;
    const moonCircle = group.querySelector(
      `#${moonCircleId}`
    ) as SVGCircleElement;

    // Get gradient stop elements for color animation
    const gradient = group.querySelector(
      `#${gradientId}`
    ) as SVGLinearGradientElement;
    const stop0 = gradient?.querySelector(
      'stop[offset="0%"]'
    ) as SVGStopElement;
    const stopMiddle = gradient?.querySelector(
      'stop[offset="50%"]'
    ) as SVGStopElement;
    const stop1 = gradient?.querySelector(
      'stop[offset="100%"]'
    ) as SVGStopElement;

    // Get glow filter elements for animation
    const glowFilter = group.querySelector(
      `#${glowFilterId}`
    ) as SVGFilterElement;
    const glowBlur = glowFilter?.querySelector(
      "feGaussianBlur"
    ) as SVGFEGaussianBlurElement;

    if (
      !shadowCircle ||
      !earthShadow ||
      !moonCircle ||
      !gradient ||
      !stop0 ||
      !stop1 ||
      !stopMiddle ||
      !glowFilter ||
      !glowBlur
    )
      return;

    // Create timeline for moon phases
    // Using progress-based positioning: position values 0-1 map to scroll progress 0-1
    timeline.current = gsap.timeline({
      paused: true,
    });

    // Moon phases cycle through scroll progress:
    // Progress 0.0 = Full Moon (moon fully visible)
    // Progress 0.25-0.75 = LUNAR ECLIPSE (Earth's shadow approaches moon center, moon turns red)
    // Progress 0.5 = Peak eclipse (Earth shadow center aligns with moon center)
    // Progress 1.0 = Full Moon (moon fully visible again)

    // Set initial states - start at Full Moon
    gsap.set(shadowCircle, {
      attr: {
        cx: centerX - radius * 2.5, // Full Moon position (shadow far left = moon fully visible)
      },
    });
    gsap.set(earthShadow, {
      attr: {
        cx: centerX - radius * 2.5, // Start far left (before eclipse)
        cy: centerY,
      },
    });
    // Set initial gradient colors (normal moon: light gray to white)
    // Use attr with hyphenated 'stop-color' property name
    gsap.set(stop0, {
      attr: { "stop-color": "#e8e8e8" },
    });
    gsap.set(stopMiddle, {
      attr: { "stop-color": "#e8e8e8" },
    });
    gsap.set(stop1, {
      attr: { "stop-color": "#ffffff" },
    });

    // Set initial glow filter state (invisible before eclipse - no blur)
    gsap.set(glowBlur, {
      attr: { stdDeviation: "0" },
    });

    // Keep shadowCircle at Full Moon position throughout (no phase changes)
    // The moon stays at Full Moon, only the Earth's shadow moves for the eclipse

    // Phase 1: Full Moon (0-0.25 of timeline) - Earth shadow stays far left
    // No animation needed, already set

    // Phase 2: LUNAR ECLIPSE (progress 0.25-0.75)
    // Earth's shadow moves smoothly from far left, through center (peak at 0.5), to far right
    // One continuous animation for smooth motion without stopping points
    timeline.current.to(
      earthShadow,
      {
        attr: {
          cx: centerX + radius * 3, // Shadow moves all the way to far right
          cy: centerY,
        },
        duration: 1, // Single smooth animation from 0.25 to 0.75 (entire eclipse duration)
        ease: "sine.inOut", // Smooth easing throughout
      },
      0.1 // Start at progress 0.25
    );

    // Animate gradient colors to red during eclipse (smooth transition)
    // Colors gradually turn red from 0.25 to 0.5 (peak eclipse)
    timeline.current.to(
      stop0,
      {
        attr: { "stop-color": "#8B0000" }, // Dark red
        duration: 0.25, // From 0.25 to 0.5 (peak eclipse)
        ease: "power2.inOut",
      },
      0.25 // Start at progress 0.25
    );

    timeline.current.to(
      stopMiddle,
      {
        attr: { "stop-color": "#B22222" }, // Medium red
        duration: 0.25, // From 0.25 to 0.5 (peak eclipse)
        ease: "power2.inOut",
      },
      0.25 // Start at progress 0.25
    );

    timeline.current.to(
      stop1,
      {
        attr: { "stop-color": "#4B0000" }, // Very dark red
        duration: 0.25, // From 0.25 to 0.5 (peak eclipse)
        ease: "power2.inOut",
      },
      0.25 // Start at progress 0.25
    );

    // Animate red glow to appear during eclipse
    timeline.current.to(
      glowBlur,
      {
        attr: { stdDeviation: "12" }, // Blur amount for red glow effect
        duration: 0.25, // From 0.25 to 0.5 (peak eclipse)
        ease: "power2.inOut",
      },
      0.25 // Start at progress 0.25
    );

    // Animate gradient colors back to normal moon colors after peak eclipse
    // Colors gradually return from 0.5 to 0.75
    timeline.current.to(
      stop0,
      {
        attr: { "stop-color": "#e8e8e8" }, // Light gray
        duration: 0.25, // From 0.5 to 0.75
        ease: "power2.inOut",
      },
      0.5 // Start at progress 0.5 (peak eclipse, start returning)
    );

    timeline.current.to(
      stopMiddle,
      {
        attr: { "stop-color": "#e8e8e8" }, // Light gray
        duration: 0.25, // From 0.5 to 0.75
        ease: "power2.inOut",
      },
      0.5 // Start at progress 0.5
    );

    timeline.current.to(
      stop1,
      {
        attr: { "stop-color": "#ffffff" }, // White
        duration: 0.25, // From 0.5 to 0.75
        ease: "power2.inOut",
      },
      0.5 // Start at progress 0.5
    );

    // Animate red glow to fade out after peak eclipse
    timeline.current.to(
      glowBlur,
      {
        attr: { stdDeviation: "0" }, // Reduce blur to fade out glow
        duration: 0.25, // From 0.5 to 0.75
        ease: "power2.inOut",
      },
      0.5 // Start at progress 0.5
    );

    // Ensure timeline ends at time 1.0 so progress values map correctly
    // Add a dummy animation that extends to 1.0 (or use the last animation's end time)
    // The timeline will naturally end around 0.75, so we add padding to reach 1.0
    timeline.current.to(
      {},
      {
        duration: 0.25, // Padding to reach time 1.0
      },
      0.75 // Start after eclipse ends
    );

    // Cleanup
    return () => {
      if (timeline.current) {
        timeline.current.kill();
        timeline.current = null;
      }
    };
  }, [
    centerX,
    centerY,
    radius,
    shadowCircleId,
    earthShadowId,
    moonCircleId,
    gradientId,
    maskId,
    glowFilterId,
  ]);

  // Map scroll progress (0-1) to moon phase timeline progress
  // Progress 0 = Full Moon, 0.5 = Eclipse (peak), 1.0 = Full Moon again
  useSmoothProgress(timeline.current, progress);

  // Calculate viewBox to fit moon and Earth shadow movement
  const padding = radius * 4; // Enough space for Earth shadow movement
  const viewBoxX = centerX - padding;
  const viewBoxY = centerY - padding;
  const viewBoxWidth = padding * 2;
  const viewBoxHeight = padding * 2;

  return (
    <svg
      ref={groupRef}
      width="400"
      height="400"
      viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        border: "1px solid #ccc",
        backgroundColor: "black",
      }}
    >
      <defs>
        {/* Moon gradient: colors will be animated smoothly */}
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8e8e8" stopOpacity="1" />
          <stop offset="50%" stopColor="#e8e8e8" stopOpacity="1" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
        </linearGradient>

        {/* Red glow filter for eclipse effect */}
        <filter
          id={glowFilterId}
          x="-100%"
          y="-100%"
          width="300%"
          height="300%"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="0" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="0 0 0 0 0.698
                    0 0 0 0 0.133
                    0 0 0 0 0.133
                    0 0 0 1 0"
            result="redBlur"
          />
          <feMerge>
            <feMergeNode in="redBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Mask to create moon phases + Earth's shadow */}
        <mask id={maskId}>
          <rect
            x={viewBoxX}
            y={viewBoxY}
            width={viewBoxWidth}
            height={viewBoxHeight}
            fill="white"
          />
          {/* Phase shadow circle (for moon phases) - stays at Full Moon position */}
          <circle
            id={shadowCircleId}
            cx={centerX - radius * 2.5} // Full Moon position (shadow far left = moon fully visible)
            cy={centerY}
            r={radius}
            fill="black"
          />
          {/* Earth's shadow circle (for lunar eclipse) */}
          <circle
            id={earthShadowId}
            cx={centerX - radius * 2.5} // Start far left
            cy={centerY}
            r={radius}
            fill="black"
          />
        </mask>
      </defs>

      {/* Main moon circle with mask applied */}
      <circle
        id={moonCircleId}
        cx={centerX}
        cy={centerY}
        r={radius + 2}
        fill={`url(#${gradientId})`}
        strokeWidth="2"
        mask={`url(#${maskId})`}
        filter={`url(#${glowFilterId})`}
      />
    </svg>
  );
}
