/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@ozar/shared'],
  images: {
    domains: ['i.pravatar.cc', 'images.unsplash.com', 'localhost'],
  },
}

module.exports = nextConfig
