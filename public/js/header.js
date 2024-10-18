document.addEventListener('DOMContentLoaded', async () => {
    const homeButton = document.getElementById('nav-bar-brand');
    homeButton.addEventListener('click', () => {
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

    const logButton = document.getElementById('log-button');
});