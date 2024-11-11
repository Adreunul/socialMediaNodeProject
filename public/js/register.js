import './header.js';

var form = document.getElementById('registerForm');
var usernameField = document.getElementById('username');
var emailField = document.getElementById('email');
var passwordField = document.getElementById('password');
var confirmPasswordField = document.getElementById('confirmPassword');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    removeInvalidFields();

    const username = usernameField.value;
    const email = emailField.value;
    const password = passwordField.value;
    const confirmPassword = confirmPasswordField.value;

    try {
        const response = await fetch('/api/v1/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                username,
                email,
                password,
                confirmPassword,
            }),
        });

        const data = await response.json();

        if (response.ok && data.status === 'success') {
            localStorage.setItem('userId', data.userId);
            window.location.href = '/home';
        } else {
            alert(data.message); // Now we show the custom error message from the backend
        }

        switch(data.field){
            case 'username':
                usernameField.classList.add('is-invalid');
                break;
            case 'email':
                emailField.classList.add('is-invalid');
                break;
            case 'password':
                passwordField.classList.add('is-invalid');
                break;
            case 'passwords':
                passwordField.classList.add('is-invalid');
                confirmPasswordField.classList.add('is-invalid');
                break;
            case 'all':
                if(usernameField.value === '')
                    usernameField.classList.add('is-invalid');
                if(emailField.value === '')
                    emailField.classList.add('is-invalid');
                if(passwordField.value === '')
                    passwordField.classList.add('is-invalid');
                if(confirmPasswordField.value === '')
                    confirmPasswordField.classList.add('is-invalid');
                break;
        }
    } catch (error) {
        console.error('Register failed:', error);
        alert('Register failed. Please try again.');
    }
});


const goToLogin = document.getElementById('go-to-login');
goToLogin.addEventListener('click', () => {
    window.location.href = '/login';
});

function removeInvalidFields() {
    if(usernameField.classList.contains('is-invalid'))
        usernameField.classList.remove('is-invalid');
    if(emailField.classList.contains('is-invalid'))
        emailField.classList.remove('is-invalid');
    if(passwordField.classList.contains('is-invalid'))
        passwordField.classList.remove('is-invalid');
    if(confirmPasswordField.classList.contains('is-invalid'))
        confirmPasswordField.classList.remove('is-invalid');
}