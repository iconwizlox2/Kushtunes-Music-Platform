/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // Minimal configuration to avoid build issues
  experimental: {
    outputFileTracingRoot: undefined,
    webpackBuildWorker: false,
  },
  
  // Simple webpack configuration
  webpack: (config, { isServer, dev }) => {
    // Only disable devtool in production
    if (!dev) {
      config.devtool = false;
    }
    
    return config;
  },
}

module.exports = nextConfig