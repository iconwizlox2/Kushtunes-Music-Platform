#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting build without trace collection...');

// Set environment variables to disable all tracing
process.env.NEXT_DISABLE_BUILD_TRACE = '1';
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.NEXT_PRIVATE_DISABLE_TRACE = '1';
process.env.NEXT_PRIVATE_DISABLE_TELEMETRY = '1';
process.env.NEXT_PRIVATE_SKIP_TRACE_WEBPACK = '1';
process.env.NEXT_PRIVATE_SKIP_TRACE_MICROMATCH = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=8192';

try {
  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Create trace files to prevent errors
  console.log('🔧 Creating trace files...');
  const traceFiles = [
    '.next/server/pages/_app.js.nft.json',
    '.next/server/pages/_document.js.nft.json',
    '.next/server/pages/_error.js.nft.json',
  ];
  
  traceFiles.forEach(file => {
    const dir = path.dirname(file);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(file, '{"version":3,"files":[]}');
    console.log(`✅ Created ${file}`);
  });
  
  // Build with Next.js
  console.log('🏗️ Building Next.js application...');
  execSync('npx next build --no-lint', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
