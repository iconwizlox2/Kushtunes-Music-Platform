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
  // Completely disable build trace collection
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Remove all trace-related plugins
    config.plugins = config.plugins.filter(plugin => {
      const pluginName = plugin.constructor.name;
      return !pluginName.includes('Trace') && 
             !pluginName.includes('BuildTrace') &&
             !pluginName.includes('CollectBuildTraces');
    });
    
    // Disable build trace collection at the webpack level
    if (config.optimization && config.optimization.splitChunks) {
      config.optimization.splitChunks.cacheGroups = {};
    }
    
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
