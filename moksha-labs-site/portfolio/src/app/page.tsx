'use client';

import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Navigation } from "@/components/ui/Navigation";
import { DevToolbar } from "@/components/dev/DevToolbar";
import { StoryboardProvider } from "@/storyboard/context/StoryboardContext";

// Scene imports
import { HeroScene } from "@/storyboard/scenes/01-hero/HeroScene";
import { heroSceneConfig } from "@/storyboard/scenes/01-hero/HeroScene.config";

import { PhilosophyScene } from "@/storyboard/scenes/02-philosophy/PhilosophyScene";
import { philosophySceneConfig } from "@/storyboard/scenes/02-philosophy/PhilosophyScene.config";

import { ServicesScene } from "@/storyboard/scenes/03-services/ServicesScene";
import { servicesSceneConfig } from "@/storyboard/scenes/03-services/ServicesScene.config";

import { WorkScene } from "@/storyboard/scenes/04-work-1/WorkScene";
import { workScene1Config, workScene2Config, workScene3Config } from "@/storyboard/scenes/04-work-1/WorkScene.config";

import { TeamScene } from "@/storyboard/scenes/07-team/TeamScene";
import { teamSceneConfig } from "@/storyboard/scenes/07-team/TeamScene.config";

import { ContactScene } from "@/storyboard/scenes/08-contact/ContactScene";
import { contactSceneConfig } from "@/storyboard/scenes/08-contact/ContactScene.config";

// Work project data
const workProjects = [
  {
    title: 'Zenith Digital',
    subtitle: 'E-commerce Reimagined',
    description: 'A complete digital transformation for a luxury fashion brand, combining elegant design with powerful e-commerce functionality. Built with Next.js and headless CMS for maximum flexibility.',
    tags: ['E-commerce', 'Next.js', 'Design System'],
    year: '2024',
    imagePosition: 'left' as const,
  },
  {
    title: 'Aurora Studios',
    subtitle: 'Interactive Portfolio',
    description: 'An immersive 3D portfolio showcasing architectural visualizations. Built with React Three Fiber and custom shaders for stunning visual effects.',
    tags: ['WebGL', 'React Three Fiber', '3D'],
    year: '2024',
    imagePosition: 'right' as const,
    bgColor: 'bg-teal-50',
  },
  {
    title: 'Mindful Tech',
    subtitle: 'Wellness Platform',
    description: 'A meditation and wellness app focused on accessibility and user experience. Features include guided sessions, progress tracking, and community features.',
    tags: ['React Native', 'UX Design', 'Wellness'],
    year: '2023',
    imagePosition: 'left' as const,
  },
];

export default function Home() {
  return (
    <StoryboardProvider 
      config={{
        scenes: [
          heroSceneConfig,
          philosophySceneConfig,
          servicesSceneConfig,
          workScene1Config,
          workScene2Config,
          workScene3Config,
          teamSceneConfig,
          contactSceneConfig,
        ],
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
          <PhilosophyScene />
          <ServicesScene />
          <WorkScene config={workScene1Config} project={workProjects[0]} />
          <WorkScene config={workScene2Config} project={workProjects[1]} />
          <WorkScene config={workScene3Config} project={workProjects[2]} />
          <TeamScene />
          <ContactScene />
        </div>
      </main>
    </StoryboardProvider>
  );
}
