#!/bin/bash

# Build optimization script to prevent call stack errors
echo "🔧 Optimizing build process..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next
rm -rf out
rm -rf node_modules/.cache

# Clear npm cache
echo "🗑️ Clearing npm cache..."
npm cache clean --force

# Install dependencies fresh
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Build with optimizations
echo "🏗️ Building with optimizations..."
NODE_OPTIONS="--max-old-space-size=4096" npm run build

echo "✅ Build optimization complete!"
