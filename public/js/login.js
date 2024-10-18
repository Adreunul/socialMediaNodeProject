import './header.js';

document.getElementById('loginForm').addEventListener('submit', async(event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try{
        const response = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                email,
                password
            })
        });

        if(response.ok)
            window.location.href = '/home';
        else 
            alert('Invalid email or password');
        
    } catch (error) {
        console.error("Login failed:", error);
        alert('Login failed');
    }
});

const goToRegister = document.getElementById('go-to-register');
goToRegister.addEventListener('click', () => {
    window.location.href = '/register';
});

