/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizePackageImports: ['@prisma/client'],
    webpackBuildWorker: false,
    buildTrace: false,
  },
  // Balanced webpack configuration
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Remove only problematic trace plugins
    config.plugins = config.plugins.filter(plugin => {
      const pluginName = plugin.constructor.name;
      return !pluginName.includes('Trace') &&
             !pluginName.includes('BuildTrace') &&
             !pluginName.includes('CollectBuildTraces');
    });

    // Keep essential optimizations but disable problematic cache groups
    if (config.optimization && config.optimization.splitChunks) {
      config.optimization.splitChunks.cacheGroups = {};
    }

    return config;
  },
  // Keep essential features
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  outputFileTracing: false,
}

module.exports = nextConfig
