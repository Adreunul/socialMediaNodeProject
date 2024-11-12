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

export const findById = async (id) => {
    try{
        const query = 'SELECT password FROM users WHERE id = $1';
        const result = await pool.query(query, [id]);

        if(result.rows.length > 0)
            return result.rows[0];
        else
            return null;
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

export const updatePassword = async (id_user, password, actualPassword) => {
    try{
        const query = 'UPDATE users SET password = $1 WHERE id = $2 RETURNING 1';
        const result = await pool.query(query, [password, id_user]);

        if(result.rows.length > 0)
            return true;
        else
            return null;
    } catch(error){
        console.error("Error querying the database", error);
        throw error;
    }
};

export const getUserById = async (id_user) => {
    try{
        const query = 'SELECT username, email, bio FROM users WHERE id = $1';
        const result = await pool.query(query, [id_user]);

        if(result.rows.length > 0){
            return result.rows[0];
        }
        else
            return null;

    } catch (error) {
        console.error("Error querying the database", error);
        return null;
    }   
};

export const getUsernameById = async (id_user) => {
    try{
        const query = 'SELECT username FROM users WHERE id = $1';
        const result = await pool.query(query, [id_user]);

        if(result.rows.length > 0)
            return result.rows[0].username;
        else
            return null;
    } catch (error) {
        console.error("Error querying the database", error);
        return null;
    }
};

export const updateUsername = async (id_user, username) => {
    try{
        const query = 'UPDATE users SET username = $1 WHERE id = $2 RETURNING 1';
        const result = await pool.query(query, [username, id_user]);

        if(result.rows.length > 0)
            return true;
        else
            return null;
    } catch (error) {
        console.error("Error querying the database", error);
        throw error;
    }
};

export const updateBio = async (id_user, bio) => {
    try{
        const query = 'UPDATE users SET bio = $1 WHERE id = $2 RETURNING 1';
        const result = await pool.query(query, [bio, id_user]);

        if(result.rows.length > 0) 
            return true;
        else
            return null;
    } catch (error) {
        console.error("Error querying the database", error);
        return null;
    }
}

export default { 
    findByEmail,
    findById,
    register,
    updatePassword,
    getUserById,
    getUsernameById,
    updateUsername,
    updateBio
};