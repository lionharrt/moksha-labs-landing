# Deployment Guide - Moksha Labs Portfolio

## Firebase Setup

### Prerequisites
- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase project created at https://console.firebase.google.com

### Initial Setup

1. **Login to Firebase**
   ```bash
   firebase login
   ```

2. **Update Project ID**
   Edit `.firebaserc` and replace `YOUR_FIREBASE_PROJECT_ID` with your actual Firebase project ID.

3. **Build the Project**
   ```bash
   pnpm build
   ```
   This creates a static export in the `out/` directory.

4. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```

### Quick Deploy (After Initial Setup)

```bash
pnpm build && firebase deploy
```

### Configuration Files

- **`firebase.json`** - Firebase Hosting configuration
  - Public directory: `out/` (Next.js static export)
  - SPA rewrites configured
  - Optimal cache headers for static assets

- **`next.config.js`** - Next.js configuration
  - Static export enabled
  - Image optimization disabled (required for static export)
  - Three.js transpilation configured
  - GLSL shader support

- **`.firebaserc`** - Firebase project alias
  - Update with your project ID

### Build Output

The build creates:
- `out/` - Static HTML, CSS, JS files ready for hosting
- `out/_next/` - Next.js static chunks
- `out/index.html` - Entry point

### Troubleshooting

**Build fails:**
- Ensure all dependencies installed: `pnpm install`
- Check Node version: Should be 18+

**Deploy fails:**
- Verify Firebase login: `firebase login --reauth`
- Check project ID in `.firebaserc`
- Ensure Firebase Hosting is enabled in your project

**3D elements not working after deploy:**
- Check browser console for errors
- Verify Three.js and R3F versions are compatible
- Ensure GLSL files are being loaded correctly

### Performance Tips

After deployment, check:
- Lighthouse scores (aim for 90+ on Performance)
- WebGL rendering performance (should be 60fps on desktop)
- Loading time (should be < 3s on 3G)

### Custom Domain (Optional)

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Follow DNS setup instructions
4. Wait for SSL certificate provisioning (~15 minutes)

### Environment-Specific Deploys

Create additional Firebase projects for staging:

```bash
firebase use --add
# Select staging project
# Set alias: staging

firebase deploy --only hosting --project staging
```

---

**Live Site:** After deployment, your site will be at:
`https://YOUR_PROJECT_ID.web.app`
or
`https://YOUR_PROJECT_ID.firebaseapp.com`

