#!/bin/bash

echo "🚀 Starting Kushtunes Server..."

# Kill any existing server processes
pkill -f "node .next/standalone/server.js" 2>/dev/null || true

# Start the server using the standalone configuration
echo "📡 Starting server on http://localhost:3000"
node .next/standalone/server.js

echo "✅ Server started successfully!"
echo "🌐 Open http://localhost:3000 in your browser"
