/**
 * Scene 5: Contact Us
 *
 * Sea floor scene with contact information
 * Deepest part of underwater gradient - sea floor
 */

import { SceneConfig } from "../../types/Scene.types";

export const contactUsSceneConfig: SceneConfig = {
  id: "contact-us",
  name: "Contact Us",
  order: 5,
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
    description: "Contact Us section at the sea floor with contact information",
    tags: ["contact-us", "contact"],
  },
};
