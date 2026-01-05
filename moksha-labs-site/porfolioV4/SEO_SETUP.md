# SEO/AEO Setup for Moksha Labs

## ✅ Implemented SEO Features

### 1. **Sitemap Generation**
- ✅ Installed `@nuxtjs/sitemap` module
- ✅ Configured automatic sitemap.xml generation
- ✅ Multi-language sitemap entries (en, tr, it, ar)
- ✅ Proper priority and changefreq settings
- **Access at**: `https://mokshalabs.ie/sitemap.xml`

### 2. **Enhanced robots.txt**
- ✅ Updated with sitemap reference
- ✅ Specific rules for major search engines (Google, Bing, Yahoo)
- ✅ Crawl-delay settings
- **Location**: `/public/robots.txt`

### 3. **Comprehensive Meta Tags**
- ✅ Standard meta tags (description, keywords, author)
- ✅ Robots meta (index, follow, max-image-preview)
- ✅ Theme color for mobile browsers
- ✅ Format detection
- ✅ Viewport optimization

### 4. **Open Graph Tags (Facebook/LinkedIn)**
- ✅ Complete OG implementation
- ✅ Image dimensions (1200x630)
- ✅ Multi-locale support
- ✅ Site name and URL
- ✅ Image alt text

### 5. **Twitter Card Tags**
- ✅ Summary large image card
- ✅ Twitter handle integration
- ✅ Proper image and alt text
- ✅ Title and description optimization

### 6. **Structured Data (Schema.org)**
Implemented three comprehensive JSON-LD schemas:

#### Organization Schema
```json
{
  "@type": "Organization",
  "name": "Moksha Labs",
  "url": "https://mokshalabs.ie",
  "logo": "...",
  "description": "...",
  "contactPoint": "...",
  "sameAs": [social media links]
}
```

#### WebSite Schema
```json
{
  "@type": "WebSite",
  "name": "Moksha Labs",
  "inLanguage": ["en-US", "tr-TR", "it-IT", "ar-SA"]
}
```

#### ProfessionalService Schema
```json
{
  "@type": "ProfessionalService",
  "serviceType": [
    "Web Design & Development",
    "Brand Identity Design",
    "Digital Transformation",
    "Social Media Marketing",
    "SEO & Digital Marketing",
    "Motion Design"
  ],
  "areaServed": ["Ireland", "UK", "Europe", "Turkey", "Middle East"]
}
```

### 7. **Canonical URLs**
- ✅ Canonical link tags implemented
- ✅ Prevents duplicate content issues
- ✅ Points to primary domain

### 8. **Multi-language SEO (Hreflang)**
- ✅ Automatic hreflang tags via @nuxtjs/i18n
- ✅ Proper language codes (en-US, tr-TR, it-IT, ar-SA)
- ✅ RTL support for Arabic
- ✅ Language switcher with proper locale paths

### 9. **Performance & Crawlability**
- ✅ Font preconnect for performance
- ✅ Proper charset and viewport
- ✅ Mobile optimization
- ✅ Apple web app meta tags

---

## ⚠️ Action Required: Create OG Image

You need to create a social media preview image:

### Specifications:
- **Filename**: `og-image.jpg`
- **Location**: `/public/og-image.jpg`
- **Dimensions**: 1200px × 630px (exact)
- **Format**: JPG (or PNG)
- **File size**: < 1MB (ideally < 500KB)
- **Content**: 
  - Moksha Labs branding
  - Tagline: "High-End Digital Agency" or similar
  - Professional, luxury aesthetic
  - No text smaller than 60px (won't be readable as thumbnail)
  - Safe zones: Keep important content away from edges (60px margin)

### Design Tips:
1. Use your brand colors (cream, charcoal, saffron)
2. Include your logo prominently
3. High contrast for readability
4. Test on both light and dark social media themes
5. Avoid too much text - visuals first

### Testing Tools:
- **Facebook**: https://developers.facebook.com/tools/debug/
- **Twitter**: https://cards-dev.twitter.com/validator
- **LinkedIn**: Share the URL and check preview

---

## 🚀 Optional Enhancements (Future)

### 1. **Google Analytics / Tag Manager**
Add tracking to monitor:
- Page views
- User behavior
- Conversion tracking
- Event tracking (form submissions, video plays)

### 2. **Rich Snippets**
Consider adding:
- FAQ schema for common questions
- Review schema (when you have client testimonials)
- Portfolio/CreativeWork schema for individual projects

### 3. **Performance Optimization**
- Image lazy loading (already implemented)
- Critical CSS inlining
- Service worker for offline support
- Web Vitals optimization (LCP, FID, CLS)

### 4. **Additional Social Platforms**
- Pinterest meta tags
- WhatsApp preview tags
- Telegram preview optimization

### 5. **Local SEO** (if relevant)
- Google Business Profile integration
- Local business schema
- NAP (Name, Address, Phone) consistency

### 6. **Blog/Content**
If you add a blog:
- Article schema
- Breadcrumb schema
- Author schema
- Publishing dates

---

## 📊 SEO Checklist for Launch

Before going live, verify:

- [ ] `og-image.jpg` created and placed in `/public/`
- [ ] Test sitemap at `/sitemap.xml`
- [ ] Verify robots.txt is accessible
- [ ] Test OG tags on Facebook Debugger
- [ ] Test Twitter Card on Twitter Validator
- [ ] Validate structured data on Google Rich Results Test
- [ ] Check mobile-friendliness on Google Mobile-Friendly Test
- [ ] Verify canonical URLs are correct
- [ ] Test all language versions
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Set up Google Analytics/Search Console
- [ ] Monitor for crawl errors after launch

---

## 🔗 Useful Resources

### Testing Tools:
- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Google Mobile-Friendly Test**: https://search.google.com/test/mobile-friendly
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **Schema Markup Validator**: https://validator.schema.org/
- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/

### Monitoring:
- **Google Search Console**: https://search.google.com/search-console
- **Bing Webmaster Tools**: https://www.bing.com/webmasters
- **Ahrefs**: https://ahrefs.com/ (for backlinks and keywords)
- **SEMrush**: https://www.semrush.com/ (comprehensive SEO suite)

### Learning:
- **Google SEO Starter Guide**: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- **Schema.org Documentation**: https://schema.org/docs/documents.html
- **Nuxt SEO Best Practices**: https://nuxt.com/docs/getting-started/seo-meta

---

## 📝 Notes

- All changes are production-ready
- Sitemap will auto-generate on build
- Multi-language support is fully configured
- Structured data follows Google's guidelines
- Mobile optimization is complete
- Social media previews configured (pending og-image.jpg)

**Last Updated**: January 2026

