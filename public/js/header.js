document.addEventListener('DOMContentLoaded', async () => {
    const homeButton = document.getElementById('navbar-brand');
    homeButton.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = '/home';
    });

    const writePostButton = document.getElementById('write-a-post-button');
    writePostButton.addEventListener('click', () => {
        window.location.href = '/write-post';
    });

    const profileButton = document.getElementById('go-to-profile-button');
    profileButton.addEventListener('click', () => {
        window.location.href = '/profile';
    });

    const logButton = document.getElementById('log-account-button');
    logButton.addEventListener('click', async () => {
        try {
            // Send a POST request to the logout endpoint
            const response = await fetch('/api/v1/auth/logout', {
                method: 'POST',
            });
    
            if (response.ok) {
                // Redirect to the login page after successful logout
                window.location.href = '/login';
            } else {
                alert('Failed to log out');
            }
        } catch (error) {
            console.error('Logout failed:', error);
            alert('An error occurred during logout');
        }
    });
});