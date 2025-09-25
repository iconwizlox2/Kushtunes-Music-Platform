/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizePackageImports: ['@prisma/client'],
    // Disable webpack build worker
    webpackBuildWorker: false,
  },
  // Disable build trace collection to prevent call stack errors
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    // Disable problematic plugins
    config.plugins = config.plugins.filter(plugin => {
      return !plugin.constructor.name.includes('Trace');
    });
    return config;
  },
  // Optimize build process
  swcMinify: true,
  compress: true,
  // Disable problematic features
  poweredByHeader: false,
  generateEtags: false,
}

module.exports = nextConfig
