/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // Aggressively disable build tracing
  experimental: {
    outputFileTracingRoot: undefined,
    outputFileTracingExcludes: {
      '*': ['**/*'],
    },
    webpackBuildWorker: false,
    serverComponentsExternalPackages: ['micromatch', 'picomatch', 'glob', 'minimatch'],
  },
  
  // Aggressive webpack configuration to prevent trace issues
  webpack: (config, { isServer, dev }) => {
    // Remove all tracing-related plugins
    config.plugins = config.plugins.filter(plugin => {
      const pluginName = plugin.constructor.name;
      return !pluginName.includes('Trace') && 
             !pluginName.includes('trace') && 
             !pluginName.includes('BuildTrace') &&
             !pluginName.includes('FileTrace') &&
             !pluginName.includes('CollectBuildTraces');
    });
    
    // Disable devtool completely
    config.devtool = false;
    
    // Disable optimization that might cause tracing issues
    config.optimization = {
      ...config.optimization,
      splitChunks: false,
      minimize: false,
    };
    
    // Externalize problematic modules
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'micromatch': 'commonjs micromatch',
        'picomatch': 'commonjs picomatch',
        'glob': 'commonjs glob',
        'minimatch': 'commonjs minimatch',
        'braces': 'commonjs braces',
        'extglob': 'commonjs extglob',
        'fill-range': 'commonjs fill-range',
        'is-number': 'commonjs is-number',
        'repeat-element': 'commonjs repeat-element',
        'snapdragon': 'commonjs snapdragon',
        'to-regex': 'commonjs to-regex',
      });
    }
    
    return config;
  },
  
  // Override build process
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
}

module.exports = nextConfig