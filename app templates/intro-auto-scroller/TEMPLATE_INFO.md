# Template Information

## 📦 What Is This?

A **reusable, self-contained** React + TypeScript template that adds a cinematic intro animation with auto-scroll functionality to any web project. Extracted from the `demo-builder` production app.

## 🎯 Purpose

Enable developers to quickly add professional demo presentations to client projects by:
1. Copying the `src` folder into their project
2. Installing dependencies
3. Using the `useIntroAutoScroller` hook

No complex setup. No configuration files. Just copy and use.

## ✨ What's Included

### Core Features
- **Glass DNA Helix Animation** (14 seconds)
  - 3D WebGL animation with Three.js
  - Saffron/amber lighting
  - Crystal sparkle particles
  - Smooth rotation and fades

- **Text Animation**
  - Character-by-character reveal
  - Blur-to-sharp transitions
  - GSAP-powered animations

- **"Presents" Sequence**
  - Professional transition
  - Client logo display with depth effects
  - Subtle scale animations

- **Auto-Scroll System**
  - Smooth linear scrolling
  - Pause/resume controls
  - Automatic return to top
  - Configurable speeds

### Integration
- **Hook-based API** (`useIntroAutoScroller`)
- **Two components**: `PlayButton` and `IntroAnimation`
- **One ref**: `scrollContainerRef` for scroll container
- **Full control**: State, callbacks, and controls exposed

## 📁 File Structure

```
intro-auto-scroller/
├── src/                                 # Copy this into your project
│   ├── hooks/
│   │   └── useIntroAutoScroller.tsx    # Main hook (React state + auto-scroll logic)
│   ├── components/
│   │   ├── TitleAnimation.tsx          # Animation orchestrator (timeline management)
│   │   ├── GlassDNA.tsx                # Three.js canvas + lighting
│   │   ├── GlassHelixParticles.tsx     # Helix geometry + sparkles
│   │   └── EnhancedText.tsx            # GSAP text animations
│   ├── types/
│   │   └── index.ts                    # TypeScript interfaces
│   └── index.ts                        # Public exports
│
├── example/
│   └── ExampleUsage.tsx                # Copy-paste examples
│
├── README.md                            # Full documentation
├── QUICK_START.md                       # 5-minute setup guide
├── package.json                         # Dependencies list
└── tsconfig.json                        # TypeScript config
```

## 🚀 How To Use

### Step 1: Copy
```bash
cp -r intro-auto-scroller/src /your-project/src/intro-auto-scroller
```

### Step 2: Install
```bash
npm install @react-three/fiber @react-three/drei @react-three/postprocessing three gsap
```

### Step 3: Use
```tsx
import { useIntroAutoScroller } from './intro-auto-scroller';

function DemoPage() {
  const { PlayButton, IntroAnimation, scrollContainerRef } = useIntroAutoScroller({
    companyName: "Moksha Labs",
    tagline: "Where artistry meets code",
    clientLogoUrl: "/logo.png", // Optional
  });

  return (
    <>
      <PlayButton />
      <IntroAnimation />
      <main ref={scrollContainerRef} className="h-screen overflow-y-auto">
        {/* Your content */}
      </main>
    </>
  );
}
```

## 🔧 Configuration Options

```typescript
{
  companyName: string;        // Required: Your company name
  tagline: string;            // Required: Your tagline
  clientLogoUrl?: string;     // Optional: Client logo to display
  autoScroll?: {
    scrollSpeed?: number;     // Optional: ms per viewport (default: 5819)
    pauseAtBottom?: number;   // Optional: pause duration (default: 2000)
    returnDuration?: number;  // Optional: return speed (default: 1500)
  };
  onComplete?: () => void;    // Optional: Callback when complete
}
```

## 💡 Use Cases

1. **Client Demos** - `/demo` route for presentations
2. **Product Launches** - Cinematic product reveals
3. **Portfolio Showcases** - Impressive project presentations
4. **Landing Pages** - Memorable first impressions
5. **Sales Presentations** - Auto-guided tours

## 🎨 Customization

### Easy (No code changes)
- Change company name/tagline via props
- Upload different client logo
- Adjust scroll speed via config

### Moderate (Edit hook file)
- Modify Tailwind classes
- Add custom UI elements
- Adjust animation triggers

### Advanced (Edit component files)
- Change animation timeline
- Modify 3D lighting colors
- Customize text animations
- Add new effects

## 📊 Performance

- **Bundle size**: ~1.2MB (Three.js + dependencies)
- **Animation**: 60 FPS (WebGL accelerated)
- **Tested**: Chrome, Firefox, Safari, Edge
- **Mobile**: Works, but best on desktop/tablet

## ⚙️ Technical Details

### Dependencies
- `react` 18+ (peer)
- `@react-three/fiber` 8.15+ (3D rendering)
- `@react-three/drei` 9.92+ (Three.js helpers)
- `@react-three/postprocessing` 2.15+ (Bloom effects)
- `three` 0.159+ (WebGL library)
- `gsap` 3.12+ (Text animations)

### Requirements
- TypeScript 5+
- Tailwind CSS (for styling)
- Modern browser with WebGL support

## 🆚 vs. Other Solutions

**vs. Video Intro**
- ✅ Lighter bundle size
- ✅ Interactive (pausable)
- ✅ Customizable text
- ✅ No video hosting

**vs. Lottie Animations**
- ✅ More impressive (3D)
- ✅ Dynamic text/logo
- ✅ Full control
- ❌ Larger bundle

**vs. CSS-only**
- ✅ More sophisticated
- ✅ Professional quality
- ❌ Heavier dependencies

## 📝 Notes

- **Production-Ready**: Extracted from live demo-builder app
- **Battle-Tested**: Used in real client presentations
- **Maintained**: Keep updated with improvements
- **License**: MIT - use freely

## 🔗 Related

- **Source**: Extracted from `demo-builder` app
- **Pattern**: Same animation system as production tool
- **Updates**: Sync improvements back to this template

---

**Version**: 1.0.0  
**Created**: October 2025  
**Author**: Moksha Labs  
**Status**: Production Ready ✅

