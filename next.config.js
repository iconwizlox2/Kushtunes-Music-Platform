/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // Completely disable build tracing
  experimental: {
    outputFileTracingRoot: undefined,
    outputFileTracingExcludes: {
      '*': ['**/*'],
    },
    // Disable build worker to avoid tracing issues
    webpackBuildWorker: false,
  },
  
  // Disable all tracing-related features
  webpack: (config, { isServer, dev }) => {
    // Remove tracing plugins completely
    config.plugins = config.plugins.filter(plugin => {
      const pluginName = plugin.constructor.name;
      return !pluginName.includes('Trace') && 
             !pluginName.includes('trace') && 
             !pluginName.includes('BuildTrace') &&
             !pluginName.includes('FileTrace');
    });
    
    // Disable source maps to reduce tracing
    config.devtool = false;
    
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
        'critters': 'commonjs critters'
      });
    }
    
    return config;
  },
}

module.exports = nextConfig