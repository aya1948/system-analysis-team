// Authentication functions

// Login function
function login(email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Remove password from stored user object
        const { password, ...userWithoutPassword } = user;
        currentUser = userWithoutPassword;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        showNotification('Login successful!', 'success');
        
        // Redirect based on role
        setTimeout(() => {
            if (user.role === 'admin') {
                window.location.href = 'admin-dashboard.html';
            } else {
                window.location.href = 'index.html';
            }
        }, 1000);
        
        return true;
    } else {
        showNotification('Invalid email or password', 'error');
        return false;
    }
}

// Register function
function register(name, email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
        showNotification('User with this email already exists', 'error');
        return false;
    }
    
    // Create new user
    const newUser = {
        id: users.length + 1,
        name: name,
        email: email,
        password: password,
        role: 'user'
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login after registration
    const { password: _, ...userWithoutPassword } = newUser;
    currentUser = userWithoutPassword;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    showNotification('Registration successful!', 'success');
    
    // Redirect to home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
    
    return true;
}

// Check if user is logged in
function isLoggedIn() {
    return currentUser !== null;
}

// Check if user is admin
function isAdmin() {
    return currentUser && currentUser.role === 'admin';
}

// Require login for certain pages
function requireLogin(redirectTo = 'login.html') {
    if (!isLoggedIn()) {
        showNotification('Please login to access this page', 'warning');
        setTimeout(() => {
            window.location.href = redirectTo;
        }, 1500);
        return false;
    }
    return true;
}

// Require admin access
function requireAdmin(redirectTo = 'index.html') {
    if (!isAdmin()) {
        showNotification('Admin access required', 'error');
        setTimeout(() => {
            window.location.href = redirectTo;
        }, 1500);
        return false;
    }
    return true;
}

// Initialize auth forms
document.addEventListener('DOMContentLoaded', function() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (login(email, password)) {
                // Form will be handled by login function
            }
        });
    }
    
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validate passwords match
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            // Validate password strength
            if (password.length < 6) {
                showNotification('Password must be at least 6 characters', 'error');
                return;
            }
            
            if (register(name, email, password)) {
                // Form will be handled by register function
            }
        });
    }
    
    // Check admin access for admin pages
    if (window.location.href.includes('admin')) {
        if (!requireLogin()) return;
        if (!requireAdmin()) return;
    }
    
    // Check login for borrowings page
    if (window.location.href.includes('borrowings')) {
        if (!requireLogin()) return;
    }
});