/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
    unoptimized: true,
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
      const name = plugin.constructor.name;
      return !name.includes('Trace') && 
             !name.includes('BuildTrace') && 
             !name.includes('CollectBuildTraces');
    });

    // Keep essential optimizations but disable problematic ones
    if (config.optimization && config.optimization.splitChunks) {
      // Disable only the problematic cache groups
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
