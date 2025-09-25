#!/bin/bash

# Clean build script using minimal configuration
echo "🚀 Starting clean Vercel build process..."

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Use clean configuration
echo "📝 Using clean Next.js configuration..."
cp next.config.clean.js next.config.js

# Build with clean configuration
echo "🏗️ Building with clean configuration..."
NODE_OPTIONS="--max-old-space-size=8192" NEXT_DISABLE_BUILD_TRACE=1 npx next build

echo "✅ Clean build complete!"
