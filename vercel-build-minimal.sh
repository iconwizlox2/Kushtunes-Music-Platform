#!/bin/bash

# Balanced build script to avoid stack overflow while maintaining functionality
echo "🚀 Starting balanced build process..."

# Set environment variables
export NODE_OPTIONS="--max-old-space-size=8192"
export NEXT_DISABLE_BUILD_TRACE=1
export NEXT_TELEMETRY_DISABLED=1

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Build with balanced configuration
echo "🏗️ Building with balanced configuration..."
npx next build --no-lint

echo "✅ Balanced build complete!"
