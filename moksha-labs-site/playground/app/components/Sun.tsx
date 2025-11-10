"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
// Function to create a ray path that extends radially outward
function createRayPath(
  centerX: number,
  centerY: number,
  sunRadius: number,
  rayLength: number,
  rayWidth: number,
  angle: number
): string {
  // Convert angle to radians
  const rad = (angle * Math.PI) / 180;

  // Start point on the sun's edge
  const startX = centerX + Math.cos(rad) * sunRadius;
  const startY = centerY + Math.sin(rad) * sunRadius;

  // End point (tip of ray)
  const endX = centerX + Math.cos(rad) * (sunRadius + rayLength);
  const endY = centerY + Math.sin(rad) * (sunRadius + rayLength);

  // Perpendicular direction (for width)
  const perpX = -Math.sin(rad);
  const perpY = Math.cos(rad);

  // Base width points (wider at the base)
  const baseWidth = rayWidth;
  const baseLeftX = startX + (perpX * baseWidth) / 2;
  const baseLeftY = startY + (perpY * baseWidth) / 2;
  const baseRightX = startX - (perpX * baseWidth) / 2;
  const baseRightY = startY - (perpY * baseWidth) / 2;

  // Create a scimitar-like curve: one edge sweeps outward, the other curves inward by the same amount
  // Symmetric crescent blade shape

  // Leading edge (scimitar curve) - sweeps outward dramatically
  const curveDistance1 = rayLength * 0.4;
  const curveX1 = startX + Math.cos(rad) * curveDistance1;
  const curveY1 = startY + Math.sin(rad) * curveDistance1;
  // Sweep outward significantly for the scimitar effect
  const curveOffset1 = rayWidth * 2; // Much wider sweep
  const curveLeftX = curveX1 + perpX * curveOffset1;
  const curveLeftY = curveY1 + perpY * curveOffset1;

  // Second control point for leading edge - continues the sweep
  const curveDistance2 = rayLength * 0.5;
  const curveX2 = startX + Math.cos(rad) * curveDistance2;
  const curveY2 = startY + Math.sin(rad) * curveDistance2;
  const curveOffset2 = rayWidth * 0.1;
  const curveLeftX2 = curveX2 + perpX * curveOffset2;
  const curveLeftY2 = curveY2 + perpY * curveOffset2;

  // Trailing edge - curves inward by the same amount as leading edge curves outward
  const curveRightX = curveX1 + perpX; // Same amount, opposite direction
  const curveRightY = curveY1 + perpY;
  const curveRightX2 = curveX2 + perpX; // Same amount, opposite direction
  const curveRightY2 = curveY2 + perpY;

  // Create scimitar path: leading edge sweeps outward, trailing edge curves inward by equal amount
  return `
    M ${baseLeftX} ${baseLeftY}
    C ${curveLeftX} ${curveLeftY}, ${curveLeftX2} ${curveLeftY2}, ${endX} ${endY}
    C ${curveRightX2} ${curveRightY2}, ${curveRightX} ${curveRightY}, ${baseRightX} ${baseRightY}
    Z
  `;
}

interface SunProps {
  centerX: number;
  centerY: number;
  sunRadius?: number;
  rayLength?: number;
  rayWidth?: number;
  numRays?: number;
}

export default function Sun({
  centerX,
  centerY,
  sunRadius = 45,
  rayLength = 80,
  rayWidth = 20,
  numRays = 16,
}: SunProps) {
  const groupRef = useRef<SVGSVGElement>(null);
  const timeline = useRef<GSAPTimeline | null>(null);
  const gradientId = `rayGradient-${centerX}-${centerY}`;
  const sunGradientId = `sunGradient-${centerX}-${centerY}`;

  useLayoutEffect(() => {
    if (!groupRef.current) return;

    // Clean up previous timeline
    if (timeline.current) {
      timeline.current.kill();
    }

    // Create scoped selectors within this group
    const group = groupRef.current;
    const sunCircle = group.querySelector(
      `.sun-circle-${centerX}-${centerY}`
    ) as SVGCircleElement;
    const sunRayGroups = Array.from(
      { length: numRays },
      (_, i) =>
        group.querySelector(
          `.sun-ray-group-${i}-${centerX}-${centerY}`
        ) as SVGGElement
    );

    // Get gradient stops for pulsing animation
    const gradientStops = [
      group.querySelector(
        `#${sunGradientId} stop:nth-child(1)`
      ) as SVGStopElement,
      group.querySelector(
        `#${sunGradientId} stop:nth-child(2)`
      ) as SVGStopElement,
      group.querySelector(
        `#${sunGradientId} stop:nth-child(3)`
      ) as SVGStopElement,
    ];

    if (
      !sunCircle ||
      sunRayGroups.length === 0 ||
      gradientStops.some((stop) => !stop)
    )
      return;

    // Create new timeline for continuous rotation
    timeline.current = gsap.timeline({
      repeat: -1, // Infinite loop
    });

    // Animate rays rotation - all rays spin together around the sun continuously
    sunRayGroups.forEach((rayGroup, i) => {
      if (rayGroup) {
        // Use svgOrigin for SVG elements - this uses SVG coordinate space
        // Set the rotation origin to the center of the sun
        gsap.set(rayGroup, {
          svgOrigin: `${centerX} ${centerY}`,
        });

        // Rotate all ray groups together - continuous 360 degree rotation
        // Use ease: "none" for constant speed rotation
        timeline.current?.to(
          rayGroup,
          {
            rotation: 360, // Full rotation
            duration: 50,
            ease: "none", // Constant speed for smooth continuous rotation
            svgOrigin: `${centerX} ${centerY}`, // Ensure origin is set during animation too
          },
          0 // All start at the same time
        );
      }
    });

    // Animate gradient stop offsets to create pulsing effect
    // Expanding the bright center area makes it appear to grow
    timeline.current
      ?.to(
        gradientStops[1],
        {
          attr: { offset: "70%" }, // Expand bright center outward
          duration: 2,
          ease: "sine.inOut",
        },
        0
      )
      .to(
        gradientStops[1],
        {
          attr: { offset: "50%" }, // Contract back to original
          duration: 2,
          ease: "sine.inOut",
        },
        2
      );

    // Cleanup function
    return () => {
      if (timeline.current) {
        timeline.current.kill();
        timeline.current = null;
      }
    };
  }, [centerX, centerY, sunRadius, numRays]);

  // Generate rays evenly spaced around the sun
  const rays = Array.from({ length: numRays }, (_, i) => {
    const angle = (360 / numRays) * i;
    return {
      angle,
      path: createRayPath(
        centerX,
        centerY,
        sunRadius,
        rayLength,
        rayWidth,
        angle
      ),
    };
  });

  // Calculate viewBox to fit sun and rays
  const padding = rayLength + sunRadius + 20; // Extra padding for rays
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
        backgroundColor: "deepskyblue",
      }}
    >
      <defs>
        {/* Gradient for rays: orange at base to yellow at tip */}
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff6b35" stopOpacity="1" />
          <stop offset="50%" stopColor="#ff8c42" stopOpacity="1" />
          <stop offset="100%" stopColor="#ffd23f" stopOpacity="1" />
        </linearGradient>
        {/* Radial gradient for sun circle: lighter in center, darker at edges for rounded effect */}
        <radialGradient id={sunGradientId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd23f" stopOpacity="1" />
          <stop offset="50%" stopColor="#ff8c42" stopOpacity="1" />
          <stop offset="100%" stopColor="#ff6b35" stopOpacity="1" />
        </radialGradient>
      </defs>

      {/* Render rays - each wrapped in a group for rotation */}
      {rays.map((ray, i) => (
        <g key={i} className={`sun-ray-group-${i}-${centerX}-${centerY}`}>
          <path
            d={ray.path}
            fill={`url(#${gradientId})`}
            stroke="#fff"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </g>
      ))}

      {/* Sun circle */}
      <circle
        className={`sun-circle-${centerX}-${centerY}`}
        cx={centerX}
        cy={centerY}
        r={sunRadius}
        fill={`url(#${sunGradientId})`}
        stroke="#fff"
        strokeWidth="1.5"
      />
    </svg>
  );
}
