import './header.js';

document.getElementById('registerForm').addEventListener('submit', async(event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try{
        const response = await fetch('/api/v1/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                username,
                email,
                password
            })
        });


        if(response.ok)
            window.location.href = '/home';
        else if (response.status === 400)
            alert('Email already in use');
        else if (response.status === 401)
            alert('Username already in use');
        else
            alert('Failed to register');
    } catch (error) {
        console.error("Register failed:", error);
        alert('Register failed');
    }
});

const goToLogin = document.getElementById('go-to-login');
goToLogin.addEventListener('click', () => {
    window.location.href = '/login';
});