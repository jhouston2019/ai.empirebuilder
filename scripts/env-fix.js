const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Build environment fallback for Windows
 * Forces environment variables to prevent Next.js Windows build issues
 */

const isWindows = os.platform() === 'win32';

console.log('🔧 Setting up build environment...');
console.log(`   Platform: ${os.platform()}`);

if (isWindows) {
  console.log('   ⚠️  Windows detected - applying fixes\n');
  
  // Force environment variables
  process.env.NODE_ENV = process.env.NODE_ENV || 'production';
  process.env.NEXT_PRIVATE_WORKER = 'false';
  process.env.NEXT_IGNORE_DIR_SYMLINKS = 'true';
  
  console.log('   ✅ Set NODE_ENV=production');
  console.log('   ✅ Set NEXT_PRIVATE_WORKER=false');
  console.log('   ✅ Set NEXT_IGNORE_DIR_SYMLINKS=true');
  console.log('');
  console.log('✅ Windows build environment configured');
} else {
  console.log('   ℹ️  Non-Windows platform - no fixes needed');
  console.log('');
  console.log('✅ Build environment ready');
}

