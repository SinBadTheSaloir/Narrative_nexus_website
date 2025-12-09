# Narrative Nexus

Live library viewer for narrative analysis data.

## Setup

1. Install dependencies: `npm install`
2. Create `Library/` folder in project root (not tracked in git)
3. Add book folders to `Library/`, each with chapter JSON files
4. Run: `npm start`
5. Visit: `http://localhost:3000`

## Project Structure

```
narrative-nexus/
├── .gitignore
├── package.json
├── README.md
├── Library/                    # NOT in git (upload to server manually)
│   ├── Monte_Cristo/
│   │   ├── ch01.json
│   │   ├── ch02.json
│   │   └── ...
│   └── Great_Gatsby/
│       ├── ch01.json
│       └── ...
├── backend/
│   └── server.js
└── frontend/
    ├── index.html
    ├── book.html
    ├── styles.css
    └── main.js
```

## Deployment

- Push to GitHub (Library folder excluded via .gitignore)
- Deploy on Render/Railway
- Upload Library folder directly to server via SFTP or dashboard
# Narrative_nexus_website
