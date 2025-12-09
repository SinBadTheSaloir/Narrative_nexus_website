// server.js - Complete Backend with Library-Based Architecture

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

// ============================================
// LIBRARY CONFIGURATION
// ============================================

const LIBRARY_PATH = path.join(__dirname, 'Library');
let libraryIndex = {}; // In-memory cache of all books

// Graph type to friendly label mapping
const GRAPH_LABELS = {
  'heartbeat': 'Story Emotional Heartbeat',
  'importance': 'Character Importance Over Time',
  'centrality': 'Eigenvector Centrality',
  'heatmap': 'Internal Emotion Heatmap',
  'network': 'Relationship Network',
  'trajectory': 'Positive vs Negative Trajectory'
};

// ============================================
// LIBRARY SCANNER (Convention-Based Discovery)
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
    const graphsPath = path.join(bookPath, 'graphs');
    
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
    
    // Scan available graphs
    const availableGraphs = [];
    if (fs.existsSync(graphsPath)) {
      const graphFiles = fs.readdirSync(graphsPath)
        .filter(file => file.endsWith('.json'));
      
      graphFiles.forEach(file => {
        const graphType = file.replace('.json', '');
        availableGraphs.push(graphType);
      });
    }
    
    books[bookId] = {
      id: bookId,
      ...metadata,
      graphs: availableGraphs
    };
    
    console.log(`  ✅ ${metadata.title} (${availableGraphs.length} graphs)`);
  });
  
  console.log(`📚 Library scan complete: ${Object.keys(books).length} books found\n`);
  return books;
}

// ============================================
// API ENDPOINTS
// ============================================

// 1️⃣ GET /api/books - List all books
app.get('/api/books', (req, res) => {
  const books = Object.values(libraryIndex).map(book => ({
    id: book.id,
    title: book.title,
    author: book.author,
    year: book.year,
    chapterCount: book.chapterCount,
    characterCount: book.characterCount,
    description: book.description,
    graphCount: book.graphs.length
  }));
  
  res.json(books);
});

// 2️⃣ GET /api/books/:bookId/graphs - List available graphs for a book
app.get('/api/books/:bookId/graphs', (req, res) => {
  const { bookId } = req.params;
  const book = libraryIndex[bookId];
  
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  
  const graphs = book.graphs.map(graphType => ({
    type: graphType,
    label: GRAPH_LABELS[graphType] || graphType
  }));
  
  res.json({
    id: book.id,
    title: book.title,
    graphs
  });
});

// 3️⃣ GET /api/books/:bookId/graph/:graphType - Get graph data
app.get('/api/books/:bookId/graph/:graphType', async (req, res) => {
  const { bookId, graphType } = req.params;
  const { chapter } = req.query;
  
  const book = libraryIndex[bookId];
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  
  const graphPath = path.join(LIBRARY_PATH, bookId, 'graphs', `${graphType}.json`);
  
  // Check if graph file exists
  if (!fs.existsSync(graphPath)) {
    // DEV MODE: Auto-generate if missing (future feature)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV] Graph ${graphType} missing for ${bookId} - would generate here`);
      // TODO: Implement auto-generation
    }
    
    return res.status(404).json({ error: 'Graph not available for this book' });
  }
  
  // Read graph data
  let graphData;
  try {
    graphData = JSON.parse(fs.readFileSync(graphPath, 'utf-8'));
  } catch (error) {
    console.error(`Error reading graph ${graphType} for ${bookId}:`, error);
    return res.status(500).json({ error: 'Error reading graph data' });
  }
  
  // If chapter filter requested and graph has chapters
  if (chapter && graphData.chapters && graphData.chapters[chapter]) {
    graphData = {
      ...graphData,
      data: graphData.chapters[chapter]
    };
  }
  
  res.json(graphData);
});

// ============================================
// UTILITY ENDPOINTS
// ============================================

// Rescan library (useful for dev)
app.post('/api/rescan', (req, res) => {
  libraryIndex = scanLibrary();
  res.json({ message: 'Library rescanned', bookCount: Object.keys(libraryIndex).length });
});

// Health check
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

// Scan library on startup
libraryIndex = scanLibrary();

app.listen(PORT, () => {
  console.log(`🚀 Narrative Nexus Backend running on http://localhost:${PORT}`);
  console.log(`📚 ${Object.keys(libraryIndex).length} books loaded`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
