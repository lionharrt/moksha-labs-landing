import { useEffect } from "react";
import { gsap } from "gsap";

/**
 * Custom hook to smoothly link a calculated progress value (0-1)
 * to a GSAP timeline, using a short tween for interpolation.
 * * @param {GSAPTimeline | null} timeline The GSAP timeline reference.
 * @param {number | null} segmentProgress The calculated local progress (0-1) or null if inactive.
 * @param {number} [duration=0.2] The time (in seconds) taken to catch up (smoothness).
 */
export function useSmoothProgress(
  timeline: GSAPTimeline | null,
  segmentProgress: number | null,
  duration = 0.2
) {
  useEffect(() => {
    if (!timeline) return;

    // 2. Smoothing Tween (The Jitter Fix)
    // We animate the timeline's 'progress' property to the target value
    gsap.to(timeline, {
      duration: duration,
      ease: "power2.out",
      progress: segmentProgress || 0, // Target the new progress value
      overwrite: true, // Crucial: ensures only the latest scroll update is running
    });
  }, [timeline, segmentProgress, duration]);
}
