import './header.js';

const goToLogin = document.getElementById('go-to-login');
goToLogin.addEventListener('click', () => {
    window.location.href = '/login';
});