/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static export for Firebase Hosting
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

