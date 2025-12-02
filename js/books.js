// Books related functions

// Get book by ID
function getBookById(id) {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    return books.find(book => book.id === parseInt(id));
}

// Borrow a book
function borrowBook(bookId) {
    if (!currentUser) {
        showNotification('Please login to borrow books', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return false;
    }
    
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const book = books.find(b => b.id === parseInt(bookId));
    
    if (!book) {
        showNotification('Book not found', 'error');
        return false;
    }
    
    if (!book.available || book.copies <= 0) {
        showNotification('Book is not available', 'error');
        return false;
    }
    
    // Check if user already borrowed this book
    const borrowings = JSON.parse(localStorage.getItem('borrowings')) || [];
    const existingBorrowing = borrowings.find(b => 
        b.userId === currentUser.id && 
        b.bookId === bookId && 
        b.status === 'active'
    );
    
    if (existingBorrowing) {
        showNotification('You have already borrowed this book', 'warning');
        return false;
    }
    
    // Create new borrowing
    const newBorrowing = {
        id: borrowings.length + 1,
        userId: currentUser.id,
        bookId: book.id,
        borrowDate: new Date().toISOString().split('T')[0],
        dueDate: getDueDate(14), // 14 days from now
        returnDate: null,
        status: 'active'
    };
    
    // Update book copies
    book.copies -= 1;
    if (book.copies <= 0) {
        book.available = false;
    }
    
    // Update data in localStorage
    borrowings.push(newBorrowing);
    localStorage.setItem('borrowings', JSON.stringify(borrowings));
    localStorage.setItem('books', JSON.stringify(books));
    
    showNotification(`Successfully borrowed "${book.title}"`, 'success');
    
    // Refresh book display if on catalog page
    if (window.location.href.includes('catalog.html')) {
        displayBooks(books);
    }
    
    return true;
}

// Return a book
function returnBook(borrowingId) {
    const borrowings = JSON.parse(localStorage.getItem('borrowings')) || [];
    const borrowing = borrowings.find(b => b.id === parseInt(borrowingId));
    
    if (!borrowing) {
        showNotification('Borrowing record not found', 'error');
        return false;
    }
    
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const book = books.find(b => b.id === borrowing.bookId);
    
    if (!book) {
        showNotification('Book not found', 'error');
        return false;
    }
    
    // Update borrowing record
    borrowing.returnDate = new Date().toISOString().split('T')[0];
    borrowing.status = 'returned';
    
    // Update book copies
    book.copies += 1;
    if (book.copies > 0) {
        book.available = true;
    }
    
    // Update data in localStorage
    localStorage.setItem('borrowings', JSON.stringify(borrowings));
    localStorage.setItem('books', JSON.stringify(books));
    
    showNotification(`Book returned successfully`, 'success');
    
    // Refresh borrowings display if on borrowings page
    if (window.location.href.includes('borrowings.html')) {
        displayUserBorrowings();
    }
    
    return true;
}

// Renew a book
function renewBook(borrowingId) {
    const borrowings = JSON.parse(localStorage.getItem('borrowings')) || [];
    const borrowing = borrowings.find(b => b.id === parseInt(borrowingId));
    
    if (!borrowing) {
        showNotification('Borrowing record not found', 'error');
        return false;
    }
    
    // Check if already renewed
    if (borrowing.renewed) {
        showNotification('Book can only be renewed once', 'error');
        return false;
    }
    
    // Update due date
    borrowing.dueDate = getDueDate(14); // Add 14 more days
    borrowing.renewed = true;
    
    // Update data in localStorage
    localStorage.setItem('borrowings', JSON.stringify(borrowings));
    
    showNotification('Book renewed for 14 more days', 'success');
    
    // Refresh borrowings display if on borrowings page
    if (window.location.href.includes('borrowings.html')) {
        displayUserBorrowings();
    }
    
    return true;
}

// Get user borrowings
function getUserBorrowings(userId) {
    const borrowings = JSON.parse(localStorage.getItem('borrowings')) || [];
    return borrowings.filter(b => b.userId === userId);
}

// Display user borrowings
function displayUserBorrowings() {
    if (!currentUser) return;
    
    const borrowings = getUserBorrowings(currentUser.id);
    const books = JSON.parse(localStorage.getItem('books')) || [];
    
    const borrowingsTable = document.getElementById('borrowingsTable');
    if (borrowingsTable) {
        const tbody = borrowingsTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        borrowings.forEach(borrowing => {
            const book = books.find(b => b.id === borrowing.bookId);
            if (!book) return;
            
            const daysRemaining = calculateDaysRemaining(borrowing.dueDate);
            const status = getBorrowingStatus(borrowing, daysRemaining);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="${book.cover}" alt="${book.title}" style="width: 50px; height: 70px; object-fit: cover; border-radius: 4px;">
                        <div>
                            <strong>${book.title}</strong><br>
                            <small>${book.author}</small>
                        </div>
                    </div>
                </td>
                <td>${formatDate(borrowing.borrowDate)}</td>
                <td>${formatDate(borrowing.dueDate)}</td>
                <td>${daysRemaining > 0 ? `${daysRemaining} days` : `${Math.abs(daysRemaining)} days overdue`}</td>
                <td><span class="status-badge ${getStatusClass(status)}">${status}</span></td>
                <td>
                    <div class="table-actions">
                        ${borrowing.status === 'active' ? 
                            `<button class="btn btn-success btn-small renew-btn" data-id="${borrowing.id}">Renew</button>
                             <button class="btn btn-danger btn-small return-btn" data-id="${borrowing.id}">Return</button>` : 
                            ''}
                    </div>
                </td>
            `;
            
            tbody.appendChild(row);
        });
        
        // Add event listeners
        document.querySelectorAll('.renew-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                renewBook(this.dataset.id);
            });
        });
        
        document.querySelectorAll('.return-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                returnBook(this.dataset.id);
            });
        });
    }
}

// Helper functions
function getDueDate(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

function calculateDaysRemaining(dueDate) {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function getBorrowingStatus(borrowing, daysRemaining) {
    if (borrowing.status === 'returned') return 'Returned';
    if (daysRemaining < 0) return 'Overdue';
    return 'Active';
}

function getStatusClass(status) {
    switch(status.toLowerCase()) {
        case 'active': return 'status-active';
        case 'overdue': return 'status-overdue';
        case 'returned': return 'status-returned';
        default: return '';
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Initialize book details page
document.addEventListener('DOMContentLoaded', function() {
    // Load book details if on book details page
    if (window.location.href.includes('book-details.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const bookId = urlParams.get('id');
        
        if (bookId) {
            loadBookDetails(bookId);
        }
    }
    
    // Load borrowings if on borrowings page
    if (window.location.href.includes('borrowings.html')) {
        if (requireLogin()) {
            displayUserBorrowings();
        }
    }
});

// Load book details
function loadBookDetails(bookId) {
    const book = getBookById(bookId);
    if (!book) {
        document.querySelector('.book-details-content').innerHTML = '<p>Book not found</p>';
        return;
    }
    
    const bookDetails = document.getElementById('bookDetails');
    if (bookDetails) {
        bookDetails.innerHTML = `
            <div class="book-cover-large">
                <img src="${book.cover}" alt="${book.title}">
            </div>
            <div class="book-info-details">
                <h1>${book.title}</h1>
                <p class="book-author-large">${book.author}</p>
                
                <div class="book-meta">
                    <span><i class="fas fa-book"></i> ${book.pages} pages</span>
                    <span><i class="fas fa-calendar"></i> ${book.year}</span>
                    <span><i class="fas fa-tag"></i> ${book.category}</span>
                    <span><i class="fas fa-star"></i> ${book.rating}/5</span>
                </div>
                
                <div class="book-status">
                    <span class="status-badge ${book.available ? 'status-active' : 'status-overdue'}">
                        ${book.available ? 'Available' : 'Unavailable'}
                    </span>
                </div>
                
                <div class="book-description">
                    <h3>About the Book</h3>
                    <p>${book.description}</p>
                </div>
                
                <div class="book-actions-large">
                    <button class="btn btn-accent btn-large borrow-btn-details" 
                            data-id="${book.id}" 
                            ${!book.available ? 'disabled' : ''}>
                        ${book.available ? 'Borrow Now' : 'Not Available'}
                    </button>
                    <button class="btn btn-outline btn-large" id="addToFavorites">
                        <i class="far fa-bookmark"></i> Add to Favorites
                    </button>
                    <a href="catalog.html" class="btn btn-secondary btn-large">Back to Catalog</a>
                </div>
            </div>
        `;
        
        // Add event listener for borrow button
        const borrowBtn = document.querySelector('.borrow-btn-details');
        if (borrowBtn && book.available) {
            borrowBtn.addEventListener('click', function() {
                if (borrowBook(book.id)) {
                    this.disabled = true;
                    this.textContent = 'Borrowed';
                }
            });
        }
        
        // Add event listener for favorites button
        document.getElementById('addToFavorites').addEventListener('click', function() {
            addToFavorites(book.id);
        });
    }
}

// Add book to favorites
function addToFavorites(bookId) {
    if (!currentUser) {
        showNotification('Please login to add favorites', 'warning');
        return;
    }
    
    let favorites = JSON.parse(localStorage.getItem('favorites')) || {};
    if (!favorites[currentUser.id]) {
        favorites[currentUser.id] = [];
    }
    
    if (!favorites[currentUser.id].includes(bookId)) {
        favorites[currentUser.id].push(bookId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        showNotification('Added to favorites', 'success');
    } else {
        showNotification('Already in favorites', 'info');
    }
}