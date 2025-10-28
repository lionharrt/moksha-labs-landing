# Setup Guide

This guide will help you get the Dynamic Section Builder up and running in minutes.

---

## 📋 Prerequisites

- Node.js 18+ or 20+
- npm, pnpm, or yarn
- Code editor (VS Code recommended)

---

## 🚀 Installation

### 1. Copy the template to your project location
```bash
cp -r dynamic-section-builder /path/to/your/new-project
cd /path/to/your/new-project
```

### 2. Install dependencies
```bash
npm install
# or
pnpm install
# or
yarn install
```

### 3. Start the development server
```bash
npm run dev
```

Visit `http://localhost:5173` - you should see the template running!

---

## 🎨 First Customizations

### Change Company Name & Branding

Edit `src/locales/en/common.json`:
```json
{
  "company": {
    "name": "YourCompany",
    "tagline": "Your Amazing Tagline",
    "email": "hello@yourcompany.com",
    "phone": "+1-555-0100",
    "address": "123 Main St, City, State 12345"
  }
}
```

### Set Your Brand Colors

Edit `src/config/variants.ts` - Theme 1 is your default:
```typescript
1: {
  id: 1,
  name: 'Your Brand',
  colors: {
    primary: {
      500: '#YOUR_BRAND_COLOR', // Main brand color
      // ... add other shades
    },
    secondary: { /* ... */ },
    accent: { /* ... */ },
  },
},
```

Tip: Use a color palette generator like coolors.co or tailwindcss.com/docs/customizing-colors

---

## 🔧 Common Customizations

### Add Your Logo

1. Place your logo in `public/logo.png`
2. Update Navigation component to use it:

```tsx
<img src="/logo.png" alt="Company Logo" className="h-12" />
```

### Change Default Hero Video/Image

Edit `src/variants/HeroVariants.tsx` and update the placeholder URLs with your assets.

### Remove Sections You Don't Need

1. Delete the variant file from `src/variants/`
2. Remove from `src/config/variants.ts` → `SECTION_VARIANTS`
3. Remove from `src/contexts/VariantContext.tsx` → `sections` and `sectionOrder`
4. Remove from `src/pages/HomePage.tsx` → imports and `sectionMap`

### Add Google Analytics

In `index.html`, add before `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🌍 Adding More Languages

1. Duplicate the `src/locales/en/` folder to `src/locales/es/` (for Spanish)
2. Translate all JSON files
3. Import in `src/i18n/config.ts`:

```typescript
import esCommon from '../locales/es/common.json';
import esNavigation from '../locales/es/navigation.json';
import esHome from '../locales/es/home.json';

resources: {
  en: { /* ... */ },
  es: {
    common: esCommon,
    navigation: esNavigation,
    home: esHome,
  },
},
```

4. Add language switcher to Navigation

---

## 📦 Building for Production

```bash
npm run build
```

The optimized files will be in the `dist/` folder.

Test the production build locally:
```bash
npm run preview
```

---

## 🚀 Deployment Options

### Firebase Hosting (Recommended)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Select your project, set public directory to 'dist'
npm run build
firebase deploy
```

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
1. Run `npm run build`
2. Drag the `dist/` folder to netlify.com
3. Or connect your Git repository

### Any Static Host
Upload the contents of `dist/` to your web server.

---

## 🐛 Troubleshooting

### Dev toolbar not showing
- Check you're in dev mode (`npm run dev`)
- Or add `?devmode=true` to the URL
- Verify `DevToolbar.tsx` → `shouldShow` is true

### Theme colors not changing
- Clear browser cache
- Check `ThemeWrapper.tsx` is wrapping your app
- Verify CSS variables are defined in `App.css`

### Sections not reordering
- Check `sectionOrder` exists in localStorage
- Try "Reset All" button in dev toolbar
- Clear localStorage and refresh

### Build errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

---

## 💡 Tips

1. **Use the dev toolbar during client demos** - Let them choose layouts live!
2. **Test all variants** before finalizing - some may not fit your content
3. **Mobile-first** - Always check responsive design
4. **Optimize images** - Use WebP format and lazy loading
5. **Set final defaults** before production deployment

---

## 📚 Next Steps

1. Read the main `README.md` for full documentation
2. Explore the example variants in `src/variants/`
3. Check `src/config/variants.ts` to understand theme configuration
4. Customize content in `src/locales/en/` JSON files

---

Happy building! 🎉

