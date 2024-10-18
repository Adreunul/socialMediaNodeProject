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

export default { 
    findByEmail,

};