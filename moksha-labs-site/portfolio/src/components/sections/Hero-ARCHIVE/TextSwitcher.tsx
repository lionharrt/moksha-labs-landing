/**
 * Text Switcher - Selects text animation variant
 * 
 * Add new text animation systems here
 */

'use client';

import { RefObject } from 'react';
import { useStore } from '@/stores/useStore';
import { DefaultText, EnhancedText } from './text-animations';

interface TextSwitcherProps {
  titleRef: RefObject<HTMLHeadingElement>;
  subtitleRef: RefObject<HTMLParagraphElement>;
  animationProgress: number; // 0-1 progress for text phase (70-100% of hero scroll)
}

export type TextAnimationMode = 
  | 'default'   // Simple fade in/out
  | 'enhanced'; // Character-by-character with blur

export function TextSwitcher({ titleRef, subtitleRef, animationProgress }: TextSwitcherProps) {
  const textAnimationMode = useStore((state) => state.textAnimationMode);

  switch (textAnimationMode) {
    case 'default':
      return <DefaultText titleRef={titleRef} subtitleRef={subtitleRef} animationProgress={animationProgress} />;
    case 'enhanced':
      return <EnhancedText titleRef={titleRef} subtitleRef={subtitleRef} animationProgress={animationProgress} />;
    default:
      return <DefaultText titleRef={titleRef} subtitleRef={subtitleRef} animationProgress={animationProgress} />;
  }
}

