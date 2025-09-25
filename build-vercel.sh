#!/bin/bash

echo "🚀 Starting Kushtunes Vercel Build (Tracing Disabled)..."

# Set all possible environment variables to disable tracing
export NEXT_DISABLE_BUILD_TRACE=1
export NEXT_TELEMETRY_DISABLED=1
export NODE_OPTIONS='--max-old-space-size=8192'

# Additional environment variables to disable tracing
export NEXT_PRIVATE_DISABLE_TRACE=1
export NEXT_PRIVATE_DISABLE_TELEMETRY=1

echo "📦 Generating Prisma client..."
npx prisma generate

echo "🔨 Building Next.js application with all tracing disabled..."
# Use the build script but ensure all tracing is disabled
NEXT_DISABLE_BUILD_TRACE=1 NEXT_TELEMETRY_DISABLED=1 NEXT_PRIVATE_DISABLE_TRACE=1 NEXT_PRIVATE_DISABLE_TELEMETRY=1 npx next build --no-lint

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
else
    echo "❌ Build failed!"
    exit 1
fi
