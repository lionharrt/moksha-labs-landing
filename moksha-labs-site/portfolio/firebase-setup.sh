#!/bin/bash

# Firebase Setup Script for Moksha Labs Portfolio
# Run this to configure Firebase Hosting

echo "🔥 Setting up Firebase Hosting for Moksha Labs Portfolio"
echo ""

# Step 1: Login to Firebase (if not already logged in)
echo "Step 1: Logging in to Firebase..."
firebase login

# Step 2: Initialize Firebase Hosting
echo ""
echo "Step 2: Initializing Firebase Hosting..."
echo "When prompted:"
echo "  - Select 'Hosting' (use spacebar to select)"
echo "  - Choose your existing Firebase project or create a new one"
echo "  - Public directory: 'out' (for Next.js static export)"
echo "  - Configure as SPA: Yes"
echo "  - Set up automatic builds with GitHub: No (for now)"
echo ""

firebase init hosting

# Step 3: Update next.config.js to enable static export
echo ""
echo "Step 3: Creating next.config.js with static export..."

cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static export
  images: {
    unoptimized: true  // Required for static export
  },
  webpack: (config) => {
    // GLSL shader support
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader'],
    });

    return config;
  },
  transpilePackages: ['three'],
};

module.exports = nextConfig;
EOF

echo ""
echo "✅ Firebase setup complete!"
echo ""
echo "Next steps:"
echo "  1. Build: pnpm build"
echo "  2. Deploy: firebase deploy"

