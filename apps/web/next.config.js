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
  // Disable static optimization for all pages (required for dynamic features)
  output: 'standalone',
  experimental: {
    // Force dynamic rendering for all pages
    isrMemoryCacheSize: 0,
  },
}

module.exports = nextConfig
