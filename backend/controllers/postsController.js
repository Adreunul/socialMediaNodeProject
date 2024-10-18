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
}

export default {
    getAllPosts,
    
}