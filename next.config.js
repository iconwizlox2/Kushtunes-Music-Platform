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
  
  // Disable trace collection completely
  outputFileTracing: false,

  // Security headers
  async headers() {
    const csp = [
      "default-src 'self'",
      // Allow images from self, data URIs, and your CDN if you use one
      "img-src 'self' data: blob:",
      // Script/style: allow self + 'unsafe-inline' only if you need inline styles/scripts
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      // Fonts
      "font-src 'self' data:",
      // Media (audio uploads/previews)
      "media-src 'self' blob:",
      // XHR/fetch/websocket endpoints; add your APIs / analytics domains as needed
      "connect-src 'self'",
      // Frames (usually none)
      "frame-src 'none'"
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // HSTS: preload optional; only enable if you serve HTTPS everywhere (Vercel = yes)
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" }
        ]
      }
    ];
  }
}

module.exports = nextConfig