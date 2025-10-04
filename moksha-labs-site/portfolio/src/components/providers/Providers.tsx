'use client';

import { ReactNode } from 'react';
import { LenisProvider } from './LenisProvider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <LenisProvider>
      {children}
    </LenisProvider>
  );
}

