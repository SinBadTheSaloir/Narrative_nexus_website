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
