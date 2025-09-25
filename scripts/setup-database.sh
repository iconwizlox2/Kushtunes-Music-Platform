#!/bin/bash

# Database Migration Script for Kushtunes Platform
echo "🚀 Setting up Kushtunes Database..."

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Push schema to database (for development)
echo "🗄️ Pushing schema to database..."
npx prisma db push

# Optional: Run migrations (for production)
# echo "🔄 Running database migrations..."
# npx prisma migrate deploy

echo "✅ Database setup complete!"
echo "📊 Your database is ready with:"
echo "   - Users table (with optional username)"
echo "   - Sessions table (for authentication)"
echo "   - Releases table (for music releases)"
echo "   - Tracks table (for individual songs)"
echo "   - DSP Distribution table (for platform tracking)"
echo "   - Analytics table (for performance data)"
