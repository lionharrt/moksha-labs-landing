'use client';

import { Hero } from "@/components/sections/Hero/Hero";
import { Services } from "@/components/sections/Services/Services";
import { Work } from "@/components/sections/Work/Work";
import { About } from "@/components/sections/About/About";
import { Contact } from "@/components/sections/Contact/Contact";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Navigation } from "@/components/ui/Navigation";
import { DevToolbar } from "@/components/dev/DevToolbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Scroll Progress Indicator */}
      <ScrollProgress />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Dev Toolbar */}
      <DevToolbar />
      
      {/* Scrolling Content */}
      <div className="relative">
        <Hero />
        <Services />
        <Work />
        <About />
        <Contact />
      </div>
    </main>
  );
}

