/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost', 'vercel.app'],
  },
  experimental: {
    outputFileTracingRoot: undefined,
    outputFileTracing: false,
    serverComponentsExternalPackages: ['critters', 'micromatch', 'picomatch'],
  },
  webpack: (config, { isServer, dev }) => {
    // Disable problematic modules that cause stack overflow
    if (isServer) {
      config.externals = [
        ...config.externals,
        'critters',
        'micromatch',
        'picomatch',
        'glob',
        'minimatch'
      ];
    }
    
    // Optimize webpack for production builds
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Create a separate chunk for vendor libraries
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20
            },
            // Create a separate chunk for common modules
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true
            }
          }
        }
      };
    }
    
    return config;
  },
}

module.exports = nextConfig