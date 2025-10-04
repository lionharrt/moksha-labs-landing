/** @type {import('next').NextConfig} */
const nextConfig = {
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

