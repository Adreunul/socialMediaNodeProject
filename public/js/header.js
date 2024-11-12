document.addEventListener('DOMContentLoaded', async () => {
    if(window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
        await getSessionAndUsername();
    }

    const currentUserId = await getCurrentSession();

    const homeButton = document.getElementById('navbar-brand');
    homeButton.addEventListener('click', (event) => {
        event.preventDefault();
        localStorage.setItem('userId', currentUserId);
        window.location.href = '/home';
    });

    const writePostButton = document.getElementById('write-a-post-button');
    writePostButton.addEventListener('click', () => {
        localStorage.setItem('userId', currentUserId);
        window.location.href = '/write-post';
    });

    const profileButton = document.getElementById('go-to-profile-button');
    profileButton.addEventListener('click', async () => {
        localStorage.setItem('userId', currentUserId);
        window.location.href = '/profile/' + currentUserId;
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

async function getCurrentSession() {
    try {
      const response = await fetch("/api/v1/auth/session");
      if (response.ok) {
        const sessionData = await response.json();
        return sessionData.userId;
        //localStorage.setItem("currentUserId", currentUserId);
      } else {
        console.error("Failed to fetch session");
        return;
      }
    } catch (error) {
      console.error("Failed to fetch session", error);
    }
  }

async function getSessionAndUsername() {
    try {
        const response = await fetch('/api/v1/auth/session');
        if (response.ok) {
            const sessionData = await response.json();
            const currentUserId = sessionData.userId;
            setUsername(currentUserId);
        } else {
            console.error('Failed to fetch session');
        }
    } catch (error) {
        console.error('Failed to fetch session', error);
    }

}

async function setUsername(currentUserId)
{
    try{
        const response = await fetch('/api/v1/users/getUsernameById/' + currentUserId);
        const data = await response.json();

        if (response.ok && data.status === 'success') {
            const username = data.username;
            const usernameElement = document.getElementById('go-to-profile-button');
            usernameElement.innerText = username;
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Failed to fetch username', error);
    }
}

