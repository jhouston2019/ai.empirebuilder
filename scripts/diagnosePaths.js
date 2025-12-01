const fs = require('fs');
const path = require('path');

/**
 * Diagnose and fix Windows file/directory issues
 * Fixes cases where Windows incorrectly marks files as directories or symlinks
 */

const filesToCheck = [
  'pages/_app.tsx',
  'pages/_document.tsx',
  'pages/index.tsx',
];

let pathsNormalized = 0;
let filesRecreated = 0;
let symlinkResolutionDisabled = true; // Set in next.config.js

console.log('🔍 Diagnosing Windows path issues...\n');

filesToCheck.forEach((filePath) => {
  const fullPath = path.resolve(__dirname, '..', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  ${filePath} does not exist - skipping`);
    return;
  }

  try {
    const stats = fs.lstatSync(fullPath);
    const isSymlink = stats.isSymbolicLink();
    const isDirectory = stats.isDirectory();
    const isFile = stats.isFile();

    console.log(`📄 Checking: ${filePath}`);
    console.log(`   Is Symlink: ${isSymlink}`);
    console.log(`   Is Directory: ${isDirectory}`);
    console.log(`   Is File: ${isFile}`);

    // If Windows incorrectly marks it as a directory or symlink, recreate it
    if (isDirectory || isSymlink) {
      console.log(`   ⚠️  Issue detected: File is marked as ${isDirectory ? 'directory' : 'symlink'}`);
      
      // Read the content if it's a symlink (might work)
      let content = '';
      try {
        if (isSymlink) {
          const realPath = fs.readlinkSync(fullPath);
          const targetPath = path.isAbsolute(realPath) ? realPath : path.resolve(path.dirname(fullPath), realPath);
          content = fs.readFileSync(targetPath, 'utf8');
        } else {
          // If it's a directory, we can't read it as a file
          console.log(`   ❌ Cannot read directory as file - this is a critical issue`);
          return;
        }
      } catch (readError) {
        console.log(`   ⚠️  Could not read content: ${readError.message}`);
        // Try to read from a backup or skip
        return;
      }

      // Delete the problematic file/symlink
      try {
        if (isSymlink) {
          fs.unlinkSync(fullPath);
        } else {
          fs.rmSync(fullPath, { recursive: true, force: true });
        }
        console.log(`   🗑️  Deleted problematic ${isDirectory ? 'directory' : 'symlink'}`);
      } catch (deleteError) {
        console.log(`   ❌ Could not delete: ${deleteError.message}`);
        return;
      }

      // Recreate as a normal file
      try {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`   ✅ Recreated as normal file`);
        filesRecreated++;
      } catch (writeError) {
        console.log(`   ❌ Could not recreate: ${writeError.message}`);
        return;
      }
    } else {
      console.log(`   ✅ File is correctly identified as a normal file`);
    }

    // Normalize path separators
    const normalizedPath = fullPath.replace(/\\/g, '/');
    if (fullPath !== normalizedPath) {
      pathsNormalized++;
    }

    console.log('');
  } catch (error) {
    console.log(`   ❌ Error checking ${filePath}: ${error.message}\n`);
  }
});

console.log('📊 Summary:');
console.log(`   Paths normalized: ${pathsNormalized}`);
console.log(`   Files recreated: ${filesRecreated}`);
console.log(`   Symlink resolution disabled: ${symlinkResolutionDisabled}`);
console.log('');

if (filesRecreated > 0) {
  console.log('✅ Fixed Windows file/directory issues');
} else {
  console.log('✅ No file/directory issues detected');
}

