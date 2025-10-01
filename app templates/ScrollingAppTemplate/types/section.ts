/**
 * Section Types
 */

export type SectionBackground = 'light' | 'dark' | 'gradient' | 'image';
export type SectionOverlay = 'none' | 'light' | 'dark' | 'gradient';
export type SectionLayout = 'center' | 'split' | 'hero' | 'grid' | 'custom';
export type SectionPadding = 'none' | 'small' | 'medium' | 'large';
export type SectionAnimation = 'fade' | 'slide' | 'scale' | 'none';
export type SectionHeight = 'screen' | 'auto' | 'min-screen';

export interface SectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  background?: SectionBackground;
  backgroundImage?: string;
  overlay?: SectionOverlay;
  layout?: SectionLayout;
  padding?: SectionPadding;
  animation?: SectionAnimation;
  height?: SectionHeight;
}
