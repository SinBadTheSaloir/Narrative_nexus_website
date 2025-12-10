# Narrative Nexus - Emotion Dashboard Viewer

A simple web application for viewing emotion dashboards from narrative analysis data.

## Features

- **Library View**: Browse available books
- **Emotion Dashboard**: Two visualization modes
  - Total Story View: Positive/negative emotional intensity across chapters
  - Character View: Character importance over time with emotion markers

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Library Data

The `Library/` folder structure:

```
Library/
└── the_great_gatsby/
    ├── metadata.json      # Book information
    └── dashboard.json     # Dashboard data
```

**metadata.json** format:
```json
{
  "id": "the_great_gatsby",
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "year": 1925,
  "chapterCount": 9,
  "characterCount": 33,
  "description": "A classic American novel"
}
```

**dashboard.json** format: See included example file.

### 3. Run the Application

```bash
npm start
```

Then visit: **http://localhost:3000**

## Project Structure

```
narrative-nexus/
├── backend/
│   └── server.js           # Express API server
├── frontend/
│   ├── index.html          # Main HTML
│   ├── app.js              # Application logic & routing
│   └── styles.css          # Styling
├── Library/                # Data folder (not in git)
│   └── the_great_gatsby/
│       ├── metadata.json
│       └── dashboard.json
└── package.json
```

## Usage

1. **Library Page** (`/`): Shows all available books
2. **Dashboard Page** (`/books/:bookId`): Shows emotion dashboard with:
   - Toggle between Story View and Character View
   - Interactive Plotly visualizations
   - Emotion legend for character view

## API Endpoints

- `GET /api/books` - List all books
- `GET /api/books/:bookId/dashboard` - Get dashboard data

## Adding New Books

1. Create a folder in `Library/` with your book ID
2. Add `metadata.json` with book information
3. Add `dashboard.json` with visualization data
4. Restart the server
5. Book appears automatically in the library

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: Vanilla JavaScript
- **Visualization**: Plotly.js
- **Styling**: Pure CSS (black/white/gold theme)

## Color Palette

- Background: `#000000`
- Container: `#0a0a0a`
- Gold Accent: `#d4af37`
- Text: `#ffffff`, `#888888`
- Positive: `#51cf66`
- Negative: `#ff6b6b`

## Development

```bash
# Install dependencies
npm install

# Run in development
npm run dev
```

## Deployment

Works on any Node.js hosting platform (Render, Railway, Heroku, etc.)

1. Push code to GitHub
2. Connect to hosting platform
3. Platform auto-detects Node.js
4. Upload `Library/` folder separately
5. Done!

---

**Built for analyzing narrative emotion data**
