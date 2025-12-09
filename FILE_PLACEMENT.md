# FILE PLACEMENT INSTRUCTIONS

After downloading all files, organize them in your project like this:

## Root Directory Files
Place these in your project root (`narrative-nexus/`):
- .gitignore
- package.json
- README.md

## Backend Files
Create a `backend/` folder and place inside it:
- server.js

## Frontend Files
Create a `frontend/` folder and place inside it:
- index.html
- book.html
- styles.css
- main.js

## Final Structure Should Look Like:

```
narrative-nexus/
├── .gitignore
├── package.json
├── README.md
├── backend/
│   └── server.js
└── frontend/
    ├── index.html
    ├── book.html
    ├── styles.css
    └── main.js
```

## Setup Steps:

1. Create project folder: `mkdir narrative-nexus && cd narrative-nexus`
2. Place root files (.gitignore, package.json, README.md) in this folder
3. Create backend folder: `mkdir backend`
4. Move server.js into backend/
5. Create frontend folder: `mkdir frontend`
6. Move all HTML/CSS/JS files into frontend/
7. Install dependencies: `npm install`
8. Create Library folder: `mkdir Library`
9. Add your book folders to Library/ (e.g., Library/Monte_Cristo/)
10. Run: `npm start`
11. Visit: http://localhost:3000

## Notes:
- The Library/ folder is NOT included in git (see .gitignore)
- Upload Library/ manually to your server after deployment
- All styling is already configured (black/white/gold theme)
- Books will fade in smoothly when the page loads
