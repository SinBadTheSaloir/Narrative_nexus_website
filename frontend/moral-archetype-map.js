// moral-archetype-map-improved.js - Enhanced Moral Archetype Map Visualization
// Features:
// - Clickable act numbers instead of play button
// - Smart radial label positioning to prevent overlaps
// - All acts shown dimmed, selected act highlighted

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
  
  // Initialize the archetype map
  renderMoralArchetypeMap(archetypeData);
}


// ============================================
// MAIN RENDERING FUNCTION
// ============================================

function renderMoralArchetypeMap(data) {
  const container = document.getElementById('dashboard-plot');
  
  // Create act number tabs dynamically
  const actTabs = data.units.map((unit, idx) => `
    <button class="act-tab ${idx === 0 ? 'active' : ''}" data-act-index="${idx}">
      ${unit.label}
    </button>
  `).join('');
  
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
        
        <!-- Act Tabs (clickable) -->
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
      
      /* Act Tabs Styling */
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
  
  // Initialize state
  window.archetypeState = {
    data: data,
    currentIndex: 0,
    selectedCharacters: new Set(),
    searchTerm: '',
    filterMode: 'all'
  };
  
  // Render initial views
  renderCharacterList();
  renderArchetypePlot();
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
// SMART RADIAL LABEL POSITIONING
// ============================================

function calculateRadialLabelPositions(points, minDistance = 0.8) {
  /**
   * Calculate non-overlapping label positions using radial spacing
   * Returns array of {x, y, textposition, angle} for each point
   */
  
  const labelInfo = points.map((point, idx) => ({
    x: point.x,
    y: point.y,
    name: point.name,
    color: point.color,
    originalIdx: idx
  }));
  
  // For each point, find optimal angle to place label
  const positions = labelInfo.map((point, idx) => {
    // Calculate angles to all other points
    const angles = [];
    
    labelInfo.forEach((other, otherIdx) => {
      if (idx === otherIdx) return;
      
      const dx = other.x - point.x;
      const dy = other.y - point.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < minDistance * 3) {
        // This point is close, record the angle to avoid
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        angles.push(angle);
      }
    });
    
    // Find the best angle (furthest from other points)
    let bestAngle = 90; // Default: top
    
    if (angles.length > 0) {
      // Sort angles
      angles.sort((a, b) => a - b);
      
      // Find largest gap between angles
      let maxGap = 0;
      let gapAngle = 90;
      
      for (let i = 0; i < angles.length; i++) {
        const nextAngle = angles[(i + 1) % angles.length];
        const gap = nextAngle - angles[i];
        
        if (gap > maxGap) {
          maxGap = gap;
          gapAngle = angles[i] + gap / 2;
        }
      }
      
      bestAngle = gapAngle;
    }
    
    // Convert angle to text position
    let textposition;
    if (bestAngle >= -45 && bestAngle < 45) {
      textposition = 'middle right';
    } else if (bestAngle >= 45 && bestAngle < 135) {
      textposition = 'top center';
    } else if (bestAngle >= 135 || bestAngle < -135) {
      textposition = 'middle left';
    } else {
      textposition = 'bottom center';
    }
    
    return {
      ...point,
      textposition: textposition,
      angle: bestAngle
    };
  });
  
  return positions;
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
    // Bottom-left: Madness / Evil (purple)
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
  // NEW: Show ALL acts, but dimmed for non-current
  // ============================================
  
  data.units.forEach((unit, unitIdx) => {
    const isCurrentAct = unitIdx === currentIndex;
    const opacity = isCurrentAct ? 1.0 : 0.15;
    const markerSize = isCurrentAct ? 12 : 8;
    
    // Collect all points for this unit
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
    
    // Calculate radial positions for labels (only for current act)
    let labelPositions = null;
    if (isCurrentAct) {
      labelPositions = calculateRadialLabelPositions(unitPoints);
    }
    
    // Create trace for this unit
    const trace = {
      x: unitPoints.map(p => p.x),
      y: unitPoints.map(p => p.y),
      text: isCurrentAct ? unitPoints.map((p, idx) => {
        const labelPos = labelPositions[idx];
        return labelPos.name;
      }) : [],
      mode: isCurrentAct ? 'markers+text' : 'markers',
      type: 'scatter',
      marker: {
        size: markerSize,
        color: unitPoints.map(p => p.color),
        opacity: opacity,
        line: { color: isCurrentAct ? '#000' : '#333', width: isCurrentAct ? 2 : 1 }
      },
      textposition: isCurrentAct ? labelPositions.map(l => l.textposition) : [],
      textfont: { size: 10, color: '#fff' },
      opacity: opacity,
      hovertemplate: unitPoints.map(p => 
        `${p.name}<br>` +
        `${unit.label}<br>` +
        `Control: ${p.point.x.toFixed(2)}<br>` +
        `Integrity: ${p.point.y.toFixed(2)}<br>` +
        `<extra></extra>`
      ),
      name: unit.label,
      showlegend: false
    };
    
    traces.push(trace);
  });
  
  // ============================================
  // Add trajectory lines for selected characters
  // ============================================
  
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
          opacity: 0.7,
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
        font: { size: 11, color: 'indigo', weight: 'bold' }
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
  
  // Act tab clicks
  document.querySelectorAll('.act-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const actIndex = parseInt(e.target.dataset.actIndex);
      
      // Update active state
      document.querySelectorAll('.act-tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      
      // Update current index
      window.archetypeState.currentIndex = actIndex;
      
      // Re-render plot
      renderArchetypePlot();
      
      // Update character detail if one is selected
      if (window.archetypeState.selectedCharacters.size === 1) {
        const charId = Array.from(window.archetypeState.selectedCharacters)[0];
        const char = data.characters.find(c => c.id === charId);
        showCharacterDetail(char);
      }
    });
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


// ============================================
// EXPORT
// ============================================

// Make sure the function is globally accessible
window.renderMoralArchetypeView = renderMoralArchetypeView;
