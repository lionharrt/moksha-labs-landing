"use client";

import { memo, useLayoutEffect, useRef } from "react";
import { useSmoothProgress } from "@/storyboard/hooks/useSmoothProgress";
import { gsap } from "gsap";

interface MoonProps {
  centerX: number;
  centerY: number;
  radius?: number;
  progress: number;
  progressRef?: React.MutableRefObject<number>; // Optional ref for smooth RAF updates
}

function Moon({
  centerX,
  centerY,
  radius = 50,
  progress,
  progressRef,
}: MoonProps) {
  const groupRef = useRef<SVGSVGElement>(null);
  const timeline = useRef<GSAPTimeline | null>(null);
  const maskId = `moon-mask-${centerX}-${centerY}`;
  const gradientId = `moonGradient-${centerX}-${centerY}`;
  const shadowCircleId = `moon-shadow-${centerX}-${centerY}`;
  const earthShadowId = `earth-shadow-${centerX}-${centerY}`;
  const moonCircleId = `moon-circle-${centerX}-${centerY}`;
  const glowFilterId = `moon-glow-filter-${centerX}-${centerY}`;
  const rafIdRef = useRef<number | null>(null);

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
    // Progress 0.0 = Full Moon (moon fully visible, shadow far left)
    // Progress 0.25 = First Quarter (half moon, shadow at center from left)
    // Progress 0.5 = New Moon (moon completely dark, shadow covers moon)
    // Progress 0.75 = Last Quarter (half moon, shadow at center from right)
    // Progress 1.0 = Full Moon again (moon fully visible, shadow far left)
    timeline.current = gsap.timeline({
      paused: true,
    });

    // Set initial states - start at Full Moon (shadow far left = moon fully visible)
    gsap.set(shadowCircle, {
      attr: {
        cx: centerX - radius * 2.5, // Full Moon position (shadow far left = moon fully visible)
      },
    });

    // Set initial gradient colors (normal moon: light gray to white)
    gsap.set(stop0, {
      attr: { "stop-color": "#e8e8e8" },
    });
    gsap.set(stopMiddle, {
      attr: { "stop-color": "#e8e8e8" },
    });
    gsap.set(stop1, {
      attr: { "stop-color": "#ffffff" },
    });

    // Set initial glow filter state (no blur)
    gsap.set(glowBlur, {
      attr: { stdDeviation: "0" },
    });

    // Hide earthShadow (we're using shadowCircle for phases now)
    gsap.set(earthShadow, {
      attr: {
        cx: centerX - radius * 2.5,
        cy: centerY,
      },
    });

    // Animate shadow circle to create moon phases
    // Full Moon (0) -> First Quarter (0.25) -> New Moon (0.5) -> Last Quarter (0.75) -> Full Moon (1)
    timeline.current.to(
      shadowCircle,
      {
        attr: {
          cx: centerX, // First Quarter - shadow at center from left
        },
        duration: 0.25,
        ease: "sine.inOut",
      },
      0 // Start at progress 0
    );

    timeline.current.to(
      shadowCircle,
      {
        attr: {
          cx: centerX + radius * 2.5, // New Moon - shadow covers moon (far right)
        },
        duration: 0.25,
        ease: "sine.inOut",
      },
      0.25 // Start at progress 0.25
    );

    timeline.current.to(
      shadowCircle,
      {
        attr: {
          cx: centerX, // Last Quarter - shadow at center from right
        },
        duration: 0.25,
        ease: "sine.inOut",
      },
      0.5 // Start at progress 0.5
    );

    timeline.current.to(
      shadowCircle,
      {
        attr: {
          cx: centerX - radius * 2.5, // Full Moon - shadow far left (moon fully visible)
        },
        duration: 0.25,
        ease: "sine.inOut",
      },
      0.75 // Start at progress 0.75
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

  // CRITICAL: If progressRef is provided, update timeline in RAF loop for smooth updates
  // Otherwise, use useSmoothProgress hook with prop (for backward compatibility)
  useLayoutEffect(() => {
    if (progressRef && timeline.current) {
      let lastProgress = progressRef.current;

      const updateTimeline = () => {
        if (timeline.current && progressRef) {
          const currentProgress = progressRef.current;

          // Only update if progress changed significantly (prevents unnecessary updates)
          if (Math.abs(currentProgress - lastProgress) > 0.0001) {
            // Update timeline progress directly (smooth, no React overhead)
            gsap.to(timeline.current, {
              duration: 0.1, // Very short duration for smooth following
              ease: "power2.out",
              progress: currentProgress,
              overwrite: true,
            });
            lastProgress = currentProgress;
          }
        }
        rafIdRef.current = requestAnimationFrame(updateTimeline);
      };
      rafIdRef.current = requestAnimationFrame(updateTimeline);
      return () => {
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
        }
      };
    }
  }, [progressRef]);

  // Map progress (0-1) to moon phase timeline progress
  // Progress 0 = Full Moon, 0.25 = First Quarter, 0.5 = New Moon, 0.75 = Last Quarter, 1.0 = Full Moon again
  // Only used when progressRef is not provided (backward compatibility)
  useSmoothProgress(
    progressRef ? null : timeline.current, // Pass null when progressRef is provided to disable prop-based updates
    progressRef ? null : progress ?? null
  );

  // Calculate viewBox to fit moon and Earth shadow movement
  const padding = radius * 4; // Enough space for Earth shadow movement
  const viewBoxX = centerX - padding;
  const viewBoxY = centerY - padding;
  const viewBoxWidth = padding * 2;
  const viewBoxHeight = padding * 2;

  return (
    <svg
      ref={groupRef}
      width="300"
      height="300"
      viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`}
      xmlns="http://www.w3.org/2000/svg"
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
          {/* Phase shadow circle (for moon phases) - animates to create different phases */}
          <circle
            id={shadowCircleId}
            cx={centerX - radius * 2.5} // Full Moon position (shadow far left = moon fully visible)
            cy={centerY}
            r={radius}
            fill="black"
          />
          {/* Earth's shadow circle (hidden, not used for phases) */}
          <circle
            id={earthShadowId}
            cx={centerX - radius * 2.5}
            cy={centerY}
            r={radius}
            fill="black"
            opacity="0"
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

// CRITICAL: Memoize to prevent re-renders when parent re-renders
// Only re-render when progress actually changes (which is throttled)
export default memo(Moon);
