#!/bin/bash

# quick-start.sh - Get Narrative Nexus v2.0 running in 30 seconds

echo "🚀 NARRATIVE NEXUS v2.0 - QUICK START"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "   Install from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install --silent
cd ..
echo "✅ Backend dependencies installed"
echo ""

# Check Library folder
if [ ! -d "Library/gatsby" ]; then
    echo "⚠️  Library/gatsby folder not found"
    echo "   Creating example structure..."
    mkdir -p Library/gatsby/graphs
    mkdir -p Library/gatsby/chapters
fi

# Check if heartbeat.json exists
if [ ! -f "Library/gatsby/graphs/heartbeat.json" ]; then
    echo "⚠️  Example heartbeat.json missing"
    echo "   You'll need to generate graph data"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 NEXT STEPS:"
echo ""
echo "1. Start the backend:"
echo "   cd backend && npm start"
echo ""
echo "2. In another terminal, serve the frontend:"
echo "   cd frontend && python3 -m http.server 8000"
echo "   (or use: npx http-server -p 8000)"
echo ""
echo "3. Visit: http://localhost:8000"
echo ""
echo "📚 Read README.md for full documentation"
echo ""
