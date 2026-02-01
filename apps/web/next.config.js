/** @type {import('next').NextConfig} */
// Trigger rebuild for env vars
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
}

module.exports = nextConfig
