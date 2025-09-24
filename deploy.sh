#!/bin/bash

# Kushtunes Mobile App Deployment Script
echo "🚀 Deploying Kushtunes Mobile App..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Create deployment directory
echo "📁 Creating deployment directory..."
mkdir -p deployment
cp -r out/* deployment/

# Add deployment files
echo "📄 Adding deployment files..."
cp public/site.webmanifest deployment/
cp public/sw.js deployment/
cp public/offline.html deployment/

# The actual Next.js app is already copied from out/ directory
# No need to overwrite with splash screen

echo "✅ Deployment files created successfully!"
echo "📱 Your mobile app is ready for deployment!"
echo ""
echo "🌐 To deploy:"
echo "1. Upload the 'deployment' folder to your web server"
echo "2. Ensure your server supports SPA routing"
echo "3. Test the PWA installation on mobile devices"
echo ""
echo "📱 Mobile Features:"
echo "• Progressive Web App (PWA)"
echo "• Offline support"
echo "• Mobile-first navigation"
echo "• Touch gestures and animations"
echo "• Glassmorphism design"
echo "• Modern UI components"
echo ""
echo "🎉 Deployment complete!"
