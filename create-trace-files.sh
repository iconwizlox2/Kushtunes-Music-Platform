#!/bin/bash

echo "🔧 Creating trace files to prevent build errors..."

# Create the .next directory structure
mkdir -p .next/server/pages

# Create empty trace files to prevent ENOENT errors during build
echo '{"version":3,"files":[]}' > .next/server/pages/_app.js.nft.json
echo '{"version":3,"files":[]}' > .next/server/pages/_document.js.nft.json
echo '{"version":3,"files":[]}' > .next/server/pages/_error.js.nft.json

echo "✅ Trace files created successfully"
