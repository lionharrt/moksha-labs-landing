"use client";

import React, { createContext, useContext, useRef, ReactNode } from "react";
import { IntroState } from "@/hooks/useIntroController";

interface IntroContextType {
  introStateRef: React.MutableRefObject<IntroState | null>;
  introProgressRef: React.MutableRefObject<number>;
}

const IntroContext = createContext<IntroContextType | null>(null);

export function IntroProvider({ children }: { children: ReactNode }) {
  // Create refs that will be shared across all contexts and scenes
  const introStateRef = useRef<IntroState | null>(null);
  const introProgressRef = useRef(0);

  return (
    <IntroContext.Provider
      value={{
        introStateRef,
        introProgressRef,
      }}
    >
      {children}
    </IntroContext.Provider>
  );
}

export function useIntroContext() {
  const context = useContext(IntroContext);
  if (!context) {
    throw new Error("useIntroContext must be used within IntroProvider");
  }
  return context;
}

