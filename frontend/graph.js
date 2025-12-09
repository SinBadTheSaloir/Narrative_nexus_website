// Get parameters from URL
const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get('book');
const chapterId = urlParams.get('chapter');

// Hardcoded chapter data - The Great Gatsby
const CHAPTER_DATA = {
  "The_Great_Gatsby_DATA": {
    "Chapter_1": {
      displayName: "Chapter 1",
      external: {
        characters: ["Nick", "Tom", "Daisy", "Jordan", "Gatsby"],
        matrix: {
          "Nick": {
            "Nick": [0,0,0,0,0,0,0,0,0,0,0],
            "Tom": [0,0,1,0,0,0,1,0,0,0,0],
            "Daisy": [1,1,0,0,0,0,0,0,1,0,1],
            "Jordan": [1,0,0,0,0,0,0,0,0,0,0],
            "Gatsby": [0,0,0,0,0,0,0,0,0,0,0]
          },
          "Tom": {
            "Nick": [0,0,1,0,0,0,1,0,0,0,0],
            "Tom": [0,0,0,0,0,0,0,0,0,0,0],
            "Daisy": [1,1,0,1,0,0,0,0,1,0,1],
            "Jordan": [0,0,0,0,0,0,0,0,0,0,0],
            "Gatsby": [0,0,0,0,0,0,0,0,0,0,0]
          },
          "Daisy": {
            "Nick": [1,1,0,0,0,0,0,0,1,0,1],
            "Tom": [1,1,0,1,0,0,0,0,1,0,1],
            "Daisy": [0,0,0,0,0,0,0,0,0,0,0],
            "Jordan": [0,0,0,0,0,0,0,0,0,0,0],
            "Gatsby": [0,0,0,0,0,0,0,0,0,0,0]
          },
          "Jordan": {
            "Nick": [1,0,0,0,0,0,0,0,0,0,0],
            "Tom": [0,0,0,0,0,0,0,0,0,0,0],
            "Daisy": [0,0,0,0,0,0,0,0,0,0,0],
            "Jordan": [0,0,0,0,0,0,0,0,0,0,0],
            "Gatsby": [0,0,0,0,0,0,0,0,0,0,0]
          },
          "Gatsby": {
            "Nick": [0,0,0,0,0,0,0,0,0,0,0],
            "Tom": [0,0,0,0,0,0,0,0,0,0,0],
            "Daisy": [0,0,0,0,0,0,0,0,0,0,0],
            "Jordan": [0,0,0,0,0,0,0,0,0,0,0],
            "Gatsby": [0,0,0,0,0,0,0,0,0,0,0]
          }
        }
      },
      internal: {
        characters: ["Nick", "Tom", "Daisy", "Jordan", "Gatsby"],
        matrix: {
          "Nick": {
            "Nick": [0,0,1,0,0,0,1,0,1,0,0,0,0,0,0]
          },
          "Tom": {
            "Tom": [0,0,0,1,1,0,0,0,0,0,0,0,1,0,0]
          },
          "Daisy": {
            "Daisy": [0,0,0,0,0,1,0,1,1,1,0,0,0,0,0]
          },
          "Jordan": {
            "Jordan": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
          },
          "Gatsby": {
            "Gatsby": [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0]
          }
        }
      }
    },
    "Chapter_2": {
      displayName: "Chapter 2",
      external: {
        characters: ["Tom Buchanan", "Myrtle Wilson", "George Wilson", "Catherine", "Mr. McKee"],
        matrix: {
          "Tom Buchanan": {
            "Tom Buchanan": [0,0,0,0,0,0,0,0,0,0,0],
            "Myrtle Wilson": [1,1,0,0,1,0,1,0,0,0,1],
            "George Wilson": [0,0,1,0,0,0,1,1,0,0,0],
            "Catherine": [0,0,0,0,0,0,0,0,0,0,0],
            "Mr. McKee": [0,0,0,0,0,0,0,0,0,0,0]
          },
          "Myrtle Wilson": {
            "Tom Buchanan": [1,1,0,0,1,0,1,0,0,0,1],
            "Myrtle Wilson": [0,0,0,0,0,0,0,0,0,0,0],
            "George Wilson": [0,0,1,1,0,0,1,0,1,0,0],
            "Catherine": [0,0,0,0,0,0,0,0,0,0,0],
            "Mr. McKee": [0,0,0,0,0,0,0,0,0,0,0]
          },
          "George Wilson": {
            "Tom Buchanan": [0,0,1,0,0,0,1,1,0,0,0],
            "Myrtle Wilson": [0,0,1,1,0,0,1,0,1,0,0],
            "George Wilson": [0,0,0,0,0,0,0,0,0,0,0],
            "Catherine": [0,0,0,0,0,0,0,0,0,0,0],
            "Mr. McKee": [0,0,0,0,0,0,0,0,0,0,0]
          },
          "Catherine": {
            "Tom Buchanan": [0,0,0,0,0,0,0,0,0,0,0],
            "Myrtle Wilson": [0,0,0,0,0,0,0,0,0,0,0],
            "George Wilson": [0,0,0,0,0,0,0,0,0,0,0],
            "Catherine": [0,0,0,0,0,0,0,0,0,0,0],
            "Mr. McKee": [0,0,0,0,0,0,0,0,0,0,0]
          },
          "Mr. McKee": {
            "Tom Buchanan": [0,0,0,0,0,0,0,0,0,0,0],
            "Myrtle Wilson": [0,0,0,0,0,0,0,0,0,0,0],
            "George Wilson": [0,0,0,0,0,0,0,0,0,0,0],
            "Catherine": [0,0,0,0,0,0,0,0,0,0,0],
            "Mr. McKee": [0,0,0,0,0,0,0,0,0,0,0]
          }
        }
      },
      internal: {
        characters: ["Tom Buchanan", "Myrtle Wilson", "George Wilson", "Catherine", "Mr. McKee"],
        matrix: {
          "Tom Buchanan": {
            "Tom Buchanan": [0,0,1,0,1,0,0,0,0,0,0,0,0,1,0]
          },
          "Myrtle Wilson": {
            "Myrtle Wilson": [1,1,0,0,0,1,0,1,1,0,0,0,1,0,0]
          },
          "George Wilson": {
            "George Wilson": [0,0,0,0,0,1,0,0,0,1,0,0,0,0,1]
          },
          "Catherine": {
            "Catherine": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
          },
          "Mr. McKee": {
            "Mr. McKee": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
          }
        }
      }
    },
    "Chapter_3": {
      displayName: "Chapter 3",
      external: {
        characters: ["I", "Gatsby", "Jordan Baker", "Lucille", "Mr. Mumble", "Owl Eyes"],
        matrix: {
          "I": {
            "I": [0,0,0,0,0,0,0,0,0,0,0],
            "Gatsby": [0,0,0,0,0,0,0,0,0,0,0],
            "Jordan Baker": [1,0,0,0,0,0,0,0,0,0,1],
            "Lucille": [0,0,0,0,0,0,0,0,0,0,0],
            "Mr. Mumble": [0,0,0,0,0,0,0,0,0,0,0],
            "Owl Eyes": [0,0,0,0,0,0,0,0,0,0,0]
          }
        }
      },
      internal: {
        characters: ["Gatsby", "Jordan Baker", "Nick"],
        matrix: {
          "Gatsby": {
            "Gatsby": [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0]
          },
          "Jordan Baker": {
            "Jordan Baker": [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0]
          },
          "Nick": {
            "Nick": [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0]
          }
        }
      }
    },
    "Chapter_4": {
      displayName: "Chapter 4",
      external: {
        characters: ["Gatsby", "Nick Carraway", "Tom Buchanan", "Jordan Baker", "Mr. Wolfshiem", "Daisy Fay"],
        matrix: {
          "Gatsby": {
            "Gatsby": [0,0,0,0,0,0,0,0,0,0,0],
            "Nick Carraway": [1,1,0,0,1,0,0,0,1,0,1],
            "Tom Buchanan": [0,0,1,0,0,0,1,0,0,0,0],
            "Jordan Baker": [1,1,0,0,1,0,0,0,1,0,1],
            "Mr. Wolfshiem": [0,0,0,0,0,0,0,1,0,0,0],
            "Daisy Fay": [1,1,0,0,1,0,0,0,1,0,1]
          }
        }
      },
      internal: {
        characters: ["Gatsby", "Nick", "Tom", "Jordan"],
        matrix: {}
      }
    }
  }
};

let currentDataType = 'external';

document.addEventListener('DOMContentLoaded', () => {
  loadChapterData();
});

function loadChapterData() {
  const pageSubtitle = document.getElementById('page-subtitle');
  const chapterTitle = document.getElementById('chapter-title');
  const bookName = document.getElementById('book-name');
  
  // Check if we have data
  if (!bookId || !chapterId || !CHAPTER_DATA[bookId] || !CHAPTER_DATA[bookId][chapterId]) {
    pageSubtitle.textContent = 'Chapter Not Found';
    chapterTitle.textContent = 'Data Not Available';
    document.getElementById('data-display').innerHTML = '<p class="error">Chapter data not found.</p>';
    return;
  }
  
  const chapterData = CHAPTER_DATA[bookId][chapterId];
  
  // Set titles
  const bookDisplayName = bookId.replace(/_DATA$/i, '').replace(/_/g, ' ');
  pageSubtitle.textContent = bookDisplayName;
  chapterTitle.textContent = chapterData.displayName;
  bookName.textContent = bookDisplayName;
  
  // Display data
  showData('external');
}

function showData(dataType) {
  currentDataType = dataType;
  
  // Update button states
  const buttons = document.querySelectorAll('.toggle-btn');
  buttons.forEach(btn => {
    btn.classList.remove('active');
    if ((dataType === 'external' && btn.textContent.includes('External')) ||
        (dataType === 'internal' && btn.textContent.includes('Internal'))) {
      btn.classList.add('active');
    }
  });
  
  const chapterData = CHAPTER_DATA[bookId][chapterId];
  const data = chapterData[dataType];
  
  if (!data || !data.characters || data.characters.length === 0) {
    document.getElementById('data-display').innerHTML = `
      <p class="info-text">No ${dataType} data available for this chapter.</p>
    `;
    return;
  }
  
  displayMatrix(data);
}

function displayMatrix(data) {
  const dataDisplay = document.getElementById('data-display');
  
  let html = '<div class="data-section">';
  
  // Characters section
  html += '<h3>Characters</h3>';
  html += '<div class="character-list">';
  data.characters.forEach(char => {
    html += `<div class="character-badge">${char}</div>`;
  });
  html += '</div>';
  
  // Matrix section
  html += '<h3>Relationship Matrix</h3>';
  html += '<div class="matrix-container">';
  html += '<table>';
  
  // Header row
  html += '<thead><tr><th>From / To</th>';
  data.characters.forEach(char => {
    html += `<th>${char}</th>`;
  });
  html += '</tr></thead>';
  
  // Data rows
  html += '<tbody>';
  data.characters.forEach(fromChar => {
    html += '<tr>';
    html += `<th>${fromChar}</th>`;
    
    data.characters.forEach(toChar => {
      if (data.matrix[fromChar] && data.matrix[fromChar][toChar]) {
        const values = data.matrix[fromChar][toChar];
        const sum = values.reduce((a, b) => a + b, 0);
        const hasInteraction = sum > 0;
        
        html += `<td class="${hasInteraction ? 'cell-active' : ''}">${sum}</td>`;
      } else {
        html += '<td>0</td>';
      }
    });
    
    html += '</tr>';
  });
  html += '</tbody>';
  
  html += '</table>';
  html += '</div>';
  
  // Legend
  html += '<p style="color: #888; font-size: 0.85rem; margin-top: 1rem;">';
  html += '<span style="color: #51cf66;">●</span> Green cells indicate relationships/interactions between characters. ';
  html += 'Values represent the sum of emotional dimensions.';
  html += '</p>';
  
  html += '</div>';
  
  dataDisplay.innerHTML = html;
}
