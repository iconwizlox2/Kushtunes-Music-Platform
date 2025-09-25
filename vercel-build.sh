#!/bin/bash

# Balanced build script for Vercel that avoids stack overflow while maintaining functionality
echo "🚀 Starting balanced Vercel build process..."

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Build with balanced configuration
echo "🏗️ Building with balanced configuration..."
NODE_OPTIONS="--max-old-space-size=8192" NEXT_DISABLE_BUILD_TRACE=1 npx next build --no-lint

echo "✅ Balanced build complete!"
