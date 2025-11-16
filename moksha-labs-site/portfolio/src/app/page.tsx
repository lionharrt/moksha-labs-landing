"use client";

import { useEffect } from "react";
import type { IntroState } from "@/hooks/useIntroController";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Navigation } from "@/components/ui/Navigation";
import { StoryboardProvider } from "@/storyboard/context/StoryboardContext";
import { Providers } from "@/components/providers/Providers";
import { useIntroController } from "@/hooks/useIntroController";
import { INTRO_CONFIG } from "@/config/intro.config";
import { useIntroContext } from "@/contexts/IntroContext";

// Scene imports
import { HeroScene } from "@/storyboard/scenes/01-hero/HeroScene";
import { heroSceneConfig } from "@/storyboard/scenes/01-hero/HeroScene.config";
import AboutUsScene from "@/storyboard/scenes/02-about-us/AbouUsScene";
import WorkScene from "@/storyboard/scenes/03-our-work/OurWorkScene";
import ServicesScene from "@/storyboard/scenes/04-our-services/OurServicesScene";
import ContactUsScene from "@/storyboard/scenes/05-contact-us/ContactUsScene";

// Memoize storyboard config to prevent re-initialization
const storyboardConfig = {
  scenes: [heroSceneConfig],
  debug: true,
};

function HomeContent({
  introState,
  onIntroComplete,
}: {
  introState: IntroState;
  onIntroComplete: () => void;
}) {
  // Sync intro state to context at the top level (where it's controlled)
  const introContext = useIntroContext();

  useEffect(() => {
    let rafId: number | null = null;

    const syncIntroToContext = () => {
      // Update intro context refs every frame
      introContext.introStateRef.current = introState;
      introContext.introProgressRef.current = introState.progress;

      rafId = requestAnimationFrame(syncIntroToContext);
    };

    rafId = requestAnimationFrame(syncIntroToContext);

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [introState, introContext]);

  return (
    <main className="min-h-screen bg-background">
      {/* UI Components */}
      <ScrollProgress />
      <Navigation />

      {/* Scenes */}
      <div className="relative">
        <HeroScene introState={introState} onIntroComplete={onIntroComplete} />
        <AboutUsScene />
        <WorkScene />
        <ServicesScene />
        <ContactUsScene />
      </div>
    </main>
  );
}

export default function Home() {
  const introController = useIntroController({
    duration: INTRO_CONFIG.duration,
    autoUnlock: INTRO_CONFIG.autoUnlock,
  });

  // Reset scroll position to top on mount/refresh
  useEffect(() => {
    window.scrollTo(0, 0);
    // Also reset browser's scroll restoration
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return (
    <Providers scrollLocked={introController.state.scrollLocked}>
      <StoryboardProvider config={storyboardConfig}>
        <HomeContent
          introState={introController.state}
          onIntroComplete={introController.completeIntro}
        />
      </StoryboardProvider>
    </Providers>
  );
}
