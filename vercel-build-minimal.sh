#!/bin/bash

# Ultra-minimal build script to avoid stack overflow
echo "🚀 Starting ultra-minimal build process..."

# Set environment variables
export NODE_OPTIONS="--max-old-space-size=8192"
export NEXT_DISABLE_BUILD_TRACE=1
export NEXT_TELEMETRY_DISABLED=1
export NEXT_PRIVATE_SKIP_SIZE_LIMIT=1

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Copy minimal config
echo "📝 Using minimal Next.js configuration..."
cp next.config.minimal.js next.config.js

# Build with minimal configuration
echo "🏗️ Building with minimal configuration..."
npx next build --no-lint --no-mangling

echo "✅ Ultra-minimal build complete!"
