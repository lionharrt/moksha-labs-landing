/**
 * Scene 2: About Us
 *
 * Underwater scene with bubbles and gradient
 * Transitions from water surface to deeper depths
 */

import { SceneConfig } from "../../types/Scene.types";

export const aboutUsSceneConfig: SceneConfig = {
  id: "about-us",
  name: "About Us",
  order: 2,
  duration: "+=100vh", // Pin for 1 extra screen

  phases: {
    intro: {
      start: 0,
      end: 0.4,
      ease: "power2.out",
    },
    hold: {
      start: 0.4,
      end: 0.6,
      ease: "none",
    },
    outro: {
      start: 0.6,
      end: 1.0,
      ease: "power2.in",
    },
  },

  elements: [],
  effects: [],

  pin: true,
  scrub: 1,

  metadata: {
    description: "About Us section with brand introduction",
    tags: ["about-us"],
  },
};
