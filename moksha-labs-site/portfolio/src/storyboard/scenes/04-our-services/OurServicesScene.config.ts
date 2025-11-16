/**
 * Scene 4: Our Services
 *
 * Deeper underwater scene showcasing services
 * Continued underwater gradient with service offerings
 */

import { SceneConfig } from "../../types/Scene.types";

export const ourServicesSceneConfig: SceneConfig = {
  id: "our-services",
  name: "Our Services",
  order: 4,
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
    description: "Our Services section with underwater theme",
    tags: ["our-services", "services"],
  },
};
