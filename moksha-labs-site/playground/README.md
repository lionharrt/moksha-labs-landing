# SVG Playground

A bare bones Next.js app for building and experimenting with SVGs.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:9999](http://localhost:9999)

## Structure

```
playground/
├── app/
│   ├── components/
│   │   └── SVGWorkspace.tsx  # Your SVG workspace component
│   ├── hooks/
│   │   └── useScrollProgress.ts  # Scroll progress hook (0-1)
│   ├── page.tsx              # Main page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
└── package.json
```

## Usage

Edit `app/components/SVGWorkspace.tsx` to build your SVGs.

Use `useScrollProgress()` hook to get scroll progress (0-1) for scroll-based animations.


