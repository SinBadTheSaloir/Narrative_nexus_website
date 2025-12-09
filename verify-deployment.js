// verify-deployment.js
// Run this on Render Shell to verify structure

const fs = require('fs');
const path = require('path');

console.log('=== DEPLOYMENT VERIFICATION ===\n');

console.log('Current working directory:', process.cwd());
console.log('Script location:', __dirname);
console.log('');

console.log('Checking directory structure...\n');

const checks = [
  { path: 'backend', type: 'dir', name: 'Backend folder' },
  { path: 'backend/server.js', type: 'file', name: 'Server file' },
  { path: 'frontend', type: 'dir', name: 'Frontend folder' },
  { path: 'frontend/index.html', type: 'file', name: 'Index HTML' },
  { path: 'frontend/styles.css', type: 'file', name: 'Styles CSS' },
  { path: 'frontend/main.js', type: 'file', name: 'Main JS' },
  { path: 'package.json', type: 'file', name: 'Package.json' },
  { path: 'Library', type: 'dir', name: 'Library folder (optional)' }
];

let allGood = true;

checks.forEach(check => {
  const fullPath = path.join(process.cwd(), check.path);
  const exists = fs.existsSync(fullPath);
  
  const icon = exists ? '✅' : '❌';
  const status = exists ? 'Found' : 'MISSING';
  
  console.log(`${icon} ${check.name}: ${status}`);
  console.log(`   Path: ${fullPath}`);
  
  if (!exists && check.path !== 'Library') {
    allGood = false;
  }
  
  // If it's a directory and exists, list contents
  if (exists && check.type === 'dir') {
    try {
      const contents = fs.readdirSync(fullPath);
      console.log(`   Contents: ${contents.join(', ') || '(empty)'}`);
    } catch (e) {
      console.log(`   Error reading directory: ${e.message}`);
    }
  }
  
  console.log('');
});

if (allGood) {
  console.log('✅ All required files found!\n');
} else {
  console.log('❌ Some required files are missing. Check structure above.\n');
}

// Check for Library books
if (fs.existsSync(path.join(process.cwd(), 'Library'))) {
  console.log('Checking Library books...\n');
  const libraryPath = path.join(process.cwd(), 'Library');
  const books = fs.readdirSync(libraryPath)
    .filter(item => fs.statSync(path.join(libraryPath, item)).isDirectory());
  
  if (books.length > 0) {
    console.log(`📚 Found ${books.length} book(s):`);
    books.forEach(book => {
      const bookPath = path.join(libraryPath, book);
      const chapters = fs.readdirSync(bookPath).filter(f => f.endsWith('.json'));
      console.log(`   - ${book} (${chapters.length} chapters)`);
    });
  } else {
    console.log('⚠️  No books found in Library folder');
  }
} else {
  console.log('⚠️  Library folder does not exist yet\n');
}

console.log('\n=== END VERIFICATION ===');
