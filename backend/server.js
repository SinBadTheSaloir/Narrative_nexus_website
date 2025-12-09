const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Serve static frontend files
const frontendPath = path.join(__dirname, '..', 'frontend');
console.log('Frontend path:', frontendPath);
app.use(express.static(frontendPath));

// Library path detection with multiple fallbacks
const possibleLibraryPaths = [
  path.join(__dirname, '..', 'Library'),           // Standard: one level up from backend/
  path.join(__dirname, 'Library'),                 // Same level as backend/
  path.join(process.cwd(), 'Library'),             // From process root
  '/opt/render/project/src/Library',               // Render absolute path
  path.join(process.cwd(), 'src', 'Library')       // Alternative Render path
];

let LIBRARY_PATH = null;

// Find which Library path exists
async function findLibraryPath() {
  console.log('\n🔍 Searching for Library folder...');
  
  for (const libPath of possibleLibraryPaths) {
    try {
      await fs.access(libPath);
      console.log(`✅ Found Library at: ${libPath}`);
      LIBRARY_PATH = libPath;
      return libPath;
    } catch (error) {
      console.log(`❌ Not found at: ${libPath}`);
    }
  }
  
  console.log('⚠️  Library folder not found at any location');
  LIBRARY_PATH = possibleLibraryPaths[0]; // Default to first path
  return LIBRARY_PATH;
}

// Helper: List all books in Library folder
async function listBooks() {
  if (!LIBRARY_PATH) {
    await findLibraryPath();
  }
  
  try {
    console.log(`\n📚 Reading books from: ${LIBRARY_PATH}`);
    const entries = await fs.readdir(LIBRARY_PATH, { withFileTypes: true });
    
    console.log(`Found ${entries.length} total entries in Library/`);
    
    const books = entries
      .filter(entry => {
        const isDir = entry.isDirectory();
        console.log(`  - ${entry.name}: ${isDir ? 'directory ✓' : 'file (skipped)'}`);
        return isDir;
      })
      .map(entry => entry.name)
      .sort();
    
    console.log(`\n📖 Total books found: ${books.length}`);
    if (books.length > 0) {
      console.log('Books:', books);
    }
    
    return books;
  } catch (error) {
    console.error('❌ Error reading Library folder:', error.message);
    console.error('   Path attempted:', LIBRARY_PATH);
    return [];
  }
}

// Helper: List chapters in a book
async function listChapters(bookId) {
  try {
    const bookPath = path.join(LIBRARY_PATH, bookId);
    console.log(`\n📄 Reading chapters from: ${bookPath}`);
    
    const files = await fs.readdir(bookPath);
    const chapters = files
      .filter(file => file.endsWith('.json'))
      .sort();
    
    console.log(`Found ${chapters.length} chapter files`);
    return chapters;
  } catch (error) {
    console.error(`Error reading chapters for ${bookId}:`, error.message);
    return [];
  }
}

// Helper: Get chapter data
async function getChapterData(bookId, chapterFile) {
  try {
    const filePath = path.join(LIBRARY_PATH, bookId, chapterFile);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading chapter ${bookId}/${chapterFile}:`, error.message);
    return null;
  }
}

// API Routes

// GET /api/status - System status check
app.get('/api/status', async (req, res) => {
  await findLibraryPath();
  const books = await listBooks();
  
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    libraryPath: LIBRARY_PATH,
    bookCount: books.length,
    books: books
  });
});

// GET /api/debug - Detailed debug information
app.get('/api/debug', async (req, res) => {
  try {
    await findLibraryPath();
    
    const libraryExists = await fs.access(LIBRARY_PATH).then(() => true).catch(() => false);
    
    let entries = [];
    let books = [];
    
    if (libraryExists) {
      const allEntries = await fs.readdir(LIBRARY_PATH, { withFileTypes: true });
      entries = allEntries.map(e => ({ 
        name: e.name, 
        isDirectory: e.isDirectory(),
        isFile: e.isFile()
      }));
      books = await listBooks();
    }
    
    res.json({
      success: true,
      libraryPath: LIBRARY_PATH,
      libraryExists,
      possiblePaths: possibleLibraryPaths,
      allEntries: entries,
      books: books,
      bookCount: books.length,
      cwd: process.cwd(),
      __dirname: __dirname
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message, 
      stack: error.stack,
      cwd: process.cwd(),
      __dirname: __dirname
    });
  }
});

// GET /api/books - List all books
app.get('/api/books', async (req, res) => {
  console.log('\n🔔 API /api/books called');
  
  const books = await listBooks();
  
  console.log(`📤 Returning ${books.length} books to frontend\n`);
  
  res.json({ books });
});

// GET /api/books/:bookId/chapters - List chapters for a book
app.get('/api/books/:bookId/chapters', async (req, res) => {
  const { bookId } = req.params;
  console.log(`\n🔔 API /api/books/${bookId}/chapters called`);
  
  const chapters = await listChapters(bookId);
  
  if (chapters.length === 0) {
    return res.status(404).json({ error: 'Book not found or no chapters' });
  }
  
  res.json({
    bookId,
    chapters
  });
});

// GET /api/books/:bookId/:chapterFile - Get chapter data
app.get('/api/books/:bookId/:chapterFile', async (req, res) => {
  const { bookId, chapterFile } = req.params;
  console.log(`\n🔔 API /api/books/${bookId}/${chapterFile} called`);
  
  const data = await getChapterData(bookId, chapterFile);
  
  if (!data) {
    return res.status(404).json({ error: 'Chapter not found' });
  }
  
  res.json({
    chapter: chapterFile,
    data
  });
});

// Fallback: serve index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Start server
async function startServer() {
  // Find Library folder before starting
  await findLibraryPath();
  
  app.listen(PORT, async () => {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 NARRATIVE NEXUS SERVER STARTED');
    console.log('='.repeat(60));
    console.log(`\n🌐 Server URL: http://localhost:${PORT}`);
    console.log(`📁 Library Path: ${LIBRARY_PATH}`);
    console.log(`📂 Frontend Path: ${frontendPath}`);
    console.log(`💻 Working Directory: ${process.cwd()}`);
    console.log(`📍 Script Location: ${__dirname}`);
    
    // Check Library folder
    try {
      await fs.access(LIBRARY_PATH);
      console.log('\n✅ Library folder exists');
      
      const books = await listBooks();
      console.log(`\n📚 Total books available: ${books.length}`);
      
      if (books.length > 0) {
        console.log('\n📖 Books in library:');
        books.forEach((book, i) => console.log(`   ${i + 1}. ${book}`));
      } else {
        console.log('\n⚠️  No books found in Library folder');
        console.log('   Add book folders to start using the system');
      }
    } catch (error) {
      console.log('\n❌ Library folder not found');
      console.log('   Please create folder at:', LIBRARY_PATH);
      console.log('   Or check one of these locations:');
      possibleLibraryPaths.forEach(p => console.log(`   - ${p}`));
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('🔗 API Endpoints:');
    console.log('   GET  /api/status          - System status');
    console.log('   GET  /api/debug           - Debug information');
    console.log('   GET  /api/books           - List all books');
    console.log('   GET  /api/books/:id/chapters');
    console.log('   GET  /api/books/:id/:chapter');
    console.log('='.repeat(60) + '\n');
  });
}

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
