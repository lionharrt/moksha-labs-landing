# 🎬 Intro Auto-Scroller

A reusable React + TypeScript template for adding cinematic intro animations with auto-scroll functionality to your demo pages.

## ✨ Features

- 🎭 **Glass DNA Helix Animation** - Stunning 3D animated intro (14 seconds)
- 🎬 **"Presents" Sequence** - Professional transition with client logo
- 📜 **Auto-Scroll** - Smooth automatic page scrolling
- ⏸️  **Pause/Resume** - User controls during scroll
- 🎨 **Customizable** - Company name, tagline, and logo
- 🪝 **Hook-Based API** - Clean, simple integration
- 📦 **Self-Contained** - Copy into any project

## 🚀 Quick Start

### 1. Copy Template into Your Project

```bash
cp -r intro-auto-scroller/src /your-project/src/intro-auto-scroller
```

### 2. Install Dependencies

```bash
npm install @react-three/fiber @react-three/drei @react-three/postprocessing three gsap
# or
pnpm add @react-three/fiber @react-three/drei @react-three/postprocessing three gsap
```

### 3. Use in Your Component

```tsx
import { useIntroAutoScroller } from './intro-auto-scroller';

function DemoPage() {
  const { PlayButton, IntroAnimation, scrollContainerRef } = useIntroAutoScroller({
    clientLogoUrl: "/client-logo.png", // Optional
  });

  return (
    <>
      <PlayButton />
      <IntroAnimation />
      
      <main ref={scrollContainerRef} className="h-screen overflow-y-auto">
        {/* Your page content */}
        <section className="min-h-screen">Section 1</section>
        <section className="min-h-screen">Section 2</section>
        <section className="min-h-screen">Section 3</section>
      </main>
    </>
  );
}
```

That's it! 🎉

## 📖 API Reference

### `useIntroAutoScroller(config)`

Main hook that provides intro animation and auto-scroll functionality.

#### Config

```typescript
interface IntroAutoScrollerConfig {
  // Optional
  clientLogoUrl?: string;   // Client logo to display after "Moksha Labs presents"
  
  // Auto-scroll settings (optional)
  autoScroll?: {
    scrollSpeed?: number;    // ms per viewport height (default: 5819)
    pauseAtBottom?: number;  // Pause duration at bottom (default: 2000)
    returnDuration?: number; // Scroll back duration (default: 1500)
  };
  
  // Callbacks
  onComplete?: () => void;   // Called when sequence finishes
}
```

#### Returns

```typescript
interface IntroAutoScrollerReturn {
  PlayButton: React.FC;              // Play button overlay component
  IntroAnimation: React.FC;          // Title animation component
  isPlaying: boolean;                // Animation is playing
  isScrolling: boolean;              // Auto-scroll is active
  isPaused: boolean;                 // Auto-scroll is paused
  start: () => void;                 // Start sequence manually
  togglePause: () => void;           // Pause/resume scroll
  scrollContainerRef: RefObject;     // Ref for scroll container
}
```

## 🎯 Usage Examples

### Basic Usage

```tsx
const { PlayButton, IntroAnimation, scrollContainerRef } = useIntroAutoScroller({});

return (
  <>
    <PlayButton />
    <IntroAnimation />
    <main ref={scrollContainerRef} className="h-screen overflow-y-auto">
      {/* Content */}
    </main>
  </>
);
```

### With Client Logo

```tsx
const { PlayButton, IntroAnimation, scrollContainerRef } = useIntroAutoScroller({
  clientLogoUrl: "/client-logo.png",
});
```

### Custom Scroll Speed

```tsx
const { PlayButton, IntroAnimation, scrollContainerRef } = useIntroAutoScroller({
  autoScroll: {
    scrollSpeed: 8000,    // Slower scroll
    pauseAtBottom: 3000,  // Longer pause
    returnDuration: 2000, // Slower return
  },
});
```

### With Pause/Resume Controls

```tsx
const { 
  PlayButton, 
  IntroAnimation, 
  scrollContainerRef,
  isScrolling,
  isPaused,
  togglePause 
} = useIntroAutoScroller({
  clientLogoUrl: "/client-logo.png",
});

return (
  <>
    <PlayButton />
    <IntroAnimation />
    
    <main ref={scrollContainerRef} className="h-screen overflow-y-auto">
      {/* Content */}
    </main>

    {/* Pause/Resume UI */}
    {isScrolling && (
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
        <button onClick={togglePause}>
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>
    )}
  </>
);
```

### With React Router

```tsx
function App() {
  const location = useLocation();
  const isDemoRoute = location.pathname === '/demo';

  const { PlayButton, IntroAnimation, scrollContainerRef } = useIntroAutoScroller({
    clientLogoUrl: "/client-logo.png",
  });

  if (!isDemoRoute) {
    return <NormalPage />;
  }

  return (
    <>
      <PlayButton />
      <IntroAnimation />
      <main ref={scrollContainerRef} className="h-screen overflow-y-auto">
        <DemoContent />
      </main>
    </>
  );
}
```

## 🎨 Animation Timeline

The intro animation follows this 14-second sequence:

```
0-0.5s:   Fade in from black
0.5-3s:   Glass helix builds + "Moksha Labs" text appears
3-5s:     Hold both fully visible (2 seconds)
5-6s:     Helix fades out (1 second)
6-7s:     "Moksha Labs" text fades out (1 second after helix)
7-7.5s:   Black screen (0.5 second)
7.5-9s:   "presents" text (1.5 seconds)
9-10s:    Black screen (1 second)
10-13s:   Client logo with depth effects (3 seconds)
13-14s:   Fade to black (1 second)
→ Auto-scroll begins
```

## 🛠️ Customization

### Styling

The components use Tailwind CSS classes. You can customize by:

1. **Modifying classes directly** in the hook's JSX
2. **Overriding with custom CSS** using higher specificity
3. **Editing component files** for deep customization

### Animation Timing

Edit `src/components/TitleAnimation.tsx` to adjust durations:

```tsx
const totalDuration = 14; // Change animation length
```

### Colors & Lighting

Edit `src/components/GlassDNA.tsx` to change lighting colors:

```tsx
<spotLight color="#d4a574" />  // Saffron
<spotLight color="#cc9966" />  // Amber
```

## 📦 File Structure

```
intro-auto-scroller/
├── src/
│   ├── hooks/
│   │   └── useIntroAutoScroller.tsx  # Main hook
│   ├── components/
│   │   ├── TitleAnimation.tsx        # Animation orchestrator
│   │   ├── GlassDNA.tsx              # 3D canvas wrapper
│   │   ├── GlassHelixParticles.tsx   # Helix geometry
│   │   └── EnhancedText.tsx          # Text animation
│   ├── types/
│   │   └── index.ts                  # TypeScript types
│   └── index.ts                      # Public exports
├── example/
│   └── ExampleUsage.tsx              # Usage examples
├── package.json                       # Dependencies
├── tsconfig.json                      # TypeScript config
└── README.md                          # This file
```

## 🔧 Requirements

- React 18+
- TypeScript 5+
- Tailwind CSS (for styling)
- Modern browser with WebGL support

## 💡 Tips

1. **Performance**: The 3D animation uses WebGL. Test on target devices.
2. **Content Length**: Auto-scroll works best with 3-5 sections.
3. **Logo Format**: Use PNG/SVG with transparent background for best results.
4. **Mobile**: Animation is responsive but best on desktop/tablet.
5. **Accessibility**: Consider adding a "skip intro" option for returning users.

## 🚨 Troubleshooting

### Animation doesn't appear
- Check browser console for errors
- Verify all dependencies are installed
- Ensure Three.js libraries loaded correctly

### Auto-scroll not working
- Verify `scrollContainerRef` is attached to scroll container
- Ensure container has `overflow-y-auto` class
- Check container height is set (e.g., `h-screen`)

### Performance issues
- Reduce sparkle count in `GlassHelixParticles.tsx`
- Lower device pixel ratio in `GlassDNA.tsx`
- Test on target hardware

## 📄 License

MIT - Use freely in your projects!

## 🤝 Contributing

This is a template. Fork it, customize it, make it yours!

---

**Built with ❤️ by Moksha Labs**

For more templates and tools: [github.com/lionharrt](https://github.com/lionharrt)

