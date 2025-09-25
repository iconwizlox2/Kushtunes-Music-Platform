/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost', 'vercel.app'],
  },
  experimental: {
    serverComponentsExternalPackages: ['critters'],
  },
}

module.exports = nextConfig