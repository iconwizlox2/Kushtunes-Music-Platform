/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizePackageImports: ['@prisma/client'],
  },
  output: 'standalone',
}

module.exports = nextConfig