/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable all problematic features
  experimental: {
    optimizePackageImports: ['@prisma/client'],
    webpackBuildWorker: false,
    buildTrace: false,
    outputFileTracing: false,
  },
  
  // Minimal webpack configuration
  webpack: (config, { isServer, dev }) => {
    // Disable all trace-related functionality
    config.plugins = config.plugins.filter(plugin => {
      const name = plugin.constructor.name;
      return !name.toLowerCase().includes('trace');
    });

    // Disable source maps
    config.devtool = false;
    
    // Disable optimization that causes issues
    if (config.optimization) {
      config.optimization.splitChunks = false;
      config.optimization.minimize = false;
    }

    return config;
  },
  
  // Disable all unnecessary features
  swcMinify: false,
  compress: false,
  poweredByHeader: false,
  generateEtags: false,
  outputFileTracing: false,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
