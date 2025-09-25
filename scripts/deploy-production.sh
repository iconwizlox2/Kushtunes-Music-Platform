#!/bin/bash

# Kushtunes.com Production Deployment Script
# This script prepares and deploys the enhanced Kushtunes platform

set -e

echo "🚀 Starting Kushtunes.com Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js version check passed: $(node -v)"

# Install dependencies
print_status "Installing dependencies..."
npm ci --production=false

# Generate Prisma client
print_status "Generating Prisma client..."
npx prisma generate

# Run type checking
print_status "Running TypeScript type checking..."
npm run type-check

# Run linting
print_status "Running ESLint..."
npm run lint:fix

# Build for production
print_status "Building for production..."
NODE_OPTIONS="--max-old-space-size=8192" npm run build:prod

# Check if build was successful
if [ $? -eq 0 ]; then
    print_success "Production build completed successfully!"
else
    print_error "Production build failed!"
    exit 1
fi

# Create production environment file if it doesn't exist
if [ ! -f ".env.production.local" ]; then
    print_warning "Production environment file not found."
    print_status "Please create .env.production.local with the following variables:"
    echo ""
    echo "DATABASE_URL=postgresql://username:password@localhost:5432/kushtunes_prod"
    echo "JWT_SECRET=your-super-secure-jwt-secret-key-for-production"
    echo "NEXTAUTH_SECRET=your-nextauth-secret-for-production"
    echo "NEXTAUTH_URL=https://kushtunes.com"
    echo "AWS_ACCESS_KEY_ID=your-aws-access-key"
    echo "AWS_SECRET_ACCESS_KEY=your-aws-secret-key"
    echo "AWS_REGION=us-east-1"
    echo "AWS_S3_BUCKET=kushtunes-uploads"
    echo "EMAIL_SERVICE_API_KEY=your-email-service-api-key"
    echo "EMAIL_FROM=noreply@kushtunes.com"
    echo "STRIPE_SECRET_KEY=sk_live_..."
    echo "STRIPE_PUBLISHABLE_KEY=pk_live_..."
    echo "ENCRYPTION_KEY=your-32-character-encryption-key"
    echo "CORS_ORIGIN=https://kushtunes.com"
    echo ""
    print_warning "Please create .env.production.local and run this script again."
    exit 1
fi

# Check if database is accessible
print_status "Checking database connection..."
if npx prisma db push --accept-data-loss; then
    print_success "Database connection successful!"
else
    print_error "Database connection failed!"
    print_warning "Please check your DATABASE_URL in .env.production.local"
    exit 1
fi

# Create deployment package
print_status "Creating deployment package..."
mkdir -p deployment
cp -r .next deployment/
cp -r public deployment/
cp -r prisma deployment/
cp package.json deployment/
cp package-lock.json deployment/
cp next.config.production.js deployment/next.config.js
cp .env.production.local deployment/.env.local

# Create production start script
cat > deployment/start.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Kushtunes.com Production Server..."
npm ci --production
npx prisma generate
npm start
EOF

chmod +x deployment/start.sh

print_success "Deployment package created in ./deployment/"

# Display deployment options
echo ""
print_status "Deployment Options:"
echo ""
echo "1. Vercel (Recommended for Next.js):"
echo "   - Install: npm i -g vercel"
echo "   - Deploy: vercel --prod"
echo "   - Set environment variables in Vercel dashboard"
echo ""
echo "2. Netlify:"
echo "   - Install: npm i -g netlify-cli"
echo "   - Deploy: netlify deploy --prod --dir=out"
echo ""
echo "3. Custom Server:"
echo "   - Upload ./deployment/ folder to your server"
echo "   - Run: ./start.sh"
echo ""
echo "4. Docker:"
echo "   - Use the provided Dockerfile"
echo "   - Build: docker build -t kushtunes ."
echo "   - Run: docker run -p 3000:3000 kushtunes"
echo ""

# Create Dockerfile for containerized deployment
cat > Dockerfile << 'EOF'
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npm run build:prod

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
EOF

print_success "Dockerfile created for containerized deployment"

# Final success message
echo ""
print_success "🎉 Kushtunes.com Production Deployment Ready!"
echo ""
print_status "Enhanced Features Included:"
echo "✅ Multi-track Upload System"
echo "✅ Advanced Analytics Dashboard"
echo "✅ Earnings Calculator"
echo "✅ Payout Processing"
echo "✅ Release Management"
echo "✅ Professional Dashboard"
echo "✅ API Endpoints"
echo "✅ Authentication System"
echo ""
print_status "Next Steps:"
echo "1. Set up production database"
echo "2. Configure cloud storage (AWS S3)"
echo "3. Set up email service"
echo "4. Configure payment processing"
echo "5. Deploy to your hosting provider"
echo "6. Test all functionality"
echo ""
print_success "Ready to launch Kushtunes.com! 🎵"

