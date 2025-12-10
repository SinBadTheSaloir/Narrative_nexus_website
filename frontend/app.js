// app.js - Simplified Application Logic

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
  
  if (parts[0] === 'books' && parts.length === 2) {
    return { page: 'dashboard', bookId: parts[1] };
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
    case 'dashboard':
      renderDashboardPage(parsed.bookId);
      break;
    case '404':
      render404Page();
      break;
  }
}

window.addEventListener('hashchange', renderRoute);
document.addEventListener('DOMContentLoaded', renderRoute);

// ============================================
// API CLIENT
// ============================================

async function fetchBooks() {
  const response = await fetch(`${API_BASE}/books`);
  if (!response.ok) throw new Error('Failed to fetch books');
  return response.json();
}

async function fetchDashboardData(bookId) {
  const response = await fetch(`${API_BASE}/books/${bookId}/dashboard`);
  if (!response.ok) throw new Error('Failed to fetch dashboard data');
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
          <span>${book.characterCount || 0} characters</span>
        </div>
      </div>
    `).join('');
    
    render(`
      <div class="library-page">
        <h2 class="page-title">Library</h2>
        <p class="page-subtitle">Select a book to view its emotion dashboard</p>
        
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
// PAGE: DASHBOARD
// ============================================

async function renderDashboardPage(bookId) {
  showLoading();
  
  try {
    const dashboardData = await fetchDashboardData(bookId);
    
    // Render container
    render(`
      <div class="dashboard-page">
        <div class="breadcrumb">
          <span onclick="navigateTo('/')" class="breadcrumb-link">Library</span>
          <span class="breadcrumb-separator">›</span>
          <span>${dashboardData.title || bookId}</span>
        </div>
        
        <h2 class="page-title">${dashboardData.title || bookId}</h2>
        
        <!-- Toggle Buttons -->
        <div class="dashboard-controls">
          <div class="view-toggle">
            <button class="view-btn active" data-view="story" onclick="switchDashboardView('story')">
              Total Story View
            </button>
            <button class="view-btn" data-view="character" onclick="switchDashboardView('character')">
              Character View
            </button>
          </div>
        </div>
        
        <!-- Visualization Container -->
        <div id="dashboard-plot" class="dashboard-plot"></div>
        
        <!-- Legend (for character view) -->
        <div id="emotion-legend" class="emotion-legend" style="display: none;"></div>
        
        <div class="dashboard-actions">
          <button onclick="navigateTo('/')" class="btn btn-secondary">← Back to Library</button>
        </div>
      </div>
    `);
    
    // Store data globally for view switching
    window.dashboardData = dashboardData;
    
    // Render initial view (story totals)
    renderStoryView(dashboardData);
    
  } catch (error) {
    console.error('Error loading dashboard:', error);
    showError(`Failed to load dashboard: ${error.message}`);
  }
}

// ============================================
// DASHBOARD VIEW SWITCHING
// ============================================

function switchDashboardView(view) {
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.view === view) {
      btn.classList.add('active');
    }
  });
  
  if (view === 'story') {
    document.getElementById('emotion-legend').style.display = 'none';
    renderStoryView(window.dashboardData);
  } else if (view === 'character') {
    document.getElementById('emotion-legend').style.display = 'block';
    renderCharacterView(window.dashboardData);
  }
}

window.switchDashboardView = switchDashboardView;

// ============================================
// STORY TOTALS VIEW
// ============================================

function renderStoryView(data) {
  if (!data.chapters) {
    document.getElementById('dashboard-plot').innerHTML = 
      '<div style="text-align: center; color: #888; padding: 3rem;">No story data available</div>';
    return;
  }
  
  const xLabels = data.chapters.map(ch => ch.label || `Chapter ${ch.index}`);
  const xIndices = data.chapters.map(ch => ch.index);
  const positive = data.chapters.map(ch => ch.positive || 0);
  const negative = data.chapters.map(ch => ch.negative || 0);
  const total = data.chapters.map(ch => ch.total || 0);
  
  const traces = [
    {
      x: xIndices,
      y: positive,
      name: 'Positive',
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: '#51cf66', width: 3 },
      marker: { size: 10 }
    },
    {
      x: xIndices,
      y: negative,
      name: 'Negative',
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: '#ff6b6b', width: 3 },
      marker: { size: 10 }
    },
    {
      x: xIndices,
      y: total,
      name: 'Total',
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: '#d4af37', width: 3 },
      marker: { size: 10 }
    }
  ];
  
  const layout = {
    title: {
      text: `${data.title || 'Story'} - Emotional Intensity Over Time`,
      font: { color: '#d4af37', size: 18 }
    },
    xaxis: {
      title: 'Chapter',
      color: '#888',
      gridcolor: '#2a2a2a',
      tickvals: xIndices,
      ticktext: xLabels,
      tickangle: -45
    },
    yaxis: {
      title: 'Emotional Intensity',
      color: '#888',
      gridcolor: '#2a2a2a'
    },
    paper_bgcolor: '#0a0a0a',
    plot_bgcolor: '#0a0a0a',
    font: { color: '#888' },
    legend: {
      font: { color: '#888' },
      bgcolor: '#1a1a1a',
      bordercolor: '#333',
      borderwidth: 1
    },
    hovermode: 'x unified',
    margin: { t: 60, b: 100, l: 60, r: 40 }
  };
  
  const config = {
    responsive: true,
    displayModeBar: false
  };
  
  Plotly.newPlot('dashboard-plot', traces, layout, config);
}

// ============================================
// CHARACTER IMPORTANCE VIEW
// ============================================

function renderCharacterView(data) {
  if (!data.characters || !data.character_chapters) {
    document.getElementById('dashboard-plot').innerHTML = 
      '<div style="text-align: center; color: #888; padding: 3rem;">No character data available</div>';
    return;
  }
  
  const emotionColors = {};
  if (data.internal_emotions) {
    data.internal_emotions.forEach(emotion => {
      emotionColors[emotion.id] = emotion.color;
    });
  }
  
  const xLabels = data.character_chapters.map(ch => ch.label || `Chapter ${ch.index}`);
  const xIndices = data.character_chapters.map(ch => ch.index);
  
  const traces = data.characters.map((character, charIdx) => {
    const importance = [];
    const colors = [];
    const hoverText = [];
    
    data.character_chapters.forEach((chapter, chIdx) => {
      const charData = chapter.characters.find(c => c.id === character.id);
      
      if (charData) {
        importance.push(charData.importance);
        
        const emotionColor = emotionColors[charData.top_internal_emotion] || '#888';
        colors.push(emotionColor);
        
        const emotionLabel = data.internal_emotions?.find(e => e.id === charData.top_internal_emotion)?.label || charData.top_internal_emotion;
        hoverText.push(
          `${character.name}<br>` +
          `Importance: ${(charData.importance * 100).toFixed(1)}%<br>` +
          `Emotion: ${emotionLabel}`
        );
      } else {
        importance.push(0);
        colors.push('#444');
        hoverText.push(`${character.name}<br>Not present`);
      }
    });
    
    return {
      x: xIndices,
      y: importance,
      name: character.name,
      type: 'scatter',
      mode: 'lines+markers',
      line: { 
        width: 2.5,
        color: `hsl(${charIdx * 60}, 70%, 60%)`
      },
      marker: { 
        size: 12,
        color: colors,
        line: { color: '#000', width: 1 }
      },
      text: hoverText,
      hovertemplate: '%{text}<extra></extra>'
    };
  });
  
  const layout = {
    title: {
      text: `${data.title || 'Story'} - Character Importance & Emotions`,
      font: { color: '#d4af37', size: 18 }
    },
    xaxis: {
      title: 'Chapter',
      color: '#888',
      gridcolor: '#2a2a2a',
      tickvals: xIndices,
      ticktext: xLabels,
      tickangle: -45
    },
    yaxis: {
      title: 'Importance (Normalized)',
      color: '#888',
      gridcolor: '#2a2a2a',
      tickformat: '.0%'
    },
    paper_bgcolor: '#0a0a0a',
    plot_bgcolor: '#0a0a0a',
    font: { color: '#888' },
    legend: {
      font: { color: '#888' },
      bgcolor: '#1a1a1a',
      bordercolor: '#333',
      borderwidth: 1
    },
    hovermode: 'closest',
    margin: { t: 60, b: 100, l: 60, r: 40 }
  };
  
  const config = {
    responsive: true,
    displayModeBar: false
  };
  
  Plotly.newPlot('dashboard-plot', traces, layout, config);
  
  renderEmotionLegend(data.internal_emotions);
}

// ============================================
// EMOTION LEGEND
// ============================================

function renderEmotionLegend(emotions) {
  const legendContainer = document.getElementById('emotion-legend');
  
  if (!emotions || emotions.length === 0) {
    legendContainer.style.display = 'none';
    return;
  }
  
  let html = '<div class="legend-title">Internal Emotions (Marker Colors)</div>';
  html += '<div class="legend-grid">';
  
  emotions.forEach(emotion => {
    html += `
      <div class="legend-item">
        <div class="legend-color" style="background-color: ${emotion.color};"></div>
        <div class="legend-label">${emotion.label}</div>
      </div>
    `;
  });
  
  html += '</div>';
  
  legendContainer.innerHTML = html;
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
