import Comment from '../models/commentModel.js';

export const getCommentsByPostId = async (req, res) => {
    const id = req.params.id;
    try{
        var comments = await Comment.getCommentsByPostId(id);
        if(comments !== null)
            comments = await formatReactionsNumber(comments);
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

export const getUserHasLiked = async (req, res) => {
    const comment_id = req.params.comment_id;
    const user_id = req.params.user_id;

    try{
        const response = await Comment.getUserHasLiked(comment_id, user_id);
        if(response)
            return res.status(200).json({ status: 'success', message: 'User has liked', userInteraction : response });
        else
            return res.status(200).json({ status: 'success', message: 'User has not liked', userInteraction : response });
    } catch (error) {
        console.error("Error getting user interaction", error);
        res.status(500).json({ status: 'error', message: 'Failed to get user interaction' });
    }
};

export const setUserReaction = async (req, res) => {
    const comment_id = req.params.comment_id;
    const user_id = req.params.user_id;

    try{
        const response = await Comment.setUserReaction(comment_id, user_id);
        if(response)
            return res.status(200).json({ status: 'success', message: 'User reaction added' });
        else
            return res.status(500).json({ status: 'error', message: 'Failed to add user reaction' });
    } catch (error) {
        console.error("Error setting user reaction", error);
        res.status(500).json({ status: 'error', message: 'Failed to add user reaction' });
    }
};

export const deleteUserReaction = async (req, res) => {
    const comment_id = req.params.comment_id;
    const user_id = req.params.user_id;

    try{
        const response = await Comment.deleteUserReaction(comment_id, user_id);
        if(response)
            return res.status(200).json({ status: 'success', message: 'User reaction deleted' });
        else
            return res.status(500).json({ status: 'error', message: 'Failed to delete user reaction' });
    }  catch (error) {
        console.error("Error deleting user reaction", error);
        res.status(500).json({ status: 'error', message: 'Failed to delete user reaction' });
    }
};

async function formatReactionsNumber(comments) {
    for(var i = 0; i < comments.length; i++) {
        console.log("reactions_number: "+comments[i].likes);
        if(comments[i].likes == 0) {
            comments[i].likes = "0";
            continue;
        }
        else if(comments[i].likes < 5) {
            comments[i].likes = "< 5";
            continue;
        }
        else if(comments[i].likes < 10) {
            comments[i].likes = "< 10";
            continue;
        }
        else if(comments[i].likes > 10){
            comments[i].likes = "> 10";
            continue;
        }
        else if(comments[i].likes > 100){
            comments[i].likes = "> 100";
            continue
        }
        else if(comments[i].likes > 1000){
            comments[i].likes = "> 1000";
            continue
        }
        else if(comments[i].likes > 10000){
            comments[i].likes = "> 10.000";
            continue
        }
    }

    return comments;
}

export default{
    getCommentsByPostId,
    createComment,
    getUserHasLiked,
    setUserReaction,
    deleteUserReaction
}