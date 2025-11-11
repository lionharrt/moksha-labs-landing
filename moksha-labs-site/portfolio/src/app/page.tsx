"use client";

import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Navigation } from "@/components/ui/Navigation";
import { DevToolbar } from "@/components/dev/DevToolbar";
import { StoryboardProvider } from "@/storyboard/context/StoryboardContext";

// Scene imports
import { HeroScene } from "@/storyboard/scenes/01-hero/HeroScene";
import { heroSceneConfig } from "@/storyboard/scenes/01-hero/HeroScene.config";

export default function Home() {
  return (
    <StoryboardProvider
      config={{
        scenes: [heroSceneConfig],
        debug: true,
      }}
    >
      <main className="min-h-screen bg-background">
        {/* UI Components */}
        <ScrollProgress />
        <Navigation />
        <DevToolbar />

        {/* Scenes */}
        <div className="relative">
          <HeroScene />
        </div>
      </main>
    </StoryboardProvider>
  );
}
