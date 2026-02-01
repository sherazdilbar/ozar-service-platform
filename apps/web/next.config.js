/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@ozar/shared'],
  images: {
    domains: ['i.pravatar.cc', 'images.unsplash.com', 'localhost'],
  },
  webpack: (config, { isServer }) => {
    // Ignore React Native modules in web builds
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
    };
    return config;
  },
  // Standalone output for optimized deployment
  output: 'standalone',
  // Skip generating error pages during build (they'll be generated on-demand)
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
}

module.exports = nextConfig
