import pool from '../db.js';

export const getAllPosts = async (req, res) => {
    try{
        const query = 'SELECT p.id post_id, p.title, p.text, p.date, p.id_author, p.edited, u.username, (SELECT COUNT(id) reactions_number FROM likes_users_posts WHERE id_post = p.id), (SELECT FLOOR(((SELECT COUNT(id) + 1 FROM likes_users_posts WHERE id_post = p.id AND likes = 1)::FLOAT / (SELECT COUNT(id) + 1 FROM likes_users_posts WHERE id_post = p.id)) * 100) AS agree_percentage) FROM posts p JOIN users u ON p.id_author = u.id ORDER BY post_id DESC;'
        const result = await pool.query(query);

        if (result.rows.length > 0) {
            return result.rows;
        } else {
            return null;
        }
    } catch (error){
        console.error("Error querying the database", error);
        throw error;
    }
};

export const getPostById = async (id) => {
    try{
        const query = 'SELECT p.id post_id, p.title, p.text, p.date, p.id_author, p.edited, u.username, (SELECT COUNT(id) reactions_number FROM likes_users_posts WHERE id_post = p.id), (SELECT FLOOR(((SELECT COUNT(id) + 1 FROM likes_users_posts WHERE id_post = p.id AND likes = 1)::FLOAT / (SELECT COUNT(id) + 1 FROM likes_users_posts WHERE id_post = p.id)) * 100) AS agree_percentage) FROM posts p JOIN users u ON p.id_author = u.id WHERE p.id = $1;';
        const result = await pool.query(query, [id]);

        if (result.rows.length > 0) {
            return result.rows;
        } else {
            return null;
        }
    } catch (error){
        console.error("Error querying the database", error);
        throw error;
    }
};

export const createPost = async (title, text, date, id_author) => {
    try{
        const query = 'INSERT INTO posts (title, text, date, id_author) VALUES ($1, $2, $3, $4) RETURNING id';
        const result = await pool.query(query, [title, text, date, id_author]);
        console.log("id: " + result.rows[0].id);

        return result.rows[0].id;
    } catch (error) {
        console.error("Error querying the database", error);
        
        if(error.detail.includes("title"))
            return "title";
        else if(error.detail.includes("text"))
            return "text";
        else
            return null;
    }
};

export const updatePost = async (id, text) => {
    try{
        const query = 'UPDATE posts SET text = $1, edited = 1 WHERE id = $2';
        const result = await pool.query(query, [text, id]);

        return true;
    } catch (error) {
        console.error("Error querying the database", error);
        return false;
    }
};

export const deletePost = async (id) => {
    try{
        const query = 'DELETE FROM posts WHERE id = $1';
        const result = await pool.query(query, [id]);


        return true;
    } catch (error) {
        console.error("Error querying the database", error);
        return false;
    }
};

export const getUserHasLiked = async (id_post, id_user) => {
    try{
        const query = 'SELECT likes FROM likes_users_posts WHERE id_user = $1 AND id_post = $2';
        const result = await pool.query(query, [id_user, id_post]);

        if(result.rows.length > 0)
            return result.rows[0].likes;
        else
            return null;

    } catch (error) {
        console.error("Error querying the database", error);
        return null;
    }
};

export const editUserReaction = async (id_post, id_user, likes) => {
    try{
        const query = 'UPDATE likes_users_posts SET likes = $1 WHERE id_user = $2 AND id_post = $3 RETURNING 1';
        const result = await pool.query(query, [likes, id_user, id_post]);

        if(result.rows.length > 0)
            return true;
        else
            return null;
    } catch (error) {
        console.error("Error querying the database", error);
        return null;
    }
};

export const setUserReaction = async (id_post, id_user, likes) => {
    try{
        const query = 'INSERT INTO likes_users_posts (id_post, id_user, likes) VALUES ($1, $2, $3) RETURNING 1';
        const result = await pool.query(query, [id_post, id_user, likes]);

        if(result.rows.length > 0)
            return true;
        else
            return null;
    } catch (error) {
        console.error("Error querying the database", error);
        return null;
    }
};

export const deleteUserReaction = async (id_post, id_user) => {
    try{
        const query = 'DELETE FROM likes_users_posts WHERE id_user = $1 AND id_post = $2 RETURNING 1';
        const result = await pool.query(query, [id_user, id_post]);

        if(result.rows.length > 0)
            return true;
        else
            return null;
    } catch (error) {
        console.error("Error querying the database", error);
        return null;
    }
};

export default {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    getUserHasLiked,
    setUserReaction,
    editUserReaction,
    deleteUserReaction
}