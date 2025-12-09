const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Library path (relative to project root)
// Try multiple possible locations for flexibility
const possibleLibraryPaths = [
  path.join(__dirname, '..', 'Library'),           // Local: one level up from backend/
  path.join(__dirname, 'Library'),                 // Alternative: same level as backend/
  path.join(process.cwd(), 'Library')              // Production: from process root
];

let LIBRARY_PATH = possibleLibraryPaths[0];

// Find which path exists (will be checked on startup)
async function findLibraryPath() {
  for (const libPath of possibleLibraryPaths) {
    try {
      await fs.access(libPath);
      LIBRARY_PATH = libPath;
      return libPath;
    } catch (error) {
      // Path doesn't exist, try next
    }
  }
  return possibleLibraryPaths[0]; // Default to first if none found
}

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files
const frontendPath = path.join(__dirname, '..', 'frontend');
console.log('Serving frontend from:', frontendPath);
app.use(express.static(frontendPath));

// Helper: List all books in Library folder
async function listBooks() {
  try {
    const entries = await fs.readdir(LIBRARY_PATH, { withFileTypes: true });
    const books = entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .sort(); // Alphabetical order
    
    console.log(`Found ${books.length} book folders:`, books);
    return books;
  } catch (error) {
    console.error('Error reading Library folder:', error);
    return [];
  }
}

// Helper: List chapters in a book
async function listChapters(bookId) {
  try {
    const bookPath = path.join(LIBRARY_PATH, bookId);
    const files = await fs.readdir(bookPath);
    const chapters = files
      .filter(file => file.endsWith('.json'))
      .sort();
    return chapters;
  } catch (error) {
    console.error(`Error reading chapters for ${bookId}:`, error);
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
    console.error(`Error reading chapter ${bookId}/${chapterFile}:`, error);
    return null;
  }
}

// API Routes

// GET /api/debug - Debug endpoint to check Library status
app.get('/api/debug', async (req, res) => {
  try {
    const libraryExists = await fs.access(LIBRARY_PATH).then(() => true).catch(() => false);
    const entries = libraryExists ? await fs.readdir(LIBRARY_PATH, { withFileTypes: true }) : [];
    const allEntries = entries.map(e => ({ name: e.name, isDirectory: e.isDirectory() }));
    const books = await listBooks();
    
    res.json({
      libraryPath: LIBRARY_PATH,
      libraryExists,
      allEntries,
      books,
      bookCount: books.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

// GET /api/books - List all books
app.get('/api/books', async (req, res) => {
  const books = await listBooks();
  console.log(`API /api/books called - returning ${books.length} books`);
  res.json({ books });
});

// GET /api/books/:bookId/chapters - List chapters for a book
app.get('/api/books/:bookId/chapters', async (req, res) => {
  const { bookId } = req.params;
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
app.listen(PORT, async () => {
  console.log(`🚀 Narrative Nexus running on http://localhost:${PORT}`);
  
  // Find Library folder
  await findLibraryPath();
  console.log(`📁 Library path: ${LIBRARY_PATH}`);
  
  // Check if Library folder exists
  try {
    await fs.access(LIBRARY_PATH);
    console.log('✅ Library folder found');
    const books = await listBooks();
    console.log(`📚 Found ${books.length} books:`, books);
  } catch (error) {
    console.log('⚠️  Library folder not found at any of these locations:');
    possibleLibraryPaths.forEach(p => console.log(`   - ${p}`));
    console.log('📝 Please create Library/ folder and add book data');
  }
});
