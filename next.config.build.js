
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // Completely disable build tracing
  experimental: {
    outputFileTracingRoot: undefined,
    webpackBuildWorker: false,
  },
  
  // Override the build process to skip tracing
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  
  // Disable all tracing in webpack
  webpack: (config, { isServer, dev }) => {
    // Remove all tracing plugins
    config.plugins = config.plugins.filter(plugin => {
      const pluginName = plugin.constructor.name;
      return !pluginName.includes('Trace') && 
             !pluginName.includes('trace') && 
             !pluginName.includes('BuildTrace') &&
             !pluginName.includes('FileTrace') &&
             !pluginName.includes('CollectBuildTraces');
    });
    
    // Disable devtool
    config.devtool = false;
    
    return config;
  },
}

module.exports = nextConfig
