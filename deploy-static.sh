#!/bin/bash

echo "🚀 Deploying Kushtunes to Static Hosting..."

# Clean previous builds
rm -rf out .next

# Build with static export
echo "📦 Building static export..."
NEXT_DISABLE_BUILD_TRACE=1 npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    
    # Create a simple deployment package
    echo "📁 Creating deployment package..."
    mkdir -p deploy
    cp -r out/* deploy/
    
    # Create a simple index.html redirect for SPA
    cat > deploy/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Kushtunes - Music Distribution Platform</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .loading { color: #666; }
    </style>
</head>
<body>
    <div class="loading">
        <h1>🎵 Kushtunes</h1>
        <p>Loading your music distribution platform...</p>
        <p>If you're not redirected automatically, <a href="/index.html">click here</a></p>
    </div>
    <script>
        // Redirect to the main app
        window.location.href = '/index.html';
    </script>
</body>
</html>
EOF
    
    echo "🎉 Deployment package ready in ./deploy/"
    echo ""
    echo "📋 Deployment Options:"
    echo "1. Upload ./deploy/ contents to any static hosting provider"
    echo "2. Use GitHub Pages: Push deploy/ contents to gh-pages branch"
    echo "3. Use Netlify Drop: Drag deploy/ folder to netlify.com/drop"
    echo "4. Use Vercel: Upload deploy/ folder to vercel.com"
    echo ""
    echo "🌐 Your Kushtunes app is ready for deployment!"
    
else
    echo "❌ Build failed!"
    exit 1
fi
