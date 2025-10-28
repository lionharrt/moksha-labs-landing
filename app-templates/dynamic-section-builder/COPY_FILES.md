# File Copy Guide

To complete the template setup, copy these files from the Power Solar project and adapt them with generic content:

## Core System Files (copy and adapt)

```bash
# From apps/frontend/src/ to dynamic-section-builder/src/

# Context
cp apps/frontend/src/contexts/VariantContext.tsx src/contexts/
# Update section names: whoWeAre→about, didYouKnow→testimonials, showcase→portfolio, invest→(remove), benefits→features
# Update localStorage key: 'powersolar-variants' → 'dsb-variants'

# Config  
cp apps/frontend/src/config/variants.ts src/config/
# Keep all 11 themes as-is
# Update SECTION_VARIANTS keys to: hero, about, features, services, portfolio, process, testimonials, contact

# Components
cp apps/frontend/src/components/DevToolbar.tsx src/components/
cp apps/frontend/src/components/ThemeWrapper.tsx src/components/
cp apps/frontend/src/components/Navigation.tsx src/components/
# Generic-ize all text, remove company-specific branding
cp apps/frontend/src/components/Footer.tsx src/components/
# Generic-ize all text
cp apps/frontend/src/components/PowerSolarSection.tsx src/components/Section.tsx
# Rename component to just "Section"

# i18n
cp -r apps/frontend/src/i18n src/
cp -r apps/frontend/src/locales/en src/locales/
# Update all JSON files with generic placeholder text

# CSS
cp apps/frontend/src/App.css src/
cp apps/frontend/src/main.tsx src/
cp apps/frontend/src/App.tsx src/
# Remove Power Solar specific imports

# Pages
cp apps/frontend/src/pages/PowerSolarHomePage.tsx src/pages/HomePage.tsx
# Update all imports and section names
```

## Variant Files (create generic versions)

For each section, create 3 variants with placeholder content:

### src/variants/HeroVariants.tsx
- Variant A: Video hero with CTA
- Variant B: Image hero with gradient overlay
- Variant C: Minimal text hero

### src/variants/AboutVariants.tsx  
- Variant A: Story with team photo placeholder
- Variant B: Stats grid
- Variant C: Video introduction placeholder

### src/variants/FeaturesVariants.tsx
- Variant A: 3x2 grid
- Variant B: Feature cards with icons
- Variant C: Vertical list

### src/variants/ServicesVariants.tsx
- Variant A: Side-by-side cards
- Variant B: Stacked with large icons
- Variant C: Tabbed interface

### src/variants/PortfolioVariants.tsx
- Variant A: Masonry grid
- Variant B: Featured project cards
- Variant C: Before/after style

### src/variants/ProcessVariants.tsx
- Variant A: Numbered cards in row
- Variant B: Horizontal timeline
- Variant C: Vertical stepper

### src/variants/TestimonialsVariants.tsx
- Variant A: Carousel/slider
- Variant B: Grid of quote cards
- Variant C: Featured testimonial with smaller ones

### src/variants/ContactVariants.tsx
- Variant A: Centered form
- Variant B: Split (info left, form right)
- Variant C: Compact inline form

## Placeholder Content Guidelines

- Company Name: "YourCompany" / "Your Company Name"
- Tagline: "Building Amazing Products"
- Phone: "+1-555-0100"
- Email: "hello@yourcompany.com"
- Address: "123 Main Street, City, State 12345"
- Features: "Feature 1", "Feature 2", etc.
- Services: "Service A", "Service B", etc.
- Testimonials: "John D.", "Sarah M." with generic quotes
- Images: Use gradient placeholders with text "Add Image Here"

## Quick Adaptation Script

I'll create an automated script in the next message to handle all these copies and replacements automatically.

