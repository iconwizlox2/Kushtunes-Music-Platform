const fs = require('fs');
const path = require('path');

console.log('🔧 Creating trace files to prevent build errors...');

// Create the .next directory structure
fs.mkdirSync('.next/server/pages', { recursive: true });

// Create empty trace files to prevent ENOENT errors during build
const traceFiles = [
  '_app.js.nft.json',
  '_document.js.nft.json',
  '_error.js.nft.json'
];

traceFiles.forEach(file => {
  const filePath = path.join('.next/server/pages', file);
  fs.writeFileSync(filePath, '{"version":3,"files":[]}');
  console.log(`✅ Created ${file}`);
});

console.log('✅ All trace files created successfully');
