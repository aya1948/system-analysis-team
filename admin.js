// Admin functions

// Initialize admin dashboard
function initializeAdminDashboard() {
    if (!requireLogin() || !requireAdmin()) return;
    
    // Load dashboard statistics
    updateDashboardStats();
    
    // Load recent activity
    loadRecentActivity();
}

// Update dashboard statistics
function updateDashboardStats() {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const borrowings = JSON.parse(localStorage.getItem('borrowings')) || [];
    
    const stats = {
        totalBooks: books.length,
        totalUsers: users.filter(u => u.role === 'user').length,
        activeBorrowings: borrowings.filter(b => b.status === 'active').length,
        overdueBorrowings: borrowings.filter(b => {
            if (b.status !== 'active') return false;
            const daysRemaining = calculateDaysRemaining(b.dueDate);
            return daysRemaining < 0;
        }).length
    };
    
    // Update stats cards
    document.getElementById('totalBooks').textContent = stats.totalBooks;
    document.getElementById('totalUsers').textContent = stats.totalUsers;
    document.getElementById('activeBorrowings').textContent = stats.activeBorrowings;
    document.getElementById('overdueBorrowings').textContent = stats.overdueBorrowings;
}

// Load recent activity
function loadRecentActivity() {
    const borrowings = JSON.parse(localStorage.getItem('borrowings')) || [];
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    const recentBorrowings = borrowings
        .sort((a, b) => new Date(b.borrowDate) - new Date(a.borrowDate))
        .slice(0, 5);
    
    const activityTable = document.getElementById('recentActivity');
    if (activityTable) {
        const tbody = activityTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        recentBorrowings.forEach(borrowing => {
            const book = books.find(b => b.id === borrowing.bookId);
            const user = users.find(u => u.id === borrowing.userId);
            
            if (book && user) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${formatDate(borrowing.borrowDate)}</td>
                    <td>${borrowing.status === 'active' ? 'Borrowing' : 'Return'}</td>
                    <td>${user.name}</td>
                    <td>${book.title}</td>
                `;
                tbody.appendChild(row);
            }
        });
    }
}

// Initialize admin books page
function initializeAdminBooks() {
    if (!requireLogin() || !requireAdmin()) return;
    
    loadAdminBooks();
    
    // Add event listener for add book button
    const addBookBtn = document.getElementById('addBookBtn');
    if (addBookBtn) {
        addBookBtn.addEventListener('click', showAddBookModal);
    }
    
    // Add event listener for search
    const searchInput = document.getElementById('adminSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchAdminBooks(this.value);
        });
    }
}

// Load books for admin
function loadAdminBooks() {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const booksTable = document.getElementById('adminBooksTable');
    
    if (booksTable) {
        const tbody = booksTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        books.forEach(book => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${book.cover}" alt="${book.title}" style="width: 50px; height: 70px; object-fit: cover; border-radius: 4px;">
                </td>
                <td><strong>${book.title}</strong></td>
                <td>${book.author}</td>
                <td>${book.category}</td>
                <td><span class="status-badge ${book.available ? 'status-active' : 'status-overdue'}">
                    ${book.available ? 'Available' : 'Unavailable'}
                </span></td>
                <td>${book.copies}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-success btn-small edit-book" data-id="${book.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-small delete-book" data-id="${book.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                        <a href="book-details.html?id=${book.id}" class="btn btn-outline btn-small">
                            <i class="fas fa-eye"></i>
                        </a>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        // Add event listeners
        document.querySelectorAll('.edit-book').forEach(btn => {
            btn.addEventListener('click', function() {
                showEditBookModal(this.dataset.id);
            });
        });
        
        document.querySelectorAll('.delete-book').forEach(btn => {
            btn.addEventListener('click', function() {
                deleteBook(this.dataset.id);
            });
        });
    }
}

// Search books in admin
function searchAdminBooks(query) {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.category.toLowerCase().includes(query.toLowerCase())
    );
    
    const booksTable = document.getElementById('adminBooksTable');
    if (booksTable) {
        const tbody = booksTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        filteredBooks.forEach(book => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${book.cover}" alt="${book.title}" style="width: 50px; height: 70px; object-fit: cover; border-radius: 4px;">
                </td>
                <td><strong>${book.title}</strong></td>
                <td>${book.author}</td>
                <td>${book.category}</td>
                <td><span class="status-badge ${book.available ? 'status-active' : 'status-overdue'}">
                    ${book.available ? 'Available' : 'Unavailable'}
                </span></td>
                <td>${book.copies}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-success btn-small edit-book" data-id="${book.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-small delete-book" data-id="${book.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                        <a href="book-details.html?id=${book.id}" class="btn btn-outline btn-small">
                            <i class="fas fa-eye"></i>
                        </a>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        // Re-add event listeners
        document.querySelectorAll('.edit-book').forEach(btn => {
            btn.addEventListener('click', function() {
                showEditBookModal(this.dataset.id);
            });
        });
        
        document.querySelectorAll('.delete-book').forEach(btn => {
            btn.addEventListener('click', function() {
                deleteBook(this.dataset.id);
            });
        });
    }
}

// Show add book modal
function showAddBookModal() {
    const modalContent = `
        <form id="addBookForm">
            <div class="form-group">
                <label for="bookTitle">Book Title</label>
                <input type="text" id="bookTitle" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="bookAuthor">Author</label>
                <input type="text" id="bookAuthor" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="bookCategory">Category</label>
                <select id="bookCategory" class="form-control" required>
                    <option value="">Select Category</option>
                    <option value="Self-Development">Self-Development</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Psychology">Psychology</option>
                    <option value="Relationships">Relationships</option>
                    <option value="Science">Science</option>
                    <option value="History">History</option>
                </select>
            </div>
            <div class="form-group">
                <label for="bookDescription">Description</label>
                <textarea id="bookDescription" class="form-control" rows="3" required></textarea>
            </div>
            <div class="form-group">
                <label for="bookCopies">Number of Copies</label>
                <input type="number" id="bookCopies" class="form-control" min="1" value="1" required>
            </div>
            <div class="form-group">
                <label for="bookCover">Cover Image URL</label>
                <input type="url" id="bookCover" class="form-control" placeholder="https://example.com/image.jpg">
            </div>
            <div class="form-group">
                <button type="submit" class="btn btn-primary">Add Book</button>
                <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
            </div>
        </form>
    `;
    
    const modal = showModal('Add New Book', modalContent);
    
    const form = modal.querySelector('#addBookForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        addNewBook();
    });
}

// Add new book
function addNewBook() {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    
    const newBook = {
        id: books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1,
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        category: document.getElementById('bookCategory').value,
        description: document.getElementById('bookDescription').value,
        cover: document.getElementById('bookCover').value || 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        pages: 300,
        year: new Date().getFullYear(),
        rating: 4.0,
        available: true,
        copies: parseInt(document.getElementById('bookCopies').value)
    };
    
    books.push(newBook);
    localStorage.setItem('books', JSON.stringify(books));
    
    showNotification('Book added successfully', 'success');
    closeModal();
    loadAdminBooks();
    updateDashboardStats();
}

// Show edit book modal
function showEditBookModal(bookId) {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const book = books.find(b => b.id === parseInt(bookId));
    
    if (!book) {
        showNotification('Book not found', 'error');
        return;
    }
    
    const modalContent = `
        <form id="editBookForm" data-id="${book.id}">
            <div class="form-group">
                <label for="editBookTitle">Book Title</label>
                <input type="text" id="editBookTitle" class="form-control" value="${book.title}" required>
            </div>
            <div class="form-group">
                <label for="editBookAuthor">Author</label>
                <input type="text" id="editBookAuthor" class="form-control" value="${book.author}" required>
            </div>
            <div class="form-group">
                <label for="editBookCategory">Category</label>
                <select id="editBookCategory" class="form-control" required>
                    <option value="Self-Development" ${book.category === 'Self-Development' ? 'selected' : ''}>Self-Development</option>
                    <option value="Fiction" ${book.category === 'Fiction' ? 'selected' : ''}>Fiction</option>
                    <option value="Psychology" ${book.category === 'Psychology' ? 'selected' : ''}>Psychology</option>
                    <option value="Relationships" ${book.category === 'Relationships' ? 'selected' : ''}>Relationships</option>
                    <option value="Science" ${book.category === 'Science' ? 'selected' : ''}>Science</option>
                    <option value="History" ${book.category === 'History' ? 'selected' : ''}>History</option>
                </select>
            </div>
            <div class="form-group">
                <label for="editBookDescription">Description</label>
                <textarea id="editBookDescription" class="form-control" rows="3" required>${book.description}</textarea>
            </div>
            <div class="form-group">
                <label for="editBookCopies">Number of Copies</label>
                <input type="number" id="editBookCopies" class="form-control" value="${book.copies}" min="0" required>
            </div>
            <div class="form-group">
                <label for="editBookAvailable">Availability</label>
                <select id="editBookAvailable" class="form-control" required>
                    <option value="true" ${book.available ? 'selected' : ''}>Available</option>
                    <option value="false" ${!book.available ? 'selected' : ''}>Unavailable</option>
                </select>
            </div>
            <div class="form-group">
                <label for="editBookCover">Cover Image URL</label>
                <input type="url" id="editBookCover" class="form-control" value="${book.cover}">
            </div>
            <div class="form-group">
                <button type="submit" class="btn btn-primary">Update Book</button>
                <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
            </div>
        </form>
    `;
    
    const modal = showModal('Edit Book', modalContent);
    
    const form = modal.querySelector('#editBookForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        updateBook(bookId);
    });
}

// Update book
function updateBook(bookId) {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const bookIndex = books.findIndex(b => b.id === parseInt(bookId));
    
    if (bookIndex === -1) {
        showNotification('Book not found', 'error');
        return;
    }
    
    books[bookIndex] = {
        ...books[bookIndex],
        title: document.getElementById('editBookTitle').value,
        author: document.getElementById('editBookAuthor').value,
        category: document.getElementById('editBookCategory').value,
        description: document.getElementById('editBookDescription').value,
        copies: parseInt(document.getElementById('editBookCopies').value),
        available: document.getElementById('editBookAvailable').value === 'true',
        cover: document.getElementById('editBookCover').value || books[bookIndex].cover
    };
    
    localStorage.setItem('books', JSON.stringify(books));
    
    showNotification('Book updated successfully', 'success');
    closeModal();
    loadAdminBooks();
    updateDashboardStats();
}

// Delete book
function deleteBook(bookId) {
    if (!confirm('Are you sure you want to delete this book?')) {
        return;
    }
    
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const bookIndex = books.findIndex(b => b.id === parseInt(bookId));
    
    if (bookIndex === -1) {
        showNotification('Book not found', 'error');
        return;
    }
    
    // Check if book is currently borrowed
    const borrowings = JSON.parse(localStorage.getItem('borrowings')) || [];
    const activeBorrowings = borrowings.filter(b => b.bookId === parseInt(bookId) && b.status === 'active');
    
    if (activeBorrowings.length > 0) {
        showNotification('Cannot delete book that is currently borrowed', 'error');
        return;
    }
    
    books.splice(bookIndex, 1);
    localStorage.setItem('books', JSON.stringify(books));
    
    showNotification('Book deleted successfully', 'success');
    loadAdminBooks();
    updateDashboardStats();
}

// Initialize admin pages
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.href.includes('admin-dashboard.html')) {
        initializeAdminDashboard();
    }
    
    if (window.location.href.includes('admin-books.html')) {
        initializeAdminBooks();
    }
});