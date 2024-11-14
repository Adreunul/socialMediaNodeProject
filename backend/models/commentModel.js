import pool from '../db.js';

export const getCommentsByPostId = async (id, orderFilter, commentFilter, currentUserId) => {
    try{
        const query = 'SELECT c.id comment_id, c.text, u.username, u.id user_id, (SELECT COUNT(id) AS likes FROM likes_users_comments WHERE id_comment = c.id) AS likes, (SELECT likes AS agrees FROM likes_users_posts WHERE id_user = u.id AND id_post = $1) AS agrees FROM comments_users_posts c JOIN users u ON c.id_user = u.id WHERE c.id_post = $1 ' + (commentFilter === "myComments" ? 'AND u.id = $2 ' : '') + ' ORDER BY ' + orderFilter + ' DESC;';
        const result = await pool.query(query, commentFilter === "myComments" ? [id, currentUserId] : [id]);

        if (result.rows.length > 0)
            return result.rows;
        else
            return null;
    } catch (error) {
        console.error("Error querying the database", error);
        return null;
    }
};

export const createComment = async (id_post, id_user, text) => {
    try{
        const query = 'INSERT INTO comments_users_posts (id_post, id_user, text) VALUES ($1, $2, $3) RETURNING 1';
        const result = await pool.query(query, [id_post, id_user, text]);

        if (result.rows.length > 0)
            return true;
        else
            return null;
    } catch (error) {
        console.error("Error querying the database", error);

        if(error.detail.includes("already exists"))
            return "duplicate";
        
        return null;
    }
};

export const getUserHasLiked = async (id_comment, id_user) => {
    try{
        const query = 'SELECT * FROM likes_users_comments WHERE id_comment = $1 AND id_user = $2';
        const result = await pool.query(query, [id_comment, id_user]);

        if (result.rows.length > 0)
            return true;
        else
            return false;
    } catch (error) {
        console.error("Error querying the database", error);
        return null;
    }
};

export const setUserReaction = async (id_comment, id_user) => {
    try{
        const query = 'INSERT INTO likes_users_comments (id_comment, id_user) VALUES ($1, $2) RETURNING 1';
        const result = await pool.query(query, [id_comment, id_user]);

        if (result.rows.length > 0)
            return true;
        else
            return null;
    } catch (error) {
        console.error("Error querying the database", error);
        return null;
    }
};

export const deleteUserReaction = async (id_comment, id_user) => {
    try{
        const query = 'DELETE FROM likes_users_comments WHERE id_comment = $1 AND id_user = $2 RETURNING 1';
        const result = await pool.query(query, [id_comment, id_user]);

        if (result.rows.length > 0)
            return true;
        else
            return null;
    } catch (error) {
        console.error("Error querying the database", error);
        return null;
    }
};

export const deleteComment = async (id_comment) => {
    try{
        const query = 'DELETE FROM comments_users_posts WHERE id = $1 RETURNING 1';
        const result = await pool.query(query, [id_comment]); 

        if(result.rows.length > 0)
            return true;
        else
            return null;
    } catch(error) {
        console.error("Error querying the database", error);
        return null;
    }
};

export default{
    getCommentsByPostId,
    createComment,
    getUserHasLiked,
    setUserReaction,
    deleteUserReaction,
    deleteComment
}