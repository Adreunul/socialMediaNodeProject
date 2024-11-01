import pool from '../db.js';

export const getCommentsByPostId = async (id) => {
    try{
        const query = 'SELECT c.text, u.username FROM comments_users_posts c JOIN users u ON c.id_user = u.id WHERE c.id_post = $1 ORDER BY c.id DESC';
        const result = await pool.query(query, [id]);

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
        return null;
    }
};

export default{
    getCommentsByPostId,
    createComment
}