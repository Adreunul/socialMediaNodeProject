import Post from '../models/postModel.js';

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.getAllPosts();
        console.log(posts);
        res.json(posts);
    } catch (error) {
        console.error("Error getting posts", error);
        res.status(500).send('Internal server error');
    }
};

export const writeNewPost = async (req, res) => {
    const { title, text, id_author } = req.body;

    if(!title || !text) {
        return res.status(400).json({ status: 'error', message: 'All fields are required', field: 'all' });
    }

    var check = await checkPost(title, text);
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

 function checkPost(title, content){
    var space = false;
    for(let i = 0; i < title.length; i++) {
        if(title[i] == " " && space == false) {
            space = true;
            continue;
        } else if(title[i] == " " && space == true) {
            title[i] = "";
            continue;
        }
        space = false;
    }
    
    if(title.split(" ").length > 10 || title.length > 50)
        return "title";
    if(content.split(" ").length > 100 || content.length > 1200)
        return "text";

    return null;
}

export default {
    getAllPosts,
    writeNewPost,
    deletePost,
    
}