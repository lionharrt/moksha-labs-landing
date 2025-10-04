# Moksha Labs Three.js Playground

Production-ready playground for learning Three.js and building your agency site.

## 🚀 Quick Start

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
playground/
├── app/                    # Next.js 15 App Router
│   ├── page.tsx           # Main page
│   └── globals.css        # Global styles
│
├── components/
│   ├── canvas/            # Three.js/R3F components
│   │   ├── SceneWrapper.tsx
│   │   └── examples/      # Example scenes
│   │       ├── BasicScene.tsx
│   │       ├── InteractiveBox.tsx
│   │       └── ParticleField.tsx
│   │
│   └── dom/               # HTML/React UI components
│       ├── ExampleSelector.tsx
│       └── InfoPanel.tsx
│
├── hooks/                 # Custom React hooks
│   └── useLenis.ts       # Smooth scroll
│
├── stores/                # State management
│   └── useStore.ts       # Zustand store
│
├── config/                # Configuration
│   └── site.ts           # Site config
│
└── public/               # Static assets
    ├── models/           # 3D models (.glb, .gltf)
    └── textures/         # Texture images
```

## 📚 Learning Path

Based on the documentation in `/docs`:

1. **Start with Basic Scene** - Understand Scene, Camera, Renderer
2. **Interactive Box** - Learn about pointer events
3. **Particle Field** - GPU-accelerated particles
4. **Read the docs** - `/docs` folder has complete guides

## 🎨 Examples Included

- ✅ Basic rotating cube
- ✅ Interactive hover/click effects
- ✅ 5000 particle field
- 🚧 More coming as you learn!

## 🛠️ Tech Stack

- **Next.js 15** - React framework with App Router
- **React Three Fiber** - Declarative Three.js in React
- **@react-three/drei** - Helper components
- **@react-three/postprocessing** - Effects
- **GSAP** - Timeline animations
- **Lenis** - Smooth scrolling
- **Zustand** - State management
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

## 📖 Documentation

All documentation is in the `/docs` folder:

- Start with `00-OVERVIEW.md`
- Follow the learning paths
- Reference `QUICK-REFERENCE.md` for code snippets

## 🎯 Next Steps

1. **Explore examples** - Switch between examples in the UI
2. **Study the code** - Each file has comments explaining concepts
3. **Read docs** - Deep dive into `/docs` for complete understanding
4. **Build features** - Add your own examples
5. **Eventually** - Transform into Moksha Labs agency site

## 💡 Tips

- **Drag** to rotate the camera
- **Scroll** to zoom in/out
- **Click** objects to interact (in Interactive Box example)
- **Check console** for helpful logs
- **FPS stats** show in development mode

## 🚀 Future Agency Site

This playground is the foundation for your Moksha Labs agency site:

- Same tech stack
- Same architecture
- Production-ready from day one
- Just add: content, design, more scenes

## 📝 Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
```

---

Built following best practices from our comprehensive Three.js documentation 🎨
