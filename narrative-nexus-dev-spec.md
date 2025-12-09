# Narrative Nexus - MVP Development Specification

## Overview
Single-repo project: Node.js backend serving static frontend + API. Clean black/white interface with gold accents. Simple, professional, minimal.

---

## 1. Project Structure

```
narrative-nexus/
├── .gitignore
├── package.json
├── README.md
├── Library/                    # NOT in git (uploaded to server manually)
│   ├── Monte_Cristo/
│   │   ├── ch01.json
│   │   ├── ch02.json
│   │   └── ...
│   └── Great_Gatsby/
│       ├── ch01.json
│       └── ...
├── backend/
│   └── server.js               # Express server
└── frontend/
    ├── index.html              # Landing page
    ├── book.html               # Book detail page (placeholder for now)
    ├── styles.css
    └── main.js
```

---

## 2. Setup Files

### `.gitignore`
```
node_modules/
Library/
.env
*.log
.DS_Store
```

### `package.json`
```json
{
  "name": "narrative-nexus",
  "version": "1.0.0",
  "description": "Narrative analysis library viewer",
  "main": "backend/server.js",
  "scripts": {
    "start": "node backend/server.js",
    "dev": "node backend/server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}
```

### `README.md`
```markdown
# Narrative Nexus

Live library viewer for narrative analysis data.

## Setup

1. Install dependencies: `npm install`
2. Create `Library/` folder in project root (not tracked in git)
3. Add book folders to `Library/`, each with chapter JSON files
4. Run: `npm start`
5. Visit: `http://localhost:3000`

## Deployment

- Push to GitHub (Library folder excluded)
- Deploy on Render/Railway
- Upload Library folder directly to server via SFTP or dashboard
```

---

## 3. Backend Implementation

### `backend/server.js`

```javascript
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
```

---

## 4. Frontend Implementation

### `frontend/index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Narrative Nexus</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <main id="app">
    <h1 class="title">NARRATIVE NEXUS</h1>
    <p class="subtitle">Live Library Viewer – Books currently in the backend</p>
    
    <div id="book-list-container" class="book-list-container">
      <div id="book-list-box" class="book-list-box">
        <p class="loading">Loading books...</p>
      </div>
    </div>
  </main>

  <script src="main.js"></script>
</body>
</html>
```

### `frontend/book.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Book View - Narrative Nexus</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <main id="app">
    <h1 class="title">NARRATIVE NEXUS</h1>
    <p class="subtitle" id="book-title">Loading...</p>
    
    <div class="book-list-container">
      <div class="book-list-box">
        <p class="info-text">Chapter view coming soon...</p>
        <a href="/" class="back-link">← Back to Library</a>
      </div>
    </div>
  </main>

  <script>
    // Get book name from URL
    const urlParams = new URLSearchParams(window.location.search);
    const bookName = urlParams.get('book');
    
    if (bookName) {
      document.getElementById('book-title').textContent = bookName.replace(/_/g, ' ');
    }
  </script>
</body>
</html>
```

### `frontend/styles.css`

```css
/* ===== RESET & GLOBALS ===== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
               "Helvetica Neue", Arial, sans-serif;
  background-color: #000000;
  color: #ffffff;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  line-height: 1.6;
}

/* ===== MAIN CONTAINER ===== */
#app {
  max-width: 600px;
  width: 100%;
  text-align: center;
}

/* ===== TITLE (GOLD) ===== */
.title {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 0.25em;
  color: #d4af37; /* Gold */
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

/* ===== SUBTITLE ===== */
.subtitle {
  font-size: 0.95rem;
  color: #888888;
  margin-bottom: 2.5rem;
  font-weight: 400;
}

/* ===== BOOK LIST CONTAINER ===== */
.book-list-container {
  background-color: #0a0a0a;
  border: 1px solid #333333;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.book-list-box {
  min-height: 150px;
  text-align: left;
}

/* ===== LOADING / INFO TEXT ===== */
.loading,
.info-text {
  color: #888888;
  text-align: center;
  font-size: 0.95rem;
}

.error {
  color: #ff6b6b;
  text-align: center;
  font-size: 0.95rem;
}

/* ===== BOOK ITEMS (CLICKABLE) ===== */
.book-item {
  display: block;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  background-color: #111111;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  color: #ffffff;
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 1rem;
  
  /* Fade-in animation */
  opacity: 0;
  animation: fadeIn 0.4s ease forwards;
}

.book-item:hover {
  background-color: #1a1a1a;
  border-color: #d4af37; /* Gold border on hover */
  transform: translateX(4px);
}

.book-item:active {
  transform: translateX(2px);
}

/* ===== BACK LINK ===== */
.back-link {
  display: inline-block;
  margin-top: 1.5rem;
  color: #d4af37;
  text-decoration: none;
  font-size: 0.95rem;
  transition: opacity 0.2s ease;
}

.back-link:hover {
  opacity: 0.7;
}

/* ===== FADE-IN ANIMATION ===== */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Stagger animation delay for multiple items */
.book-item:nth-child(1) { animation-delay: 0.05s; }
.book-item:nth-child(2) { animation-delay: 0.1s; }
.book-item:nth-child(3) { animation-delay: 0.15s; }
.book-item:nth-child(4) { animation-delay: 0.2s; }
.book-item:nth-child(5) { animation-delay: 0.25s; }
.book-item:nth-child(6) { animation-delay: 0.3s; }
.book-item:nth-child(7) { animation-delay: 0.35s; }
.book-item:nth-child(8) { animation-delay: 0.4s; }
.book-item:nth-child(9) { animation-delay: 0.45s; }
.book-item:nth-child(10) { animation-delay: 0.5s; }

/* ===== RESPONSIVE ===== */
@media (max-width: 640px) {
  .title {
    font-size: 1.75rem;
    letter-spacing: 0.15em;
  }
  
  .subtitle {
    font-size: 0.85rem;
  }
  
  .book-list-container {
    padding: 1.5rem;
  }
}
```

### `frontend/main.js`

```javascript
// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  loadBooks();
});

async function loadBooks() {
  const bookListBox = document.getElementById('book-list-box');
  
  try {
    // Fetch books from API
    const response = await fetch('/api/books');
    
    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }
    
    const data = await response.json();
    const books = data.books || [];
    
    // Clear loading message
    bookListBox.innerHTML = '';
    
    // Handle empty library
    if (books.length === 0) {
      bookListBox.innerHTML = '<p class="info-text">No books found in the Library folder.</p>';
      return;
    }
    
    // Create clickable book items
    books.forEach((bookName) => {
      const link = document.createElement('a');
      link.href = `/book.html?book=${encodeURIComponent(bookName)}`;
      link.className = 'book-item';
      link.textContent = formatBookName(bookName);
      bookListBox.appendChild(link);
    });
    
  } catch (error) {
    console.error('Error loading books:', error);
    bookListBox.innerHTML = '<p class="error">Error loading books. Please try again.</p>';
  }
}

// Helper: Format book name for display
function formatBookName(name) {
  // Replace underscores with spaces and capitalize words
  return name
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}
```

---

## 5. Deployment Instructions

### Local Development
1. Clone repo: `git clone <repo-url>`
2. Install: `npm install`
3. Create `Library/` folder in project root
4. Add book folders with chapter JSON files
5. Run: `npm start`
6. Visit: `http://localhost:3000`

### Production Deployment (Render/Railway)

#### Option 1: Render
1. Push code to GitHub (Library folder is gitignored)
2. Create new Web Service on Render
3. Connect GitHub repo
4. Settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Deploy
6. After deployment, upload `Library/` folder:
   - Use Render Shell or SFTP
   - Place in project root: `/opt/render/project/src/Library/`

#### Option 2: Railway
1. Push code to GitHub
2. Create new project on Railway
3. Connect repo
4. Railway auto-detects Node.js
5. Deploy
6. Upload `Library/` via Railway CLI or volume mount

---

## 6. Color Palette Reference

```css
/* Primary Colors */
Black Background:    #000000
Dark Container:      #0a0a0a
White Text:          #ffffff

/* Accents */
Gold (Title/Links):  #d4af37
Grey Subtitle:       #888888

/* Borders */
Dark Border:         #333333
Subtle Border:       #2a2a2a

/* Hover States */
Hover Background:    #1a1a1a
Gold Hover Border:   #d4af37
```

---

## 7. File Upload Checklist for Production

After deploying, manually upload these to the server:

- [ ] `Library/` folder (entire directory)
- [ ] Verify `Library/` is at project root level
- [ ] Test API: `https://your-app.com/api/books`
- [ ] Verify frontend loads book list

---

## 8. Testing Checklist

- [ ] Books load on landing page
- [ ] Clicking a book navigates to `/book.html?book=<name>`
- [ ] Fade-in animation works smoothly
- [ ] Gold hover effect on book items
- [ ] Responsive on mobile (test at 375px width)
- [ ] Empty library shows "No books found"
- [ ] API returns correct JSON structure

---

## Done!

This spec is **complete and ready for implementation**. Your developer has everything needed to build this exactly as designed.
