import "./header.js";

let currentUserId = null;
let orderingFilter = "mostRecent";
let postsFilter = "allPosts";

const postsContainer = document.getElementById("posts-container");

document.addEventListener("DOMContentLoaded", async () => {

  try {
    const response = await fetch("/api/v1/auth/session");
    if (response.ok) {
      const sessionData = await response.json();
      currentUserId = sessionData.userId;
    } else {
      console.error("Failed to fetch session");
      return;
    }
  } catch (error) {
    console.error("Failed to fetch session", error);
  }

  // try {
  //   const response = await fetch("/api/v1/posts/getAllPosts");
  //   if (response.ok) {
  //     const posts = await response.json();
  //     console.log(posts);
  //     displayPosts(posts, postsContainer);
  //   } else {
  //     console.error("Failed to fetch posts");
  //     postsContainer.innerHTML = "<p>No posts available</p>";
  //   }
  // } catch (error) {
  //   console.error("Failed to fetch posts", error);
  //   postsContainer.innerHTML =
  //     "<p>Error loading posts. Please try again later.</p>";
  // }

  requestPosts();
});

const filterMostRecentButton = document.getElementById("most-recent-filter-button");
const filterMostPopularButton = document.getElementById("most-popular-filter-button");
const dropdownMenu = document.getElementById("dropdown-menu");
const allPostsButton = document.getElementById("all-posts-filter-button");
const myPostsButton = document.getElementById("my-posts-filter-button");

filterMostRecentButton.addEventListener("click", async (event) => {
  if(orderingFilter !== "mostRecent") {
    filterMostPopularButton.classList.toggle("filtering-button-pressed");
      filterMostRecentButton.classList.toggle("filtering-button-pressed");
      orderingFilter = "mostRecent";
      requestPosts();
    }
});

filterMostPopularButton.addEventListener("click", async (event) => {
    if(orderingFilter !== "mostPopular") {
      filterMostPopularButton.classList.toggle("filtering-button-pressed");
      filterMostRecentButton.classList.toggle("filtering-button-pressed");
      orderingFilter = "mostPopular";
      requestPosts();
    }
});

allPostsButton.addEventListener("click", async (event) => {
  if(postsFilter !== "allPosts") {
    dropdownMenu.innerText = "All Posts";
    postsFilter = "allPosts";
    requestPosts();
  }
});

myPostsButton.addEventListener("click", async (event) => {
  if(postsFilter !== "myPosts") {
    dropdownMenu.innerText = "My Posts";
    postsFilter = "myPosts";
    requestPosts();
  }
});

async function requestPosts() {
  try {    
    const response = await fetch(`/api/v1/posts/getPostsByFilter/${orderingFilter}/${postsFilter}/${currentUserId}`);
    if (response.ok) {
      const posts = await response.json();
      displayPosts(posts);
    } else {
      console.error("Failed to fetch posts");
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch posts", error);
    return null;
  }
}

async function displayPosts(posts) {
  postsContainer.innerHTML = "";

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const postCard = document.createElement("div");
    postCard.className = "card";
    postCard.style.width = "35rem";
    postCard.style.minWidth = "300px";
    console.log("post user ID: " + post.id_author);
    console.log("current user ID: " + currentUserId);

    var userHasLiked = false;
    var userHasDisliked = false;
    if (post.id_author === currentUserId) {
        userHasLiked = true;
        userHasDisliked = false;
    } else {
        const userInteraction = await getUserHasLiked(post.post_id);
        if (userInteraction === 1) {
            userHasLiked = true;
            userHasDisliked = false;
        } else if (userInteraction === 0) {
            userHasLiked = false;
            userHasDisliked = true;
        }
    }

    postCard.innerHTML = `
    <div class="card-body">
        <h5 class="text card-title" style="text-align: center; font-size: 1.35rem;">
            ${post.title}
        </h5>
        <hr class="title-underline">
        <p class="text card-text">
            ${post.text}
        </p>
        <hr class="content-underline">


            <div class="post-info-container" style="display: flex; justify-content: space-between;">
                <div class="post-interaction-container" style="display: flex;">
                    <button class="post-interaction-button like-button ${userHasLiked ? "post-like-button-pressed" : ""}" style="background-color: #dfdfdfc9; color: #d15400d8;">
                        &#x21e7
                    </button>
                    <button class="post-interaction-button dislike-button ${userHasDisliked ? "post-dislike-button-pressed" : ""}" style="background-color: #d15400d8; color: #dfdfdfc9;">
                        &#x21e9
                    </button>

                    <div class="post-interaction-count-container" style="display: flex; flex-direction: column; align-items: center;">
                        <p class="post-interaction-info post-interaction-count" style="margin-bottom: 0px !important;">
                            ${post.reactions_number} ${post.reactions_number == 1 ? "reaction" : "reactions"}
                        </p>

                        <p class="post-interaction-info post-interaction-percentage" style="margin-bottom: 0px !important;">
                            ${post.agree_percentage}% agree
                        </p>
                    </div>
                </div>

                <div class="post-date-and-author-container" style="display: flex; flex-direction: column; align-items: center;width:50%;">

                <div class="post-date" style="display: flex; flex-direction: column; align-items: center;margin-bottom:10px;">
                    <div class="post-date-area" style="width: fit-content; height: fit-content; display: flex; flex-direction: column; align-items: center; background-color: rgba(0, 0, 0, 0.075); padding: 5px; border: 0.75px solid darkgray; border-radius: 25%;min-width:80px;">
                        <p style="font-size: 0.8rem; margin-bottom: 0px !important;">
                            ${formatPostDate(post)}
                        </p>
                        <p style="font-size: 0.8rem; margin-bottom: 0px !important;">
                            ${formatPostHour(post)}
                        </p>
                    </div>
                </div>

                <div class="author-info" style="display: flex; flex-direction: column; align-items: center;">
                <h6 class="author" style="text-align: center;">
                    Written by: ${post.username}
                </h6>
                <div class="author-buttons" style="margin-bottom: 10px !important;">
                    <a href="#" class="edit-post card-link ${post.id_author === currentUserId ? "" : "invisible"}">Edit</a>
                    <a href="#" class="delete-post card-link ${post.id_author === currentUserId ? "" : "invisible"}">Delete</a>
                </div>
                <p class="${post.edited === 1 ? "" : "invisible"}" style="font-size: 0.8rem; margin-bottom: 0px !important; margin-top: 5px !important;">
                        Edited
                    </p>
                </div>

                </div>

                <div class="post-comment-button-container" style="display:flex;flex-direction:row-reverse;">
                  <button class="comment-button" style="color: black;">
                      <img src="/img/commentButton.png" alt="comment button" style="width: 50px; height: 50px;">
                  </button>
                </div>
            </div>
    </div>
`;

    const editButton = postCard.querySelector(".edit-post");
    const deleteButton = postCard.querySelector(".delete-post");
    const likeButton = postCard.querySelector(".like-button");
    const dislikeButton = postCard.querySelector(".dislike-button");
    const commentButton = postCard.querySelector(".comment-button");

    if (post.id_author !== currentUserId) {
        likeButton.addEventListener("click", async (event) => {
            likeButton.classList.toggle("post-like-button-pressed");

            if (dislikeButton.classList.contains("post-dislike-button-pressed")){
                dislikeButton.classList.remove("post-dislike-button-pressed");
                toggleUserReaction(post.post_id, currentUserId, 1);
                return;
            }

            if(likeButton.classList.contains("post-like-button-pressed")){
                setUserReaction(post.post_id, currentUserId, 1);
            } else {
                deleteUserReaction(post.post_id, currentUserId);
            }
        });

        dislikeButton.addEventListener("click", async (event) => {
            dislikeButton.classList.toggle("post-dislike-button-pressed");

            if (likeButton.classList.contains("post-like-button-pressed")){
                likeButton.classList.remove("post-like-button-pressed");
                toggleUserReaction(post.post_id, currentUserId, 0);
                return;
            }

            if(dislikeButton.classList.contains("post-dislike-button-pressed")){
                setUserReaction(post.post_id, currentUserId, 0);
            } else {
                deleteUserReaction(post.post_id, currentUserId);
            }
        });
    } else {
        likeButton.classList.add("post-like-button-pressed");
    }

    commentButton.addEventListener("click", (event) => {
        event.preventDefault();
        handleCommentPost(post);
    });

    // Add click event listeners to the buttons
    editButton.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent default anchor behavior
        handleEditPost(post); // Call the edit post handler with post data
    });

    deleteButton.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent default anchor behavior
        handleDeletePost(post, postCard, userHasLiked, userHasDisliked); // Call the delete post handler with post ID
    });

    postsContainer.appendChild(postCard);
}

}

async function handleDeletePost(post, postCard, userHasLiked, userHasDisliked) {
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

  const confirmButton = postCard.querySelector(".confirm-delete");
  const cancelButton = postCard.querySelector(".stop-delete");

  confirmButton.addEventListener("click", async (event) => {
    try {
      const response = await fetch(`/api/v1/posts/deletePost/${post.post_id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        window.location.reload();
      } else {
        alert(data.message);
        console.error("Failed to delete post mf");
      }
    } catch (error) {
      console.error("Failed to delete post 2", error);
    }
  });

  cancelButton.addEventListener("click", (event) => {
    event.preventDefault();
    postCard.innerHTML = `
    <div class="card-body">
        <h5 class="text card-title" style="text-align: center; font-size: 1.35rem;">
            ${post.title}
        </h5>
        <hr class="title-underline">
        <p class="text card-text">
            ${post.text}
        </p>
        <hr class="content-underline">


            <div class="post-info-container" style="display: flex; justify-content: space-between;">
                <div class="post-interaction-container" style="display: flex;">
                    <button class="post-interaction-button like-button ${userHasLiked ? "post-like-button-pressed" : ""}" style="background-color: #dfdfdfc9; color: #d15400d8;">
                        &#x21e7
                    </button>
                    <button class="post-interaction-button dislike-button ${userHasDisliked ? "post-dislike-button-pressed" : ""}" style="background-color: #d15400d8; color: #dfdfdfc9;">
                        &#x21e9
                    </button>

                    <div class="post-interaction-count-container" style="display: flex; flex-direction: column; align-items: center;">
                        <p class="post-interaction-info post-interaction-count" style="margin-bottom: 0px !important;">
                            ${post.reactions_number} ${post.reactions_number == 1 ? "reaction" : "reactions"}
                        </p>

                        <p class="post-interaction-info post-interaction-percentage" style="margin-bottom: 0px !important;">
                            ${post.agree_percentage}% agree
                        </p>
                    </div>
                </div>

                <div class="post-date-and-author-container" style="display: flex; flex-direction: column; align-items: center;width:50%;">

                <div class="post-date" style="display: flex; flex-direction: column; align-items: center;margin-bottom:10px;">
                    <div class="post-date-area" style="width: fit-content; height: fit-content; display: flex; flex-direction: column; align-items: center; background-color: rgba(0, 0, 0, 0.075); padding: 5px; border: 0.75px solid darkgray; border-radius: 25%;min-width:80px;">
                        <p style="font-size: 0.8rem; margin-bottom: 0px !important;">
                            ${formatPostDate(post)}
                        </p>
                        <p style="font-size: 0.8rem; margin-bottom: 0px !important;">
                            ${formatPostHour(post)}
                        </p>
                    </div>
                </div>

                <div class="author-info" style="display: flex; flex-direction: column; align-items: center;">
                <h6 class="author" style="text-align: center;">
                    Written by: ${post.username}
                </h6>
                <div class="author-buttons" style="margin-bottom: 10px !important;">
                    <a href="#" class="edit-post card-link ${post.id_author === currentUserId ? "" : "invisible"}">Edit</a>
                    <a href="#" class="delete-post card-link ${post.id_author === currentUserId ? "" : "invisible"}">Delete</a>
                </div>
                <p class="${post.edited === 1 ? "" : "invisible"}" style="font-size: 0.8rem; margin-bottom: 0px !important; margin-top: 5px !important;">
                        Edited
                    </p>
                </div>

                </div>

                <div class="post-comment-button-container" style="display:flex;flex-direction:row-reverse;">
                  <button class="comment-button" style="color: black;">
                      <img src="/img/commentButton.png" alt="comment button" style="width: 50px; height: 50px;">
                  </button>
                </div>
            </div>
    </div>
`;

    const editButton = postCard.querySelector(".edit-post");
    const deleteButton = postCard.querySelector(".delete-post");
    const likeButton = postCard.querySelector(".like-button");
    const dislikeButton = postCard.querySelector(".dislike-button");
    const commentButton = postCard.querySelector(".comment-button");

    if (post.id_author !== currentUserId) {
        likeButton.addEventListener("click", async (event) => {
            likeButton.classList.toggle("post-like-button-pressed");

            if (dislikeButton.classList.contains("post-dislike-button-pressed")){
                dislikeButton.classList.remove("post-dislike-button-pressed");
                toggleUserReaction(post.post_id, currentUserId, 1);
                return;
            }

            if(likeButton.classList.contains("post-like-button-pressed")){
                setUserReaction(post.post_id, currentUserId, 1);
            } else {
                deleteUserReaction(post.post_id, currentUserId);
            }
        });

        dislikeButton.addEventListener("click", async (event) => {
            dislikeButton.classList.toggle("post-dislike-button-pressed");

            if (likeButton.classList.contains("post-like-button-pressed")){
                likeButton.classList.remove("post-like-button-pressed");
                toggleUserReaction(post.post_id, currentUserId, 0);
                return;
            }

            if(dislikeButton.classList.contains("post-dislike-button-pressed")){
                setUserReaction(post.post_id, currentUserId, 0);
            } else {
                deleteUserReaction(post.post_id, currentUserId);
            }
        });
    } else {
        likeButton.classList.add("post-like-button-pressed");
    }

    commentButton.addEventListener("click", (event) => {
        event.preventDefault();
        handleCommentPost(post);
    });

    // Add click event listeners to the buttons
    editButton.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent default anchor behavior
        handleEditPost(post); // Call the edit post handler with post data
    });

    deleteButton.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent default anchor behavior
        handleDeletePost(post, postCard, userHasLiked, userHasDisliked); // Call the delete post handler with post ID
    });
  });

  setTimeout(() => {
    cancelButton.click(); // Simulate a click on the cancel button
  }, 3000);
}

async function handleEditPost(post) {
  console.log("edit post:" + post.post_id) ;
  window.location.href = `/edit-post/${post.post_id}`;
}

async function handleCommentPost(post) {
  console.log("comment post:" + post.post_id) ;
  window.location.href = `/comment-post/${post.post_id}`;
}

async function getUserHasLiked(postId) {
  try {
    console.log("eu asa trimit post id: " + postId);
    console.log("eu asa trimit user id: " + currentUserId);
    const response = await fetch('/api/v1/posts/getUserHasLiked/' + postId + '/' + currentUserId);

    const data = await response.json();

    if (response.ok && data.userInteraction !== null) {
      return data.userInteraction;
    } else
      return null;
  } catch(error) {
    console.error("Failed to get user has liked", error);
  }
  
}

async function setUserReaction(postId, userId, reaction) {
  try {
    const response = await fetch('/api/v1/posts/setUserReaction/' + postId + '/' + userId + '/' + reaction, {
      method: "POST",
    });

    const data = await response.json();

    if (response.ok && data.status === "success") {
      return data;
    } else {
      console.error("Failed to set user reaction");
    }
  } catch(error) {
    console.error("Failed to set user reaction", error);
  }
}

async function toggleUserReaction(postId, userId, reaction) {
  try{
    const response = await fetch('/api/v1/posts/toggleUserReaction/' + postId + '/' + userId + '/' + reaction, {
      method: "PATCH",
    });

    const data = await response.json();

    if (response.ok && data.status === "success") {
      return data;
    } else {
      console.error("Failed to toggle user reaction");
    }
   } catch(error) {
    console.error("Failed to toggle user reaction", error);
   }
}

async function deleteUserReaction(postId, userId) {
  try{
    const response = await fetch('/api/v1/posts/deleteUserReaction/' + postId + '/' + userId, {
      method: "DELETE",
    });

    const data = await response.json();

    if (response.ok && data.status === "success") {
      return data;
    } else {
      console.error("Failed to delete user reaction");
    }
  } catch(error) {
    console.error("Failed to delete user reaction", error);
  }
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
    return "Today";
  }

  // Check if the postDate is yesterday
  if (postDate >= startOfYesterday && postDate < startOfToday) {
    return "Yesterday";
  }

  // Check if the postDate is within the current week
  if (postDate >= startOfWeek && postDate <= endOfWeek) {
    // If in the current week, display the weekday
    const weekday = postDate.toLocaleDateString("en-US", { weekday: "long" });
    return `${weekday}`;
  } else {
    // If not in the current week, display full date
    const date = postDate.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    return date;
  }
}

function formatPostHour(post) {
  const postDate = new Date(post.date);
  const time = postDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 24-hour format
  });

  return time;
}
