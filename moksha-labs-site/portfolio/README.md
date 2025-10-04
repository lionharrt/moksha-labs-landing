# Moksha Labs Site

Elegant, scroll-driven website built with Next.js, React Three Fiber, and Lenis.

## Architecture

- **Framework**: Next.js 15 with App Router
- **3D**: React Three Fiber + Drei
- **Scroll**: Lenis (smooth scroll)
- **Animation**: GSAP with ScrollTrigger
- **State**: Zustand
- **Styling**: Tailwind CSS + CSS Modules

## Project Structure

```
src/
├── app/                    # Next.js App Router
├── components/
│   ├── canvas/            # R3F 3D components
│   ├── sections/          # DOM content sections
│   ├── ui/                # Reusable UI components
│   ├── dev/               # Developer tools
│   └── providers/         # Context providers
├── stores/                # Zustand state management
├── config/                # Configuration files
└── hooks/                 # Custom React hooks
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Developer Toolbar

Press **DEV** button (bottom right) to access:
- Current section tracking
- Scroll progress
- Canvas visibility toggle
- Performance stats
- **Cursor catalogue** - Preview all cursor styles
- Quick navigation

## Key Features

### 1. Modular Section Architecture
Each section is self-contained with:
- DOM component (`/components/sections/`)
- 3D scene component (`/components/canvas/sections/`)
- Entrance/exit animations
- Independent scroll triggers

### 2. Section Flow
Sections automatically:
- Fade 3D elements in/out
- Update current section state
- Change cursor type
- Animate camera position

### 3. Theme System
Easy theme customization via CSS variables:
```css
:root {
  --color-primary: #000000;
  --color-accent: #6366f1;
  /* ... */
}
```

### 4. Cursor Catalogue
6 cursor styles configurable via dev toolbar:
- Default
- Hover
- Explore
- Drag
- Trail
- Magnetic

## Animation Philosophy

**Simple Creative Elegance**
- Focus on **entrance and exit** timing
- Smooth **section transitions**
- **Movement and vibe** over technical effects
- Clean, **minimal aesthetic**

## Next Steps

1. **Refine entrance animations** - timing, easing, composition
2. **Iterate on cursor styles** - use dev toolbar
3. **Adjust 3D geometries** - shapes, positions, rotations
4. **Fine-tune scroll feel** - Lenis duration, easing
5. **Add real content** - swap placeholders

## Notes

- All sections use CSS Modules for scoped styling
- 3D elements auto-fade based on current section
- Scroll tracking via ScrollTrigger
- Dev mode starts enabled for iteration
- Mobile: simplified 3D, no custom cursor

