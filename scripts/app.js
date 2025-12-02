/**
 * Library Management System - Complete with User Registration
 * نظام إدارة المكتبة الكامل مع تسجيل المستخدمين
 */

const CONFIG = {
    ADMIN_USERNAME: 'admin',
    ADMIN_PASSWORD: 'admin123',
    MAX_BORROWED_BOOKS: 5,
    BORROW_DURATION_DAYS: 14,
    STORAGE_KEYS: {
        BOOKS: 'library_books',
        BORROWINGS: 'library_borrowings',
        USERS: 'library_users',
        CURRENT_USER: 'library_current_user',
        FAVORITES: 'library_favorites'
    }
};

// Sample books data
const SAMPLE_BOOKS = [
    {
        id: 1,
        title: 'مدخل إلى علم الحاسوب',
        author: 'أحمد محمد',
        year: 2020,
        category: 'تقنية',
        description: 'كتاب شامل يقدم المفاهيم الأساسية في علم الحاسوب والبرمجة للمبتدئين.',
        image: '',
        isbn: '978-1234567890'
    },
    {
        id: 2,
        title: 'الأدب العربي في العصر الحديث',
        author: 'فاطمة علي',
        year: 2019,
        category: 'أدب',
        description: 'دراسة شاملة لتطور الأدب العربي في القرنين الأخيرين مع تحليل لأهم الأعمال الأدبية.',
        image: '',
        isbn: '978-0987654321'
    },
    {
        id: 3,
        title: 'تاريخ العالم الإسلامي',
        author: 'خالد سعيد',
        year: 2018,
        category: 'تاريخ',
        description: 'سرد تاريخي شامل للعالم الإسلامي منذ نشأة الإسلام وحتى العصر الحديث.',
        image: '',
        isbn: '978-1122334455'
    },
    {
        id: 4,
        title: 'أسس الفلسفة',
        author: 'سارة عبدالله',
        year: 2021,
        category: 'فلسفة',
        description: 'مقدمة شاملة للفلسفة وتطور الفكر الفلسفي عبر العصور.',
        image: '',
        isbn: '978-5566778899'
    },
    {
        id: 5,
        title: 'الكون بين العلم والدين',
        author: 'محمد حسن',
        year: 2022,
        category: 'علوم',
        description: 'دراسة مقارنة بين النظريات العلمية الحديثة والرؤى الدينية حول نشأة الكون.',
        image: '',
        isbn: '978-9988776655'
    },
    {
        id: 6,
        title: 'التصميم الجرافيكي الحديث',
        author: 'ليلى كمال',
        year: 2023,
        category: 'فنون',
        description: 'دليل شامل لمبادئ وأساليب التصميم الجرافيكي في العصر الرقمي.',
        image: '',
        isbn: '978-4433221100'
    }
];

// Sample users data (for demo)
const SAMPLE_USERS = [
    {
        id: 1,
        username: 'user1',
        email: 'user1@example.com',
        password: 'user123',
        name: 'مستخدم تجريبي',
        phone: '0512345678',
        address: 'الرياض، السعودية',
        role: 'user',
        createdAt: '2024-01-01',
        borrowedBooks: [1, 3],
        favorites: [2, 4]
    },
    {
        id: 2,
        username: 'reader',
        email: 'reader@example.com',
        password: 'reader123',
        name: 'قارئ مثالي',
        phone: '0555555555',
        address: 'جدة، السعودية',
        role: 'user',
        createdAt: '2024-02-15',
        borrowedBooks: [2],
        favorites: [1, 5, 6]
    }
];

class LibraryStore {
    constructor() {
        this.books = this.loadBooks();
        this.borrowings = this.loadBorrowings();
        this.users = this.loadUsers();
        this.currentUser = this.loadCurrentUser();
        this.favorites = this.loadFavorites();
        this.currentBookId = null;
        this.searchQuery = '';
        this.filterCategory = '';
        this.initializeData();
    }

    initializeData() {
        if (this.books.length === 0) {
            this.books = [...SAMPLE_BOOKS];
            this.saveBooks();
        }
        
        if (this.users.length === 0) {
            this.users = [...SAMPLE_USERS];
            this.saveUsers();
        }
    }

    loadBooks() {
        const stored = localStorage.getItem(CONFIG.STORAGE_KEYS.BOOKS);
        return stored ? JSON.parse(stored) : [];
    }

    saveBooks() {
        localStorage.setItem(CONFIG.STORAGE_KEYS.BOOKS, JSON.stringify(this.books));
        this.updateStats();
    }

    loadBorrowings() {
        const stored = localStorage.getItem(CONFIG.STORAGE_KEYS.BORROWINGS);
        return stored ? JSON.parse(stored) : [];
    }

    saveBorrowings() {
        localStorage.setItem(CONFIG.STORAGE_KEYS.BORROWINGS, JSON.stringify(this.borrowings));
        this.updateStats();
    }

    loadUsers() {
        const stored = localStorage.getItem(CONFIG.STORAGE_KEYS.USERS);
        return stored ? JSON.parse(stored) : [];
    }

    saveUsers() {
        localStorage.setItem(CONFIG.STORAGE_KEYS.USERS, JSON.stringify(this.users));
    }

    loadCurrentUser() {
        const stored = localStorage.getItem(CONFIG.STORAGE_KEYS.CURRENT_USER);
        return stored ? JSON.parse(stored) : null;
    }

    saveCurrentUser(user) {
        this.currentUser = user;
        if (user) {
            localStorage.setItem(CONFIG.STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        } else {
            localStorage.removeItem(CONFIG.STORAGE_KEYS.CURRENT_USER);
        }
    }

    loadFavorites() {
        const stored = localStorage.getItem(CONFIG.STORAGE_KEYS.FAVORITES);
        return stored ? JSON.parse(stored) : [];
    }

    saveFavorites() {
        localStorage.setItem(CONFIG.STORAGE_KEYS.FAVORITES, JSON.stringify(this.favorites));
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    registerUser(userData) {
        // Check if username exists
        if (this.users.some(u => u.username === userData.username)) {
            return { success: false, message: 'اسم المستخدم موجود مسبقاً' };
        }
        
        // Check if email exists
        if (this.users.some(u => u.email === userData.email)) {
            return { success: false, message: 'البريد الإلكتروني موجود مسبقاً' };
        }
        
        // Create new user
        const newUser = {
            id: Date.now(),
            ...userData,
            role: 'user',
            createdAt: new Date().toISOString(),
            borrowedBooks: [],
            favorites: []
        };
        
        this.users.push(newUser);
        this.saveUsers();
        
        // Auto login after registration
        this.saveCurrentUser(newUser);
        
        return { 
            success: true, 
            message: 'تم إنشاء الحساب بنجاح!',
            user: newUser
        };
    }

    loginUser(username, password) {
        const user = this.users.find(u => 
            (u.username === username || u.email === username) && 
            u.password === password
        );
        
        if (user) {
            // Remove password before saving to current user
            const { password, ...userWithoutPassword } = user;
            this.saveCurrentUser(userWithoutPassword);
            return { success: true, message: 'تم تسجيل الدخول بنجاح!', user: userWithoutPassword };
        }
        
        // Check admin credentials
        if (username === CONFIG.ADMIN_USERNAME && password === CONFIG.ADMIN_PASSWORD) {
            const adminUser = {
                id: 0,
                username: 'admin',
                name: 'مدير النظام',
                email: 'admin@library.com',
                role: 'admin',
                createdAt: new Date().toISOString()
            };
            this.saveCurrentUser(adminUser);
            return { success: true, message: 'تم تسجيل الدخول كمسؤول!', user: adminUser };
        }
        
        return { success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' };
    }

    logout() {
        this.saveCurrentUser(null);
        return { success: true, message: 'تم تسجيل الخروج بنجاح' };
    }

    updateUserProfile(userId, updates) {
        const index = this.users.findIndex(u => u.id === userId);
        if (index !== -1) {
            this.users[index] = { ...this.users[index], ...updates };
            this.saveUsers();
            
            // Update current user if it's the same user
            if (this.currentUser && this.currentUser.id === userId) {
                const { password, ...userWithoutPassword } = this.users[index];
                this.saveCurrentUser(userWithoutPassword);
            }
            
            return { success: true, message: 'تم تحديث الملف الشخصي' };
        }
        return { success: false, message: 'المستخدم غير موجود' };
    }

    toggleFavorite(bookId) {
        if (!this.isLoggedIn()) {
            return { success: false, message: 'يجب تسجيل الدخول أولاً' };
        }
        
        const userId = this.currentUser.id;
        const userIndex = this.users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) return { success: false, message: 'المستخدم غير موجود' };
        
        const user = this.users[userIndex];
        const isFavorite = user.favorites.includes(bookId);
        
        if (isFavorite) {
            // Remove from favorites
            user.favorites = user.favorites.filter(id => id !== bookId);
        } else {
            // Add to favorites
            user.favorites.push(bookId);
        }
        
        this.saveUsers();
        
        // Update current user
        const { password, ...userWithoutPassword } = user;
        this.saveCurrentUser(userWithoutPassword);
        
        return { 
            success: true, 
            message: isFavorite ? 'تم إزالة الكتاب من المفضلة' : 'تم إضافة الكتاب إلى المفضلة',
            isFavorite: !isFavorite
        };
    }

    getUserFavorites() {
        if (!this.isLoggedIn()) return [];
        
        const user = this.users.find(u => u.id === this.currentUser.id);
        if (!user) return [];
        
        return user.favorites.map(bookId => 
            this.books.find(book => book.id === bookId)
        ).filter(book => book !== undefined);
    }

    getUserBorrowings() {
        if (!this.isLoggedIn()) return [];
        
        return this.borrowings
            .filter(b => !b.returned && b.userId === this.currentUser.id)
            .map(borrowing => {
                const book = this.getBookById(borrowing.bookId);
                return {
                    ...borrowing,
                    book: book || { title: 'كتاب محذوف', author: 'غير معروف' }
                };
            });
    }

    getAllCategories() {
        const categories = new Set();
        this.books.forEach(book => categories.add(book.category));
        return Array.from(categories).sort();
    }

    getBookById(id) {
        return this.books.find(book => book.id === id);
    }

    addBook(bookData) {
        const newId = this.books.length > 0 ? Math.max(...this.books.map(b => b.id)) + 1 : 1;
        const newBook = {
            id: newId,
            ...bookData,
            createdAt: new Date().toISOString()
        };
        this.books.push(newBook);
        this.saveBooks();
        return newBook;
    }

    updateBook(id, bookData) {
        const index = this.books.findIndex(book => book.id === id);
        if (index !== -1) {
            this.books[index] = { ...this.books[index], ...bookData, updatedAt: new Date().toISOString() };
            this.saveBooks();
            return this.books[index];
        }
        return null;
    }

    deleteBook(id) {
        const index = this.books.findIndex(book => book.id === id);
        if (index !== -1) {
            this.books.splice(index, 1);
            this.saveBooks();
            return true;
        }
        return false;
    }

    borrowBook(bookId) {
        if (!this.isLoggedIn()) {
            this.showToast('يجب تسجيل الدخول لاستعارة الكتب', 'warning');
            return false;
        }

        // Check if already borrowed
        if (this.borrowings.some(b => b.bookId === bookId && b.userId === this.currentUser.id && !b.returned)) {
            this.showToast('هذا الكتاب مستعار بالفعل!', 'warning');
            return false;
        }

        // Check max borrow limit
        const userBorrowings = this.borrowings.filter(b => b.userId === this.currentUser.id && !b.returned);
        if (userBorrowings.length >= CONFIG.MAX_BORROWED_BOOKS) {
            this.showToast(`لا يمكنك استعارة أكثر من ${CONFIG.MAX_BORROWED_BOOKS} كتب في نفس الوقت`, 'warning');
            return false;
        }

        const borrowDate = new Date();
        const returnDate = new Date();
        returnDate.setDate(returnDate.getDate() + CONFIG.BORROW_DURATION_DAYS);

        const borrowing = {
            id: Date.now(),
            bookId,
            userId: this.currentUser.id,
            borrowDate: borrowDate.toISOString(),
            dueDate: returnDate.toISOString(),
            returned: false
        };

        this.borrowings.push(borrowing);
        this.saveBorrowings();
        this.showToast('تم استعارة الكتاب بنجاح!', 'success');
        return true;
    }

    returnBook(borrowingId) {
        const index = this.borrowings.findIndex(b => b.id === borrowingId);
        if (index !== -1) {
            this.borrowings[index].returned = true;
            this.borrowings[index].returnDate = new Date().toISOString();
            this.saveBorrowings();
            this.showToast('تم إرجاع الكتاب بنجاح!', 'success');
            return true;
        }
        return false;
    }

    filterBooks() {
        return this.books.filter(book => {
            const matchesSearch = !this.searchQuery || 
                book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                book.author.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                book.description.toLowerCase().includes(this.searchQuery.toLowerCase());
            
            const matchesCategory = !this.filterCategory || 
                book.category === this.filterCategory;
            
            return matchesSearch && matchesCategory;
        });
    }

    getFeaturedBooks() {
        return this.books.slice(0, 4);
    }

    updateStats() {
        const totalBooks = document.getElementById('total-books-count');
        const borrowedBooks = document.getElementById('borrowed-books-count');
        
        if (totalBooks) {
            totalBooks.textContent = this.books.length;
        }
        
        if (borrowedBooks) {
            const activeBorrowings = this.borrowings.filter(b => !b.returned).length;
            borrowedBooks.textContent = activeBorrowings;
        }
    }

    showToast(message, type = 'info') {
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => toast.remove());

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 3000);
    }
}

class LibraryUI {
    constructor(store) {
        this.store = store;
        this.initializeUI();
    }

    initializeUI() {
        this.setupEventListeners();
        this.renderCategories();
        this.updateUserInterface();
        this.store.updateStats();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const hash = link.getAttribute('href');
                window.location.hash = hash;
            });
        });

        // Menu toggle
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        if (menuToggle && navLinks) {
            menuToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });

            document.addEventListener('click', (e) => {
                if (!e.target.closest('.navbar') && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            });
        }

        // Search input
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.store.searchQuery = e.target.value;
                this.renderCatalog();
            });
        }

        // Category filter
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.store.filterCategory = e.target.value;
                this.renderCatalog();
            });
        }

        // Reset filters
        const resetFilters = document.getElementById('reset-filters');
        if (resetFilters) {
            resetFilters.addEventListener('click', () => {
                this.store.searchQuery = '';
                this.store.filterCategory = '';
                if (searchInput) searchInput.value = '';
                if (categoryFilter) categoryFilter.value = '';
                this.renderCatalog();
            });
        }

        // Back buttons
        document.getElementById('back-to-catalog')?.addEventListener('click', () => {
            window.location.hash = '#catalog';
        });

        document.getElementById('back-to-admin')?.addEventListener('click', () => {
            window.location.hash = '#admin';
        });

        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Register form
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
            
            // Password strength indicator
            const passwordInput = document.getElementById('register-password');
            if (passwordInput) {
                passwordInput.addEventListener('input', (e) => {
                    this.updatePasswordStrength(e.target.value);
                });
            }
        }

        // Add book form
        const addBookForm = document.getElementById('add-book-form');
        if (addBookForm) {
            addBookForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddBook();
            });
        }

        // Contact form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm();
            });
        }

        // FAQ items
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.closest('.faq-item');
                faqItem.classList.toggle('active');
            });
        });

        // Admin buttons
        document.getElementById('view-stats')?.addEventListener('click', () => {
            this.showAdminStats();
        });

        document.getElementById('manage-users')?.addEventListener('click', () => {
            this.store.showToast('هذه الميزة غير متاحة في النسخة التجريبية', 'info');
        });

        document.getElementById('system-settings')?.addEventListener('click', () => {
            this.store.showToast('هذه الميزة غير متاحة في النسخة التجريبية', 'info');
        });

        // Logout button
        document.getElementById('logout-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleLogout();
        });

        // Edit profile button
        document.getElementById('edit-profile-btn')?.addEventListener('click', () => {
            this.showEditProfileForm();
        });
    }

    updateUserInterface() {
        const guestButtons = document.getElementById('guest-buttons');
        const userProfileMenu = document.getElementById('user-profile-menu');
        const loginBtn = document.getElementById('login-btn');
        const usernameDisplay = document.getElementById('username-display');
        
        if (this.store.isLoggedIn()) {
            // User is logged in
            if (guestButtons) guestButtons.style.display = 'none';
            if (userProfileMenu) userProfileMenu.style.display = 'block';
            if (usernameDisplay) {
                usernameDisplay.textContent = this.store.currentUser.name || this.store.currentUser.username;
            }
            
            if (loginBtn) {
                loginBtn.style.display = 'none';
            }
        } else {
            // User is not logged in
            if (guestButtons) guestButtons.style.display = 'flex';
            if (userProfileMenu) userProfileMenu.style.display = 'none';
            
            if (loginBtn) {
                loginBtn.style.display = 'inline-flex';
                loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> تسجيل الدخول';
                loginBtn.href = '#login';
            }
        }
        
        // Update active nav link
        const currentHash = window.location.hash || '#home';
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentHash) {
                link.classList.add('active');
            }
        });
    }

    updatePasswordStrength(password) {
        const strengthBar = document.querySelector('.strength-bar');
        const strengthText = document.querySelector('.strength-text');
        
        if (!strengthBar || !strengthText) return;
        
        let strength = 0;
        let color = '#dc3545'; // red
        let text = 'ضعيفة';
        
        if (password.length >= 8) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        if (/[^A-Za-z0-9]/.test(password)) strength += 25;
        
        if (strength >= 75) {
            color = '#28a745'; // green
            text = 'قوية';
        } else if (strength >= 50) {
            color = '#ffc107'; // yellow
            text = 'جيدة';
        } else if (strength >= 25) {
            color = '#fd7e14'; // orange
            text = 'متوسطة';
        }
        
        strengthBar.style.setProperty('--strength-color', color);
        strengthBar.querySelector('::after').style.width = `${strength}%`;
        strengthBar.querySelector('::after').style.backgroundColor = color;
        strengthText.textContent = `قوة كلمة المرور: ${text}`;
        strengthText.style.color = color;
    }

    renderCategories() {
        const categories = this.store.getAllCategories();
        
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            while (categoryFilter.options.length > 1) {
                categoryFilter.remove(1);
            }
            
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            });
        }
        
        const footerCategories = document.getElementById('footer-categories');
        if (footerCategories) {
            footerCategories.innerHTML = '';
            categories.forEach(category => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = `#catalog?category=${encodeURIComponent(category)}`;
                a.textContent = category;
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.store.filterCategory = category;
                    window.location.hash = '#catalog';
                    setTimeout(() => {
                        if (categoryFilter) categoryFilter.value = category;
                        this.renderCatalog();
                    }, 100);
                });
                li.appendChild(a);
                footerCategories.appendChild(li);
            });
        }
    }

    renderBookCard(book) {
        const isBorrowed = this.store.borrowings.some(b => 
            b.bookId === book.id && 
            b.userId === (this.store.currentUser?.id) && 
            !b.returned
        );
        
        const isFavorite = this.store.isLoggedIn() && 
            this.store.users.find(u => u.id === this.store.currentUser.id)?.favorites?.includes(book.id);
        
        return `
            <div class="book-card" data-id="${book.id}">
                <div class="book-cover">
                    ${book.image ? 
                        `<img src="${book.image}" alt="${book.title}">` : 
                        `<i class="fas fa-book"></i>`
                    }
                    ${this.store.isLoggedIn() ? `
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-id="${book.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                    ` : ''}
                </div>
                <div class="book-info">
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-author">${book.author}</p>
                    <span class="book-category">${book.category}</span>
                    <p class="book-year">${book.year ? `سنة النشر: ${book.year}` : ''}</p>
                    <div class="book-actions">
                        <button class="btn btn-primary btn-sm view-book" data-id="${book.id}">
                            <i class="fas fa-eye"></i> عرض التفاصيل
                        </button>
                        ${!isBorrowed ? 
                            `<button class="btn btn-success btn-sm borrow-book" data-id="${book.id}">
                                <i class="fas fa-hand-holding"></i> استعارة
                            </button>` : 
                            `<span class="btn btn-outline btn-sm" style="cursor: default;">
                                <i class="fas fa-check"></i> مستعار
                            </span>`
                        }
                    </div>
                </div>
            </div>
        `;
    }

    renderFeaturedBooks() {
        const featuredBooksContainer = document.getElementById('featured-books');
        if (!featuredBooksContainer) return;

        const featuredBooks = this.store.getFeaturedBooks();
        
        if (featuredBooks.length === 0) {
            featuredBooksContainer.innerHTML = '<p class="text-center">لا توجد كتب مميزة لعرضها</p>';
            return;
        }

        featuredBooksContainer.innerHTML = featuredBooks.map(book => 
            this.renderBookCard(book)
        ).join('');

        this.attachBookCardEvents(featuredBooksContainer);
    }

    renderCatalog() {
        const catalogBooksContainer = document.getElementById('catalog-books');
        const noResults = document.getElementById('no-results');
        
        if (!catalogBooksContainer) return;

        const filteredBooks = this.store.filterBooks();
        
        if (filteredBooks.length === 0) {
            catalogBooksContainer.innerHTML = '';
            if (noResults) noResults.style.display = 'block';
        } else {
            catalogBooksContainer.innerHTML = filteredBooks.map(book => 
                this.renderBookCard(book)
            ).join('');
            
            if (noResults) noResults.style.display = 'none';
            
            this.attachBookCardEvents(catalogBooksContainer);
        }
    }

    attachBookCardEvents(container) {
        // View book details
        container.querySelectorAll('.view-book').forEach(button => {
            button.addEventListener('click', (e) => {
                const bookId = parseInt(e.currentTarget.getAttribute('data-id'));
                this.showBookDetails(bookId);
            });
        });

        // Borrow book
        container.querySelectorAll('.borrow-book').forEach(button => {
            button.addEventListener('click', (e) => {
                const bookId = parseInt(e.currentTarget.getAttribute('data-id'));
                this.handleBorrowBook(bookId);
            });
        });

        // Favorite button
        container.querySelectorAll('.favorite-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const bookId = parseInt(e.currentTarget.getAttribute('data-id'));
                this.handleToggleFavorite(bookId);
            });
        });
    }

    showBookDetails(bookId) {
        const book = this.store.getBookById(bookId);
        if (!book) {
            this.store.showToast('الكتاب غير موجود', 'error');
            return;
        }

        this.store.currentBookId = bookId;
        const isBorrowed = this.store.borrowings.some(b => 
            b.bookId === bookId && 
            b.userId === (this.store.currentUser?.id) && 
            !b.returned
        );
        
        const isFavorite = this.store.isLoggedIn() && 
            this.store.users.find(u => u.id === this.store.currentUser.id)?.favorites?.includes(bookId);

        const bookDetailsContainer = document.getElementById('book-details');
        if (bookDetailsContainer) {
            bookDetailsContainer.innerHTML = `
                <div class="book-details-cover">
                    ${book.image ? 
                        `<img src="${book.image}" alt="${book.title}">` : 
                        `<i class="fas fa-book"></i>`
                    }
                    ${this.store.isLoggedIn() ? `
                    <button class="favorite-btn-large ${isFavorite ? 'active' : ''}" id="favorite-details-btn" data-id="${bookId}">
                        <i class="fas fa-heart"></i>
                    </button>
                    ` : ''}
                </div>
                <div class="book-details-content">
                    <h2>${book.title}</h2>
                    <h3>${book.author}</h3>
                    
                    <div class="book-details-meta">
                        <div class="book-detail-item">
                            <i class="fas fa-tag"></i>
                            <span>${book.category}</span>
                        </div>
                        ${book.year ? `
                        <div class="book-detail-item">
                            <i class="fas fa-calendar"></i>
                            <span>${book.year}</span>
                        </div>` : ''}
                        ${book.isbn ? `
                        <div class="book-detail-item">
                            <i class="fas fa-barcode"></i>
                            <span>${book.isbn}</span>
                        </div>` : ''}
                    </div>
                    
                    <div class="book-description">
                        <h4>وصف الكتاب</h4>
                        <p>${book.description || 'لا يوجد وصف متاح لهذا الكتاب.'}</p>
                    </div>
                    
                    <div class="book-details-actions">
                        ${!isBorrowed ? 
                            `<button class="btn btn-primary" id="borrow-details-btn">
                                <i class="fas fa-hand-holding"></i> استعارة هذا الكتاب
                            </button>` : 
                            `<span class="btn btn-outline" style="cursor: default;">
                                <i class="fas fa-check"></i> هذا الكتاب مستعار حالياً
                            </span>`
                        }
                        ${this.store.isAdmin() ? 
                            `<button class="btn btn-outline" id="edit-book-btn">
                                <i class="fas fa-edit"></i> تعديل
                            </button>
                            <button class="btn btn-danger" id="delete-book-btn">
                                <i class="fas fa-trash"></i> حذف
                            </button>` : ''
                        }
                    </div>
                </div>
            `;

            // Add event listeners
            const borrowBtn = document.getElementById('borrow-details-btn');
            if (borrowBtn) {
                borrowBtn.addEventListener('click', () => {
                    this.handleBorrowBook(bookId);
                });
            }

            const favoriteBtn = document.getElementById('favorite-details-btn');
            if (favoriteBtn) {
                favoriteBtn.addEventListener('click', () => {
                    this.handleToggleFavorite(bookId);
                });
            }

            const editBtn = document.getElementById('edit-book-btn');
            if (editBtn) {
                editBtn.addEventListener('click', () => {
                    this.showEditBookForm(bookId);
                });
            }

            const deleteBtn = document.getElementById('delete-book-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    if (confirm('هل أنت متأكد من حذف هذا الكتاب؟')) {
                        this.handleDeleteBook(bookId);
                    }
                });
            }
        }

        window.location.hash = '#book-details';
    }

    showEditBookForm(bookId) {
        const book = this.store.getBookById(bookId);
        if (!book) return;

        const bookDetailsContainer = document.getElementById('book-details');
        if (bookDetailsContainer) {
            bookDetailsContainer.innerHTML = `
                <div class="book-details-cover">
                    ${book.image ? 
                        `<img src="${book.image}" alt="${book.title}">` : 
                        `<i class="fas fa-book"></i>`
                    }
                </div>
                <div class="book-details-content">
                    <h2>تعديل الكتاب</h2>
                    
                    <form id="edit-book-form">
                        <div class="form-group">
                            <label for="edit-title">عنوان الكتاب *</label>
                            <input type="text" id="edit-title" value="${book.title}" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="edit-author">المؤلف *</label>
                            <input type="text" id="edit-author" value="${book.author}" required>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="edit-year">سنة النشر</label>
                                <input type="number" id="edit-year" value="${book.year || ''}" min="1000" max="2024">
                            </div>
                            <div class="form-group">
                                <label for="edit-category">التصنيف *</label>
                                <select id="edit-category" required>
                                    <option value="">اختر تصنيفاً</option>
                                    ${this.store.getAllCategories().map(cat => 
                                        `<option value="${cat}" ${cat === book.category ? 'selected' : ''}>${cat}</option>`
                                    ).join('')}
                                    <option value="أخرى" ${!this.store.getAllCategories().includes(book.category) ? 'selected' : ''}>أخرى</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="edit-description">وصف الكتاب</label>
                            <textarea id="edit-description" rows="4">${book.description || ''}</textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="edit-image">رابط صورة الكتاب (اختياري)</label>
                            <input type="text" id="edit-image" value="${book.image || ''}" placeholder="https://example.com/book.jpg">
                        </div>
                        
                        <div class="form-group">
                            <label for="edit-isbn">رقم ISBN (اختياري)</label>
                            <input type="text" id="edit-isbn" value="${book.isbn || ''}">
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> حفظ التعديلات
                            </button>
                            <button type="button" class="btn btn-outline" id="cancel-edit">
                                <i class="fas fa-times"></i> إلغاء
                            </button>
                        </div>
                    </form>
                </div>
            `;

            const editForm = document.getElementById('edit-book-form');
            if (editForm) {
                editForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleEditBook(bookId);
                });
            }

            const cancelBtn = document.getElementById('cancel-edit');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    this.showBookDetails(bookId);
                });
            }
        }
    }

    renderBorrowings() {
        const borrowingsList = document.getElementById('borrowings-list');
        const noBorrowings = document.getElementById('no-borrowings');
        
        if (!borrowingsList) return;

        const borrowedBooks = this.store.getUserBorrowings();
        
        if (borrowedBooks.length === 0) {
            borrowingsList.innerHTML = '';
            if (noBorrowings) noBorrowings.style.display = 'block';
        } else {
            borrowingsList.innerHTML = borrowedBooks.map(borrowing => {
                const borrowDate = new Date(borrowing.borrowDate);
                const dueDate = new Date(borrowing.dueDate);
                const daysLeft = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
                
                return `
                    <div class="borrowing-item" data-id="${borrowing.id}">
                        <div class="borrowing-info">
                            <div class="borrowing-cover">
                                ${borrowing.book.image ? 
                                    `<img src="${borrowing.book.image}" alt="${borrowing.book.title}">` : 
                                    `<i class="fas fa-book"></i>`
                                }
                            </div>
                            <div class="borrowing-details">
                                <h4 class="borrowing-title">${borrowing.book.title}</h4>
                                <p class="borrowing-author">${borrowing.book.author}</p>
                                <div class="borrowing-meta">
                                    <span>تاريخ الاستعارة: ${borrowDate.toLocaleDateString('ar-SA')}</span>
                                    <span>تاريخ الإرجاع: ${dueDate.toLocaleDateString('ar-SA')}</span>
                                    <span class="${daysLeft < 0 ? 'text-danger' : daysLeft < 3 ? 'text-warning' : 'text-success'}">
                                        ${daysLeft < 0 ? 'متأخر' : `متبقي ${daysLeft} يوم`}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="borrowing-actions">
                            <button class="btn btn-primary return-book" data-id="${borrowing.id}">
                                <i class="fas fa-undo"></i> إرجاع الكتاب
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
            
            if (noBorrowings) noBorrowings.style.display = 'none';

            borrowingsList.querySelectorAll('.return-book').forEach(button => {
                button.addEventListener('click', (e) => {
                    const borrowingId = parseInt(e.currentTarget.getAttribute('data-id'));
                    this.handleReturnBook(borrowingId);
                });
            });
        }
    }

    renderProfile() {
        if (!this.store.isLoggedIn()) {
            window.location.hash = '#login';
            return;
        }

        const user = this.store.currentUser;
        const fullUser = this.store.users.find(u => u.id === user.id) || user;
        
        // Update profile information
        document.getElementById('profile-name').textContent = user.name || user.username;
        document.getElementById('profile-role').textContent = user.role === 'admin' ? 'مسؤول' : 'مستخدم';
        document.getElementById('profile-username').textContent = user.username;
        document.getElementById('profile-email').textContent = user.email || '-';
        document.getElementById('profile-phone').textContent = fullUser.phone || '-';
        document.getElementById('profile-address').textContent = fullUser.address || '-';
        
        if (user.createdAt) {
            const joinDate = new Date(user.createdAt);
            document.getElementById('profile-join-date').textContent = joinDate.toLocaleDateString('ar-SA');
            
            // Calculate days as member
            const daysMember = Math.floor((new Date() - joinDate) / (1000 * 60 * 60 * 24));
            document.getElementById('profile-days-member').textContent = daysMember;
        }
        
        // Update statistics
        const userBorrowings = this.store.borrowings.filter(b => b.userId === user.id);
        const currentBorrowings = userBorrowings.filter(b => !b.returned).length;
        const totalBorrowings = userBorrowings.length;
        const favoritesCount = fullUser.favorites?.length || 0;
        
        document.getElementById('profile-books-borrowed').textContent = totalBorrowings;
        document.getElementById('profile-current-borrowed').textContent = currentBorrowings;
        document.getElementById('profile-favorites').textContent = favoritesCount;
        
        // Update recent activity
        const activityList = document.getElementById('profile-activity');
        if (activityList) {
            const recentActivities = [
                { text: 'زيارة المكتبة', time: 'اليوم', icon: 'fa-home' },
                { text: 'استعارة كتاب', time: 'أمس', icon: 'fa-book' },
                { text: 'إضافة كتاب للمفضلة', time: 'قبل 3 أيام', icon: 'fa-heart' },
                { text: 'تسجيل الدخول', time: 'قبل أسبوع', icon: 'fa-sign-in-alt' }
            ];
            
            activityList.innerHTML = recentActivities.map(activity => `
                <div class="activity-item">
                    <i class="fas ${activity.icon}"></i>
                    <div class="activity-content">
                        <p>${activity.text}</p>
                        <small>${activity.time}</small>
                    </div>
                </div>
            `).join('');
        }
    }

    showEditProfileForm() {
        const user = this.store.currentUser;
        const fullUser = this.store.users.find(u => u.id === user.id) || user;
        
        const profileContent = document.querySelector('.profile-content');
        if (profileContent) {
            profileContent.innerHTML = `
                <div class="edit-profile-form">
                    <h3><i class="fas fa-user-edit"></i> تعديل الملف الشخصي</h3>
                    
                    <form id="update-profile-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="edit-profile-name">الاسم الكامل</label>
                                <input type="text" id="edit-profile-name" value="${user.name || ''}">
                            </div>
                            <div class="form-group">
                                <label for="edit-profile-email">البريد الإلكتروني</label>
                                <input type="email" id="edit-profile-email" value="${user.email || ''}">
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="edit-profile-phone">رقم الهاتف</label>
                                <input type="tel" id="edit-profile-phone" value="${fullUser.phone || ''}">
                            </div>
                            <div class="form-group">
                                <label for="edit-profile-address">العنوان</label>
                                <input type="text" id="edit-profile-address" value="${fullUser.address || ''}">
                            </div>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> حفظ التعديلات
                            </button>
                            <button type="button" class="btn btn-outline" id="cancel-profile-edit">
                                <i class="fas fa-times"></i> إلغاء
                            </button>
                        </div>
                    </form>
                </div>
                
                <div class="profile-stats">
                    <h3><i class="fas fa-chart-bar"></i> إحصائياتي</h3>
                    <!-- Keep stats section -->
                    ${document.querySelector('.profile-stats').innerHTML}
                </div>
            `;
            
            const updateForm = document.getElementById('update-profile-form');
            if (updateForm) {
                updateForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleUpdateProfile();
                });
            }
            
            const cancelBtn = document.getElementById('cancel-profile-edit');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    this.renderProfile();
                });
            }
        }
    }

    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const result = this.store.loginUser(username, password);
        
        if (result.success) {
            this.store.showToast(result.message, 'success');
            this.updateUserInterface();
            
            setTimeout(() => {
                if (result.user.role === 'admin') {
                    window.location.hash = '#admin';
                } else {
                    window.location.hash = '#home';
                }
            }, 1000);
        } else {
            this.store.showToast(result.message, 'error');
        }
    }

    handleRegister() {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const username = document.getElementById('register-username').value;
        const phone = document.getElementById('register-phone').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const address = document.getElementById('register-address').value;
        const terms = document.getElementById('register-terms').checked;

        // Validation
        if (!terms) {
            this.store.showToast('يجب الموافقة على الشروط والأحكام', 'warning');
            return;
        }
        
        if (password !== confirmPassword) {
            this.store.showToast('كلمتا المرور غير متطابقتين', 'error');
            return;
        }
        
        if (password.length < 6) {
            this.store.showToast('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'warning');
            return;
        }

        const userData = {
            name,
            email,
            username,
            phone,
            password,
            address
        };

        const result = this.store.registerUser(userData);
        
        if (result.success) {
            this.store.showToast(result.message, 'success');
            this.updateUserInterface();
            
            setTimeout(() => {
                window.location.hash = '#profile';
            }, 1000);
        } else {
            this.store.showToast(result.message, 'error');
        }
    }

    handleLogout() {
        if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
            const result = this.store.logout();
            this.store.showToast(result.message, 'success');
            this.updateUserInterface();
            
            setTimeout(() => {
                window.location.hash = '#home';
            }, 500);
        }
    }

    handleUpdateProfile() {
        const name = document.getElementById('edit-profile-name').value;
        const email = document.getElementById('edit-profile-email').value;
        const phone = document.getElementById('edit-profile-phone').value;
        const address = document.getElementById('edit-profile-address').value;

        const updates = {
            name,
            email,
            phone,
            address
        };

        const result = this.store.updateUserProfile(this.store.currentUser.id, updates);
        
        if (result.success) {
            this.store.showToast(result.message, 'success');
            this.renderProfile();
        } else {
            this.store.showToast(result.message, 'error');
        }
    }

    handleToggleFavorite(bookId) {
        const result = this.store.toggleFavorite(bookId);
        
        if (result.success) {
            this.store.showToast(result.message, 'success');
            
            // Update UI
            this.renderCatalog();
            this.renderFeaturedBooks();
            
            // If on book details page, update it
            if (window.location.hash === '#book-details' && this.store.currentBookId === bookId) {
                this.showBookDetails(bookId);
            }
        } else {
            this.store.showToast(result.message, 'warning');
        }
    }

    handleAddBook() {
        const title = document.getElementById('book-title').value;
        const author = document.getElementById('book-author').value;
        const year = document.getElementById('book-year').value;
        const category = document.getElementById('book-category').value;
        const description = document.getElementById('book-description').value;
        const image = document.getElementById('book-image').value;
        const isbn = document.getElementById('book-isbn').value;

        if (!title || !author || !category) {
            this.store.showToast('الرجاء ملء الحقول المطلوبة', 'warning');
            return;
        }

        const bookData = {
            title,
            author,
            year: year ? parseInt(year) : undefined,
            category,
            description,
            image: image || '',
            isbn: isbn || ''
        };

        const newBook = this.store.addBook(bookData);
        
        document.getElementById('add-book-form').reset();
        this.store.showToast(`تم إضافة الكتاب "${newBook.title}" بنجاح`, 'success');
        this.renderBooksTable();
        this.renderCategories();
        this.renderFeaturedBooks();
    }

    handleEditBook(bookId) {
        const title = document.getElementById('edit-title').value;
        const author = document.getElementById('edit-author').value;
        const year = document.getElementById('edit-year').value;
        const category = document.getElementById('edit-category').value;
        const description = document.getElementById('edit-description').value;
        const image = document.getElementById('edit-image').value;
        const isbn = document.getElementById('edit-isbn').value;

        if (!title || !author || !category) {
            this.store.showToast('الرجاء ملء الحقول المطلوبة', 'warning');
            return;
        }

        const bookData = {
            title,
            author,
            year: year ? parseInt(year) : undefined,
            category,
            description,
            image: image || '',
            isbn: isbn || ''
        };

        const updatedBook = this.store.updateBook(bookId, bookData);
        
        if (updatedBook) {
            this.store.showToast(`تم تحديث الكتاب "${updatedBook.title}" بنجاح`, 'success');
            this.showBookDetails(bookId);
            this.renderBooksTable();
            this.renderCategories();
            this.renderFeaturedBooks();
            this.renderCatalog();
        }
    }

    handleDeleteBook(bookId) {
        const book = this.store.getBookById(bookId);
        if (!book) return;

        const success = this.store.deleteBook(bookId);
        
        if (success) {
            this.store.showToast(`تم حذف الكتاب "${book.title}" بنجاح`, 'success');
            
            if (window.location.hash === '#book-details' && this.store.currentBookId === bookId) {
                window.location.hash = '#catalog';
            }
            
            this.renderBooksTable();
            this.renderCategories();
            this.renderFeaturedBooks();
            this.renderCatalog();
            this.renderBorrowings();
        }
    }

    handleBorrowBook(bookId) {
        const book = this.store.getBookById(bookId);
        if (!book) {
            this.store.showToast('الكتاب غير موجود', 'error');
            return;
        }

        const success = this.store.borrowBook(bookId);
        
        if (success) {
            this.renderCatalog();
            this.renderBorrowings();
            
            if (window.location.hash === '#book-details' && this.store.currentBookId === bookId) {
                this.showBookDetails(bookId);
            }
            
            this.renderFeaturedBooks();
        }
    }

    handleReturnBook(borrowingId) {
        const success = this.store.returnBook(borrowingId);
        
        if (success) {
            this.renderBorrowings();
            this.renderCatalog();
            this.renderFeaturedBooks();
            
            if (window.location.hash === '#book-details') {
                const borrowing = this.store.borrowings.find(b => b.id === borrowingId);
                if (borrowing && this.store.currentBookId === borrowing.bookId) {
                    this.showBookDetails(borrowing.bookId);
                }
            }
        }
    }

    handleContactForm() {
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const subject = document.getElementById('contact-subject').value;
        const message = document.getElementById('contact-message').value;

        if (!name || !email || !subject || !message) {
            this.store.showToast('الرجاء ملء جميع الحقول', 'warning');
            return;
        }

        this.store.showToast('تم إرسال رسالتك بنجاح! سنقوم بالرد عليك في أقرب وقت ممكن.', 'success');
        document.getElementById('contact-form').reset();
    }

    renderAdminStats() {
        const adminStats = document.getElementById('admin-stats');
        if (!adminStats) return;

        const totalBooks = this.store.books.length;
        const totalBorrowings = this.store.borrowings.length;
        const activeBorrowings = this.store.borrowings.filter(b => !b.returned).length;
        const returnedBooks = this.store.borrowings.filter(b => b.returned).length;
        const totalUsers = this.store.users.length;
        const categories = this.store.getAllCategories().length;

        adminStats.innerHTML = `
            <h3>إحصائيات المكتبة</h3>
            <div class="stats-list">
                <div class="stat-item">
                    <span>إجمالي الكتب:</span>
                    <span class="stat-value">${totalBooks}</span>
                </div>
                <div class="stat-item">
                    <span>إجمالي الاستعارات:</span>
                    <span class="stat-value">${totalBorrowings}</span>
                </div>
                <div class="stat-item">
                    <span>الاستعارات النشطة:</span>
                    <span class="stat-value">${activeBorrowings}</span>
                </div>
                <div class="stat-item">
                    <span>الكتب المُرجعَة:</span>
                    <span class="stat-value">${returnedBooks}</span>
                </div>
                <div class="stat-item">
                    <span>عدد المستخدمين:</span>
                    <span class="stat-value">${totalUsers}</span>
                </div>
                <div class="stat-item">
                    <span>عدد التصنيفات:</span>
                    <span class="stat-value">${categories}</span>
                </div>
            </div>
        `;
    }

    renderBooksTable() {
        const tableBody = document.getElementById('books-table-body');
        const booksCount = document.getElementById('books-count');
        
        if (!tableBody) return;

        tableBody.innerHTML = this.store.books.map(book => `
            <tr data-id="${book.id}">
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.category}</td>
                <td>${book.year || '-'}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-outline btn-sm view-book-table" data-id="${book.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-outline btn-sm edit-book-table" data-id="${book.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm delete-book-table" data-id="${book.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        if (booksCount) {
            booksCount.textContent = this.store.books.length;
        }

        tableBody.querySelectorAll('.view-book-table').forEach(button => {
            button.addEventListener('click', (e) => {
                const bookId = parseInt(e.currentTarget.getAttribute('data-id'));
                this.showBookDetails(bookId);
            });
        });

        tableBody.querySelectorAll('.edit-book-table').forEach(button => {
            button.addEventListener('click', (e) => {
                const bookId = parseInt(e.currentTarget.getAttribute('data-id'));
                this.showEditBookFormInManage(bookId);
            });
        });

        tableBody.querySelectorAll('.delete-book-table').forEach(button => {
            button.addEventListener('click', (e) => {
                const bookId = parseInt(e.currentTarget.getAttribute('data-id'));
                if (confirm('هل أنت متأكد من حذف هذا الكتاب؟')) {
                    this.handleDeleteBook(bookId);
                }
            });
        });
    }

    showEditBookFormInManage(bookId) {
        this.store.currentBookId = bookId;
        window.location.hash = '#book-details';
        setTimeout(() => {
            this.showEditBookForm(bookId);
        }, 100);
    }

    showAdminStats() {
        this.renderAdminStats();
    }
}

class LibraryRouter {
    constructor(store, ui) {
        this.store = store;
        this.ui = ui;
        this.currentPage = 'home';
        this.init();
    }

    init() {
        window.addEventListener('hashchange', () => this.route());
        window.addEventListener('load', () => {
            const navLinks = document.querySelector('.nav-links');
            if (navLinks) navLinks.classList.remove('active');
            this.route();
        });
        this.parseHash();
    }

    parseHash() {
        const hash = window.location.hash.substring(1) || 'home';
        const [page, query] = hash.split('?');
        this.currentPage = page;
        
        if (query) {
            const params = new URLSearchParams(query);
            const category = params.get('category');
            if (category) {
                this.store.filterCategory = decodeURIComponent(category);
            }
        }
    }

    route() {
        this.parseHash();
        
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        const pageId = `${this.currentPage}-page`;
        const currentPage = document.getElementById(pageId);
        
        if (currentPage) {
            currentPage.classList.add('active');
            this.ui.updateUserInterface();
            this.renderPage();
        } else {
            window.location.hash = '#home';
        }
    }

    renderPage() {
        switch (this.currentPage) {
            case 'home':
                this.ui.renderFeaturedBooks();
                this.store.updateStats();
                break;
                
            case 'catalog':
                this.ui.renderCatalog();
                const searchInput = document.getElementById('search-input');
                const categoryFilter = document.getElementById('category-filter');
                if (searchInput) searchInput.value = this.store.searchQuery;
                if (categoryFilter) categoryFilter.value = this.store.filterCategory;
                break;
                
            case 'book-details':
                if (this.store.currentBookId) {
                    this.ui.showBookDetails(this.store.currentBookId);
                } else {
                    window.location.hash = '#catalog';
                }
                break;
                
            case 'borrowings':
                if (!this.store.isLoggedIn()) {
                    window.location.hash = '#login';
                } else {
                    this.ui.renderBorrowings();
                }
                break;
                
            case 'admin':
                if (!this.store.isAdmin()) {
                    window.location.hash = '#login';
                } else {
                    this.ui.renderAdminStats();
                }
                break;
                
            case 'manage-books':
                if (!this.store.isAdmin()) {
                    window.location.hash = '#login';
                } else {
                    this.ui.renderBooksTable();
                }
                break;
                
            case 'login':
                const loginForm = document.getElementById('login-form');
                if (loginForm) loginForm.reset();
                break;
                
            case 'register':
                const registerForm = document.getElementById('register-form');
                if (registerForm) registerForm.reset();
                break;
                
            case 'profile':
                this.ui.renderProfile();
                break;
                
            case 'about':
            case 'contact':
                // No dynamic content needed
                break;
        }
        
        this.store.updateStats();
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    const store = new LibraryStore();
    const ui = new LibraryUI(store);
    const router = new LibraryRouter(store, ui);
    
    window.libraryStore = store;
    window.libraryUI = ui;
    
    console.log('Library System with User Registration initialized successfully!');
});