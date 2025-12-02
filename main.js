// Main JavaScript for Library Management System

// Book Data Structure
const books = [
    {
        id: 1,
        title: "Atomic Habits",
        author: "James Clear",
        category: "Self-Development",
        description: "An easy & proven way to build good habits & break bad ones",
        cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        pages: 320,
        year: 2018,
        rating: 4.7,
        available: true,
        copies: 5
    },
    {
        id: 2,
        title: "The Power of Positive Thinking",
        author: "Norman Vincent Peale",
        category: "Self-Development",
        description: "Practical techniques for successful living",
        cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        pages: 256,
        year: 1952,
        rating: 4.5,
        available: true,
        copies: 3
    },
    {
        id: 3,
        title: "The Forty Rules of Love",
        author: "Elif Shafak",
        category: "Fiction",
        description: "A novel within a novel about love and spirituality",
        cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        pages: 368,
        year: 2009,
        rating: 4.6,
        available: false,
        copies: 0
    },
    {
        id: 4,
        title: "Thinking, Fast and Slow",
        author: "Daniel Kahneman",
        category: "Psychology",
        description: "How the mind works and makes decisions",
        cover: "https://images.unsplash.com/photo-1531346688376-ab6275c4725e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        pages: 512,
        year: 2011,
        rating: 4.4,
        available: true,
        copies: 2
    },
    {
        id: 5,
        title: "Men Are from Mars, Women Are from Venus",
        author: "John Gray",
        category: "Relationships",
        description: "A practical guide for improving communication",
        cover: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        pages: 368,
        year: 1992,
        rating: 4.3,
        available: true,
        copies: 4
    }
];

// User Data
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let users = JSON.parse(localStorage.getItem('users')) || [
    {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        role: "admin"
    },
    {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        password: "password123",
        role: "user"
    }
];

// Borrowings Data
let borrowings = JSON.parse(localStorage.getItem('borrowings')) || [
    {
        id: 1,
        userId: 2,
        bookId: 1,
        borrowDate: "2023-10-15",
        dueDate: "2023-10-29",
        returnDate: null,
        status: "active"
    },
    {
        id: 2,
        userId: 2,
        bookId: 2,
        borrowDate: "2023-10-10",
        dueDate: "2023-10-24",
        returnDate: null,
        status: "active"
    }
];

// Initialize data in localStorage
function initializeData() {
    if (!localStorage.getItem('books')) {
        localStorage.setItem('books', JSON.stringify(books));
    }
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify(users));
    }
    if (!localStorage.getItem('borrowings')) {
        localStorage.setItem('borrowings', JSON.stringify(borrowings));
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Modal System
function showModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.classList.add('show');
    }, 100);
    
    // Close modal on X click
    modal.querySelector('.modal-close').addEventListener('click', () => {
        closeModal();
    });
    
    // Close modal on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    return modal;
}

function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    }
}

// Update header based on login status
function updateHeader() {
    const userActions = document.querySelector('.user-actions');
    if (userActions) {
        if (currentUser) {
            userActions.innerHTML = `
                <div class="user-profile">
                    <span>Welcome, ${currentUser.name}</span>
                    <a href="#" class="btn btn-outline" id="logoutBtn">Logout</a>
                </div>
            `;
            
            document.getElementById('logoutBtn').addEventListener('click', logout);
        } else {
            userActions.innerHTML = `
                <a href="login.html" class="btn btn-outline">Login</a>
                <a href="register.html" class="btn btn-primary">Register</a>
            `;
        }
    }
}

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateHeader();
    showNotification('Logged out successfully', 'success');
    
    // Redirect to home page if not already there
    if (!window.location.href.includes('index.html')) {
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// Search books function
function searchBooks(query) {
    const allBooks = JSON.parse(localStorage.getItem('books')) || books;
    return allBooks.filter(book => 
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.category.toLowerCase().includes(query.toLowerCase())
    );
}

// Filter books by category
function filterBooksByCategory(category) {
    const allBooks = JSON.parse(localStorage.getItem('books')) || books;
    if (category === 'all') {
        return allBooks;
    }
    return allBooks.filter(book => book.category === category);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    updateHeader();
    
    // Add event listener for search form if exists
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = document.getElementById('searchInput').value;
            const results = searchBooks(query);
            displaySearchResults(results);
        });
    }
    
    // Add event listeners for category filters
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category || 'all';
            const filteredBooks = filterBooksByCategory(category);
            displayBooks(filteredBooks);
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// Display books in grid
function displayBooks(booksToDisplay) {
    const booksGrid = document.getElementById('booksGrid');
    if (booksGrid) {
        booksGrid.innerHTML = '';
        
        booksToDisplay.forEach(book => {
            const bookCard = createBookCard(book);
            booksGrid.appendChild(bookCard);
        });
    }
}

// Create book card element
function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `
        <div class="book-cover">
            <img src="${book.cover}" alt="${book.title}">
        </div>
        <div class="book-info">
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">${book.author}</p>
            <span class="book-category">${book.category}</span>
            <div class="book-actions">
                <a href="book-details.html?id=${book.id}" class="btn btn-primary btn-small">View Details</a>
                <button class="btn ${book.available ? 'btn-outline' : 'btn-secondary'} btn-small borrow-btn" 
                        data-id="${book.id}" 
                        ${!book.available ? 'disabled' : ''}>
                    ${book.available ? 'Borrow' : 'Unavailable'}
                </button>
            </div>
        </div>
    `;
    
    // Add event listener for borrow button
    const borrowBtn = card.querySelector('.borrow-btn');
    if (borrowBtn && book.available) {
        borrowBtn.addEventListener('click', function() {
            borrowBook(book.id);
        });
    }
    
    return card;
}

// Display search results
function displaySearchResults(results) {
    const resultsContainer = document.getElementById('searchResults');
    if (resultsContainer) {
        if (results.length === 0) {
            resultsContainer.innerHTML = '<p class="text-center">No books found. Try a different search term.</p>';
        } else {
            resultsContainer.innerHTML = '';
            results.forEach(book => {
                const bookCard = createBookCard(book);
                resultsContainer.appendChild(bookCard);
            });
        }
    }
}