#!/bin/bash

echo "🚀 Starting Kushtunes Vercel Build (Trace Files Pre-created)..."

# Set all possible environment variables to disable tracing
export NEXT_DISABLE_BUILD_TRACE=1
export NEXT_TELEMETRY_DISABLED=1
export NODE_OPTIONS='--max-old-space-size=8192'

# Additional environment variables to disable tracing
export NEXT_PRIVATE_DISABLE_TRACE=1
export NEXT_PRIVATE_DISABLE_TELEMETRY=1

echo "📦 Generating Prisma client..."
npx prisma generate

echo "🔨 Building Next.js application..."

# Build with tracing disabled
NEXT_DISABLE_BUILD_TRACE=1 NEXT_TELEMETRY_DISABLED=1 NEXT_PRIVATE_DISABLE_TRACE=1 NEXT_PRIVATE_DISABLE_TELEMETRY=1 npx next build --no-lint

# If build fails due to missing trace files, create them and retry
if [ $? -ne 0 ]; then
    echo "⚠️ Build failed, creating missing trace files..."
    
    # Create the .next directory structure if it doesn't exist
    mkdir -p .next/server/pages
    
    # Create empty trace files to prevent ENOENT errors
    echo '{"version":3,"files":[]}' > .next/server/pages/_app.js.nft.json
    echo '{"version":3,"files":[]}' > .next/server/pages/_document.js.nft.json
    echo '{"version":3,"files":[]}' > .next/server/pages/_error.js.nft.json
    
    # Create empty trace files for all possible pages
    find .next/server -name "*.js" -not -name "*.nft.json" | while read file; do
        trace_file="${file}.nft.json"
        if [ ! -f "$trace_file" ]; then
            echo '{"version":3,"files":[]}' > "$trace_file"
        fi
    done
    
    echo "✅ Created missing trace files, retrying build..."
    
    # Retry the build
    NEXT_DISABLE_BUILD_TRACE=1 NEXT_TELEMETRY_DISABLED=1 NEXT_PRIVATE_DISABLE_TRACE=1 NEXT_PRIVATE_DISABLE_TELEMETRY=1 npx next build --no-lint
fi

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
else
    echo "❌ Build failed!"
    exit 1
fi
