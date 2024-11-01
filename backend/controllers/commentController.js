import Comment from '../models/commentModel.js';

export const getCommentsByPostId = async (req, res) => {
    const id = req.params.id;
    try{
        const comments = await Comment.getCommentsByPostId(id);
        res.status(200).json({ status: 'success', comments : comments });
    } catch (error) {
        console.error("Error getting comments", error);
        res.status(500).json({ status: 'error', message: 'Failed to get comments' });
    }
};

export const createComment = async (req, res) => {
    const { post_id, user_id, text } = req.body;

    try{
        const response = await Comment.createComment(post_id, user_id, text);
        console.log("response: " + response);
        console.log("post_id: " + post_id + " user_id: " + user_id + " text: " + text);
        if(response)
            return res.status(200).json({ status: 'success', message: 'Comment added' });
        else
            return res.status(500).json({ status: 'error', message: 'Failed to add comment' });
    } catch (error) {
        console.error("Error creating comment", error);
        res.status(500).json({ status: 'error', message: 'Failed to add comment' });
    }
};

export default{
    getCommentsByPostId,
    createComment
}