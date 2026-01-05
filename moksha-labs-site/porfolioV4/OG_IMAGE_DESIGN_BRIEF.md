# OG Image Design Brief - Moksha Labs

## File Specifications

### Technical Requirements
- **Filename**: `og-image.jpg`
- **Final Location**: `/public/og-image.jpg`
- **Canvas Size**: 1200px × 630px (exact)
- **Format**: JPG or PNG
- **Color Mode**: RGB
- **File Size**: Under 500KB (max 1MB)
- **Resolution**: 72 DPI (web standard)

---

## Design Layout

### Canvas Setup
```
┌─────────────────────────────────────────────────────────────┐
│                         1200px width                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Safe Zone (60px margin all sides)                     │  │
│  │                                                        │  │
│  │              ┌─────────────────────┐                  │  │
│  │              │   LOTUS LOGO        │  ← 320-400px     │  │
│  │              │   (centered)        │                  │  │
│  │              └─────────────────────┘                  │  │
│  │                                                        │  │
│  │              MOKSHA LABS                               │  │ 630px
│  │              ─────────────                             │  │ height
│  │                                                        │  │
│  │         High-End Digital Agency                        │  │
│  │                                                        │  │
│  │  Immersive Experiences • Luxury Branding • Motion      │  │
│  │                                                        │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Brand Colors

### Primary Colors
```css
Cream Background: #FDFBF7 (or RGB: 253, 251, 247)
Charcoal Text:    #1A1A1A (or RGB: 26, 26, 26)
Saffron Accent:   #D97706 (or RGB: 217, 119, 6)
```

### Color Usage
- **Background**: Use cream (#FDFBF7) as the main background
- **Logo**: Keep as black/charcoal (#1A1A1A)
- **Text**: Charcoal (#1A1A1A) for main text
- **Accent Line**: Saffron (#D97706) for the decorative line
- **Tagline**: Charcoal with 60% opacity (#1A1A1A99)

---

## Typography

### Font: Inter (primary)
**Available at**: https://fonts.google.com/specimen/Inter

### Text Hierarchy

#### 1. Logo/Brand Name - "MOKSHALABS"
- **Font**: Inter Black (900 weight)
- **Size**: 72-84px
- **Style**: "MOKSHA" in regular weight, "LABS" in italic serif (Playfair Display)
- **Color**: Charcoal (#1A1A1A)
- **Position**: Center, below logo
- **Letter Spacing**: -0.02em (tight)

#### 2. Decorative Line
- **Width**: 200-250px
- **Height**: 2px
- **Color**: Saffron (#D97706)
- **Position**: Centered, below brand name (20px gap)
- **Style**: Solid line

#### 3. Main Tagline - "High-End Digital Agency"
- **Font**: Inter Bold (700 weight)
- **Size**: 36-42px
- **Color**: Charcoal (#1A1A1A)
- **Position**: Center, below decorative line (24px gap)
- **Letter Spacing**: 0.02em

#### 4. Services Line
- **Text**: "Immersive Experiences • Luxury Branding • Motion Design"
- **Font**: Inter Medium (500 weight)
- **Size**: 20-24px
- **Color**: Charcoal at 60% opacity (#1A1A1A99)
- **Position**: Center, below main tagline (16px gap)
- **Letter Spacing**: 0.05em (wider)

---

## Logo Specifications

### Lotus Logo
- **Source**: Use the lotus flower logo (black outline)
- **Size**: 320-400px width (maintain aspect ratio)
- **Position**: Top-center of the composition
- **Color**: Black/Charcoal (#1A1A1A)
- **Spacing**: 80-100px from top edge
- **Style**: Keep the clean line art style intact

---

## Layout Measurements (Exact)

```
Top Margin: 80px
├── Lotus Logo: 360px × ~300px (proportional)
│   └── Gap: 40px
├── "MOKSHALABS": 78px height
│   └── Gap: 20px
├── Decorative Line: 220px × 2px
│   └── Gap: 24px
├── "High-End Digital Agency": 40px height
│   └── Gap: 16px
└── Services Line: 24px height
Bottom Margin: ~60px
```

### Horizontal Centering
- All text elements: Centered horizontally
- Logo: Centered horizontally
- Decorative line: Centered horizontally

---

## Design Guidelines

### Do's ✅
- Keep adequate white space around all elements
- Maintain high contrast (dark on light)
- Use exact brand colors
- Center all elements horizontally
- Keep logo crisp and clean
- Test readability at small sizes (Facebook feed thumbnails)
- Save with high quality (90-95% JPEG quality)

### Don'ts ❌
- Don't use gradients
- Don't add shadows or effects
- Don't use colors outside the brand palette
- Don't make text smaller than 18px
- Don't place important elements within 60px of edges
- Don't use more than 3 font weights
- Don't over-compress (keep quality high)

---

## Example Composition (Vertical Spacing)

```
     ┌─────────────────────────────┐
     │         [80px gap]          │
     │                             │
     │      🪷 [Lotus Logo]         │
     │         360×300px           │
     │                             │
     │         [40px gap]          │
     │                             │
     │       MOKSHALABS            │  78px
     │                             │
     │         [20px gap]          │
     │      ───────────            │  2px
     │         [24px gap]          │
     │                             │
     │   High-End Digital Agency   │  40px
     │                             │
     │         [16px gap]          │
     │  Immersive Experiences •    │  24px
     │  Luxury Branding • Motion   │
     │                             │
     │         [60px gap]          │
     └─────────────────────────────┘
          Total: 630px height
```

---

## Alternative Layout (Option B - Horizontal)

If you prefer a side-by-side layout:

```
┌────────────────────────────────────────────────────┐
│                                                    │
│   🪷            MOKSHALABS                          │
│  Logo              ─────────                       │
│ 280px         High-End Digital Agency              │
│               Immersive • Luxury • Motion          │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## Testing Requirements

### Before Finalizing:
1. **Preview at thumbnail size** (150×150px) - logo should still be recognizable
2. **Test on dark backgrounds** (Twitter dark mode, LinkedIn dark theme)
3. **Test on mobile** (WhatsApp, Messages preview)
4. **Validate with tools**:
   - Facebook Debugger: https://developers.facebook.com/tools/debug/
   - Twitter Card Validator: https://cards-dev.twitter.com/validator
   - LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

---

## Delivery Checklist

- [ ] Final file is exactly 1200×630px
- [ ] File size is under 500KB
- [ ] Saved as `og-image.jpg` in high quality
- [ ] All text is readable at small sizes
- [ ] Brand colors match exactly
- [ ] Logo is centered and crisp
- [ ] No elements within 60px of edges
- [ ] Tested on Facebook/Twitter/LinkedIn validators

---

## Quick Design Tools (if doing it yourself)

### Recommended Tools:
1. **Canva** (easiest): https://canva.com
   - Use "Custom Size" template: 1200×630px
   - Upload logo, add text, export

2. **Figma** (professional): https://figma.com
   - Create 1200×630px frame
   - Import logo as SVG if available
   - Export as JPG at 2x quality

3. **Photoshop/Illustrator** (advanced)
   - Create new document: 1200×630px, 72 DPI, RGB
   - Place logo, add text layers
   - Export as JPG (Quality 10-12)

---

## Fonts Download

If using design software:

1. **Inter**: https://fonts.google.com/specimen/Inter
   - Download weights: 400, 500, 700, 900
   
2. **Playfair Display** (for "LABS" italic): https://fonts.google.com/specimen/Playfair+Display
   - Download weight: 400 Italic

---

## Quick Mockup Text (Copy-Paste Ready)

```
MOKSHALABS
─────────
High-End Digital Agency
Immersive Experiences • Luxury Branding • Motion Design
```

---

**Need Help?** 
- Share a draft and we can review together
- Adjust spacing/sizing as needed to achieve perfect balance
- The goal: Professional, minimal, instantly recognizable

