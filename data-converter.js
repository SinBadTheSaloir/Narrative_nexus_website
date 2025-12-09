// data-converter.js
// Run this with Node.js to convert your Library files into frontend format

const fs = require('fs');
const path = require('path');

// CONFIG: Set your Library path here
const LIBRARY_PATH = './Library/The_Great_Gatsby_DATA';
const OUTPUT_FILE = './frontend/book-data.js';

// Function to read and parse a chapter file
function readChapterFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(content);
    
    // Parse the raw_response string (it's JSON inside JSON)
    if (json.raw_response) {
      return JSON.parse(json.raw_response);
    }
    return null;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return null;
  }
}

// Main conversion function
function convertBookData() {
  console.log('🔄 Converting book data...\n');
  
  const chapters = {};
  
  // Read all files in the Library folder
  const files = fs.readdirSync(LIBRARY_PATH);
  
  // Group by chapter number
  const chapterNumbers = new Set();
  files.forEach(file => {
    const match = file.match(/Chapter_(\d+)_(external|internal)\.json/);
    if (match) {
      chapterNumbers.add(match[1]);
    }
  });
  
  // Process each chapter
  Array.from(chapterNumbers).sort((a, b) => parseInt(a) - parseInt(b)).forEach(chNum => {
    console.log(`Processing Chapter ${chNum}...`);
    
    // Read external file
    const externalPath = path.join(LIBRARY_PATH, `Chapter_${chNum}_external.json`);
    const externalData = readChapterFile(externalPath);
    
    // Read internal file
    const internalPath = path.join(LIBRARY_PATH, `Chapter_${chNum}_internal.json`);
    const internalData = readChapterFile(internalPath);
    
    if (!externalData || !internalData) {
      console.log(`  ⚠️  Missing data for Chapter ${chNum}`);
      return;
    }
    
    // Build chapter object
    chapters[chNum] = {
      name: `Chapter ${chNum}`,
      characters: externalData.characters || [],
      external: externalData.matrix || {},
      internal: internalData.internal_matrix || {}
    };
    
    console.log(`  ✅ Chapter ${chNum}: ${chapters[chNum].characters.length} characters`);
  });
  
  // Generate output JavaScript file
  const output = `// Auto-generated book data
// Generated: ${new Date().toISOString()}

const BOOK_DATA = ${JSON.stringify(chapters, null, 2)};

// Make available globally
if (typeof window !== 'undefined') {
  window.BOOK_DATA = BOOK_DATA;
}
`;
  
  // Write to file
  fs.writeFileSync(OUTPUT_FILE, output, 'utf-8');
  
  console.log(`\n✅ Conversion complete!`);
  console.log(`📁 Output: ${OUTPUT_FILE}`);
  console.log(`📊 Chapters converted: ${Object.keys(chapters).length}`);
}

// Run the converter
convertBookData();
