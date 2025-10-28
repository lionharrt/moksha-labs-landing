# ⚡ Quick Start Guide

Get the intro animation running in your project in 5 minutes!

## 1️⃣ Copy Files (10 seconds)

```bash
# Copy the src folder into your project
cp -r intro-auto-scroller/src /your-project/src/intro-auto-scroller
```

## 2️⃣ Install Dependencies (30 seconds)

```bash
npm install @react-three/fiber @react-three/drei @react-three/postprocessing three gsap
```

Or with pnpm:
```bash
pnpm add @react-three/fiber @react-three/drei @react-three/postprocessing three gsap
```

## 3️⃣ Add to Your Page (2 minutes)

Create a new file or edit an existing page:

```tsx
// src/pages/DemoPage.tsx
import { useIntroAutoScroller } from '../intro-auto-scroller';

export function DemoPage() {
  const { PlayButton, IntroAnimation, scrollContainerRef } = useIntroAutoScroller({
    clientLogoUrl: "/path/to/client-logo.png", // Optional
  });

  return (
    <>
      <PlayButton />
      <IntroAnimation />
      
      <main ref={scrollContainerRef} className="h-screen overflow-y-auto">
        <section className="min-h-screen bg-blue-500 flex items-center justify-center">
          <h1 className="text-6xl text-white">Welcome</h1>
        </section>
        
        <section className="min-h-screen bg-green-500 flex items-center justify-center">
          <h1 className="text-6xl text-white">About</h1>
        </section>
        
        <section className="min-h-screen bg-purple-500 flex items-center justify-center">
          <h1 className="text-6xl text-white">Contact</h1>
        </section>
      </main>
    </>
  );
}
```

## 4️⃣ Set Up Routing (1 minute)

Add to your router:

```tsx
// App.tsx or routes.tsx
import { DemoPage } from './pages/DemoPage';

// In your router:
<Route path="/demo" element={<DemoPage />} />
```

## 5️⃣ Test It! (1 minute)

```bash
npm run dev
```

Navigate to `http://localhost:5173/demo` and click the play button!

---

## ✅ Checklist

- [ ] Copied `src` folder
- [ ] Installed dependencies
- [ ] Created demo page component
- [ ] Added route for `/demo`
- [ ] (Optional) Added client logo
- [ ] Tested in browser

## 🎨 Next Steps

1. **Add client logo**: Set `clientLogoUrl` prop
2. **Adjust timing**: Modify `autoScroll` config
3. **Style it**: Update Tailwind classes
4. **Deploy**: Share the URL with clients!

**Note**: "Moksha Labs" branding is hardcoded in the animation to showcase your studio.

## 🚨 Common Issues

**Three.js errors?**
- Make sure all dependencies installed correctly
- Try clearing `node_modules` and reinstalling

**Scroll not working?**
- Verify `scrollContainerRef` is on the scroll container
- Ensure container has `h-screen overflow-y-auto` classes

**Styles not applying?**
- Confirm Tailwind CSS is configured in your project
- Check CSS is being imported

---

**Need help?** Check the full [README.md](./README.md) for detailed documentation.

**Working?** 🎉 You're all set! Customize and deploy!

