// graph-registry.js - Plugin System for Graph Visualizations

// ============================================
// GRAPH REGISTRY
// ============================================

window.GRAPH_REGISTRY = {
  
  // GRAPH 1: Story Emotional Heartbeat
  'heartbeat': {
    label: 'Story Emotional Heartbeat',
    description: 'Tracks positive and negative emotional intensity across chapters',
    render: function(data, bookId) {
      renderHeartbeatGraph(data);
    }
  },
  
  // GRAPH 2: Character Importance Over Time
  'importance': {
    label: 'Character Importance Over Time',
    description: 'Shows normalized importance of each character per chapter',
    render: function(data, bookId) {
      renderImportanceGraph(data);
    }
  },
  
  // GRAPH 3: Eigenvector Centrality
  'centrality': {
    label: 'Eigenvector Centrality',
    description: 'Network importance scores for characters',
    render: function(data, bookId) {
      renderCentralityGraph(data);
    }
  },
  
  // GRAPH 4: Internal Emotion Heatmap
  'heatmap': {
    label: 'Internal Emotion Heatmap',
    description: 'Dominant emotion per character per chapter',
    render: function(data, bookId) {
      renderHeatmapGraph(data);
    }
  },
  
  // GRAPH 5: Relationship Network
  'network': {
    label: 'Relationship Network',
    description: 'Interactive force-directed graph of character relationships',
    render: function(data, bookId) {
      renderNetworkGraph(data);
    }
  },
  
  // GRAPH 6: Positive vs Negative Trajectory
  'trajectory': {
    label: 'Positive vs Negative Trajectory',
    description: 'Phase space plot showing emotional trajectory',
    render: function(data, bookId) {
      renderTrajectoryGraph(data);
    }
  },
  
  // GRAPH 7: Emotion Dashboard
  'dashboard': {
    label: 'Emotion Dashboard',
    description: 'Combined view of story totals and character importance with emotions',
    render: function(data, bookId) {
      renderEmotionDashboard(data);
    }
  }
  
};

// ============================================
// GRAPH RENDERING FUNCTIONS
// ============================================

// GRAPH 1: Heartbeat
function renderHeartbeatGraph(data) {
  const container = document.getElementById('graph-container');
  
  if (!data.chapters || !data.positive || !data.negative) {
    container.innerHTML = '<div class="placeholder">Graph data format not recognized. Check console for details.</div>';
    console.error('Expected data format:', { chapters: [], positive: [], negative: [], total: [] });
    console.error('Received:', data);
    return;
  }
  
  container.innerHTML = '<div id="plotly-heartbeat" style="width:100%; height:500px;"></div>';
  
  const traces = [
    {
      x: data.x || data.chapters.map((_, i) => i),
      y: data.positive,
      name: 'Positive',
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: '#51cf66', width: 3 },
      marker: { size: 8 }
    },
    {
      x: data.x || data.chapters.map((_, i) => i),
      y: data.negative,
      name: 'Negative',
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: '#ff6b6b', width: 3 },
      marker: { size: 8 }
    },
    {
      x: data.x || data.chapters.map((_, i) => i),
      y: data.total,
      name: 'Total',
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: '#d4af37', width: 3 },
      marker: { size: 8 }
    }
  ];
  
  const layout = {
    title: { text: 'Story Emotional Heartbeat', font: { color: '#d4af37', size: 20 } },
    xaxis: {
      title: 'Chapter',
      color: '#888',
      gridcolor: '#2a2a2a',
      tickvals: data.x || data.chapters.map((_, i) => i),
      ticktext: data.chapters
    },
    yaxis: { title: 'Emotional Intensity', color: '#888', gridcolor: '#2a2a2a' },
    paper_bgcolor: '#0a0a0a',
    plot_bgcolor: '#0a0a0a',
    font: { color: '#888' },
    legend: { font: { color: '#888' } }
  };
  
  Plotly.newPlot('plotly-heartbeat', traces, layout, { responsive: true });
}

// GRAPH 2: Importance (Placeholder)
function renderImportanceGraph(data) {
  const container = document.getElementById('graph-container');
  container.innerHTML = `
    <div class="placeholder">
      <h3>Character Importance Over Time</h3>
      <p>This graph has not been implemented yet.</p>
      <p>Add your implementation in <code>graph-registry.js</code></p>
      <details>
        <summary>Expected Data Format</summary>
        <pre>${JSON.stringify({ characters: [], chapters: [], x: [], importance: {} }, null, 2)}</pre>
      </details>
    </div>
  `;
}

// GRAPH 3: Centrality (Placeholder)
function renderCentralityGraph(data) {
  const container = document.getElementById('graph-container');
  container.innerHTML = `
    <div class="placeholder">
      <h3>Eigenvector Centrality</h3>
      <p>This graph has not been implemented yet.</p>
      <p>Add your implementation in <code>graph-registry.js</code></p>
      <details>
        <summary>Expected Data Format</summary>
        <pre>${JSON.stringify({ characters: [], chapters: [], x: [], centrality: {} }, null, 2)}</pre>
      </details>
    </div>
  `;
}

// GRAPH 4: Heatmap (Placeholder)
function renderHeatmapGraph(data) {
  const container = document.getElementById('graph-container');
  container.innerHTML = `
    <div class="placeholder">
      <h3>Internal Emotion Heatmap</h3>
      <p>This graph has not been implemented yet.</p>
      <p>Add your implementation in <code>graph-registry.js</code></p>
      <details>
        <summary>Expected Data Format</summary>
        <pre>${JSON.stringify({ characters: [], chapters: [], data: [[]] }, null, 2)}</pre>
      </details>
    </div>
  `;
}

// GRAPH 5: Network (Placeholder)
function renderNetworkGraph(data) {
  const container = document.getElementById('graph-container');
  container.innerHTML = `
    <div class="placeholder">
      <h3>Relationship Network</h3>
      <p>This graph has not been implemented yet.</p>
      <p>Add your implementation in <code>graph-registry.js</code></p>
      <details>
        <summary>Expected Data Format</summary>
        <pre>${JSON.stringify({ nodes: [], edges: [] }, null, 2)}</pre>
      </details>
    </div>
  `;
}

// GRAPH 6: Trajectory (Placeholder)
function renderTrajectoryGraph(data) {
  const container = document.getElementById('graph-container');
  container.innerHTML = `
    <div class="placeholder">
      <h3>Positive vs Negative Trajectory</h3>
      <p>This graph has not been implemented yet.</p>
      <p>Add your implementation in <code>graph-registry.js</code></p>
      <details>
        <summary>Expected Data Format</summary>
        <pre>${JSON.stringify({ chapters: [], points: [] }, null, 2)}</pre>
      </details>
    </div>
  `;
}

// ============================================
// GRAPH 7: EMOTION DASHBOARD
// ============================================

function renderEmotionDashboard(data) {
  const container = document.getElementById('graph-container');
  
  // Create dashboard HTML structure
  container.innerHTML = `
    <div class="emotion-dashboard">
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
    </div>
    
    <style>
      .emotion-dashboard {
        width: 100%;
        min-height: 600px;
      }
      
      .dashboard-controls {
        display: flex;
        justify-content: center;
        margin-bottom: 2rem;
        padding: 1rem;
        background-color: #0a0a0a;
        border: 1px solid #333;
        border-radius: 12px;
      }
      
      .view-toggle {
        display: flex;
        gap: 1rem;
      }
      
      .view-btn {
        background-color: #1a1a1a;
        color: #888;
        border: 1px solid #333;
        padding: 0.75rem 2rem;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      
      .view-btn:hover {
        border-color: #d4af37;
        color: #d4af37;
      }
      
      .view-btn.active {
        background-color: #d4af37;
        color: #000;
        border-color: #d4af37;
        font-weight: 600;
      }
      
      .dashboard-plot {
        width: 100%;
        height: 500px;
        background-color: #0a0a0a;
        border: 1px solid #333;
        border-radius: 12px;
        padding: 1rem;
      }
      
      .emotion-legend {
        margin-top: 2rem;
        padding: 1.5rem;
        background-color: #0a0a0a;
        border: 1px solid #333;
        border-radius: 12px;
      }
      
      .legend-title {
        color: #d4af37;
        font-size: 1rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin-bottom: 1rem;
      }
      
      .legend-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 0.75rem;
      }
      
      .legend-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        background-color: #1a1a1a;
        border-radius: 6px;
      }
      
      .legend-color {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 1px solid #444;
      }
      
      .legend-label {
        color: #aaa;
        font-size: 0.85rem;
      }
    </style>
  `;
  
  // Store data globally for view switching
  window.dashboardData = data;
  
  // Render initial view (story totals)
  renderStoryView(data);
}

// ============================================
// DASHBOARD VIEW SWITCHING
// ============================================

function switchDashboardView(view) {
  // Update button states
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.view === view) {
      btn.classList.add('active');
    }
  });
  
  // Render appropriate view
  if (view === 'story') {
    document.getElementById('emotion-legend').style.display = 'none';
    renderStoryView(window.dashboardData);
  } else if (view === 'character') {
    document.getElementById('emotion-legend').style.display = 'block';
    renderCharacterView(window.dashboardData);
  }
}

// Make function globally accessible
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
  
  // Build emotion color map
  const emotionColors = {};
  if (data.internal_emotions) {
    data.internal_emotions.forEach(emotion => {
      emotionColors[emotion.id] = emotion.color;
    });
  }
  
  // Extract chapter labels
  const xLabels = data.character_chapters.map(ch => ch.label || `Chapter ${ch.index}`);
  const xIndices = data.character_chapters.map(ch => ch.index);
  
  // Create traces for each character
  const traces = data.characters.map((character, charIdx) => {
    const importance = [];
    const colors = [];
    const hoverText = [];
    
    data.character_chapters.forEach((chapter, chIdx) => {
      const charData = chapter.characters.find(c => c.id === character.id);
      
      if (charData) {
        importance.push(charData.importance);
        
        // Get emotion color
        const emotionColor = emotionColors[charData.top_internal_emotion] || '#888';
        colors.push(emotionColor);
        
        // Build hover text
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
        color: `hsl(${charIdx * 60}, 70%, 60%)` // Different line color per character
      },
      marker: { 
        size: 12,
        color: colors,  // Colored by emotion
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
  
  // Render emotion legend
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
