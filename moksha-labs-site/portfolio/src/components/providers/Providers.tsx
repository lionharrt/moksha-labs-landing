"use client";

import { ReactNode } from "react";
import { LenisProvider } from "./LenisProvider";
import { LightingProvider } from "@/contexts/LightingContext";
import { IntroProvider } from "@/contexts/IntroContext";

interface ProvidersProps {
  children: ReactNode;
  scrollLocked?: boolean;
}

export function Providers({ children, scrollLocked = false }: ProvidersProps) {
  return (
    <IntroProvider>
      <LightingProvider>
        <LenisProvider scrollLocked={scrollLocked}>{children}</LenisProvider>
      </LightingProvider>
    </IntroProvider>
  );
}
