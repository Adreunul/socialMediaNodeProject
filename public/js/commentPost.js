import "./header.js";

let currentUserId = null;
let postId = null;

const url = window.location.href;
postId = url.split('/').pop();

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/v1/auth/session');
        if(response.ok) {
            const sessionData = await response.json();
            currentUserId = sessionData.userId;
        }
        else {
            console.error('Failed to fetch session');
            return;
        }
    } catch(error) {
        console.error('Failed to fetch session', error);
    }

    try{
        const response = await fetch('/api/v1/posts/getPostById/' + postId);
        if(response.ok) {
            const data = await response.json();
            console.log(data);
            await displayPost(data[0]);
            try{
                //displayComments(data);
                const response = await fetch('/api/v1/comments/getCommentsByPostId/' + postId);
                if(response.ok) {
                    const data = await response.json();
                    console.log(data);
                    await displayComments(data.comments);
                }
            } catch (error) {
                console.error('Failed to fetch comments', error);
            }
        }
    } catch(error) {
        console.error('Failed to fetch post', error);
    }
});

async function displayPost(post) {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = "";
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
        const userInteraction = await getUserHasLiked(post.post_id, "post");
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



                </div>

                <div class="author-info" style="display: flex; flex-direction: column; align-items: center;">
                    <h6 class="author" style="text-align: center;">
                        Written by: ${post.username}
                    </h6>
                    <p class="${post.edited === 1 ? "" : "invisible"}" style="font-size: 0.8rem; margin-bottom: 0px !important; margin-top: 5px !important;">
                        Edited
                    </p>
                </div>
            </div>
        <hr class="content-underline" style="margin-bottom:0px !important;height:.5px !important;">

        <div class="comment-section-label-container" style="display: flex; justify-content: center;">
            <h4 class="comment-section-label" style="text-align: center;">Comments</h4>
        </div>

        <div class="comments-container" style="display: flex; flex-direction: column; align-items: center;">
            <div id="comment-section" class="comment-section" style="display: flex; flex-direction: column; align-items: center;">
        
            </div>
        </div>
    </div>
`;

    const likeButton = postCard.querySelector(".like-button");
    const dislikeButton = postCard.querySelector(".dislike-button");

    if (post.id_author !== currentUserId) {
        likeButton.addEventListener("click", async (event) => {
            likeButton.classList.toggle("post-like-button-pressed");

            if (dislikeButton.classList.contains("post-dislike-button-pressed")){
                dislikeButton.classList.remove("post-dislike-button-pressed");
                toggleUserReaction(post.post_id, currentUserId, 1);
                return;
            }

            if(likeButton.classList.contains("post-like-button-pressed")){
                setUserReaction(post.post_id, currentUserId, 1, "post");
            } else {
                deleteUserReaction(post.post_id, currentUserId, "post");
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
                setUserReaction(post.post_id, currentUserId, 0, "post");
            } else {
                deleteUserReaction(post.post_id, currentUserId, "post");
            }
        });
    } else {
        likeButton.classList.add("post-like-button-pressed");
    }

    postsContainer.appendChild(postCard);
}

async function displayComments(comments) {
    const commentsContainer = document.getElementById('comment-section');
    commentsContainer.innerHTML = ``;
    
    const writeNewCommentCard = document.createElement("div");   // new comm card
        writeNewCommentCard.className = "card comment-card";
        writeNewCommentCard.style.width = "50%!important";
        writeNewCommentCard.style.minWidth = "50px";
        writeNewCommentCard.style.marginTop = "10px";

        toggleUserToComment("button", writeNewCommentCard);

        var writeNewCommentButton = writeNewCommentCard.querySelector(".write-new-comment-button");
        writeNewCommentButton.addEventListener("click", async (event) => {
            toggleUserToComment("comment", writeNewCommentCard);
        });
        commentsContainer.appendChild(writeNewCommentCard);

    if(comments != null){ //if there are comms
        for(let i = 0; i < comments.length; i++) { //we show them all
        console.log("comment id: " + comments[i].comment_id + "comment likes: " + comments[i].likes);
        const comment = comments[i];
        const commentCard = document.createElement("div");
        commentCard.className = "card comment-card";
        commentCard.style.width = "100%";
        commentCard.style.minWidth = "50px";
        commentCard.style.marginTop = "10px";

        var userHasLiked = await getUserHasLiked(comment.comment_id, "comment");

        commentCard.innerHTML = `
    <div class="card-body" style="background-color: #ff9854bd;padding-bottom:0px !important;">
        <p class="text card-text">
            ${comment.text}
        </p>
        <hr class="content-underline" style="margin-bottom:5px !important;">
        <div class="post-date-and-author-container" style="display: flex; flex-direction: column; align-items: center; width: 100%;">
            <h6 class="author" style="text-align: center;">
                ${comment.username}
            </h6>

            <!-- Button with counter -->
            <button class="post-interaction-button like-button ${userHasLiked ? "post-like-button-pressed" : ""}" style="position: relative; background-color: #e2dcd9a8; color: black; width: 55px; height: 55px; text-align: center; margin-bottom: 2px; border: 1px solid black;">
                &#x21e7

                <!-- Counter in the top-right corner -->
                <p class="like-counter" style="position: absolute; top: 2px; right: 2px; font-size: 12px; color: black; margin: 0;">
                    ${comment.likes}
                </p>
            </button>
        </div>
    </div>
`;

    const likeButton = commentCard.querySelector(".like-button");
    const likeCounter = commentCard.querySelector(".like-counter");

    likeButton.addEventListener("click", async (event) => {
        likeButton.classList.toggle("post-like-button-pressed");

        if(likeButton.classList.contains("post-like-button-pressed")) {
            setUserReaction(comment.comment_id, currentUserId, 1, "comment");
            console.log("comment likes: " + comment.likes);
            if(comment.likes == 0) {
                likeCounter.textContent = parseInt(likeCounter.textContent) + 1;
            }
        }
        else {
            deleteUserReaction(comment.comment_id, currentUserId, "comment");
            if(likeCounter.textContent === "1")
                likeCounter.textContent = parseInt(likeCounter.textContent) - 1;
        }
        
    
        // if(likeButton.classList.contains("post-like-button-pressed")){
        //     setUserReaction(post.post_id, currentUserId, 1);
        // } else 
        //     deleteUserReaction(post.post_id, currentUserId);
        });
        
        commentsContainer.appendChild(commentCard);
        }
    }
    else{ //if there are no comms
        const commentCard = document.createElement("div"); //we show a message
        commentCard.className = "card comment-card";
        commentCard.style.width = "100%";
        commentCard.style.minWidth = "50px";
        commentCard.style.marginTop = "10px";

        commentCard.innerHTML = `
        <div class="card-body" style="background-color: #ff9854bd;padding-bottom:0px !important;">
        <p class="text card-text">
            No comments have been posted yet.
        </p>
        <hr class="content-underline" style="margin-bottom:5px !important;">
        </div>
    `;
        commentsContainer.appendChild(commentCard);
    }
}

async function toggleUserToComment(toggleTo, writeNewCommentCard) {
    if(toggleTo === "comment") {
        writeNewCommentCard.innerHTML = `
        <div class="card-body" style="background-color: #ff985499;display:flex;flex-direction:column;justify-content:center;align-items:center;min-height:2rem;padding-bottom:5px !important">
        <textarea class="write-new-comment-textarea" style="width:100%;min-height:50%;height:100px;border:2px solid black;border-radius:5%;margin-bottom:5px;"></textarea>
        <button class="write-new-comment-submit-button" style="width:40%;height:30%;background-color:#ff9854bd;border:2px solid black;border-radius:5%;">
            Submit
        </button>
        <button class="cancel-new-comment-button" style="width:30%;height:15%;background-color:#ff9854bd;border:1px solid black;border-radius:5%;margin-top:3px;font-size:.75rem;">
            Cancel
        </button>
        </div>
        `;
        var submitNewCommentButton = writeNewCommentCard.querySelector(".write-new-comment-submit-button");
        submitNewCommentButton.addEventListener("click", async (event) => {
            const commentText = writeNewCommentCard.querySelector(".write-new-comment-textarea").value;
            if(commentText === "") {
                alert("Comment cannot be empty!");
                return;
            }
            console.log("user id:" + currentUserId);
            const comment = {
                text: commentText,
                post_id: postId,
                user_id:currentUserId
            };
            try {
                const response = await fetch('/api/v1/comments/writeComment', {
                    method: "POST",
                    header: {
                        "Content-Type": "application/json",
                    },
                    body: new URLSearchParams(comment),
                });

                const data = await response.json();

                if(response.ok && data.status === "success") {
                    console.log("Comment written successfully");
                    window.location.reload();
                } else{
                    console.error("Failed to write comment");
                }
            }catch(error) {
                console.error("Failed to write comment", error);
            }
        });

        var cancelNewCommentButton = writeNewCommentCard.querySelector(".cancel-new-comment-button");
        cancelNewCommentButton.addEventListener("click", async (event) => {
            toggleUserToComment("button", writeNewCommentCard);
        });
    }
    else if(toggleTo === "button") {
        writeNewCommentCard.innerHTML = `
        <div class="card-body" style="background-color: #ff985499;display:flex;justify-content:center;align-items:center;">
        <button class="write-new-comment-button" style="with:50%;height:25%;">
            Write a comment...
        </button>
        <hr class="content-underline" style="margin-bottom:5px !important;">
        </div>
        `;
        var writeNewCommentButton = writeNewCommentCard.querySelector(".write-new-comment-button");
        writeNewCommentButton.addEventListener("click", async (event) => {
            toggleUserToComment("comment", writeNewCommentCard);
        });
    }

}

async function getUserHasLiked(Id, whatToLike) {
    if(whatToLike === "post") {
        try {
        const response = await fetch('/api/v1/posts/getUserHasLiked/' + Id + '/' + currentUserId);
  
        const data = await response.json();
  
        if (response.ok && data.userInteraction !== null) {
            return data.userInteraction;
        } else
            return null;
        } catch(error) {
        console.error("Failed to get user has liked", error);
        }
    } else if(whatToLike === "comment") {
        try{
            const response = await fetch('/api/v1/comments/getUserHasLiked/' + Id + '/' + currentUserId);
            console.log("post id: " + Id + " user id: " + currentUserId);
            const data = await response.json();

            if(response.ok && data.userInteraction !== null) {
                return data.userInteraction;
            } else{
                return null;
            }
        } catch(error){
            console.error("Failed to get user has liked", error);
        }
    }
    
  }
  
  async function setUserReaction(Id, userId, reaction, reactTo) {
    if(reactTo === "post") {
        try {
        const response = await fetch('/api/v1/posts/setUserReaction/' + Id + '/' + userId + '/' + reaction, {
            method: "POST",
        });
  
        const data = await response.json();
  
        if (response.ok && data.status === "success") {
            return true;
        } else {
            console.error("Failed to set user reaction");
        }
    } catch(error) {
      console.error("Failed to set user reaction", error);
    }
    } else if(reactTo === "comment") { 
        try{
            const response = await fetch('/api/v1/comments/setUserReaction/' + Id + '/' + userId, {
                method: "POST",
            });
            const data = await response.json();

            if(response.ok && data.status === "success") {
                return true;
            } else {
                console.error("Failed to set user reaction");
            }
        } catch(error) {
            console.error("Failed to set user reaction", error);
        }
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
  
  async function deleteUserReaction(Id, userId, reactionTo) {
    if(reactionTo === "post") {
        try{
            const response = await fetch('/api/v1/posts/deleteUserReaction/' + Id + '/' + userId, {
              method: "DELETE",
            });
        
            const data = await response.json();
        
            if (response.ok && data.status === "success") {
              return true;
            } else {
              console.error("Failed to delete user reaction");
            }
          } catch(error) {
            console.error("Failed to delete user reaction", error);
          }
    } else if(reactionTo === "comment") {
        try{
            const response = await fetch('/api/v1/comments/deleteUserReaction/' + Id + '/' + userId, {
              method: "DELETE",
            });
        
            const data = await response.json();
        
            if (response.ok && data.status === "success") {
              return true;
            } else {
              console.error("Failed to delete user reaction");
            }
          } catch(error) {
            console.error("Failed to delete user reaction", error);
          }
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
  