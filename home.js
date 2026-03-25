// ==================== HOME.JS ====================
// Homepage extras: EVA chat, login state display

document.addEventListener('DOMContentLoaded', function() {
    // Show/hide login vs bookings based on auth state
    const user = window.auth && window.auth.getCurrentUser();
    const loginBtn = document.querySelector('.btn-login');
    const myBookingsLink = document.querySelector('.header-right a[href="mybookings.html"]');

    if (user && loginBtn) {
        loginBtn.textContent = user.name;
        loginBtn.href = 'mybookings.html';
        loginBtn.classList.add('logged-in');
    }

    // EVA chat widget click
    const evaChat = document.getElementById('evaChat');
    if (evaChat) {
        evaChat.addEventListener('click', function() {
            alert('EVA Chat Assistant: Hi! I\\'m EVA, your travel assistant. Use the search form above to find flights, trains, and buses!');
        });
    }
});

