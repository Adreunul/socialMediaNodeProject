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

// event listener on user scrolling the page

window.onscroll = async function() {
    //console.log("salut");
}



function displayPosts(posts, postsContainer){
    postsContainer.innerHTML = '';

    posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'card';
        postCard.style.width =  '35rem';
        postCard.style.minWidth = '300px';
        console.log("post user ID: "+post.id_author);
        console.log("current user ID: "+currentUserId);


        postCard.innerHTML = `
        <div class="card-body">
            <h5 class="text card-title" style="text-align: center;font-size:1.35rem;">${post.title}</h5>
            <hr class="title-underline">
            <p class="text card-text">${post.text}</p>
            <hr class="content-underline">
            <h6 class="author" style="text-align:center">Written by: ${post.username}</h6>
            <div class="author-buttons" style="margin-bottom:10px !important;">
                <a href="#" class="edit-post card-link ${post.id_author === currentUserId ? '' : 'invisible'}">Edit Post</a>
                <a href="#" class="delete-post card-link ${post.id_author === currentUserId ? '' : 'invisible'}">Delete Post</a>
            </div>
            <div class="post-date" style="display:flex;flex-direction:column;align-items:center;">
                <div class="post-date-area" style="width:fit-content;height:fit-content;display:flex;flex-direction:column;align-items:center;background-color: rgba(0, 0, 0, 0.075);padding:5px;border:0.75px solid darkgray;border-radius:25%;">
                    <p style="font-size:0.8rem;margin-bottom:0px !important;">${formatPostDate(post)}</p>
                    <p style="font-size:0.8rem;margin-bottom:0px !important;">${formatPostHour(post)}</p>
                </div>
                <p class="${post.edited === 1 ? '' : 'invisible'}" style="font-size:0.8rem;margin-bottom:0px !important;margin-top:5px !important;">Edited</p>
            </div>
        </div>
    `;

        const editButton = postCard.querySelector('.edit-post');
        const deleteButton = postCard.querySelector('.delete-post');

        // Add click event listeners to the buttons
        editButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default anchor behavior
            handleEditPost(post); // Call the edit post handler with post data
        });

        deleteButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default anchor behavior
            handleDeletePost(post, postCard); // Call the delete post handler with post ID
        });

        postsContainer.appendChild(postCard);
    }); 
}

async function handleDeletePost(post, postCard){
    var initialCardHeight = postCard.clientHeight;
    postCard.innerHTML = `
    <div class="card-body" style="height:${initialCardHeight}px !important; display:flex;flex-direction:column;align-items:center;justify-content:center;">
        <h6 class="confirmation-text" style="text-align:center">Do you want to delete this Post ?</h6>
        <div class="author-buttons">
            <a href="#" class="confirm-delete card-link">Delete my Post</a>
            <a href="#" class="stop-delete card-link">Cancel</a>
        </div>
    </div>
`;

    const confirmButton = postCard.querySelector('.confirm-delete');
    const cancelButton = postCard.querySelector('.stop-delete');

    confirmButton.addEventListener('click', async (event) => {
        try{
            const response = await fetch(`/api/v1/posts/deletePost/${post.id}`, {
                method: 'DELETE'
            });
    
            const data = await response.json();
    
            if(response.ok && data.status === 'success'){
                window.location.reload();
            }
            else {
                alert(data.message);
                console.error('Failed to delete post mf');
            }
        } catch(error){
            console.error('Failed to delete post 2', error);
        }
    });

    cancelButton.addEventListener('click', (event) => {
        event.preventDefault();
        postCard.innerHTML = `
        <div class="card-body">
            <h5 class="text card-title" style="text-align: center;font-size:1.35rem;">${post.title}</h5>
            <hr class="title-underline">
            <p class="text card-text">${post.text}</p>
            <hr class="content-underline">
            <h6 class="author" style="text-align:center">Written by: ${post.username}</h6>
            <div class="author-buttons" style="margin-bottom:10px !important;">
                <a href="#" class="edit-post card-link ${post.id_author === currentUserId ? '' : 'invisible'}">Edit Post</a>
                <a href="#" class="delete-post card-link ${post.id_author === currentUserId ? '' : 'invisible'}">Delete Post</a>
            </div>
            <div class="post-date" style="display:flex;flex-direction:column;align-items:center;">
                <div class="post-date-area" style="width:fit-content;height:fit-content;display:flex;flex-direction:column;align-items:center;background-color: rgba(0, 0, 0, 0.075);padding:5px;border:0.75px solid darkgray;border-radius:25%;">
                    <p style="font-size:0.8rem;margin-bottom:0px !important;">${formatPostDate(post)}</p>
                    <p style="font-size:0.8rem;margin-bottom:0px !important;">${formatPostHour(post)}</p>
                </div>
                <p class="${post.edited === 1 ? '' : 'invisible'}" style="font-size:0.8rem;margin-bottom:0px !important;margin-top:5px !important;">Edited</p>
            </div>
        </div>
    `;


        const editButton = postCard.querySelector('.edit-post');
        const deleteButton = postCard.querySelector('.delete-post');

        // Add click event listeners to the buttons
        editButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default anchor behavior
            handleEditPost(post); // Call the edit post handler with post data
        });

        deleteButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default anchor behavior
            handleDeletePost(post, postCard); // Call the delete post handler with post ID
        });
    });
    

    setTimeout(() => {
        cancelButton.click(); // Simulate a click on the cancel button
    }, 3000);
}

async function handleEditPost(post){
        window.location.href = `/edit-post/${post.id}`;
}

function formatPostDate(post) {
    const postDate = new Date(post.date);
    const now = new Date();

    // Get the start of today and yesterday
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfYesterday = new Date(now);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    startOfYesterday.setHours(0, 0, 0, 0);

    // Get the current week's start and end dates
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Check if the postDate is today
    if (postDate >= startOfToday && postDate < now) {
        return 'Today';
    }

    // Check if the postDate is yesterday
    if (postDate >= startOfYesterday && postDate < startOfToday) {
        return 'Yesterday';
    }

    // Check if the postDate is within the current week
    if (postDate >= startOfWeek && postDate <= endOfWeek) {
        // If in the current week, display the weekday
        const weekday = postDate.toLocaleDateString('en-US', { weekday: 'long' });
        return `${weekday}`;
    } else {
        // If not in the current week, display full date
        const date = postDate.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        });
        return date;
    }
}


function formatPostHour(post){
    const postDate = new Date(post.date);
    const time = postDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // 24-hour format
    });

    return time;
}