/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // Image optimization
  images: {
    domains: ['localhost', 'vercel.app', '*.vercel.app'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@prisma/client', 'next-auth'],
  },
  
  // Disable all tracing and telemetry
  generateBuildId: async () => {
    return 'kushtunes-' + Date.now()
  },
  
  // Webpack optimizations
  webpack: (config, { isServer, dev }) => {
    // Remove trace-related plugins
    config.plugins = config.plugins.filter(plugin => {
      const name = plugin.constructor.name;
      return !name.includes('Trace') && 
             !name.includes('TracePlugin') &&
             !name.includes('Telemetry');
    });
    
    // Production optimizations
    if (!dev) {
      config.devtool = false;
    }
    
    return config;
  },
  
  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig