#!/bin/bash

echo "🚀 Starting optimized Vercel build process..."

# Set environment variables to disable problematic features
export NODE_OPTIONS="--max-old-space-size=8192"
export NEXT_DISABLE_BUILD_TRACE=1
export NEXT_TELEMETRY_DISABLED=1
export NEXT_PRIVATE_SKIP_MEMORY_WARNING=1

echo "📦 Installing dependencies..."
npm install --production=false

echo "🗄️ Generating Prisma client..."
npx prisma generate

echo "🏗️ Building Next.js application..."
npx next build --no-lint

echo "✅ Build completed successfully!"