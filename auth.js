// Authentication module
const auth = {
    // Register a new user
    register: function(name, email, password) {
        // Get existing users from localStorage
        const users = this.getUsers();
        
        // Check if email already exists
        if (users.find(user => user.email === email)) {
            return false;
        }
        
        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name: name,
            email: email,
            password: this.hashPassword(password), // In production, use proper hashing
            createdAt: new Date().toISOString()
        };
        
        // Add user to storage
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        return true;
    },
    
    // Login user
    login: function(email, password) {
        const users = this.getUsers();
        const user = users.find(u => u.email === email);
        
        if (!user) {
            return false;
        }
        
        // Check password (in production, use proper password verification)
        if (user.password !== this.hashPassword(password)) {
            return false;
        }
        
        // Create session
        const session = {
            userId: user.id,
            email: user.email,
            name: user.name,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(session));
        
        return true;
    },
    
    // Logout user
    logout: function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    },
    
    // Check if user is logged in
    isAuthenticated: function() {
        const currentUser = localStorage.getItem('currentUser');
        return currentUser !== null;
    },
    
    // Get current user
    getCurrentUser: function() {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            return JSON.parse(currentUser);
        }
        return null;
    },
    
    // Get all users (for internal use)
    getUsers: function() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    },
    
    // Simple password hashing (for demo purposes only)
    // In production, use proper hashing like bcrypt
    hashPassword: function(password) {
        // Simple hash for demo - NOT secure for production
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString();
    }
};

