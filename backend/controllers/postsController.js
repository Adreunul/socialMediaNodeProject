import Post from '../models/postModel.js';

export const getAllPosts = async (req, res) => {
    try {
        var posts = await Post.getAllPosts();
        console.log(posts);
        posts = await formatReactionsNumber(posts);
        res.json(posts);
    } catch (error) {
        console.error("Error getting posts", error);
        res.status(500).send('Internal server error');
    }
};

export const getPostsByFilter = async (req, res) => {
    try {
        const orderFilter = req.params.order_filter;
        const postFilter = req.params.post_filter;
        const currentUserId = req.params.current_user_id;

        var order_filter = "";
        if(orderFilter === "mostRecent") 
            order_filter = "post_id";
          else
            order_filter = "reactions_number";

        var posts = await Post.getPostsByFilter(order_filter, postFilter, currentUserId);
        posts = await formatReactionsNumber(posts);
        res.json(posts);
    } catch (error) {
        console.error("Error getting posts", error);
        res.status(500).send('Internal server error');
    }
};

export const getPostById = async (req, res) => {
    const id = req.params.id;
    console.log("id: "+id);

    try {
        var post = await Post.getPostById(id);
        post = await formatReactionsNumber(post);
        res.status(200).json(post);
    }   catch (error) {
        console.error("Error getting post", error);
        res.status(500).json({ status: 'error', message: 'Failed to get post' });
    }
};

export const writeNewPost = async (req, res) => {
    const { title, text, id_author } = req.body;

    if(!title || !text) {
        return res.status(400).json({ status: 'error', message: 'All fields are required', field: 'all' });
    }

    var check = await checkPost(title, text);
    console.log("check: "+check);
    if(check == "title")
        return res.status(400).json({ status: 'error', message: 'Title is too long (maximum 10 words)', field: 'title' });
    else if(check == "text")
        return res.status(400).json({ status: 'error', message: 'You wrote too much (maximum 100 words)', field: 'text' });

    try { 
        const time = new Date();
        const year = time.getFullYear();
        const month = String(time.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(time.getDate()).padStart(2, '0');
        const hours = String(time.getHours()).padStart(2, '0');
        const minutes = String(time.getMinutes()).padStart(2, '0');

        const currentTime = `${year}-${month}-${day} ${hours}:${minutes}`;

        const response = await Post.createPost(title, text, currentTime, id_author);
        console.log("response: "+response);
        if(response && typeof response === 'number')
            return res.status(201).json({ status: 'success', message: 'Post created' });
        else if(response === 'title')
            return res.status(400).json({ status: 'error', message: 'This title has already been used', field: 'title' });
        else
            return res.status(500).json({ status: 'error', message: 'Failed to create post' });
    } catch (error) {
        console.error("Error creating post", error);
        res.status(500).send('Internal server error');
    }
};

export const editPost = async (req, res) => {
    const { id, text } = req.body;

    if(!text) {
        return res.status(400).json({ status: 'error', message: 'All fields are required', field: 'all' });
    }

    if(text.split(" ").length > 100 || text.length > 1200)
        return res.status(400).json({ status: 'error', message: 'You wrote too much (maximum 100 words)', field: 'text' });

    try {
        const response = await Post.updatePost(id, text);
        if(response)
            return res.status(200).json({ status: 'success', message: 'Post updated' });
        else
            return res.status(500).json({ status: 'error', message: 'Failed to update post' });
    } catch (error) {
        console.error("Error updating post", error);
        res.status(500).send('Internal server error');
    }
};

export const deletePost = async (req, res) => {
    const id = req.params.id;
    console.log("id: "+id);

    try {
        const response = await Post.deletePost(id);
        if(response)
            return res.status(200).json({ status: 'success', message: 'Post deleted' });
        else
            return res.status(500).json({ status: 'error', message: 'Failed to delete post' });
    } catch (error) {
        console.error("Error deleting post", error);
        res.status(500).send('Internal server error');
    }
};

export const getUserHasLiked = async (req, res) => {
    const id_post = req.params.id_post;
    const id_user = req.params.id_user;

    try {
        const userInteraction = await Post.getUserHasLiked(id_post, id_user);
        res.status(200).json({ status: 'success', userInteraction : userInteraction });
    } catch (error) {
        console.error("Error getting user interaction", error);
        res.status(500).json({ status: 'error', message: 'Failed to get user interaction' });
    }
};

export const setUserReaction = async (req, res) => {
    const id_post = req.params.id_post;
    const id_user = req.params.id_user;
    const likes = req.params.likes;

    console.log("id_post: "+id_post);
    console.log("id_user: "+id_user);
    console.log("likes: "+likes);

    try{
        const response = await Post.setUserReaction(id_post, id_user, likes);
        if(response)
            return res.status(200).json({ status: 'success', message: 'User reaction added' });
        else
            return res.status(500).json({ status: 'error', message: 'Failed to add user reaction' });
    } catch (error) {
        console.error("Error setting user reaction", error);
        res.status(500).json({ status: 'error', message: 'Failed to add user reaction' });
    }
}

export const editUserReaction = async (req, res) => {
    const id_post = req.params.id_post;
    const id_user = req.params.id_user;
    const likes = req.params.likes;


    try {
        const response = await Post.editUserReaction(id_post, id_user, likes);
        if(response)
            return res.status(200).json({ status: 'success', message: 'User reaction updated' });
        else
            return res.status(500).json({ status: 'error', message: 'Failed to update user reaction' });
    } catch (error) {
        console.error("Error updating user reaction", error);
        res.status(500).json({ status: 'error', message: 'Failed to update user reaction' });
    }
};

export const deleteUserReaction = async (req, res) => {
    const id_post = req.params.id_post;
    const id_user = req.params.id_user;

    try {
        const response = await Post.deleteUserReaction(id_post, id_user);
        if(response)
            return res.status(200).json({ status: 'success', message: 'User reaction deleted' });
        else
            return res.status(500).json({ status: 'error', message: 'Failed to delete user reaction' });
    } catch (error) {
        console.error("Error deleting user reaction", error);
        res.status(500).json({ status: 'error', message: 'Failed to delete user reaction' });
    }
};

function checkPost(title, content){  
    if(title.split(" ").length > 10 || title.length > 100)
        return "title";
    if(content.split(" ").length > 100 || content.length > 1200)
        return "text";

    return null;
}

async function formatReactionsNumber(posts) {
    for(var i = 0; i < posts.length; i++) {
        if(posts[i].reactions_number == 0) {
            posts[i].reactions_number = "1";
            continue;
        }
        else if(posts[i].reactions_number < 5) {
            posts[i].reactions_number = "< 5";
            continue;
        }
        else if(posts[i].reactions_number < 10) {
            posts[i].reactions_number = "< 10";
            continue;
        }
        else if(posts[i].reactions_number > 10){
            posts[i].reactions_number = "> 10";
            continue;
        }
        else if(posts[i].reactions_number > 100){
            posts[i].reactions_number = "> 100";
            continue
        }
        else if(posts[i].reactions_number > 1000){
            posts[i].reactions_number = "> 1000";
            continue
        }
        else if(posts[i].reactions_number > 10000){
            posts[i].reactions_number = "> 10.000";
            continue
        }
    }

    return posts;
}

export default {
    getAllPosts,
    getPostsByFilter,
    getPostById,
    writeNewPost,
    editPost,
    deletePost,
    getUserHasLiked,
    setUserReaction,
    editUserReaction,
    deleteUserReaction
}