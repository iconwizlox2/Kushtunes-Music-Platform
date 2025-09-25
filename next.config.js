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
}

module.exports = nextConfig