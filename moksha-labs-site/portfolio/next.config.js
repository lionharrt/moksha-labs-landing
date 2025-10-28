/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static export for Firebase Hosting
  images: {
    unoptimized: true  // Required for static export
  },
  // Exclude archive directory from compilation
  webpack: (config) => {
    // GLSL shader support
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader'],
    });
    
    // Exclude archive from being processed
    config.module.rules.push({
      test: /\.tsx?$/,
      exclude: /archive/,
    });

    return config;
  },
  transpilePackages: ['three'],
  // Exclude archive from TypeScript checking
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;

