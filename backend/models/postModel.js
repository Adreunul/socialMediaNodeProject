import pool from '../db.js';

export const getAllPosts = async (req, res) => {
    try{
        const query = 'SELECT p.id, p.title, p.text, p.date, p.id_author, u.username FROM posts p JOIN users u ON p.id_author = u.id ORDER BY id DESC;'
        const result = await pool.query(query);

        if (result.rows.length > 0) {
            console.log("baaa");
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

export default {
    getAllPosts,
    createPost,
    deletePost,
}