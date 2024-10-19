import './header.js';

let currentUserId = null;

document.addEventListener('DOMContentLoaded', async () => {
    const postsContainer = document.getElementById('posts-container');

    try{
        const response = await fetch('/api/v1/auth/session');
        if(response.ok) {
            const sessionData = await response.json();
            currentUserId = sessionData.userId;
        }
        else {
            console.error('Failed to fetch session');
        }
    } catch(error) {
        console.error('Failed to fetch session', error);
    }

    try{
        const response = await fetch('/api/v1/posts/getAllPosts');
        if(response.ok) {
            const posts = await response.json();
            console.log(posts);
            displayPosts(posts, postsContainer);
        }
        else {
            console.error('Failed to fetch posts');
            postsContainer.innerHTML = '<p>No posts available</p>';
        }
    } catch(error) {
        console.error('Failed to fetch posts', error);
        postsContainer.innerHTML = '<p>Error loading posts. Please try again later.</p>';
    }
});



function displayPosts(posts, postsContainer){
    postsContainer.innerHTML = '';

    posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'card';
        postCard.style.width =  '35rem';
        console.log("post user ID: "+post.id_author);
        console.log("current user ID: "+currentUserId);

        postCard.innerHTML = `
            <div class="card-body">
                <h5 class="text card-title" style="text-align: center;">${post.title}</h5>
                <hr class="title-underline">
                <p class="text card-text">${post.text}</p>
                <hr class="content-underline">
                <h6 class="author" style="text-align:center">Written by: ${post.username}</h6>
                <div class="author-buttons">
                    <a href="#" class="card-link ${post.id_author === currentUserId ? '' : 'invisible'}">Edit Post</a>
                    <a href="#" class="card-link ${post.id_author === currentUserId ? '' : 'invisible'}">Delete Post</a>
                </div>
            </div>
        `;

         postsContainer.appendChild(postCard);
    });
    
}

const userActions = document.getElementsByClassName("user-action");

for (let i = 0; i < userActions.length; i++) {
    userActions[i].classList.add("active");
    userActions[i].classList.remove("disabled");
}