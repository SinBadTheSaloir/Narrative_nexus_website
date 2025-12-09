// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  loadBooks();
});

async function loadBooks() {
  const bookListBox = document.getElementById('book-list-box');
  
  try {
    // Fetch books from API
    const response = await fetch('/api/books');
    
    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }
    
    const data = await response.json();
    const books = data.books || [];
    
    // Clear loading message
    bookListBox.innerHTML = '';
    
    // Handle empty library
    if (books.length === 0) {
      bookListBox.innerHTML = '<p class="info-text">No books found in the Library folder.</p>';
      return;
    }
    
    // Create clickable book items
    books.forEach((bookName) => {
      const link = document.createElement('a');
      link.href = `/book.html?book=${encodeURIComponent(bookName)}`;
      link.className = 'book-item';
      link.textContent = formatBookName(bookName);
      bookListBox.appendChild(link);
    });
    
  } catch (error) {
    console.error('Error loading books:', error);
    bookListBox.innerHTML = '<p class="error">Error loading books. Please try again.</p>';
  }
}

// Helper: Format book name for display
function formatBookName(name) {
  // Replace underscores with spaces and capitalize words
  return name
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}
