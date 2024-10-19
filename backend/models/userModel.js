import pool from '../db.js';


export const findByEmail = async (email) => {
    try {
        const query = 'SELECT id, email, password FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);

        if (result.rows.length > 0) {
            return result.rows[0];
        } else {
            return null;
        }
    } catch (error){
        console.error("Error querying the database", error);
        throw error;
    }
};

export const register = async (username, email, password) => {
    try {
        const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id';
        const result = await pool.query(query, [username, email, password]);

        return result.rows[0].id;
    } catch (error){
        console.error("Error querying the database", error);
        //throw error;
        if(error.detail.includes("email"))
            return "email";
        else if(error.detail.includes("username"))
            return "username";
        else
        return null;
    }
};

export default { 
    findByEmail,
    register
};