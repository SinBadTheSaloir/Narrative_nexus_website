// app.js - Main Application Logic with Routing

// ============================================
// CONFIGURATION
// ============================================

const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api'
  : '/api';

// ============================================
// ROUTER
// ============================================

function navigateTo(path) {
  window.location.hash = path;
}

function getCurrentRoute() {
  const hash = window.location.hash.slice(1) || '/';
  return hash;
}

function parseRoute(route) {
  const parts = route.split('/').filter(p => p);
  
  if (parts.length === 0) {
    return { page: 'library' };
  }
  
  if (parts[0] === 'books' && parts.length === 1) {
    return { page: 'library' };
  }
  
  if (parts[0] === 'books' && parts.length === 2) {
    return { page: 'book-graphs', bookId: parts[1] };
  }
  
  if (parts[0] === 'books' && parts.length === 3) {
    return { page: 'graph-viewer', bookId: parts[1], graphType: parts[2] };
  }
  
  return { page: '404' };
}

function renderRoute() {
  const route = getCurrentRoute();
  const parsed = parseRoute(route);
  
  console.log('Rendering route:', parsed);
  
  switch (parsed.page) {
    case 'library':
      renderLibraryPage();
      break;
    case 'book-graphs':
      renderBookGraphsPage(parsed.bookId);
      break;
    case 'graph-viewer':
      renderGraphViewerPage(parsed.bookId, parsed.graphType);
      break;
    case '404':
      render404Page();
      break;
  }
}

// Listen for hash changes
window.addEventListener('hashchange', renderRoute);

// Initial render
document.addEventListener('DOMContentLoaded', renderRoute);

// ============================================
// API CLIENT
// ============================================

async function fetchBooks() {
  const response = await fetch(`${API_BASE}/books`);
  if (!response.ok) throw new Error('Failed to fetch books');
  return response.json();
}

async function fetchBookGraphs(bookId) {
  const response = await fetch(`${API_BASE}/books/${bookId}/graphs`);
  if (!response.ok) throw new Error('Failed to fetch book graphs');
  return response.json();
}

async function fetchGraphData(bookId, graphType, chapter = null) {
  let url = `${API_BASE}/books/${bookId}/graph/${graphType}`;
  if (chapter) url += `?chapter=${chapter}`;
  
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch graph data');
  return response.json();
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function render(html) {
  document.getElementById('page-container').innerHTML = html;
}

function showError(message) {
  render(`
    <div class="error-container">
      <h2>Error</h2>
      <p>${message}</p>
      <button onclick="navigateTo('/')" class="btn">Back to Library</button>
    </div>
  `);
}

function showLoading() {
  render('<div class="loading">Loading...</div>');
}

// ============================================
// PAGE: LIBRARY (Book Selector)
// ============================================

async function renderLibraryPage() {
  showLoading();
  
  try {
    const books = await fetchBooks();
    
    if (books.length === 0) {
      render(`
        <div class="empty-state">
          <h2>No Books Available</h2>
          <p>Add books to the Library folder to get started.</p>
        </div>
      `);
      return;
    }
    
    const booksHTML = books.map(book => `
      <div class="book-card" onclick="navigateTo('/books/${book.id}')">
        <h3 class="book-title">${book.title}</h3>
        <p class="book-author">by ${book.author}</p>
        ${book.year ? `<p class="book-year">${book.year}</p>` : ''}
        ${book.description ? `<p class="book-description">${book.description}</p>` : ''}
        <div class="book-stats">
          <span>${book.chapterCount || 0} chapters</span>
          <span>${book.graphCount || 0} graphs</span>
        </div>
      </div>
    `).join('');
    
    render(`
      <div class="library-page">
        <h2 class="page-title">Library</h2>
        <p class="page-subtitle">Select a book to view its visualizations</p>
        
        <div class="books-grid">
          ${booksHTML}
        </div>
      </div>
    `);
  } catch (error) {
    console.error('Error loading library:', error);
    showError('Failed to load library. Make sure the backend is running.');
  }
}

// ============================================
// PAGE: BOOK GRAPHS (Graph Type Selector)
// ============================================

async function renderBookGraphsPage(bookId) {
  showLoading();
  
  try {
    const bookData = await fetchBookGraphs(bookId);
    
    if (bookData.graphs.length === 0) {
      render(`
        <div class="empty-state">
          <h2>${bookData.title}</h2>
          <p>No graphs available for this book yet.</p>
          <button onclick="navigateTo('/')" class="btn">Back to Library</button>
        </div>
      `);
      return;
    }
    
    const graphsHTML = bookData.graphs.map(graph => `
      <div class="graph-card" onclick="navigateTo('/books/${bookId}/${graph.type}')">
        <h3 class="graph-title">${graph.label}</h3>
        <div class="graph-indicator">●</div>
      </div>
    `).join('');
    
    render(`
      <div class="book-graphs-page">
        <div class="breadcrumb">
          <span onclick="navigateTo('/')" class="breadcrumb-link">Library</span>
          <span class="breadcrumb-separator">›</span>
          <span>${bookData.title}</span>
        </div>
        
        <h2 class="page-title">${bookData.title}</h2>
        <p class="page-subtitle">Select a visualization</p>
        
        <div class="graphs-grid">
          ${graphsHTML}
        </div>
        
        <button onclick="navigateTo('/')" class="btn btn-secondary">← Back to Library</button>
      </div>
    `);
  } catch (error) {
    console.error('Error loading book graphs:', error);
    showError(`Failed to load graphs for this book.`);
  }
}

// ============================================
// PAGE: GRAPH VIEWER (Actual Visualization)
// ============================================

async function renderGraphViewerPage(bookId, graphType) {
  showLoading();
  
  try {
    // Fetch graph data
    const graphData = await fetchGraphData(bookId, graphType);
    
    // Look up component in registry
    const graphEntry = window.GRAPH_REGISTRY[graphType];
    
    if (!graphEntry) {
      render(`
        <div class="error-container">
          <h2>Unknown Graph Type</h2>
          <p>Graph type "${graphType}" is not registered.</p>
          <button onclick="history.back()" class="btn">Go Back</button>
        </div>
      `);
      return;
    }
    
    // Render container
    render(`
      <div class="graph-viewer-page">
        <div class="breadcrumb">
          <span onclick="navigateTo('/')" class="breadcrumb-link">Library</span>
          <span class="breadcrumb-separator">›</span>
          <span onclick="navigateTo('/books/${bookId}')" class="breadcrumb-link">${bookId}</span>
          <span class="breadcrumb-separator">›</span>
          <span>${graphEntry.label}</span>
        </div>
        
        <h2 class="page-title">${graphEntry.label}</h2>
        
        <div id="graph-container" class="graph-container">
          <div class="loading">Rendering graph...</div>
        </div>
        
        <div class="graph-actions">
          <button onclick="history.back()" class="btn btn-secondary">← Back</button>
        </div>
      </div>
    `);
    
    // Render the actual graph using registered component
    graphEntry.render(graphData, bookId);
    
  } catch (error) {
    console.error('Error loading graph:', error);
    showError(`Failed to load graph: ${error.message}`);
  }
}

// ============================================
// PAGE: 404
// ============================================

function render404Page() {
  render(`
    <div class="error-container">
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <button onclick="navigateTo('/')" class="btn">Go to Library</button>
    </div>
  `);
}
