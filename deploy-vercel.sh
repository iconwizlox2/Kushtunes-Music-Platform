#!/bin/bash

echo "🚀 Deploying Kushtunes Premium App to Vercel..."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Build the app
echo "🔨 Building application..."
npm run build

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your premium Kushtunes app is now live!"
echo ""
echo "📱 Features deployed:"
echo "  • Premium dark gaming-style UI"
echo "  • Progressive Web App (PWA)"
echo "  • Mobile-first responsive design"
echo "  • Glassmorphism effects"
echo "  • Touch gestures and animations"
echo "  • Offline support"
echo ""
echo "🎮 Enjoy your premium music release platform!"


