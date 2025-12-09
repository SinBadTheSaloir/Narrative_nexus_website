// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  loadBooks();
});

async function loadBooks() {
  const bookListBox = document.getElementById('book-list-box');
  
  try {
    // Fetch books from API
    console.log('Fetching books from /api/books...');
    const response = await fetch('/api/books');
    
    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }
    
    const data = await response.json();
    console.log('Received data:', data);
    
    const books = data.books || [];
    console.log(`Found ${books.length} books:`, books);
    
    // Clear loading message
    bookListBox.innerHTML = '';
    
    // Handle empty library
    if (books.length === 0) {
      bookListBox.innerHTML = '<p class="info-text">No books found in the Library folder.</p>';
      return;
    }
    
    // Create clickable book items
    books.forEach((bookName) => {
      const displayName = formatBookName(bookName);
      console.log(`Creating link for: ${bookName} -> ${displayName}`);
      
      const link = document.createElement('a');
      link.href = `/book.html?book=${encodeURIComponent(bookName)}`;
      link.className = 'book-item';
      link.textContent = displayName;
      bookListBox.appendChild(link);
    });
    
  } catch (error) {
    console.error('Error loading books:', error);
    bookListBox.innerHTML = '<p class="error">Error loading books. Please try again.</p>';
  }
}

// Helper: Format book name for display
function formatBookName(name) {
  // Remove _DATA suffix if present
  let displayName = name.replace(/_DATA$/i, '');
  
  // Replace underscores with spaces
  displayName = displayName.replace(/_/g, ' ');
  
  // Capitalize each word
  displayName = displayName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  return displayName;
}
