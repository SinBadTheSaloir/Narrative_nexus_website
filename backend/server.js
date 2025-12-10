// server.js - Simplified Backend for Dashboard View

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
    
    // Read metadata
    if (!fs.existsSync(metadataPath)) {
      console.warn(`⚠️  No metadata.json for ${bookId}, skipping`);
      return;
    }
    
    let metadata;
    try {
      metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
    } catch (error) {
      console.error(`❌ Error reading metadata for ${bookId}:`, error.message);
      return;
    }
    
    // Check for dashboard
    const hasDashboard = fs.existsSync(dashboardPath);
    
    books[bookId] = {
      id: bookId,
      ...metadata,
      hasDashboard
    };
    
    console.log(`  ✅ ${metadata.title}${hasDashboard ? ' (dashboard available)' : ''}`);
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
