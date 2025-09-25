/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // Disable build tracing to prevent stack overflow
  experimental: {
    outputFileTracingRoot: undefined,
    webpackBuildWorker: false,
  },
  
  // Minimal webpack configuration to prevent trace issues
  webpack: (config, { isServer, dev }) => {
    // Only disable devtool in production
    if (!dev) {
      config.devtool = false;
    }
    
    // Remove problematic tracing plugins
    config.plugins = config.plugins.filter(plugin => {
      const pluginName = plugin.constructor.name;
      return !pluginName.includes('BuildTrace') && 
             !pluginName.includes('FileTrace') &&
             !pluginName.includes('CollectBuildTraces');
    });
    
    return config;
  },
}

module.exports = nextConfig