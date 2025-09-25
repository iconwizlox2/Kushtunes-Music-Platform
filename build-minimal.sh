#!/bin/bash

# Alternative build script that bypasses problematic build trace collection
echo "🚀 Starting alternative build process..."

# Set environment variables to disable problematic features
export NEXT_DISABLE_BUILD_TRACE=1
export NEXT_DISABLE_ANALYZE=1
export NEXT_DISABLE_SWC=0

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next
rm -rf out

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Build with minimal configuration
echo "🏗️ Building with minimal configuration..."
NODE_OPTIONS="--max-old-space-size=4096 --stack-size=8192" npm run build:minimal

echo "✅ Alternative build complete!"
