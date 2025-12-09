# 🚀 NARRATIVE NEXUS v2.0 - Complete Rewrite

**Convention-Based Library Architecture with Plug-and-Play Graph System**

---

## 📋 **WHAT'S NEW:**

This is a **complete rewrite** with a much better architecture:

✅ **Backend:** Convention-based Library folder scanner with REST API  
✅ **Frontend:** App Shell with hash routing and Graph Registry  
✅ **Graphs:** Plug-and-play system - add graphs one at a time  
✅ **Books:** Drop folders to add books - no code changes needed  
✅ **Deployment:** Ready for Render, Vercel, or any Node.js host  

---

## 📁 **PROJECT STRUCTURE:**

```
narrative-nexus/
├── backend/
│   ├── server.js           # Express server with Library scanner
│   └── package.json
├── frontend/
│   ├── index.html          # App Shell
│   ├── app.js              # Router + Page Components
│   ├── graph-registry.js   # Graph plugin system
│   └── styles.css          # Complete styling
├── Library/                # Convention-based data storage
│   └── gatsby/             # Example book
│       ├── metadata.json   # Book info
│       ├── chapters/       # (future use)
│       └── graphs/         # Precomputed graph JSONs
│           └── heartbeat.json
└── README.md
```

---

## 🎯 **HOW IT WORKS:**

### **1. Backend (Convention-Based)**

The backend **scans** the `Library/` folder and auto-discovers books:

```
Library/
  /gatsby/
    metadata.json        → Book info
    /graphs/
      heartbeat.json     → Precomputed graph data
      importance.json
      centrality.json
```

**Convention:** 
- Folder name = Book ID
- Must have `metadata.json`
- Graphs in `/graphs` folder
- One `.json` file per graph type

**API Endpoints:**
```
GET /api/books                        → List all books
GET /api/books/:bookId/graphs         → List available graphs for book
GET /api/books/:bookId/graph/:type    → Get graph data
```

### **2. Frontend (App Shell + Router)**

**Routes:**
```
#/                                    → Library Page (book selector)
#/books/:bookId                       → Book Graphs Page (graph selector)
#/books/:bookId/:graphType            → Graph Viewer Page (renders graph)
```

**Graph Registry:**
```javascript
GRAPH_REGISTRY = {
  'heartbeat': { label: '...', render: function(data) {...} }
}
```

To add a graph:
1. Create precomputed JSON in `/Library/book/graphs/`
2. Add entry to registry in `graph-registry.js`
3. **Done** - Works for all books automatically

---

## 🚀 **QUICK START:**

### **1. Install Dependencies:**

```bash
cd backend
npm install
```

### **2. Start Backend:**

```bash
npm start
```

Backend runs on `http://localhost:3000`

### **3. Open Frontend:**

Open `frontend/index.html` in browser, or serve with:

```bash
# Option 1: Python
cd frontend
python3 -m http.server 8000

# Option 2: Node http-server
npx http-server frontend -p 8000
```

Visit: `http://localhost:8000`

---

## 📚 **ADDING A BOOK:**

### **Step 1: Create Folder Structure**

```bash
mkdir -p Library/monte_cristo/graphs
mkdir -p Library/monte_cristo/chapters
```

### **Step 2: Create metadata.json**

```json
{
  "id": "monte_cristo",
  "title": "The Count of Monte Cristo",
  "author": "Alexandre Dumas",
  "year": 1844,
  "chapterCount": 117,
  "characterCount": 20,
  "description": "...",
  "lastProcessed": "2025-12-09T00:00:00Z"
}
```

### **Step 3: Generate Graph JSONs**

Run your preprocessing script (Python/Node) to generate:

```
Library/monte_cristo/graphs/heartbeat.json
Library/monte_cristo/graphs/importance.json
Library/monte_cristo/graphs/centrality.json
...
```

### **Step 4: Restart Backend**

```bash
# Backend rescans Library/ on startup
npm start
```

**That's it!** Book appears automatically on the frontend.

---

## 🎨 **ADDING A GRAPH:**

### **Step 1: Generate Data**

Create JSON files for each book:

```
Library/gatsby/graphs/new_graph.json
Library/monte_cristo/graphs/new_graph.json
```

### **Step 2: Add to Registry**

Edit `frontend/graph-registry.js`:

```javascript
GRAPH_REGISTRY['new_graph'] = {
  label: 'New Graph Type',
  description: 'What this graph shows',
  render: function(data, bookId) {
    // Your rendering logic here
    renderNewGraph(data);
  }
};

function renderNewGraph(data) {
  const container = document.getElementById('graph-container');
  // Use Plotly, vis.js, or custom rendering
  container.innerHTML = '<div id="plot"></div>';
  Plotly.newPlot('plot', ...);
}
```

### **Step 3: Done**

- Backend auto-discovers `new_graph.json`
- Frontend shows button automatically
- Clicking renders your graph

**No routing changes. No API changes. Just add data + registry entry.**

---

## 📊 **GRAPH DATA FORMATS:**

### **Example: Heartbeat Graph**

```json
{
  "type": "heartbeat",
  "schemaVersion": "1.0",
  "chapters": ["Chapter 1", "Chapter 2", ...],
  "x": [0, 1, 2, ...],
  "positive": [12, 15, 18, ...],
  "negative": [4, 9, 6, ...],
  "total": [16, 24, 24, ...]
}
```

### **Example: Network Graph**

```json
{
  "type": "network",
  "schemaVersion": "1.0",
  "nodes": [
    { "id": "nick", "label": "Nick Carraway" },
    { "id": "gatsby", "label": "Jay Gatsby" }
  ],
  "edges": [
    { "source": "nick", "target": "gatsby", "weight": 0.8 }
  ]
}
```

---

## 🔧 **CURRENT STATUS:**

### **✅ Working:**
- Backend server with Library scanner
- 3 REST API endpoints
- Frontend App Shell with routing
- Library Page (book selector)
- Book Graphs Page (graph selector)
- Graph Viewer Page (generic renderer)
- Graph Registry system
- **1 sample graph:** Heartbeat (implemented)

### **🚧 To Implement:**
- 5 more graphs (placeholders ready)
- Data preprocessing scripts
- Chapter-level filtering
- Advanced error handling

---

## 📝 **DEVELOPMENT WORKFLOW:**

### **Adding New Book:**

1. Process raw data → generate graph JSONs
2. Create Library folder structure
3. Restart backend
4. Book appears automatically

### **Adding New Graph:**

1. Generate JSON for each book
2. Add render function to registry
3. Refresh page
4. Graph available for all books

### **Debugging:**

```bash
# Check what backend sees
curl http://localhost:3000/api/books

# Force library rescan
curl -X POST http://localhost:3000/api/rescan

# Check specific graph
curl http://localhost:3000/api/books/gatsby/graph/heartbeat
```

---

## 🚀 **DEPLOYMENT (Render):**

### **1. Push to GitHub:**

```bash
git init
git add .
git commit -m "Initial v2.0 architecture"
git push origin main
```

### **2. Create render.yaml:**

```yaml
services:
  - type: web
    name: narrative-nexus
    env: node
    buildCommand: "cd backend && npm install"
    startCommand: "cd backend && npm start"
    envVars:
      - key: NODE_ENV
        value: production
```

### **3. Deploy:**

- Connect GitHub repo to Render
- Render auto-detects `render.yaml`
- Deploys backend + serves frontend

---

## 🎯 **NEXT STEPS:**

### **Immediate (Week 1):**
1. ✅ System architecture done
2. ⬜ Implement Graph 2 (Importance)
3. ⬜ Implement Graph 3 (Centrality)
4. ⬜ Create data preprocessing script

### **Short-term (Week 2-3):**
1. ⬜ Implement remaining 3 graphs
2. ⬜ Add Monte Cristo book
3. ⬜ Create automated data pipeline
4. ⬜ Add chapter filtering UI

### **Long-term:**
1. ⬜ User authentication
2. ⬜ Upload interface for books
3. ⬜ Real-time graph generation
4. ⬜ Export/share features

---

## 💡 **ARCHITECTURE BENEFITS:**

### **Before (Old System):**
- ❌ Hardcoded book data in frontend
- ❌ Manual updates for each book
- ❌ Tight coupling between books and graphs
- ❌ 10+ files to change per new book

### **After (New System):**
- ✅ Convention-based auto-discovery
- ✅ Drop folder → Book appears
- ✅ Precomputed graphs (fast loads)
- ✅ Plug-and-play graph system
- ✅ Add graph once → Works for all books

---

## 📞 **SUPPORT:**

Questions? Check:
1. Browser console (F12)
2. Backend logs
3. API responses with curl
4. Data format in JSON files

---

## 🎉 **YOU'RE READY!**

The complete architecture is in place. Now you can:

1. **Add books** by dropping folders
2. **Add graphs** one at a time
3. **Scale** to 100s of books easily
4. **Deploy** to production

**Start by implementing your next graph in `graph-registry.js`!** 🚀
