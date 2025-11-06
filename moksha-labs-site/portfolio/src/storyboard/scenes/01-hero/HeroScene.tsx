/**
 * Scene 1: Hero
 *
 * FIXED: Content always visible, simple animations
 */

"use client";

import { useEffect, useRef } from "react";
import { useScene } from "../../hooks/useScene";
import { heroSceneConfig } from "./HeroScene.config";
import LotusFlower from "@/components/ui/LotusFlower";

export function HeroScene() {
  const { sceneRef, progress } = useScene(heroSceneConfig);
  const lotusProgressRef = useRef(0);
  const gradientProgress = progress * 200;
  const timelineRef = useRef<GSAPTimeline | null>(null);

  useEffect(() => {
    gsap.killTweensOf(".lotus-flower-container");
    // when we reach 0.5 we want to animate the lotus flower to sway side to side
    timelineRef.current = gsap.timeline({
      paused: true,
      repeat: -1,
      yoyo: true,
    });
    timelineRef.current.fromTo(
      ".lotus-flower-container",
      {
        rotation: -2.5,
      },
      {
        rotation: 2.5,
        duration: 0.5,
        ease: "power1.inOut",
      }
    );
    timelineRef.current?.progress(0.5);
    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  useEffect(() => {
    if (progress < 0.25) {
      lotusProgressRef.current = progress / 0.25;
    }
    if (progress > 0.25 && progress < 0.5) {
      //lotus should be reversed so that 0.5 === 0 and 0.25 === 1
      lotusProgressRef.current = 1 - (progress - 0.25) / 0.25;
    }
    if (progress > 0.5) {
      timelineRef.current?.play();
    } else {
      timelineRef.current?.restart();
      timelineRef.current?.progress(0.5);
      timelineRef.current?.pause();
    }
  }, [progress]);

  return (
    <section
      ref={sceneRef}
      id={heroSceneConfig.id}
      data-scene={heroSceneConfig.id}
      style={{ transform: "none !important" }}
      className="relative h-screen overflow-hidden"
    >
      <div
        className="absolute inset-0 w-full h-full flex items-center justify-center"
        style={{
          background: `linear-gradient(${gradientProgress}deg, var(--brand-teal-dark) 0%, var(--brand-teal) 25%, var(--brand-saffron-dark) 50%, var(--brand-teal) 75%, var(--brand-teal-dark) 100%)`,
        }}
      ></div>
      <LotusFlower progress={lotusProgressRef.current} withTitle />
    </section>
  );
}
