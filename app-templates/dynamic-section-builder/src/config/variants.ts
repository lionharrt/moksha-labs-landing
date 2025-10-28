/**
 * Theme and Section Variant Configuration
 * 
 * This file defines all available themes and section variants for client preview.
 * When final selections are made, use REMOVAL_GUIDE.md to apply and clean up.
 */

export interface ThemeVariant {
  id: number;
  name: string;
  colors: {
    primary: Record<number, string>;
    secondary: Record<number, string>;
    accent: Record<number, string>;
  };
}

export const THEME_VARIANTS: Record<number, ThemeVariant> = {
  1: {
    id: 1,
    name: 'Warm Orange',
    colors: {
      primary: {
        50: '#ECFDF5',
        100: '#D1FAE5',
        200: '#A7F3D0',
        300: '#6EE7B7',
        400: '#34D399',
        500: '#10B981', // Green
        600: '#059669',
        700: '#047857',
        800: '#065F46',
        900: '#064E3B',
      },
      secondary: {
        50: '#FFF7ED',
        100: '#FFEDD5',
        200: '#FED7AA',
        300: '#FDBA74',
        400: '#FB923C',
        500: '#F97316', // Orange
        600: '#EA580C',
        700: '#C2410C',
        800: '#9A3412',
        900: '#7C2D12',
      },
      accent: {
        50: '#FFFBEB',
        100: '#FEF3C7',
        200: '#FDE68A',
        300: '#FCD34D',
        400: '#FBBF24',
        500: '#F59E0B', // Yellow
        600: '#D97706',
        700: '#B45309',
        800: '#92400E',
        900: '#78350F',
      },
    },
  },
  2: {
    id: 2,
    name: 'Professional Blue',
    colors: {
      primary: {
        50: '#EFF6FF',
        100: '#DBEAFE',
        200: '#BFDBFE',
        300: '#93C5FD',
        400: '#60A5FA',
        500: '#3B82F6', // Blue
        600: '#2563EB',
        700: '#1D4ED8',
        800: '#1E40AF',
        900: '#1E3A8A',
      },
      secondary: {
        50: '#F0F9FF',
        100: '#E0F2FE',
        200: '#BAE6FD',
        300: '#7DD3FC',
        400: '#38BDF8',
        500: '#0EA5E9', // Sky Blue (lighter, different)
        600: '#0284C7',
        700: '#0369A1',
        800: '#075985',
        900: '#0C4A6E',
      },
      accent: {
        50: '#ECFDF5',
        100: '#D1FAE5',
        200: '#A7F3D0',
        300: '#6EE7B7',
        400: '#34D399',
        500: '#10B981', // Green (contrast)
        600: '#059669',
        700: '#047857',
        800: '#065F46',
        900: '#064E3B',
      },
    },
  },
  3: {
    id: 3,
    name: 'Nature Green',
    colors: {
      primary: {
        50: '#F0FDF4',
        100: '#DCFCE7',
        200: '#BBF7D0',
        300: '#86EFAC',
        400: '#4ADE80',
        500: '#22C55E', // Bright Green
        600: '#16A34A',
        700: '#15803D',
        800: '#166534',
        900: '#14532D',
      },
      secondary: {
        50: '#FFFBEB',
        100: '#FEF3C7',
        200: '#FDE68A',
        300: '#FCD34D',
        400: '#FBBF24',
        500: '#F59E0B', // Yellow/Gold (earthy contrast)
        600: '#D97706',
        700: '#B45309',
        800: '#92400E',
        900: '#78350F',
      },
      accent: {
        50: '#FFF7ED',
        100: '#FFEDD5',
        200: '#FED7AA',
        300: '#FDBA74',
        400: '#FB923C',
        500: '#F97316', // Orange (warm accent)
        600: '#EA580C',
        700: '#C2410C',
        800: '#9A3412',
        900: '#7C2D12',
      },
    },
  },
  4: {
    id: 4,
    name: 'Solar Yellow',
    colors: {
      primary: {
        50: '#FFFBEB',
        100: '#FEF3C7',
        200: '#FDE68A',
        300: '#FCD34D',
        400: '#FBBF24',
        500: '#F59E0B', // Yellow
        600: '#D97706',
        700: '#B45309',
        800: '#92400E',
        900: '#78350F',
      },
      secondary: {
        50: '#FFF7ED',
        100: '#FFEDD5',
        200: '#FED7AA',
        300: '#FDBA74',
        400: '#FB923C',
        500: '#F97316', // Orange (distinct from yellow)
        600: '#EA580C',
        700: '#C2410C',
        800: '#9A3412',
        900: '#7C2D12',
      },
      accent: {
        50: '#FEF2F2',
        100: '#FEE2E2',
        200: '#FECACA',
        300: '#FCA5A5',
        400: '#F87171',
        500: '#EF4444', // Red (warm accent)
        600: '#DC2626',
        700: '#B91C1C',
        800: '#991B1B',
        900: '#7F1D1D',
      },
    },
  },
  5: {
    id: 5,
    name: 'Clean Slate',
    colors: {
      primary: {
        50: '#F0FDFA',
        100: '#CCFBF1',
        200: '#99F6E4',
        300: '#5EEAD4',
        400: '#2DD4BF',
        500: '#14B8A6', // Teal
        600: '#0D9488',
        700: '#0F766E',
        800: '#115E59',
        900: '#134E4A',
      },
      secondary: {
        50: '#F8FAFC',
        100: '#F1F5F9',
        200: '#E2E8F0',
        300: '#CBD5E1',
        400: '#94A3B8',
        500: '#64748B', // Slate
        600: '#475569',
        700: '#334155',
        800: '#1E293B',
        900: '#0F172A',
      },
      accent: {
        50: '#ECFDF5',
        100: '#D1FAE5',
        200: '#A7F3D0',
        300: '#6EE7B7',
        400: '#34D399',
        500: '#10B981', // Green
        600: '#059669',
        700: '#047857',
        800: '#065F46',
        900: '#064E3B',
      },
    },
  },
  6: {
    id: 6,
    name: 'Sunset Vibes',
    colors: {
      primary: {
        50: '#FDF4FF',
        100: '#FAE8FF',
        200: '#F5D0FE',
        300: '#F0ABFC',
        400: '#E879F9',
        500: '#D946EF', // Bright Pink
        600: '#C026D3',
        700: '#A21CAF',
        800: '#86198F',
        900: '#701A75',
      },
      secondary: {
        50: '#FFF1F2',
        100: '#FFE4E6',
        200: '#FECDD3',
        300: '#FDA4AF',
        400: '#FB7185',
        500: '#F43F5E', // Rose/Red
        600: '#E11D48',
        700: '#BE123C',
        800: '#9F1239',
        900: '#881337',
      },
      accent: {
        50: '#FFF7ED',
        100: '#FFEDD5',
        200: '#FED7AA',
        300: '#FDBA74',
        400: '#FB923C',
        500: '#F97316', // Orange
        600: '#EA580C',
        700: '#C2410C',
        800: '#9A3412',
        900: '#7C2D12',
      },
    },
  },
  7: {
    id: 7,
    name: 'Ocean Deep',
    colors: {
      primary: {
        50: '#F0F9FF',
        100: '#E0F2FE',
        200: '#BAE6FD',
        300: '#7DD3FC',
        400: '#38BDF8',
        500: '#0EA5E9', // Sky Blue
        600: '#0284C7',
        700: '#0369A1',
        800: '#075985',
        900: '#0C4A6E',
      },
      secondary: {
        50: '#ECFEFF',
        100: '#CFFAFE',
        200: '#A5F3FC',
        300: '#67E8F9',
        400: '#22D3EE',
        500: '#06B6D4', // Cyan
        600: '#0891B2',
        700: '#0E7490',
        800: '#155E75',
        900: '#164E63',
      },
      accent: {
        50: '#F0FDFA',
        100: '#CCFBF1',
        200: '#99F6E4',
        300: '#5EEAD4',
        400: '#2DD4BF',
        500: '#14B8A6', // Teal
        600: '#0D9488',
        700: '#0F766E',
        800: '#115E59',
        900: '#134E4A',
      },
    },
  },
  8: {
    id: 8,
    name: 'Forest Dusk',
    colors: {
      primary: {
        50: '#FEF3C7',
        100: '#FDE68A',
        200: '#FCD34D',
        300: '#FBBF24',
        400: '#F59E0B',
        500: '#D97706', // Amber
        600: '#B45309',
        700: '#92400E',
        800: '#78350F',
        900: '#451A03',
      },
      secondary: {
        50: '#F5F3FF',
        100: '#EDE9FE',
        200: '#DDD6FE',
        300: '#C4B5FD',
        400: '#A78BFA',
        500: '#8B5CF6', // Purple
        600: '#7C3AED',
        700: '#6D28D9',
        800: '#5B21B6',
        900: '#4C1D95',
      },
      accent: {
        50: '#F0FDF4',
        100: '#DCFCE7',
        200: '#BBF7D0',
        300: '#86EFAC',
        400: '#4ADE80',
        500: '#22C55E', // Green
        600: '#16A34A',
        700: '#15803D',
        800: '#166534',
        900: '#14532D',
      },
    },
  },
  9: {
    id: 9,
    name: 'Berry Blast',
    colors: {
      primary: {
        50: '#FDF2F8',
        100: '#FCE7F3',
        200: '#FBCFE8',
        300: '#F9A8D4',
        400: '#F472B6',
        500: '#EC4899', // Hot Pink
        600: '#DB2777',
        700: '#BE185D',
        800: '#9D174D',
        900: '#831843',
      },
      secondary: {
        50: '#FFF1F2',
        100: '#FFE4E6',
        200: '#FECDD3',
        300: '#FDA4AF',
        400: '#FB7185',
        500: '#F43F5E', // Rose
        600: '#E11D48',
        700: '#BE123C',
        800: '#9F1239',
        900: '#881337',
      },
      accent: {
        50: '#FDF4FF',
        100: '#FAE8FF',
        200: '#F5D0FE',
        300: '#F0ABFC',
        400: '#E879F9',
        500: '#D946EF', // Fuchsia
        600: '#C026D3',
        700: '#A21CAF',
        800: '#86198F',
        900: '#701A75',
      },
    },
  },
  10: {
    id: 10,
    name: 'Cosmic Night',
    colors: {
      primary: {
        50: '#EEF2FF',
        100: '#E0E7FF',
        200: '#C7D2FE',
        300: '#A5B4FC',
        400: '#818CF8',
        500: '#6366F1', // Indigo
        600: '#4F46E5',
        700: '#4338CA',
        800: '#3730A3',
        900: '#312E81',
      },
      secondary: {
        50: '#F5F3FF',
        100: '#EDE9FE',
        200: '#DDD6FE',
        300: '#C4B5FD',
        400: '#A78BFA',
        500: '#8B5CF6', // Violet
        600: '#7C3AED',
        700: '#6D28D9',
        800: '#5B21B6',
        900: '#4C1D95',
      },
      accent: {
        50: '#ECFEFF',
        100: '#CFFAFE',
        200: '#A5F3FC',
        300: '#67E8F9',
        400: '#22D3EE',
        500: '#06B6D4', // Cyan
        600: '#0891B2',
        700: '#0E7490',
        800: '#155E75',
        900: '#164E63',
      },
    },
  },
  11: {
    id: 11,
    name: 'Professional Eco (Designer Pick)',
    colors: {
      primary: {
        50: '#E8EDF2',
        100: '#D1DBE5',
        200: '#A3B7CB',
        300: '#7593B1',
        400: '#476F97',
        500: '#0B2644', // Deep Blue - Main brand color
        600: '#091E36',
        700: '#071729',
        800: '#050F1B',
        900: '#02080E',
      },
      secondary: {
        50: '#E6F7F3',
        100: '#CCEFE7',
        200: '#99DFCF',
        300: '#66CFB7',
        400: '#33BF9F',
        500: '#009E7F', // Teal - Eco-friendly
        600: '#007E65',
        700: '#005F4C',
        800: '#003F32',
        900: '#002019',
      },
      accent: {
        50: '#FEF3E6',
        100: '#FDE7CC',
        200: '#FBCF99',
        300: '#F9B766',
        400: '#F79F33',
        500: '#F28C00', // Orange - Solar warmth & CTAs
        600: '#C27000',
        700: '#915400',
        800: '#613800',
        900: '#301C00',
      },
    },
  },
};

export interface SectionVariantConfig {
  id: string;
  name: string;
  description: string;
}

export const SECTION_VARIANTS = {
  whoWeAre: {
    A: { id: 'A', name: 'Founder Story', description: 'Team photo + founder quote card' },
    B: { id: 'B', name: 'Credentials', description: 'Stats grid + certification logos' },
    C: { id: 'C', name: 'Video Intro', description: 'Video placeholder + quote below' },
  },
  benefits: {
    A: { id: 'A', name: 'Grid 3x2', description: '6 benefits in grid layout' },
    B: { id: 'B', name: 'Cards', description: 'Individual cards with icons' },
    C: { id: 'C', name: 'List', description: 'Simple vertical list' },
  },
  services: {
    A: { id: 'A', name: 'Side-by-Side', description: 'Residential & Commercial cards' },
    B: { id: 'B', name: 'Stacked Icons', description: 'Large cards with icons' },
    C: { id: 'C', name: 'Tabbed', description: 'Interactive tab switcher' },
  },
  showcase: {
    A: { id: 'A', name: 'Masonry', description: 'Pinterest-style photo grid' },
    B: { id: 'B', name: 'Featured', description: 'Large project cards with details' },
    C: { id: 'C', name: 'Before/After', description: 'Split comparison cards' },
  },
  process: {
    A: { id: 'A', name: 'Cards', description: 'Numbered cards in row' },
    B: { id: 'B', name: 'Timeline', description: 'Horizontal timeline with arrows' },
    C: { id: 'C', name: 'Vertical', description: 'Vertical stepper layout' },
  },
  didYouKnow: {
    A: { id: 'A', name: 'List', description: 'Simple list with checkmarks' },
    B: { id: 'B', name: 'Cards', description: 'Individual fact cards' },
    C: { id: 'C', name: 'Two Column', description: 'Facts in two columns' },
  },
  invest: {
    A: { id: 'A', name: 'Benefits List', description: 'Numbered list with CTA' },
    B: { id: 'B', name: 'Two Column', description: 'Benefits left, info right' },
    C: { id: 'C', name: 'Cards', description: 'Individual benefit cards' },
  },
  contact: {
    A: { id: 'A', name: 'Centered', description: 'Form centered, full width' },
    B: { id: 'B', name: 'Split', description: 'Info left, form right' },
    C: { id: 'C', name: 'Compact', description: 'Minimal fields, inline layout' },
  },
};

// Helper to get theme main colors (for reference)
export const getThemeMainColors = (themeId: number) => {
  const theme = THEME_VARIANTS[themeId];
  return {
    primary: theme.colors.primary[500],
    secondary: theme.colors.secondary[500],
    accent: theme.colors.accent[500],
  };
};

