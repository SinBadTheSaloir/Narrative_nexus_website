// moral-archetype-map-final.js - Complete Enhanced Moral Archetype Map
// Features:
// - NO text labels on character dots
// - All nodes MORE VISIBLE (higher opacity)
// - ALL character trajectories shown as dotted lines
// - Thicker dotted lines for selected characters (in their color)
// - Gold quadrant labels for better visibility

// ============================================
// MORAL ARCHETYPE MAP - THIRD VIEW
// ============================================

function renderMoralArchetypeView(data) {
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
  
  // Consolidate duplicate characters
  const consolidatedData = consolidateDuplicateCharacters(archetypeData);
  
  // Initialize the archetype map
  renderMoralArchetypeMap(consolidatedData);
}


// ============================================
// CONSOLIDATE DUPLICATE CHARACTERS
// ============================================

function consolidateDuplicateCharacters(data) {
  const nameMap = new Map();
  const charMap = new Map();
  
  data.characters.forEach(char => {
    const normalized = char.name.toLowerCase().trim();
    
    if (!nameMap.has(normalized)) {
      const displayName = char.name.charAt(0).toUpperCase() + char.name.slice(1).toLowerCase();
      nameMap.set(normalized, displayName);
      charMap.set(normalized, {
        ...char,
        name: displayName,
        id: normalized.replace(/\s+/g, '_')
      });
    }
  });
  
  const consolidatedUnits = data.units.map(unit => {
    const pointMap = new Map();
    
    unit.points.forEach(point => {
      const normalized = point.character_name.toLowerCase().trim();
      
      if (!pointMap.has(normalized)) {
        pointMap.set(normalized, {
          ...point,
          character_id: normalized.replace(/\s+/g, '_'),
          character_name: nameMap.get(normalized)
        });
      }
    });
    
    return {
      ...unit,
      points: Array.from(pointMap.values())
    };
  });
  
  const consolidatedTrajectories = {};
  
  Object.entries(data.trajectories).forEach(([charId, trajectory]) => {
    const charName = data.characters.find(c => c.id === charId)?.name;
    if (charName) {
      const normalized = charName.toLowerCase().trim();
      const newCharId = normalized.replace(/\s+/g, '_');
      
      if (!consolidatedTrajectories[newCharId]) {
        consolidatedTrajectories[newCharId] = trajectory;
      }
    }
  });
  
  return {
    ...data,
    characters: Array.from(charMap.values()),
    units: consolidatedUnits,
    trajectories: consolidatedTrajectories
  };
}


// ============================================
// MAIN RENDERING FUNCTION
// ============================================

function renderMoralArchetypeMap(data) {
  const container = document.getElementById('dashboard-plot');
  
  const actTabs = data.units.map((unit, idx) => `
    <button class="act-tab ${idx === 0 ? 'active' : ''}" data-act-index="${idx}">
      ${unit.label}
    </button>
  `).join('');
  
  container.innerHTML = `
    <div class="archetype-map-container">
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
      
      <div class="archetype-plot-area">
        <div id="archetype-plotly" class="archetype-plot"></div>
        
        <div class="act-tabs-container">
          ${actTabs}
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
        max-height: 300px;
        overflow-y: auto;
      }
      
      .character-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        background-color: #1a1a1a;
        border: 1px solid #333;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.85rem;
      }
      
      .character-item:hover {
        background-color: #2a2a2a;
        border-color: #d4af37;
      }
      
      .character-item.selected {
        background-color: #2a2a2a;
        border-color: #d4af37;
      }
      
      .character-color {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        flex-shrink: 0;
        border: 1px solid #555;
      }
      
      .character-name {
        color: #ddd;
        flex: 1;
      }
      
      .archetype-plot-area {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      
      .archetype-plot {
        flex: 1;
        min-height: 500px;
      }
      
      .act-tabs-container {
        display: flex;
        gap: 0.5rem;
        padding: 1rem 0;
        justify-content: center;
        flex-wrap: wrap;
      }
      
      .act-tab {
        background-color: #1a1a1a;
        color: #888;
        border: 1px solid #333;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 500;
        transition: all 0.2s ease;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      
      .act-tab:hover {
        border-color: #d4af37;
        color: #d4af37;
        background-color: #2a2a2a;
      }
      
      .act-tab.active {
        background-color: #d4af37;
        color: #000;
        border-color: #d4af37;
        font-weight: 600;
      }
      
      .detail-row {
        margin-bottom: 0.75rem;
        font-size: 0.85rem;
        color: #aaa;
      }
      
      .detail-label {
        color: #d4af37;
        font-weight: 600;
        margin-right: 0.5rem;
      }
    </style>
  `;
  
  window.archetypeState = {
    data: data,
    currentIndex: 0,
    selectedCharacters: new Set(),
    searchTerm: '',
    filterMode: 'all'
  };
  
  renderCharacterList();
  renderArchetypePlot();
  setupArchetypeEventListeners();
  
  document.getElementById('emotion-legend').style.display = 'none';
}


// ============================================
// CHARACTER LIST RENDERING
// ============================================

function renderCharacterList() {
  const { data, selectedCharacters, searchTerm, filterMode } = window.archetypeState;
  const listContainer = document.getElementById('character-list');
  
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
  
  characters = characters.sort((a, b) => a.name.localeCompare(b.name));
  
  listContainer.innerHTML = characters.map(char => `
    <div class="character-item ${selectedCharacters.has(char.id) ? 'selected' : ''}" 
         data-char-id="${char.id}">
      <div class="character-color" style="background-color: ${char.color};"></div>
      <div class="character-name">${char.name}</div>
    </div>
  `).join('');
  
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
    {
      type: 'rect',
      x0: 0, y0: 0, x1: 10, y1: 10,
      fillcolor: data.quadrants.top_right.color,
      opacity: 0.25,
      layer: 'below',
      line: { width: 0 }
    },
    {
      type: 'rect',
      x0: -10, y0: 0, x1: 0, y1: 10,
      fillcolor: data.quadrants.top_left.color,
      opacity: 0.25,
      layer: 'below',
      line: { width: 0 }
    },
    {
      type: 'rect',
      x0: 0, y0: -10, x1: 10, y1: 0,
      fillcolor: data.quadrants.bottom_right.color,
      opacity: 0.25,
      layer: 'below',
      line: { width: 0 }
    },
    {
      type: 'rect',
      x0: -10, y0: -10, x1: 0, y1: 0,
      fillcolor: data.quadrants.bottom_left.color,
      opacity: 0.25,
      layer: 'below',
      line: { width: 0 }
    }
  ];
  
  const traces = [];
  
  // ============================================
  // FIRST: Add ALL character trajectory lines
  // ============================================
  
  data.characters.forEach(char => {
    const trajectory = data.trajectories[char.id];
    
    if (trajectory && trajectory.length > 1) {
      const isSelected = selectedCharacters.has(char.id);
      const pathUpToNow = trajectory.filter(p => p.unit_index <= currentIndex);
      
      if (pathUpToNow.length > 1) {
        traces.push({
          x: pathUpToNow.map(p => p.x),
          y: pathUpToNow.map(p => p.y),
          mode: 'lines',
          type: 'scatter',
          line: {
            color: char.color,                    // Character's color
            width: isSelected ? 3.0 : 1.2,        // Thicker for selected
            dash: 'dot'
          },
          opacity: isSelected ? 0.9 : 0.4,        // More visible for selected
          showlegend: false,
          hoverinfo: 'skip',
          name: `${char.name} path`
        });
      }
    }
  });
  
  // ============================================
  // SECOND: Show ALL acts as dots (MORE VISIBLE)
  // ============================================
  
  data.units.forEach((unit, unitIdx) => {
    const isCurrentAct = unitIdx === currentIndex;
    const opacity = isCurrentAct ? 1.0 : 0.5;     // Changed from 0.2 to 0.5 - MORE VISIBLE!
    const markerSize = isCurrentAct ? 16 : 12;    // Bigger dots
    
    const unitPoints = [];
    
    data.characters.forEach(char => {
      const point = unit.points.find(p => p.character_id === char.id);
      if (point) {
        unitPoints.push({
          x: point.x,
          y: point.y,
          name: char.name,
          color: char.color,
          char: char,
          point: point
        });
      }
    });
    
    // NO TEXT - only markers!
    const trace = {
      x: unitPoints.map(p => p.x),
      y: unitPoints.map(p => p.y),
      mode: 'markers',                            // ONLY markers, NO text!
      type: 'scatter',
      marker: {
        size: markerSize,
        color: unitPoints.map(p => p.color),
        opacity: opacity,
        line: { 
          color: isCurrentAct ? '#fff' : '#666',  // White border for current, gray for others
          width: isCurrentAct ? 2 : 1 
        }
      },
      hovertemplate: unitPoints.map(p => 
        `<b>${p.name}</b><br>` +
        `${unit.label}<br>` +
        `Control: ${p.point.x.toFixed(2)}<br>` +
        `Integrity: ${p.point.y.toFixed(2)}<br>` +
        `Top: ${Object.keys(p.point.top_emotions)[0]}<br>` +
        `<extra></extra>`
      ),
      name: unit.label,
      showlegend: false
    };
    
    traces.push(trace);
  });
  
  // Layout with GOLD quadrant labels
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
      zerolinewidth: 2,
      range: [-10, 10]
    },
    yaxis: {
      title: data.axes.y_label,
      color: '#888',
      gridcolor: '#2a2a2a',
      zeroline: true,
      zerolinecolor: '#000',
      zerolinewidth: 2,
      range: [-10, 10]
    },
    shapes: shapes,
    annotations: [
      // GOLD quadrant labels
      {
        x: 5, y: 5,
        text: data.quadrants.top_right.label,
        showarrow: false,
        font: { size: 13, color: '#d4af37', weight: 'bold' }  // GOLD!
      },
      {
        x: -5, y: 5,
        text: data.quadrants.top_left.label,
        showarrow: false,
        font: { size: 13, color: '#d4af37', weight: 'bold' }  // GOLD!
      },
      {
        x: 5, y: -5,
        text: data.quadrants.bottom_right.label,
        showarrow: false,
        font: { size: 13, color: '#d4af37', weight: 'bold' }  // GOLD!
      },
      {
        x: -5, y: -5,
        text: data.quadrants.bottom_left.label,
        showarrow: false,
        font: { size: 13, color: '#d4af37', weight: 'bold' }  // GOLD!
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
  
  document.querySelectorAll('.act-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const actIndex = parseInt(e.target.dataset.actIndex);
      
      document.querySelectorAll('.act-tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      
      window.archetypeState.currentIndex = actIndex;
      
      renderArchetypePlot();
      
      if (window.archetypeState.selectedCharacters.size === 1) {
        const charId = Array.from(window.archetypeState.selectedCharacters)[0];
        const char = data.characters.find(c => c.id === charId);
        showCharacterDetail(char);
      }
    });
  });
  
  const searchInput = document.getElementById('char-search');
  searchInput.addEventListener('input', (e) => {
    window.archetypeState.searchTerm = e.target.value;
    renderCharacterList();
  });
  
  document.querySelectorAll('input[name="char-filter"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      window.archetypeState.filterMode = e.target.value;
      renderCharacterList();
    });
  });
}


// ============================================
// EXPORT
// ============================================

window.renderMoralArchetypeView = renderMoralArchetypeView;
