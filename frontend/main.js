// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  loadBooks();
});

async function loadBooks() {
  const bookListBox = document.getElementById('book-list-box');
  
  // HARDCODED BOOKS - Simple approach
  const books = [
    {
      id: "The_Great_Gatsby_DATA",
      displayName: "The Great Gatsby"
    }
    // Add more books here later:
    // { id: "Monte_Cristo", displayName: "The Count of Monte Cristo" }
  ];
  
  console.log('Loading hardcoded books:', books);
  
  // Clear loading message
  bookListBox.innerHTML = '';
  
  // Handle empty list
  if (books.length === 0) {
    bookListBox.innerHTML = '<p class="info-text">No books configured yet.</p>';
    return;
  }
  
  // Create clickable book items
  books.forEach((book) => {
    const link = document.createElement('a');
    link.href = `/book.html?book=${encodeURIComponent(book.id)}`;
    link.className = 'book-item';
    link.textContent = book.displayName;
    bookListBox.appendChild(link);
    
    console.log(`Created link for: ${book.displayName}`);
  });
}

