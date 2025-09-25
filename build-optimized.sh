#!/bin/bash

echo "🚀 Starting Kushtunes optimized build..."

# Set environment variables to completely disable tracing
export NEXT_DISABLE_BUILD_TRACE=1
export NEXT_TELEMETRY_DISABLED=1
export NODE_OPTIONS='--max-old-space-size=8192'

echo "📦 Generating Prisma client..."
npx prisma generate

echo "🔨 Building Next.js application with tracing disabled..."
# Use the build script but ensure tracing is disabled
NEXT_DISABLE_BUILD_TRACE=1 NEXT_TELEMETRY_DISABLED=1 npx next build --no-lint

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
else
    echo "❌ Build failed!"
    exit 1
fi
