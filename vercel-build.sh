#!/bin/bash

# Custom build script for Vercel that bypasses build trace collection
echo "🚀 Starting custom Vercel build process..."

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Build with custom Next.js configuration that skips build traces
echo "🏗️ Building with custom configuration..."
NODE_OPTIONS="--max-old-space-size=4096" npx next build --no-lint

echo "✅ Custom build complete!"
