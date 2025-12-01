const fs = require('fs');
const path = require('path');

/**
 * Clean all build artifacts and caches
 * Normalizes path separators to forward slashes
 */

const dirsToClean = [
  '.next',
  '.next-build',
  'node_modules/.cache',
  '.turbo',
  'dist',
  'coverage',
];

console.log('🧹 Cleaning build artifacts and caches...\n');

let cleaned = 0;
let normalized = 0;

dirsToClean.forEach((dir) => {
  const fullPath = path.resolve(__dirname, '..', dir);
  
  // Normalize path separators
  const normalizedPath = fullPath.replace(/\\/g, '/');
  if (fullPath !== normalizedPath) {
    normalized++;
  }
  
  if (fs.existsSync(fullPath)) {
    try {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`   ✅ Deleted: ${dir}`);
      cleaned++;
    } catch (error) {
      console.log(`   ⚠️  Could not delete ${dir}: ${error.message}`);
    }
  } else {
    console.log(`   ℹ️  Does not exist: ${dir}`);
  }
});

console.log('');
console.log('📊 Summary:');
console.log(`   Directories cleaned: ${cleaned}`);
console.log(`   Paths normalized: ${normalized}`);
console.log('');
console.log('✅ Cleanup complete');

