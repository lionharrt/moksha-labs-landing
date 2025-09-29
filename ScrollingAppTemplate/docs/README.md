# Scrolling App Template

A production-ready, modular React template for building beautiful single-page applications with scroll-snap sections, intelligent navigation, and seamless dark mode support.

## 🎯 Architecture Philosophy

This template enforces **clean, modular code architecture** to guide AI-assisted development toward best practices. Every component, hook, and utility is:

- **Single Responsibility**: Each module does one thing well
- **Composable**: Components work together seamlessly
- **Type-Safe**: Full TypeScript coverage
- **Configurable**: Centralized configuration files
- **Testable**: Clear interfaces and dependencies

## 📁 Project Structure

```
ScrollingAppTemplate/
├── components/          # React components
│   ├── Navigation.tsx   # Smart navigation bar
│   ├── Section.tsx      # Scroll-snap section wrapper
│   ├── ScrollProgress.tsx # Progress indicator
│   └── index.ts         # Component exports
├── hooks/               # Custom React hooks
│   ├── useDarkMode.ts   # Dark mode state management
│   ├── useMobileDetection.ts # Device detection
│   └── index.ts         # Hook exports
├── context/             # React Context providers
│   ├── ThemeContext.tsx # Global theme state
│   └── index.ts         # Context exports
├── config/              # Configuration files
│   ├── theme.ts         # Theme settings (colors, animations, etc.)
│   ├── navigation.ts    # Navigation menu items
│   └── index.ts         # Config exports
├── types/               # TypeScript definitions
│   ├── navigation.ts    # Navigation types
│   ├── section.ts       # Section types
│   └── index.ts         # Type exports
├── utils/               # Utility functions
│   ├── scrollUtils.ts   # Scroll behavior helpers
│   └── index.ts         # Util exports
├── styles/              # CSS files
│   ├── scrolling.css    # Scroll-snap core styles
│   └── theme.css        # Theme & animations
├── locales/             # i18n translations
│   └── en/
│       └── common.json  # English translations
├── examples/            # Example implementations
│   └── App.example.tsx  # Full example app
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── tailwind.config.js   # Tailwind config
└── README.md            # This file
```

## 🚀 Quick Start

### 1. Installation

```bash
# Install dependencies
npm install
# or
pnpm install
```

### 2. Basic Setup

Create your main app file (e.g., `src/App.tsx`):

```tsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context';
import { Navigation, Section, ScrollProgress } from './components';
import './styles/scrolling.css';
import './styles/theme.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <div className="scroll-snap-container">
          <Navigation />
          <ScrollProgress />

          <Section id="home" background="dark" layout="hero">
            {/* Your hero content */}
          </Section>

          <Section id="about" background="gradient">
            {/* Your about content */}
          </Section>

          {/* Add more sections */}
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
```

### 3. Import Tailwind and Styles

In your main CSS file (e.g., `src/index.css`):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import './styles/scrolling.css';
@import './styles/theme.css';
```

### 4. Configure i18n

Create `src/i18n/index.ts`:

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enCommon from '../locales/en/common.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
      },
    },
    lng: 'en',
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
```

Then import it in your entry point (`src/main.tsx`):

```typescript
import './i18n';
```

## 🎨 Customization Guide

### Theme Configuration

Edit `config/theme.ts` to customize:

- **Colors**: Primary, secondary, background, text colors for light/dark modes
- **Navigation**: Height, blur effect, transitions
- **Scroll Behavior**: Snap type, progress bar styling
- **Animations**: Duration, easing functions
- **Section Defaults**: Height, padding, animations

Example:

```typescript
export const themeConfig = {
  colors: {
    primary: {
      light: '#3b82f6',
      dark: '#60a5fa',
    },
    // ... more colors
  },
  scroll: {
    behavior: 'smooth',
    snapType: 'mandatory',
    // ... more settings
  },
};
```

### Navigation Items

Edit `config/navigation.ts` to add/remove menu items:

```typescript
export const navigationConfig: NavigationItem[] = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'services', label: 'Services', href: '#services' },
  // Add more items
];
```

### Translations

Add translations in `locales/en/common.json`:

```json
{
  "navigation": {
    "home": "Home",
    "services": "Services"
  }
}
```

## 🧩 Component API

### Section Component

The core building block for scroll-snapping sections.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | string | **required** | Unique section identifier |
| `background` | 'light' \| 'dark' \| 'gradient' \| 'image' | 'light' | Background style |
| `backgroundImage` | string | - | URL for background image |
| `overlay` | 'none' \| 'light' \| 'dark' \| 'gradient' | 'none' | Overlay effect |
| `layout` | 'center' \| 'split' \| 'hero' \| 'grid' \| 'custom' | 'center' | Content layout |
| `padding` | 'none' \| 'small' \| 'medium' \| 'large' | 'large' | Section padding |
| `animation` | 'fade' \| 'slide' \| 'scale' \| 'none' | 'fade' | Entry animation |
| `height` | 'screen' \| 'auto' \| 'min-screen' | 'screen' | Section height |
| `className` | string | '' | Additional CSS classes |

**Example:**

```tsx
<Section
  id="features"
  background="gradient"
  layout="grid"
  animation="fade"
  height="screen"
>
  <div className="grid grid-cols-3 gap-8">
    {/* Your content */}
  </div>
</Section>
```

### Navigation Component

Smart navigation bar with automatic section tracking.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | NavigationItem[] | `navigationConfig` | Menu items |
| `onNavigate` | (sectionId: string) => void | - | Callback when section changes |
| `className` | string | '' | Additional CSS classes |

**Example:**

```tsx
<Navigation
  items={customNavItems}
  onNavigate={(sectionId) => console.log(`Navigated to ${sectionId}`)}
/>
```

### ScrollProgress Component

Displays scroll progress indicator at the top of the page.

**Usage:**

```tsx
<ScrollProgress />
```

## 🪝 Custom Hooks

### useDarkMode()

Manages dark mode state with localStorage persistence.

**Returns:** `[isDark: boolean, setIsDark: (value: boolean) => void]`

**Example:**

```tsx
const [isDark, setIsDark] = useDarkMode();

<button onClick={() => setIsDark(!isDark)}>
  Toggle Dark Mode
</button>
```

### useMobileDetection()

Detects mobile devices and screen sizes.

**Returns:** `boolean`

**Example:**

```tsx
const isMobile = useMobileDetection();

return isMobile ? <MobileView /> : <DesktopView />;
```

## 🎭 Context API

### ThemeContext

Global theme state management.

**Usage:**

```tsx
import { ThemeProvider, useTheme } from './context';

// Wrap your app
<ThemeProvider>
  <App />
</ThemeProvider>

// Use in components
const { isDark, toggleDark, setDark } = useTheme();
```

## 🛠️ Utility Functions

### scrollToSection(sectionId, behavior?)

Smoothly scrolls to a section by ID.

```typescript
scrollToSection('about', 'smooth');
```

### getCurrentSection(sectionIds, navHeight?)

Gets the currently visible section.

```typescript
const activeSection = getCurrentSection(['home', 'about', 'contact'], 80);
```

### getScrollProgress()

Returns scroll progress as a percentage (0-100).

```typescript
const progress = getScrollProgress();
```

### isNearTop(threshold?)

Checks if scroll position is near the top.

```typescript
const atTop = isNearTop(20); // within 20px of top
```

## 📱 Responsive Behavior

The template automatically adapts to different screen sizes:

- **Desktop (≥768px)**: Full scroll-snap behavior, keyboard navigation
- **Mobile (<768px)**: Natural scrolling, no snap, optimized touch interactions

This is configured in `config/theme.ts` and can be customized.

## 🎯 Code Style Guidelines

### For AI Developers

When extending this template, follow these principles:

#### 1. **Single Responsibility**
Each file should have one clear purpose. Don't mix concerns.

```tsx
// ✅ GOOD: Dedicated component file
// components/FeatureCard.tsx
export const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => {
  return (
    <div className="feature-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

// ❌ BAD: Mixing multiple unrelated components
// components/Stuff.tsx
export const FeatureCard = ...;
export const UserProfile = ...;
export const Footer = ...;
```

#### 2. **Clear Imports & Exports**
Use barrel exports (index.ts files) for clean imports.

```tsx
// ✅ GOOD
import { Section, Navigation } from './components';

// ❌ BAD
import { Section } from './components/Section';
import { Navigation } from './components/Navigation';
```

#### 3. **Type Everything**
Always use TypeScript types/interfaces.

```tsx
// ✅ GOOD
interface FeatureProps {
  title: string;
  description: string;
  icon?: React.ComponentType;
}

// ❌ BAD
const Feature = ({ title, description, icon }) => { ... }
```

#### 4. **Configuration Over Hardcoding**
Put configurable values in `config/` files.

```tsx
// ✅ GOOD
import { themeConfig } from './config';
const buttonColor = themeConfig.colors.primary.light;

// ❌ BAD
const buttonColor = '#3b82f6';
```

#### 5. **Compose, Don't Duplicate**
Reuse existing components and utilities.

```tsx
// ✅ GOOD
<Section id="features" layout="grid">
  {features.map(feature => <FeatureCard key={feature.id} {...feature} />)}
</Section>

// ❌ BAD
<div className="scroll-snap-section min-h-screen bg-white">
  {/* Recreating Section component manually */}
</div>
```

#### 6. **Descriptive Naming**
Use clear, descriptive names that explain purpose.

```tsx
// ✅ GOOD
const [isNavigationVisible, setIsNavigationVisible] = useState(true);
const handleSectionChange = (sectionId: string) => { ... };

// ❌ BAD
const [visible, setVisible] = useState(true);
const handleChange = (id: string) => { ... };
```

#### 7. **Document Complex Logic**
Add comments for non-obvious behavior.

```tsx
// ✅ GOOD
// Throttle scroll events to 60fps for better performance
const handleScroll = throttle(() => {
  updateActiveSection();
}, 16);

// ❌ BAD
const handleScroll = throttle(() => {
  updateActiveSection();
}, 16);
```

#### 8. **Modular State Management**
Use Context for global state, local state for component-specific state.

```tsx
// ✅ GOOD: Global theme state in context
const { isDark } = useTheme();

// ✅ GOOD: Local UI state in component
const [isExpanded, setIsExpanded] = useState(false);

// ❌ BAD: Mixing global concerns with local state
const [isDark, setIsDark] = useState(false);
const [userSettings, setUserSettings] = useState({});
```

## 🔧 Advanced Customization

### Adding New Sections

1. **Create section in your app:**

```tsx
<Section id="pricing" background="light" layout="grid">
  {/* Your pricing content */}
</Section>
```

2. **Add to navigation config:**

```typescript
// config/navigation.ts
export const navigationConfig = [
  // ... existing items
  { id: 'pricing', label: 'Pricing', href: '#pricing' },
];
```

3. **Add translation:**

```json
// locales/en/common.json
{
  "navigation": {
    "pricing": "Pricing"
  }
}
```

### Creating Custom Hooks

Place new hooks in `hooks/` directory:

```typescript
// hooks/useScrollDirection.ts
import { useState, useEffect } from 'react';

export const useScrollDirection = () => {
  const [direction, setDirection] = useState<'up' | 'down'>('down');
  
  useEffect(() => {
    // Implementation
  }, []);
  
  return direction;
};

// Export in hooks/index.ts
export { useScrollDirection } from './useScrollDirection';
```

### Adding Global State

Create new context providers in `context/`:

```typescript
// context/UserContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
```

## 🎨 Tailwind Best Practices

### Use Tailwind Classes Consistently

```tsx
// ✅ GOOD: Tailwind utility classes
<div className="flex items-center justify-between p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-lg">

// ❌ BAD: Mixing inline styles with Tailwind
<div className="flex p-4" style={{ backgroundColor: '#fff' }}>
```

### Extend Theme in tailwind.config.js

```javascript
theme: {
  extend: {
    colors: {
      brand: {
        primary: '#your-color',
      },
    },
  },
}
```

## 🚨 Common Pitfalls to Avoid

1. **Don't bypass the scroll container**: All sections must be children of `.scroll-snap-container`
2. **Don't hardcode section IDs**: Use the `id` prop consistently
3. **Don't modify core CSS classes**: Extend in your own files
4. **Don't skip TypeScript types**: Type everything for better AI assistance
5. **Don't create duplicate utilities**: Check `utils/` first before creating helpers

## 📦 Building for Production

```bash
npm run build
```

The build process:
1. Type-checks all TypeScript
2. Compiles with Vite
3. Optimizes assets
4. Generates production bundle

## 🧪 Testing Recommendations

While tests aren't included, recommended test structure:

```
tests/
├── components/
│   ├── Navigation.test.tsx
│   ├── Section.test.tsx
│   └── ScrollProgress.test.tsx
├── hooks/
│   ├── useDarkMode.test.ts
│   └── useMobileDetection.test.ts
└── utils/
    └── scrollUtils.test.ts
```

## 🤖 AI Development Tips

When working with AI assistants (like Claude, GPT-4):

1. **Reference this README**: Point AI to this file for context
2. **Show file structure**: Use `tree` command or list relevant files
3. **Provide type definitions**: Share TypeScript interfaces
4. **Request modular changes**: Ask for single-file changes when possible
5. **Validate against patterns**: Check generated code follows guidelines
6. **Test incrementally**: Add features one at a time

## 📄 License

MIT License - Feel free to use this template for any project.

## 🙏 Credits

Created as a foundation for building beautiful, performant scrolling single-page applications with React, TypeScript, and Tailwind CSS.

---

**Happy Building! 🚀**

For questions or issues, refer to the example implementation in `examples/App.example.tsx`.
