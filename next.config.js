/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost', 'vercel.app'],
  },
  experimental: {
    outputFileTracingRoot: undefined,
    outputFileTracing: false,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...config.externals, 'critters'];
    }
    return config;
  },
}

module.exports = nextConfig