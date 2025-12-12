// moral-archetype-map.js - Moral Archetype Map Visualization
// Add this to your graph-registry.js or include as a separate file

// ============================================
// MORAL ARCHETYPE MAP - CHARACTER VIEW REPLACEMENT
// ============================================

/**
 * Renders the Moral Archetype Map instead of the old character importance view.
 * This replaces the renderCharacterView function.
 */
function renderCharacterView(data) {
  // Check if we have moral archetype data
  if (!data.moral_archetype) {
    document.getElementById('dashboard-plot').innerHTML = 
      '<div style="text-align: center; color: #888; padding: 3rem;">' +
      'No moral archetype data available.<br>' +
      'Run generate_moral_archetype_json.py to create the data file.' +
      '</div>';
    return;
  }
  
  const archetypeData = data.moral_archetype;
  
  // Validate data structure
  if (!archetypeData.units || !archetypeData.characters) {
    document.getElementById('dashboard-plot').innerHTML = 
      '<div style="text-align: center; color: #888; padding: 3rem;">Invalid archetype data format</div>';
    return;
  }
  
  // Initialize the archetype map
  renderMoralArchetypeMap(archetypeData);
}


// ============================================
// MAIN RENDERING FUNCTION
// ============================================

function renderMoralArchetypeMap(data) {
  const container = document.getElementById('dashboard-plot');
  
  // Create HTML structure
  container.innerHTML = `
    <div class="archetype-map-container">
      <!-- Character Filter Sidebar -->
      <div class="archetype-sidebar">
        <div class="sidebar-section">
          <h3>Characters</h3>
          <div class="character-search">
            <input type="text" id="char-search" placeholder="Search..." />
          </div>
          <div class="character-filter-options">
            <label>
              <input type="radio" name="char-filter" value="all" checked />
              Show All
            </label>
            <label>
              <input type="radio" name="char-filter" value="main" />
              Main Only
            </label>
            <label>
              <input type="radio" name="char-filter" value="selected" />
              Selected Only
            </label>
          </div>
          <div id="character-list" class="character-list"></div>
        </div>
        
        <div class="sidebar-section" id="character-detail" style="display: none;">
          <h3>Character Detail</h3>
          <div id="character-detail-content"></div>
        </div>
      </div>
      
      <!-- Main Plot Area -->
      <div class="archetype-plot-area">
        <div id="archetype-plotly" class="archetype-plot"></div>
        
        <!-- Time Slider Controls -->
        <div class="time-controls">
          <button id="play-btn" class="control-btn">▶ Play</button>
          <input type="range" id="time-slider" min="0" max="${data.units.length - 1}" value="0" step="1" />
          <div id="time-label" class="time-label">${data.units[0].label}</div>
        </div>
      </div>
    </div>
    
    <style>
      .archetype-map-container {
        display: flex;
        gap: 1rem;
        width: 100%;
        min-height: 600px;
      }
      
      .archetype-sidebar {
        width: 250px;
        background-color: #0a0a0a;
        border: 1px solid #333;
        border-radius: 8px;
        padding: 1rem;
        overflow-y: auto;
        max-height: 700px;
      }
      
      .sidebar-section {
        margin-bottom: 1.5rem;
      }
      
      .sidebar-section h3 {
        color: #d4af37;
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.75rem;
      }
      
      .character-search input {
        width: 100%;
        background-color: #1a1a1a;
        border: 1px solid #333;
        color: #fff;
        padding: 0.5rem;
        border-radius: 4px;
        font-size: 0.85rem;
        margin-bottom: 0.75rem;
      }
      
      .character-filter-options {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 0.75rem;
        font-size: 0.85rem;
      }
      
      .character-filter-options label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #aaa;
        cursor: pointer;
      }
      
      .character-filter-options input[type="radio"] {
        cursor: pointer;
      }
      
      .character-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      
      .character-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        background-color: #1a1a1a;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
        font-size: 0.85rem;
      }
      
      .character-item:hover {
        background-color: #2a2a2a;
      }
      
      .character-item.selected {
        background-color: #2a2a2a;
        border-left: 3px solid #d4af37;
      }
      
      .character-color {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        flex-shrink: 0;
      }
      
      .character-name {
        color: #ccc;
        flex: 1;
      }
      
      #character-detail-content {
        color: #aaa;
        font-size: 0.85rem;
        line-height: 1.6;
      }
      
      .detail-row {
        margin-bottom: 0.5rem;
      }
      
      .detail-label {
        color: #d4af37;
        font-weight: 600;
      }
      
      .archetype-plot-area {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      
      .archetype-plot {
        flex: 1;
        min-height: 550px;
        background-color: #0a0a0a;
        border: 1px solid #333;
        border-radius: 8px;
      }
      
      .time-controls {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background-color: #0a0a0a;
        border: 1px solid #333;
        border-radius: 8px;
        margin-top: 1rem;
      }
      
      .control-btn {
        background-color: #d4af37;
        color: #000;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      
      .control-btn:hover {
        background-color: #c19d2f;
      }
      
      #time-slider {
        flex: 1;
        height: 6px;
        border-radius: 3px;
        background: #333;
        outline: none;
        -webkit-appearance: none;
      }
      
      #time-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #d4af37;
        cursor: pointer;
      }
      
      #time-slider::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #d4af37;
        cursor: pointer;
        border: none;
      }
      
      .time-label {
        color: #d4af37;
        font-weight: 600;
        min-width: 100px;
        text-align: right;
      }
    </style>
  `;
  
  // Initialize state
  window.archetypeState = {
    data: data,
    currentIndex: 0,
    selectedCharacters: new Set(),
    isPlaying: false,
    playInterval: null,
    searchTerm: '',
    filterMode: 'all'
  };
  
  // Render character list
  renderCharacterList();
  
  // Render initial plot
  renderArchetypePlot();
  
  // Setup event listeners
  setupArchetypeEventListeners();
  
  // Hide the emotion legend (not needed for archetype map)
  document.getElementById('emotion-legend').style.display = 'none';
}


// ============================================
// CHARACTER LIST RENDERING
// ============================================

function renderCharacterList() {
  const { data, selectedCharacters, searchTerm, filterMode } = window.archetypeState;
  const listContainer = document.getElementById('character-list');
  
  // Filter characters
  let characters = data.characters;
  
  if (searchTerm) {
    characters = characters.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  if (filterMode === 'main') {
    characters = characters.filter(c => c.is_main);
  } else if (filterMode === 'selected') {
    characters = characters.filter(c => selectedCharacters.has(c.id));
  }
  
  // Render list
  listContainer.innerHTML = characters.map(char => `
    <div class="character-item ${selectedCharacters.has(char.id) ? 'selected' : ''}" 
         data-char-id="${char.id}">
      <div class="character-color" style="background-color: ${char.color};"></div>
      <div class="character-name">${char.name}</div>
    </div>
  `).join('');
  
  // Add click handlers
  listContainer.querySelectorAll('.character-item').forEach(item => {
    item.addEventListener('click', () => {
      const charId = item.dataset.charId;
      toggleCharacterSelection(charId);
    });
  });
}


function toggleCharacterSelection(charId) {
  const { selectedCharacters } = window.archetypeState;
  
  if (selectedCharacters.has(charId)) {
    selectedCharacters.delete(charId);
  } else {
    selectedCharacters.add(charId);
  }
  
  renderCharacterList();
  renderArchetypePlot();
  
  // Show character detail if one is selected
  if (selectedCharacters.size === 1) {
    const char = window.archetypeState.data.characters.find(c => c.id === charId);
    showCharacterDetail(char);
  } else {
    document.getElementById('character-detail').style.display = 'none';
  }
}


function showCharacterDetail(character) {
  const { data, currentIndex } = window.archetypeState;
  const detailSection = document.getElementById('character-detail');
  const detailContent = document.getElementById('character-detail-content');
  
  const currentUnit = data.units[currentIndex];
  const point = currentUnit.points.find(p => p.character_id === character.id);
  
  if (!point) {
    detailContent.innerHTML = '<p>Character not present in this unit.</p>';
    detailSection.style.display = 'block';
    return;
  }
  
  const trajectory = data.trajectories[character.id] || [];
  
  detailContent.innerHTML = `
    <div class="detail-row">
      <span class="detail-label">Name:</span> ${character.name}
    </div>
    <div class="detail-row">
      <span class="detail-label">Current ${data.structure.unit_type}:</span> ${currentUnit.label}
    </div>
    <div class="detail-row">
      <span class="detail-label">Position:</span><br>
      Control: ${point.x.toFixed(2)}<br>
      Integrity: ${point.y.toFixed(2)}
    </div>
    <div class="detail-row">
      <span class="detail-label">Internal Scores:</span><br>
      Positive: ${point.internal_scores.positive}<br>
      Negative: ${point.internal_scores.negative}
    </div>
    <div class="detail-row">
      <span class="detail-label">Top Emotions:</span><br>
      ${Object.entries(point.top_emotions).map(([emotion, value]) => 
        `${emotion}: ${value}`
      ).join('<br>')}
    </div>
    <div class="detail-row">
      <span class="detail-label">Trajectory:</span> ${trajectory.length} points
    </div>
  `;
  
  detailSection.style.display = 'block';
}


// ============================================
// PLOT RENDERING
// ============================================

function renderArchetypePlot() {
  const { data, currentIndex, selectedCharacters } = window.archetypeState;
  const currentUnit = data.units[currentIndex];
  
  if (!currentUnit) return;
  
  // Create quadrant shapes for background
  const shapes = [
    // Top-right: Hero / Stable (light blue)
    {
      type: 'rect',
      x0: 0, y0: 0, x1: 10, y1: 10,
      fillcolor: data.quadrants.top_right.color,
      opacity: 0.25,
      layer: 'below',
      line: { width: 0 }
    },
    // Top-left: Cold Tyrant (light coral)
    {
      type: 'rect',
      x0: -10, y0: 0, x1: 0, y1: 10,
      fillcolor: data.quadrants.top_left.color,
      opacity: 0.25,
      layer: 'below',
      line: { width: 0 }
    },
    // Bottom-right: Tragic Victim (plum)
    {
      type: 'rect',
      x0: 0, y0: -10, x1: 10, y1: 0,
      fillcolor: data.quadrants.bottom_right.color,
      opacity: 0.25,
      layer: 'below',
      line: { width: 0 }
    },
    // Bottom-left: Madness / Evil (indigo)
    {
      type: 'rect',
      x0: -10, y0: -10, x1: 0, y1: 0,
      fillcolor: data.quadrants.bottom_left.color,
      opacity: 0.25,
      layer: 'below',
      line: { width: 0 }
    }
  ];
  
  // Determine which characters to show
  let visibleCharacters = data.characters;
  if (selectedCharacters.size > 0) {
    visibleCharacters = data.characters.filter(c => selectedCharacters.has(c.id));
  }
  
  // Create scatter traces for current positions
  const currentTrace = {
    x: [],
    y: [],
    text: [],
    mode: 'markers+text',
    type: 'scatter',
    marker: {
      size: 12,
      color: [],
      line: { color: '#000', width: 2 }
    },
    textposition: 'top center',
    textfont: { size: 10, color: '#fff' },
    hovertemplate: '%{text}<extra></extra>',
    name: 'Current Position'
  };
  
  visibleCharacters.forEach(char => {
    const point = currentUnit.points.find(p => p.character_id === char.id);
    if (point) {
      currentTrace.x.push(point.x);
      currentTrace.y.push(point.y);
      currentTrace.marker.color.push(char.color);
      currentTrace.text.push(
        `${char.name}<br>` +
        `Control: ${point.x.toFixed(2)}<br>` +
        `Integrity: ${point.y.toFixed(2)}<br>` +
        `Top: ${Object.keys(point.top_emotions)[0]}`
      );
    }
  });
  
  const traces = [currentTrace];
  
  // Add trajectory lines for selected characters
  selectedCharacters.forEach(charId => {
    const char = data.characters.find(c => c.id === charId);
    const trajectory = data.trajectories[charId];
    
    if (trajectory && trajectory.length > 1) {
      // Only show trajectory up to current index
      const pathUpToNow = trajectory.filter(p => p.unit_index <= currentIndex);
      
      if (pathUpToNow.length > 1) {
        traces.push({
          x: pathUpToNow.map(p => p.x),
          y: pathUpToNow.map(p => p.y),
          mode: 'lines',
          type: 'scatter',
          line: {
            color: char.color,
            width: 2,
            dash: 'dot'
          },
          opacity: 0.5,
          showlegend: false,
          hoverinfo: 'skip'
        });
      }
    }
  });
  
  // Layout
  const layout = {
    title: {
      text: `${data.title} - Moral Archetype Map<br><sub>${currentUnit.label}</sub>`,
      font: { color: '#d4af37', size: 18 }
    },
    xaxis: {
      title: data.axes.x_label,
      color: '#888',
      gridcolor: '#2a2a2a',
      zeroline: true,
      zerolinecolor: '#000',
      zerolinewidth: 2
    },
    yaxis: {
      title: data.axes.y_label,
      color: '#888',
      gridcolor: '#2a2a2a',
      zeroline: true,
      zerolinecolor: '#000',
      zerolinewidth: 2
    },
    shapes: shapes,
    annotations: [
      // Quadrant labels
      {
        x: 5, y: 5,
        text: data.quadrants.top_right.label,
        showarrow: false,
        font: { size: 11, color: 'navy', weight: 'bold' }
      },
      {
        x: -5, y: 5,
        text: data.quadrants.top_left.label,
        showarrow: false,
        font: { size: 11, color: 'darkred', weight: 'bold' }
      },
      {
        x: 5, y: -5,
        text: data.quadrants.bottom_right.label,
        showarrow: false,
        font: { size: 11, color: 'purple', weight: 'bold' }
      },
      {
        x: -5, y: -5,
        text: data.quadrants.bottom_left.label,
        showarrow: false,
        font: { size: 11, color: 'white', weight: 'bold' }
      }
    ],
    paper_bgcolor: '#0a0a0a',
    plot_bgcolor: '#0a0a0a',
    font: { color: '#888' },
    showlegend: false,
    hovermode: 'closest',
    margin: { t: 80, b: 60, l: 80, r: 40 }
  };
  
  const config = {
    responsive: true,
    displayModeBar: false
  };
  
  Plotly.newPlot('archetype-plotly', traces, layout, config);
}


// ============================================
// EVENT LISTENERS
// ============================================

function setupArchetypeEventListeners() {
  const { data } = window.archetypeState;
  
  // Time slider
  const slider = document.getElementById('time-slider');
  const timeLabel = document.getElementById('time-label');
  
  slider.addEventListener('input', (e) => {
    window.archetypeState.currentIndex = parseInt(e.target.value);
    const currentUnit = data.units[window.archetypeState.currentIndex];
    timeLabel.textContent = currentUnit.label;
    renderArchetypePlot();
    
    // Update character detail if one is selected
    if (window.archetypeState.selectedCharacters.size === 1) {
      const charId = Array.from(window.archetypeState.selectedCharacters)[0];
      const char = data.characters.find(c => c.id === charId);
      showCharacterDetail(char);
    }
  });
  
  // Play button
  const playBtn = document.getElementById('play-btn');
  playBtn.addEventListener('click', () => {
    if (window.archetypeState.isPlaying) {
      stopAnimation();
    } else {
      startAnimation();
    }
  });
  
  // Character search
  const searchInput = document.getElementById('char-search');
  searchInput.addEventListener('input', (e) => {
    window.archetypeState.searchTerm = e.target.value;
    renderCharacterList();
  });
  
  // Filter radio buttons
  document.querySelectorAll('input[name="char-filter"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      window.archetypeState.filterMode = e.target.value;
      renderCharacterList();
    });
  });
}


function startAnimation() {
  const { data } = window.archetypeState;
  const slider = document.getElementById('time-slider');
  const playBtn = document.getElementById('play-btn');
  const timeLabel = document.getElementById('time-label');
  
  window.archetypeState.isPlaying = true;
  playBtn.textContent = '⏸ Pause';
  
  window.archetypeState.playInterval = setInterval(() => {
    let nextIndex = window.archetypeState.currentIndex + 1;
    
    if (nextIndex >= data.units.length) {
      nextIndex = 0; // Loop back to start
    }
    
    window.archetypeState.currentIndex = nextIndex;
    slider.value = nextIndex;
    timeLabel.textContent = data.units[nextIndex].label;
    
    renderArchetypePlot();
    
    // Update character detail if needed
    if (window.archetypeState.selectedCharacters.size === 1) {
      const charId = Array.from(window.archetypeState.selectedCharacters)[0];
      const char = data.characters.find(c => c.id === charId);
      showCharacterDetail(char);
    }
  }, 1500); // 1.5 second intervals
}


function stopAnimation() {
  const playBtn = document.getElementById('play-btn');
  
  window.archetypeState.isPlaying = false;
  playBtn.textContent = '▶ Play';
  
  if (window.archetypeState.playInterval) {
    clearInterval(window.archetypeState.playInterval);
    window.archetypeState.playInterval = null;
  }
}


// ============================================
// EXPORT FOR GRAPH REGISTRY
// ============================================

// Make sure the function is globally accessible
window.renderCharacterView = renderCharacterView;
