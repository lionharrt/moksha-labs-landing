'use client';

import { Hero } from "@/components/sections/Hero/Hero";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Navigation } from "@/components/ui/Navigation";
import { DevToolbar } from "@/components/dev/DevToolbar";
import { StoryboardProvider } from "@/storyboard/context/StoryboardContext";
import { petalTestConfig } from "@/storyboard/scenes/01-petal-test/PetalTestScene.config";
import { 
  seedPodArrivalConfig,
  petalUnfurlingConfig,
  fullBloomConfig,
  finalStateConfig 
} from "@/storyboard/scenes/_placeholder/PlaceholderScene.config";
import { PlaceholderScene } from "@/storyboard/scenes/_placeholder/PlaceholderScene";

export default function Home() {
  return (
    <StoryboardProvider 
      config={{
        scenes: [
          petalTestConfig,
          seedPodArrivalConfig,
          petalUnfurlingConfig,
          fullBloomConfig,
          finalStateConfig,
        ],
        debug: true, // Enable debug mode
      }}
    >
      <main className="min-h-screen bg-background">
        {/* Scroll Progress Indicator */}
        <ScrollProgress />
        
        {/* Navigation */}
        <Navigation />
        
        {/* Dev Toolbar */}
        <DevToolbar />
        
      {/* Scrolling Content */}
      <div className="relative">
        {/* Scene 1 - PETAL TEST */}
        <Hero />
        
        {/* Scene 2 - PLACEHOLDER */}
        <PlaceholderScene 
          config={seedPodArrivalConfig}
          bgColor="#0d3838"
          textColor="#e89f4c"
        />
        
        {/* Scene 3 - PLACEHOLDER */}
        <PlaceholderScene 
          config={petalUnfurlingConfig}
          bgColor="#1a4d4d"
          textColor="#f2b56a"
        />
        
        {/* Scene 4 - PLACEHOLDER */}
        <PlaceholderScene 
          config={fullBloomConfig}
          bgColor="#2d6363"
          textColor="#e89f4c"
        />
        
        {/* Scene 5 - PLACEHOLDER */}
        <PlaceholderScene 
          config={finalStateConfig}
          bgColor="#0d3838"
          textColor="#ffffff"
        />
      </div>
      </main>
    </StoryboardProvider>
  );
}
