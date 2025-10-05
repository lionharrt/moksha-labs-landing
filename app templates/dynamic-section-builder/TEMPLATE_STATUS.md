# Template Status

## ✅ Completed

- [x] Project structure created
- [x] README.md with full documentation
- [x] SETUP.md with installation guide
- [x] package.json with all dependencies
- [x] Build configuration (Vite, TypeScript, Tailwind)
- [x] Helper scripts (create-template.sh)
- [x] Documentation (COPY_FILES.md)

## 🔄 To Complete

The template structure is ready. To complete the setup, you need to:

### 1. Copy Core System Files

Run from the root `powersolar-project` directory:

```bash
# Copy and adapt core files
cp -r apps/frontend/src/contexts dynamic-section-builder/src/
cp -r apps/frontend/src/components/DevToolbar.tsx dynamic-section-builder/src/components/
cp -r apps/frontend/src/components/ThemeWrapper.tsx dynamic-section-builder/src/components/
cp -r apps/frontend/src/config/variants.ts dynamic-section-builder/src/config/
cp apps/frontend/src/App.css dynamic-section-builder/src/
cp apps/frontend/src/App.tsx dynamic-section-builder/src/
cp apps/frontend/src/main.tsx dynamic-section-builder/src/
cp -r apps/frontend/src/i18n dynamic-section-builder/src/
```

### 2. Create Generic Components

Copy Navigation, Footer, and Section components:

```bash
cp apps/frontend/src/components/Navigation.tsx dynamic-section-builder/src/components/
cp apps/frontend/src/components/Footer.tsx dynamic-section-builder/src/components/
cp apps/frontend/src/components/PowerSolarSection.tsx dynamic-section-builder/src/components/Section.tsx
```

### 3. Create Variant Files

Create these 8 variant files (or copy and adapt from Power Solar):

- `src/variants/HeroVariants.tsx` - 3 variants (Video, Image, Minimal)
- `src/variants/AboutVariants.tsx` - 3 variants (Story, Stats, Video)
- `src/variants/FeaturesVariants.tsx` - 3 variants (Grid, Cards, List)
- `src/variants/ServicesVariants.tsx` - 3 variants (Side-by-Side, Stacked, Tabbed)
- `src/variants/PortfolioVariants.tsx` - 3 variants (Masonry, Featured, Before/After)
- `src/variants/ProcessVariants.tsx` - 3 variants (Cards, Timeline, Vertical)
- `src/variants/TestimonialsVariants.tsx` - 3 variants (Carousel, Grid, Featured)
- `src/variants/ContactVariants.tsx` - 3 variants (Centered, Split, Compact)

### 4. Create HomePage

```bash
cp apps/frontend/src/pages/PowerSolarHomePage.tsx dynamic-section-builder/src/pages/HomePage.tsx
```

Then update imports and section names to generic versions.

### 5. Update i18n Files

Copy and make generic:

```bash
cp -r apps/frontend/src/locales dynamic-section-builder/src/
```

Update all JSON files with placeholder content like:
- Company: "YourCompany"
- Phone: "+1-555-0100"
- Email: "hello@yourcompany.com"
- Generic features, services, etc.

### 6. Find & Replace

Search and replace in all copied files:

- `PowerSolar` → `YourCompany`
- `Power Solar` → `Your Company`
- `powersolar` → `yourcompany`
- `PowerSolarSection` → `Section`
- `PowerSolarHomePage` → `HomePage`
- `powersolar-variants` → `dsb-variants`

Section name replacements in VariantContext:
- `whoWeAre` → `about`
- `benefits` → `features`
- `didYouKnow` → `testimonials`
- `showcase` → `portfolio`
- Remove `invest` section
- Keep `services`, `process`, `contact`

### 7. Test

```bash
cd dynamic-section-builder
npm install
npm run dev
```

---

## 🚀 Quick Complete Command

Want to do it all at once? Run this from the project root:

```bash
# Copy all source files
cp -r apps/frontend/src/{contexts,components,config,pages,i18n,locales} dynamic-section-builder/src/
cp apps/frontend/src/{App.css,App.tsx,main.tsx} dynamic-section-builder/src/

# Copy variant files
mkdir -p dynamic-section-builder/src/variants
cp apps/frontend/src/variants/*.tsx dynamic-section-builder/src/variants/

# Now do the find/replace manually or with:
cd dynamic-section-builder
find src -type f -name "*.tsx" -o -name "*.ts" -o -name "*.json" | xargs sed -i.bak 's/PowerSolar/YourCompany/g'
find src -type f -name "*.tsx" -o -name "*.ts" -o -name "*.json" | xargs sed -i.bak 's/Power Solar/Your Company/g'
find src -type f -name "*.bak" -delete

# Install and test
npm install
npm run dev
```

---

## 📋 Final Checklist

- [ ] All source files copied
- [ ] Find/replace completed
- [ ] Section names updated in VariantContext
- [ ] i18n files have generic content
- [ ] `npm install` succeeds
- [ ] `npm run dev` runs without errors
- [ ] Dev toolbar appears and works
- [ ] Theme switching works
- [ ] Section reordering works
- [ ] All 8 sections render
- [ ] Navigation and Footer are generic

---

## 💡 Alternative: Manual Creation

If you prefer to create files manually rather than copying:

1. Follow the structure in `README.md`
2. Use the Power Solar variants as reference for layout patterns
3. Replace all specific content with generic placeholders
4. Test each section as you build

The advantage of this approach is you'll have cleaner, purpose-built code without any leftover Power Solar references.

---

Ready to extract and use! 🎉

