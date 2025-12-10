# QUICK SETUP GUIDE

## Step 1: Download & Extract

Download all files and extract to a folder called `narrative-nexus/`

## Step 2: Install Dependencies

Open terminal in the `narrative-nexus/` folder and run:

```bash
npm install
```

This installs Express and CORS (only 2 dependencies needed).

## Step 3: Start the Server

```bash
npm start
```

Or use the quick start script:

```bash
./start.sh
```

## Step 4: Open in Browser

Visit: **http://localhost:3000**

You should see:
1. Landing page with "NARRATIVE NEXUS" title
2. One book card: "The Great Gatsby"
3. Click it to view the dashboard

## Step 5: Use the Dashboard

The dashboard has 2 views you can toggle:

**Total Story View:**
- Shows positive, negative, and total emotional intensity
- Across all 9 chapters
- Green = Positive, Red = Negative, Gold = Total

**Character View:**
- Shows character importance over time
- Marker colors indicate emotion states
- Hover to see details
- Legend shows all emotions at bottom

## Troubleshooting

**"Cannot find module 'express'"**
→ Run `npm install` first

**"EADDRINUSE: Port 3000 already in use"**
→ Kill other process or change PORT in server.js

**"No books found"**
→ Make sure Library/the_great_gatsby/ exists with both files

**Dashboard won't load**
→ Check browser console (F12) for errors
→ Verify dashboard.json is valid JSON

## File Checklist

Make sure you have these files:

```
✓ .gitignore
✓ package.json
✓ README.md
✓ CHANGES.md
✓ start.sh
✓ backend/server.js
✓ frontend/index.html
✓ frontend/app.js
✓ frontend/styles.css
✓ Library/the_great_gatsby/metadata.json
✓ Library/the_great_gatsby/dashboard.json
```

## Success Indicators

When everything works, you'll see in terminal:

```
📚 Scanning Library...
  ✅ The Great Gatsby (dashboard available)
📚 Library scan complete: 1 books found

🚀 Narrative Nexus running on http://localhost:3000
📚 1 books loaded
```

## What to Do Next

### Add More Books

1. Create new folder in `Library/` (e.g., `monte_cristo/`)
2. Add `metadata.json` with book info
3. Add `dashboard.json` with your data
4. Restart server → Book appears!

### Customize Styling

Edit `frontend/styles.css` to change:
- Colors (search for `#d4af37` to change gold)
- Fonts
- Layout
- Spacing

### Deploy Online

Works with:
- Render.com (free tier)
- Railway.app (free tier)  
- Heroku
- Any Node.js hosting

Just push to GitHub and connect your repo!

---

**Need help?** Check CHANGES.md for detailed explanation of how everything works.
