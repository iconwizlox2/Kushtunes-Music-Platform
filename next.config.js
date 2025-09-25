/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost', 'vercel.app'],
  },
  // Completely disable all experimental features that might cause issues
  experimental: {
    serverComponentsExternalPackages: [
      'critters', 
      'micromatch', 
      'picomatch', 
      'glob', 
      'minimatch',
      'braces',
      'extglob',
      'fill-range',
      'is-number',
      'repeat-element',
      'snapdragon',
      'to-regex'
    ],
  },
  // Disable all tracing and telemetry
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  webpack: (config, { isServer, dev }) => {
    // Completely externalize problematic modules
    if (isServer) {
      config.externals = [
        ...config.externals,
        'critters',
        'micromatch',
        'picomatch',
        'glob',
        'minimatch',
        'braces',
        'extglob',
        'fill-range',
        'is-number',
        'repeat-element',
        'snapdragon',
        'to-regex'
      ];
    }
    
    // Remove any trace-related plugins
    config.plugins = config.plugins.filter(plugin => {
      const name = plugin.constructor.name;
      return !name.includes('Trace') && 
             !name.includes('TracePlugin') &&
             !name.includes('Telemetry');
    });
    
    // Disable source maps to reduce complexity
    if (!dev) {
      config.devtool = false;
    }
    
    return config;
  },
}

module.exports = nextConfig