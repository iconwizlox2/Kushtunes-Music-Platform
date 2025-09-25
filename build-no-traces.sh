#!/bin/bash

echo "🚀 Starting Kushtunes Vercel Build (Trace Collection Disabled)..."

# Set all possible environment variables to disable tracing
export NEXT_DISABLE_BUILD_TRACE=1
export NEXT_TELEMETRY_DISABLED=1
export NODE_OPTIONS='--max-old-space-size=8192'

# Additional environment variables to disable tracing
export NEXT_PRIVATE_DISABLE_TRACE=1
export NEXT_PRIVATE_DISABLE_TELEMETRY=1

echo "📦 Generating Prisma client..."
npx prisma generate

echo "🔨 Building Next.js application with trace collection disabled..."

# Create a patch to disable build trace collection completely
cat > patch-build-traces.js << 'EOF'
const fs = require('fs');
const path = require('path');

// Patch the collect-build-traces.js file to skip trace collection
const tracesFile = path.join(__dirname, 'node_modules/next/dist/build/collect-build-traces.js');
if (fs.existsSync(tracesFile)) {
  let content = fs.readFileSync(tracesFile, 'utf8');
  
  // Replace the collectBuildTraces function to do nothing
  content = content.replace(
    /async function collectBuildTraces\([^}]+\)\s*\{[^}]*\}/s,
    'async function collectBuildTraces() { console.log("Build tracing disabled - skipping trace collection"); return Promise.resolve(); }'
  );
  
  // Also patch the main build function to skip trace collection
  content = content.replace(
    /await collectBuildTraces\(/g,
    '// await collectBuildTraces('
  );
  
  fs.writeFileSync(tracesFile, content);
  console.log("✅ Patched build trace collection");
}

// Also patch the main build index file
const buildIndexFile = path.join(__dirname, 'node_modules/next/dist/build/index.js');
if (fs.existsSync(buildIndexFile)) {
  let content = fs.readFileSync(buildIndexFile, 'utf8');
  
  // Skip trace collection in the main build process
  content = content.replace(
    /await collectBuildTraces\(/g,
    '// await collectBuildTraces('
  );
  
  fs.writeFileSync(buildIndexFile, content);
  console.log("✅ Patched main build process");
}
EOF

# Apply the patch
node patch-build-traces.js

# Build with tracing disabled
NEXT_DISABLE_BUILD_TRACE=1 NEXT_TELEMETRY_DISABLED=1 NEXT_PRIVATE_DISABLE_TRACE=1 NEXT_PRIVATE_DISABLE_TELEMETRY=1 npx next build --no-lint

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    # Clean up
    rm -f patch-build-traces.js
else
    echo "❌ Build failed!"
    rm -f patch-build-traces.js
    exit 1
fi
