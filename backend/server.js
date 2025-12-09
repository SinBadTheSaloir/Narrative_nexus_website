const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Library path (relative to project root)
const LIBRARY_PATH = path.join(__dirname, '..', 'Library');

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Helper: List all books in Library folder
async function listBooks() {
  try {
    const entries = await fs.readdir(LIBRARY_PATH, { withFileTypes: true });
    const books = entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .sort(); // Alphabetical order
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

// GET /api/books - List all books
app.get('/api/books', async (req, res) => {
  const books = await listBooks();
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
app.listen(PORT, () => {
  console.log(`🚀 Narrative Nexus running on http://localhost:${PORT}`);
});
