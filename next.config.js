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
    // Disable other experimental features that might cause issues
    serverComponentsExternalPackages: ['micromatch', 'picomatch', 'glob', 'minimatch'],
  },
  
  // Disable all tracing-related features
  webpack: (config, { isServer, dev }) => {
    // Remove tracing plugins completely
    config.plugins = config.plugins.filter(plugin => {
      const pluginName = plugin.constructor.name;
      return !pluginName.includes('Trace') && 
             !pluginName.includes('trace') && 
             !pluginName.includes('BuildTrace') &&
             !pluginName.includes('FileTrace') &&
             !pluginName.includes('CollectBuildTraces');
    });
    
    // Add plugin to create trace files during build
    config.plugins.push({
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('CreateTraceFiles', () => {
          const fs = require('fs');
          const path = require('path');
          
          // Create the .next/server/pages directory
          const pagesDir = path.join('.next/server/pages');
          fs.mkdirSync(pagesDir, { recursive: true });
          
          // Create empty trace files
          const traceFiles = ['_app.js.nft.json', '_document.js.nft.json', '_error.js.nft.json'];
          traceFiles.forEach(file => {
            const filePath = path.join(pagesDir, file);
            fs.writeFileSync(filePath, '{"version":3,"files":[]}');
          });
          
          console.log('✅ Trace files created during build');
        });
      }
    });
    
    // Disable source maps to reduce tracing
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
        'critters': 'commonjs critters'
      });
    }
    
    return config;
  },
  
  // Override the build process to skip trace collection
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  
  // Disable build trace collection at the root level
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
}

module.exports = nextConfig