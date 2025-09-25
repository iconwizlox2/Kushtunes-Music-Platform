#!/bin/bash

# Custom build script that completely bypasses problematic trace collection
echo "🚀 Starting Kushtunes build with trace collection disabled..."

# Set environment variables to disable all trace collection
export NEXT_DISABLE_BUILD_TRACE=1
export NEXT_TELEMETRY_DISABLED=1
export NODE_OPTIONS="--max-old-space-size=8192"

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Build with all trace collection disabled
echo "🔨 Building Next.js application..."
NEXT_DISABLE_BUILD_TRACE=1 NEXT_TELEMETRY_DISABLED=1 npx next build --no-lint

echo "✅ Build completed successfully!"
