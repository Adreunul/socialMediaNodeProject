import pool from '../db.js';

export const getAllPosts = async (req, res) => {
    try{
        const query = 'SELECT p.id, p.title, p.text, p.date, p.id_author, u.username FROM posts p JOIN users u ON p.id_author = u.id;'
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

export default {
    getAllPosts,
    
}