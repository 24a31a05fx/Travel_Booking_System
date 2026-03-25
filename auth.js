// ==================== AUTH.JS ====================
// Handles login, registration, session management

(function() {
    // ---- Helpers ----
    function getUsers() {
        try { return JSON.parse(localStorage.getItem('tbs_users') || '[]'); } catch(e) { return []; }
    }
    function saveUsers(users) {
        localStorage.setItem('tbs_users', JSON.stringify(users));
    }
    function getCurrentUser() {
        try { return JSON.parse(sessionStorage.getItem('tbs_current_user') || 'null'); } catch(e) { return null; }
    }
    function setCurrentUser(user) {
        sessionStorage.setItem('tbs_current_user', JSON.stringify(user));
    }
    function clearCurrentUser() {
        sessionStorage.removeItem('tbs_current_user');
    }

    // ---- Auth Guard ----
    const publicPages = ['login.html', 'register.html', 'index.html', ''];
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const isPublicPage = publicPages.some(p => currentPage === p);

    if (!isPublicPage && !getCurrentUser()) {
        window.location.href = 'login.html';
    }
    if ((currentPage === 'login.html' || currentPage === 'register.html') && getCurrentUser()) {
        window.location.href = 'search.html';
    }

    // ---- Login/Register Forms ----
    document.addEventListener('DOMContentLoaded', function() {
        // Toggle between login and register
        const toggleBtns = document.querySelectorAll('.toggle-btn');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        if (toggleBtns.length) {
            toggleBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    toggleBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    const target = this.dataset.form;
                    if (target === 'login') {
                        loginForm && loginForm.classList.add('active');
                        registerForm && registerForm.classList.remove('active');
                    } else {
                        registerForm && registerForm.classList.add('active');
                        loginForm && loginForm.classList.remove('active');
                    }
                });
            });
        }

        // Login Submit
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value.trim();
                const password = document.getElementById('loginPassword').value;
                const errorEl = document.getElementById('loginError');
                errorEl.textContent = '';

                const users = getUsers();
                const user = users.find(u =>
                    (u.email.toLowerCase() === email.toLowerCase() || u.name.toLowerCase() === email.toLowerCase())
                    && u.password === password
                );
                if (!user) {
                    errorEl.textContent = 'Invalid email/username or password.';
                    return;
                }
                setCurrentUser({ id: user.id, name: user.name, email: user.email });
                window.location.href = 'search.html';
            });
        }

        // Register Submit
        if (registerForm) {
            registerForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const name = document.getElementById('regName').value.trim();
                const email = document.getElementById('regEmail').value.trim();
                const password = document.getElementById('regPassword').value;
                const confirm = document.getElementById('regConfirmPassword').value;
                const errorEl = document.getElementById('registerError');
                errorEl.textContent = '';

                if (!name || !email || !password || !confirm) {
                    errorEl.textContent = 'All fields are required.';
                    return;
                }
                if (password.length < 6) {
                    errorEl.textContent = 'Password must be at least 6 characters.';
                    return;
                }
                if (password !== confirm) {
                    errorEl.textContent = 'Passwords do not match.';
                    return;
                }

                const users = getUsers();
                if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
                    errorEl.textContent = 'Email already registered.';
                    return;
                }

                const newUser = {
                    id: 'user_' + Date.now(),
                    name,
                    email,
                    password
                };
                users.push(newUser);
                saveUsers(users);
                setCurrentUser({ id: newUser.id, name: newUser.name, email: newUser.email });
                window.location.href = 'search.html';
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                clearCurrentUser();
                window.location.href = 'login.html';
            });
        }

        // Show current user name in nav if element exists
        const userNameEl = document.getElementById('currentUserName');
        const user = getCurrentUser();
        if (userNameEl && user) {
            userNameEl.textContent = user.name;
        }

        // Mobile nav toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        if (navToggle && navLinks) {
            navToggle.addEventListener('click', function() {
                navLinks.classList.toggle('open');
            });
        }
    });

    // Expose helpers globally
    window.auth = {
        getCurrentUser,
        setCurrentUser,
        clearCurrentUser
    };
})();

