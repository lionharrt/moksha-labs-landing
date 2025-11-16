/**
 * Scene 3: Our Work
 *
 * Deeper underwater scene showcasing portfolio
 * Continued underwater gradient with work examples
 */

import { SceneConfig } from "../../types/Scene.types";

export const ourWorkSceneConfig: SceneConfig = {
  id: "our-work",
  name: "Our Work",
  order: 3,
  duration: "+=500vh", // Pin for 1 extra screen

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
    description: "Our Work section showcasing portfolio with underwater theme",
    tags: ["our-work", "portfolio"],
  },
};
