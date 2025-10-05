# Dynamic Section Builder

A powerful React SPA template with dynamic section variants, theme switching, and reorderable sections. Built for rapid prototyping and production deployment.

---

## 🎯 Features

✅ **Dynamic Section Variants** - Each section has 3 design variants (A, B, C)  
✅ **Section Reordering** - Drag-and-drop section order via dev toolbar  
✅ **11 Theme Variants** - Instant theme switching with CSS variables  
✅ **i18n Support** - Multi-language ready (English default)  
✅ **Dev Toolbar** - Visual variant/theme switcher for client demos  
✅ **Persistent State** - localStorage saves selections across sessions  
✅ **Responsive Design** - Mobile-first with TailwindCSS  
✅ **Production Ready** - TypeScript, ESLint, optimized builds  

---

## 📦 What's Included

### **Core System**
- `VariantContext` - Global state for themes, variants, and section order
- `DevToolbar` - Visual controls for switching themes, variants, and reordering sections
- `ThemeWrapper` - Applies CSS variables for dynamic theming
- `variants.ts` - Configuration for all themes and section variants

### **Generic Sections** (3 variants each)
1. **Hero** - Swappable hero with CTA (Video, Image, Minimal)
2. **About** - Company introduction (Story, Stats, Video)
3. **Features** - Product/service features (Grid, Cards, List)
4. **Services** - Service offerings (Side-by-Side, Stacked, Tabbed)
5. **Portfolio** - Project showcase (Masonry, Featured, Before/After)
6. **Process** - How it works (Cards, Timeline, Vertical)
7. **Testimonials** - Social proof (Carousel, Grid, Featured)
8. **Contact** - Contact form (Centered, Split, Compact)

### **Components**
- `Navigation` - Responsive navbar with smooth scrolling
- `Footer` - Sitemap, contact info, social links
- `Section` - Base section wrapper component

### **i18n**
- English translations (default)
- Easy to add more languages
- No hardcoded strings

---

## 🚀 Quick Start

### **1. Extract Template**
```bash
# Copy the dynamic-section-builder folder to your new project
cp -r dynamic-section-builder my-new-project
cd my-new-project
```

### **2. Install Dependencies**
```bash
npm install
# or
pnpm install
```

### **3. Customize Branding**
Edit `src/locales/en/common.json`:
```json
{
  "company": {
    "name": "Your Company Name",
    "tagline": "Your Tagline",
    "email": "hello@yourcompany.com",
    "phone": "+1-234-567-8900"
  }
}
```

### **4. Update Theme Colors** (Optional)
Edit `src/config/variants.ts` - Theme 1 is your default brand colors.

### **5. Run Development Server**
```bash
npm run dev
# Visit http://localhost:5173
```

---

## 🎨 Using the Dev Toolbar

The dev toolbar appears in the bottom-right corner (only in dev mode or with `?devmode=true`).

### **Features:**
- **Theme Switcher** - Try all 11 themes instantly
- **Section Variants** - Switch between A/B/C variants for each section
- **Reorder Sections** - Move sections up/down, then click "Apply Order"
- **Reset All** - Return to defaults

### **For Client Demos:**
1. Open the site with `?devmode=true` in production
2. Let clients choose themes and layouts
3. Note their selections
4. Apply the final choices (see below)

---

## 🔧 Customization Guide

### **Add a New Section**

1. **Create variant file:** `src/variants/NewSectionVariants.tsx`
```tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Section } from '../components/Section';

export const NewSectionVariantA: React.FC = () => {
  const { t } = useTranslation(['home']);
  
  return (
    <Section id="new-section" background="light" height="auto">
      <h2>{t('home:newSection.title')}</h2>
      {/* Your content */}
    </Section>
  );
};

export const NewSectionVariantB: React.FC = () => {
  // Variant B
};

export const NewSectionVariantC: React.FC = () => {
  // Variant C
};
```

2. **Add to config:** `src/config/variants.ts`
```typescript
export const SECTION_VARIANTS = {
  // ... existing sections
  newSection: {
    A: { id: 'A', name: 'Layout One', description: 'First layout' },
    B: { id: 'B', name: 'Layout Two', description: 'Second layout' },
    C: { id: 'C', name: 'Layout Three', description: 'Third layout' },
  },
};
```

3. **Add to context:** `src/contexts/VariantContext.tsx`
```typescript
interface VariantState {
  sections: {
    // ... existing
    newSection: string;
  };
  sectionOrder: string[]; // Add 'newSection' to default order
}
```

4. **Add to HomePage:** `src/pages/HomePage.tsx`
```typescript
import { NewSectionVariantA, NewSectionVariantB, NewSectionVariantC } from '../variants/NewSectionVariants';

const newSectionVariants = { A: NewSectionVariantA, B: NewSectionVariantB, C: NewSectionVariantC };
const NewSectionComponent = newSectionVariants[state.sections.newSection];

const sectionMap = {
  // ... existing
  newSection: <NewSectionComponent key="newSection" />,
};
```

5. **Add translations:** `src/locales/en/home.json`
```json
{
  "newSection": {
    "title": "New Section Title",
    "content": "Your content here"
  }
}
```

The section will automatically appear in the dev toolbar!

---

### **Add a New Theme**

Edit `src/config/variants.ts`:

```typescript
export const THEME_VARIANTS: Record<number, ThemeVariant> = {
  // ... existing themes
  12: { // Next theme ID
    id: 12,
    name: 'My New Theme',
    colors: {
      primary: {
        50: '#...', // Lightest
        500: '#...', // Main brand color
        900: '#...', // Darkest
      },
      secondary: { /* ... */ },
      accent: { /* ... */ },
    },
  },
};
```

Update `DevToolbar.tsx` button array:
```tsx
{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((themeId) => ( /* ... */ ))}
```

---

### **Apply Final Selections (Remove Dev Toolbar)**

Once you've chosen your final theme and variants:

1. **Set defaults in** `src/contexts/VariantContext.tsx`:
```typescript
const defaultState: VariantState = {
  theme: 5, // Your chosen theme
  sections: {
    hero: 'B',
    about: 'A',
    // ... your final variants
  },
  sectionOrder: ['hero', 'about', ...], // Your final order
};
```

2. **Hide dev toolbar in** `src/components/DevToolbar.tsx`:
```typescript
const shouldShow = import.meta.env.DEV; // Only show in dev mode
```

3. **Optional: Delete unused variants**
Keep only the variants you're using to reduce bundle size.

---

## 🌍 Adding Languages

1. **Create new locale folder:** `src/locales/es/` (for Spanish)

2. **Copy English files:**
```bash
cp src/locales/en/*.json src/locales/es/
```

3. **Translate content** in each JSON file

4. **Add to i18n config:** `src/i18n/config.ts`
```typescript
import es from '../locales/es/common.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { /* ... */ },
    es: {
      common: es,
      // ... other Spanish files
    },
  },
  // ...
});
```

5. **Add language switcher** to Navigation component

---

## 📁 Project Structure

```
dynamic-section-builder/
├── src/
│   ├── components/
│   │   ├── DevToolbar.tsx          # Variant switcher UI
│   │   ├── ThemeWrapper.tsx        # Applies theme CSS variables
│   │   ├── Navigation.tsx          # Navbar
│   │   ├── Footer.tsx              # Footer
│   │   └── Section.tsx             # Base section wrapper
│   ├── contexts/
│   │   └── VariantContext.tsx      # Global state management
│   ├── variants/
│   │   ├── HeroVariants.tsx        # Hero section (A, B, C)
│   │   ├── AboutVariants.tsx       # About section (A, B, C)
│   │   ├── FeaturesVariants.tsx    # Features section (A, B, C)
│   │   ├── ServicesVariants.tsx    # Services section (A, B, C)
│   │   ├── PortfolioVariants.tsx   # Portfolio section (A, B, C)
│   │   ├── ProcessVariants.tsx     # Process section (A, B, C)
│   │   ├── TestimonialsVariants.tsx# Testimonials section (A, B, C)
│   │   └── ContactVariants.tsx     # Contact section (A, B, C)
│   ├── pages/
│   │   └── HomePage.tsx            # Main page (renders dynamic sections)
│   ├── config/
│   │   └── variants.ts             # Theme + variant configuration
│   ├── locales/
│   │   └── en/
│   │       ├── common.json         # Common translations
│   │       ├── navigation.json     # Nav translations
│   │       └── home.json           # Page content
│   ├── i18n/
│   │   └── config.ts               # i18n setup
│   ├── App.tsx                     # Root component
│   ├── App.css                     # Global styles + CSS variables
│   └── main.tsx                    # Entry point
├── public/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md (this file)
```

---

## 🎯 Best Practices

### **For Development**
- Use the dev toolbar for rapid prototyping
- Test all variants before choosing finals
- Check mobile responsiveness for each variant
- Use `console.log(state)` in VariantContext to debug

### **For Production**
- Set final theme and variants in `defaultState`
- Hide or remove dev toolbar
- Delete unused variant components
- Run `npm run build` and test the production build
- Optimize images and assets

### **For Client Demos**
- Deploy with `?devmode=true` support
- Walk clients through theme options
- Let them choose section layouts
- Document their preferences
- Apply selections to codebase

---

## 🚀 Deployment

### **Option 1: Firebase Hosting**
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### **Option 2: Vercel**
```bash
npm install -g vercel
vercel
```

### **Option 3: Netlify**
```bash
npm run build
# Drag dist/ folder to netlify.com
```

---

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **react-i18next** - Internationalization
- **React Router** - Routing
- **React Helmet** - SEO meta tags

---

## 📝 License

This template is open-source and free to use for any project.

---

## 🤝 Support

For questions or issues, refer to the inline code comments or the customization examples above.

---

## 🎉 Happy Building!

This template is designed to save you weeks of development time. Clone it, customize it, and ship beautiful websites faster than ever.

**Pro Tip:** Use the dev toolbar during client meetings to let them choose their favorite layouts in real-time. It's a game-changer for closing deals! 🚀

