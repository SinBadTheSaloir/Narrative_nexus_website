// server.js - Simplified Backend for Dashboard View (No metadata.json required)

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ============================================
// LIBRARY CONFIGURATION
// ============================================

const LIBRARY_PATH = path.join(__dirname, '..', 'Library');
console.log("📁 Scanning Library at:", LIBRARY_PATH);
let libraryIndex = {}; // In-memory cache of all books

// ============================================
// AUTHOR INFERENCE (optional enhancement)
// ============================================

const KNOWN_AUTHORS = {
  'hamlet': 'William Shakespeare',
  'macbeth': 'William Shakespeare',
  'othello': 'William Shakespeare',
  'romeo_and_juliet': 'William Shakespeare',
  'the_tempest': 'William Shakespeare',
  'the_great_gatsby': 'F. Scott Fitzgerald',
};

const KNOWN_YEARS = {
  'hamlet': '1600',
  'macbeth': '1606',
  'othello': '1603',
  'romeo_and_juliet': '1597',
  'the_tempest': '1611',
  'the_great_gatsby': '1925',
};

function inferAuthor(bookId, title) {
  // Check known authors map
  if (KNOWN_AUTHORS[bookId]) {
    return KNOWN_AUTHORS[bookId];
  }
  
  // Return null to let frontend handle it
  return null;
}

function inferYear(bookId) {
  return KNOWN_YEARS[bookId] || null;
}

// ============================================
// LIBRARY SCANNER
// ============================================

function scanLibrary() {
  console.log('📚 Scanning Library...');
  
  if (!fs.existsSync(LIBRARY_PATH)) {
    console.warn('⚠️  Library folder not found. Creating it...');
    fs.mkdirSync(LIBRARY_PATH, { recursive: true });
    return {};
  }
  
  const books = {};
  const bookFolders = fs.readdirSync(LIBRARY_PATH, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  bookFolders.forEach(bookId => {
    const bookPath = path.join(LIBRARY_PATH, bookId);
    const metadataPath = path.join(bookPath, 'metadata.json');
    const dashboardPath = path.join(bookPath, 'dashboard.json');
    
    // Dashboard.json is required
    if (!fs.existsSync(dashboardPath)) {
      console.warn(`⚠️  No dashboard.json for ${bookId}, skipping`);
      return;
    }
    
    let dashboardData;
    try {
      dashboardData = JSON.parse(fs.readFileSync(dashboardPath, 'utf-8'));
    } catch (error) {
      console.error(`❌ Error reading dashboard for ${bookId}:`, error.message);
      return;
    }
    
    // Start with data from dashboard.json
    const bookInfo = {
      id: bookId,
      title: dashboardData.title || bookId.replace(/_/g, ' '),
      chapterCount: dashboardData.chapters ? dashboardData.chapters.length : 0,
      characterCount: dashboardData.characters ? dashboardData.characters.length : 0,
      hasDashboard: true
    };
    
    // Try to read metadata.json if it exists (optional)
    if (fs.existsSync(metadataPath)) {
      try {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
        
        // Merge metadata (metadata.json takes priority)
        if (metadata.title) bookInfo.title = metadata.title;
        if (metadata.author) bookInfo.author = metadata.author;
        if (metadata.year) bookInfo.year = metadata.year;
        if (metadata.description) bookInfo.description = metadata.description;
        if (metadata.chapterCount) bookInfo.chapterCount = metadata.chapterCount;
        if (metadata.characterCount) bookInfo.characterCount = metadata.characterCount;
        
        console.log(`  ✅ ${bookInfo.title} (with metadata.json)`);
      } catch (error) {
        console.warn(`  ⚠️  Error reading metadata for ${bookId}, using dashboard data only`);
      }
    } else {
      // No metadata.json, try to infer author
      const inferredAuthor = inferAuthor(bookId, bookInfo.title);
      const inferredYear = inferYear(bookId);
      
      if (inferredAuthor) {
        bookInfo.author = inferredAuthor;
      }
      if (inferredYear) {
        bookInfo.year = inferredYear;
      }
      
      console.log(`  ✅ ${bookInfo.title} (dashboard.json only)`);
    }
    
    // Set default author if still missing
    if (!bookInfo.author) {
      bookInfo.author = 'Unknown Author';
    }
    
    books[bookId] = bookInfo;
  });
  
  console.log(`📚 Library scan complete: ${Object.keys(books).length} books found\n`);
  return books;
}

// ============================================
// API ENDPOINTS
// ============================================

// GET /api/books - List all books
app.get('/api/books', (req, res) => {
  // Always rescan so new folders are picked up without restarting
  console.log('📚 /api/books requested — rescanning Library...');
  libraryIndex = scanLibrary();

  const books = Object.values(libraryIndex).map(book => ({
    id: book.id,
    title: book.title,
    author: book.author,
    year: book.year,
    chapterCount: book.chapterCount,
    characterCount: book.characterCount,
    description: book.description,
    hasDashboard: book.hasDashboard
  }));

  res.json(books);
});


// GET /api/books/:bookId/dashboard - Get dashboard data
app.get('/api/books/:bookId/dashboard', (req, res) => {
  const { bookId } = req.params;
  
  const book = libraryIndex[bookId];
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  
  const dashboardPath = path.join(LIBRARY_PATH, bookId, 'dashboard.json');
  
  if (!fs.existsSync(dashboardPath)) {
    return res.status(404).json({ error: 'Dashboard data not available for this book' });
  }
  
  let dashboardData;
  try {
    dashboardData = JSON.parse(fs.readFileSync(dashboardPath, 'utf-8'));
  } catch (error) {
    console.error(`Error reading dashboard for ${bookId}:`, error);
    return res.status(500).json({ error: 'Error reading dashboard data' });
  }
  
  res.json(dashboardData);
});

// ============================================
// UTILITY ENDPOINTS
// ============================================

app.post('/api/rescan', (req, res) => {
  libraryIndex = scanLibrary();
  res.json({ message: 'Library rescanned', bookCount: Object.keys(libraryIndex).length });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    books: Object.keys(libraryIndex).length,
    environment: process.env.NODE_ENV || 'development'
  });
});

// ============================================
// STARTUP
// ============================================

libraryIndex = scanLibrary();

app.listen(PORT, () => {
  console.log(`🚀 Narrative Nexus running on http://localhost:${PORT}`);
  console.log(`📚 ${Object.keys(libraryIndex).length} books loaded`);
});
