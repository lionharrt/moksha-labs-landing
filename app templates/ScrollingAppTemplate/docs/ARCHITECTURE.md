# Architecture Overview

## System Design

The ScrollingAppTemplate follows a **modular, layered architecture** designed to be:
- Easy to understand
- Easy to extend
- Easy for AI to work with
- Type-safe and maintainable

## Layer Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Application Layer                     │
│              (Your App, examples/App.example.tsx)        │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                   Component Layer                        │
│      (Navigation, Section, ScrollProgress)               │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              Context & State Layer                       │
│            (ThemeContext, useTheme)                      │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                   Hook Layer                             │
│        (useDarkMode, useMobileDetection)                 │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                   Utility Layer                          │
│         (scrollUtils, configuration)                     │
└─────────────────────────────────────────────────────────┘
```

## Component Architecture

### Navigation Component

```
Navigation
├── Uses: useTheme, useMobileDetection
├── Reads: navigationConfig, themeConfig
├── Utilities: scrollToSection, getCurrentSection
└── State Management:
    ├── Active section tracking
    ├── Scroll position detection
    ├── Mouse proximity detection
    └── Mobile menu state
```

### Section Component

```
Section
├── Uses: IntersectionObserver API
├── Reads: themeConfig
├── Props: background, layout, animation, height, padding
└── Features:
    ├── Scroll-snap behavior
    ├── Animation on scroll
    ├── Flexible layouts
    └── Responsive styling
```

### ScrollProgress Component

```
ScrollProgress
├── Uses: Scroll event listeners
├── Utilities: getScrollProgress
└── Renders: Progress bar at top
```

## State Management Strategy

### Global State (Context)
- **ThemeContext**: Dark/light mode
- **Future**: Add more contexts as needed (User, Settings, etc.)

### Local State (Component)
- Navigation: Menu open/close, active section
- Section: Visibility, animation state

### Why Context over Redux/MobX?
- Simpler for theme management
- Less boilerplate
- Easier for AI to understand
- Can add Redux/Zustand later if needed

## Data Flow

```
User Interaction (Scroll/Click)
         │
         ▼
    Navigation Component
         │
         ├─► scrollToSection() ─► Updates URL hash
         │                      │
         │                      ▼
         │               Smooth scroll to section
         │
         ├─► getCurrentSection() ─► Track active section
         │                        │
         │                        ▼
         │                  Update navigation highlight
         │
         └─► ThemeContext ─► Dark mode toggle
                          │
                          ▼
                   Update CSS classes
```

## File Organization Strategy

### Why This Structure?

```
components/    → Presentational components (UI)
hooks/         → Reusable logic (behavior)
context/       → Global state management
config/        → Configuration (data)
types/         → Type definitions (contracts)
utils/         → Pure functions (helpers)
styles/        → CSS (presentation)
```

### Benefits:
1. **Separation of Concerns**: Each directory has a single purpose
2. **Easy Navigation**: Find what you need quickly
3. **Scalability**: Add new files without restructuring
4. **AI-Friendly**: Clear patterns for AI to follow

## Configuration System

```
config/theme.ts
├── Colors (light/dark modes)
├── Navigation settings
├── Scroll behavior
├── Animation timing
├── Section defaults
└── Responsive breakpoints
```

```
config/navigation.ts
├── Menu items definition
└── Translation helper
```

### Why Centralized Config?
- Single source of truth
- Easy to customize without touching code
- AI can modify settings without risk
- Theme switching becomes trivial

## Type System

```
types/
├── navigation.ts → NavigationItem, NavigationProps
├── section.ts    → SectionProps, SectionBackground, etc.
└── index.ts      → Central type exports
```

### Benefits:
- **IntelliSense**: IDE autocomplete
- **Type Safety**: Catch errors at compile time
- **Documentation**: Types serve as inline docs
- **AI Assistance**: Types help AI understand contracts

## Styling Strategy

### Three-Layer Approach:

1. **Tailwind Utilities** (90% of styling)
   - Utility-first approach
   - Fast development
   - Consistent design system

2. **Custom CSS** (scrolling.css, theme.css)
   - Scroll-snap behavior
   - Animations
   - Theme-specific styles

3. **Inline Styles** (rare, for dynamic values)
   - Only when absolutely necessary
   - Calculated values (progress bar width)

### Why Tailwind?
- Faster than writing custom CSS
- Consistent spacing/colors
- Purges unused styles
- Easy to customize via config

## Responsive Strategy

### Mobile-First Approach

```css
/* Base styles (mobile) */
.section { padding: 1rem; }

/* Tablet and up */
@media (min-width: 768px) {
  .section { padding: 2rem; }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .section { padding: 3rem; }
}
```

### Adaptive Behavior
- **Mobile (<768px)**: Natural scrolling, no snap, hamburger menu
- **Desktop (≥768px)**: Scroll-snap, keyboard nav, full menu

## Performance Optimizations

### 1. Intersection Observer
- Used for section visibility detection
- More efficient than scroll listeners
- Native browser API

### 2. Throttling
- Scroll events throttled to 16ms (~60fps)
- Prevents excessive re-renders

### 3. CSS Transforms
- Animations use `transform` and `opacity`
- GPU-accelerated
- Smooth 60fps animations

### 4. Code Splitting
- Can lazy-load sections
- Dynamic imports for heavy components
- Tree-shaking with ES modules

### 5. Will-Change Hints
- `will-change: transform` on animated elements
- Tells browser to optimize

## Extension Points

### Adding New Features

1. **New Component**
   ```
   components/NewFeature.tsx
   └── Export in components/index.ts
   ```

2. **New Hook**
   ```
   hooks/useNewHook.ts
   └── Export in hooks/index.ts
   ```

3. **New Context**
   ```
   context/NewContext.tsx
   └── Export in context/index.ts
   ```

4. **New Utility**
   ```
   utils/newUtils.ts
   └── Export in utils/index.ts
   ```

### Integration Points

- **API Integration**: Create `services/` directory
- **State Management**: Add Redux/Zustand in `store/`
- **Animations**: Add Framer Motion or GSAP
- **Forms**: Add React Hook Form or Formik
- **Routing**: Already has React Router

## Testing Strategy (Recommended)

```
tests/
├── components/
│   ├── Navigation.test.tsx
│   ├── Section.test.tsx
│   └── ScrollProgress.test.tsx
├── hooks/
│   ├── useDarkMode.test.ts
│   └── useMobileDetection.test.ts
├── utils/
│   └── scrollUtils.test.ts
└── integration/
    └── scrolling.test.tsx
```

### Testing Libraries to Consider:
- **Vitest**: Fast, Vite-native test runner
- **React Testing Library**: Component testing
- **Playwright**: E2E testing for scroll behavior

## Security Considerations

### Input Sanitization
When adding user input:
- Sanitize HTML content
- Validate URLs
- Escape special characters

### XSS Prevention
- React escapes by default
- Be careful with `dangerouslySetInnerHTML`
- Validate external data

### Dependencies
- Keep dependencies updated
- Use `npm audit` regularly
- Review package permissions

## Deployment

### Build Process
```bash
npm run build
```

Produces:
- Minified JavaScript
- Optimized CSS
- Hashed filenames for caching

### Environment Variables
Add `.env` files for:
- API endpoints
- Feature flags
- Analytics IDs

### Hosting Options
- **Vercel**: Zero-config deployment
- **Netlify**: Continuous deployment
- **GitHub Pages**: Free static hosting
- **AWS S3 + CloudFront**: Scalable hosting

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Review and update types
- Add tests for new features
- Update documentation
- Monitor bundle size

### Code Quality
- Run ESLint before commits
- Use Prettier for formatting
- Review PR diffs carefully
- Keep components under 300 lines

## Future Enhancements

Potential additions:
- [ ] Animation library integration (Framer Motion)
- [ ] Form validation utilities
- [ ] API service layer
- [ ] Toast notification system
- [ ] Modal/Dialog components
- [ ] Loading states
- [ ] Error boundaries
- [ ] SEO utilities
- [ ] Analytics integration
- [ ] A11y improvements

---

**This architecture is designed to grow with your project while maintaining clean code and clear patterns.**
