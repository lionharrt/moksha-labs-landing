import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Add GLSL shader support
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader'],
    });

    return config;
  },
  
  // Optimize Three.js packages
  experimental: {
    optimizePackageImports: ['three', '@react-three/fiber', '@react-three/drei'],
  },
};

export default nextConfig;
