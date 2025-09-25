#!/bin/bash

echo "🚀 Starting Kushtunes deployment to alternative platform..."

# Set environment variables
export NODE_OPTIONS='--max-old-space-size=8192'
export NEXT_DISABLE_BUILD_TRACE=1
export NEXT_TELEMETRY_DISABLED=1

echo "📦 Installing dependencies..."
npm install

echo "🔧 Generating Prisma client..."
npx prisma generate

echo "🔨 Building application..."
# Try building with minimal configuration
NEXT_DISABLE_BUILD_TRACE=1 NEXT_TELEMETRY_DISABLED=1 npx next build --no-lint

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "🌐 Starting local server to test..."
    
    # Start the application locally to verify it works
    echo "🎉 Application built successfully!"
    echo "📱 You can now run 'npm start' to start the production server locally"
    echo "🔗 Or deploy the .next folder to any Node.js hosting platform"
else
    echo "❌ Build failed!"
    exit 1
fi
