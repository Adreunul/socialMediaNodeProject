import pg from 'pg';

// const pool = new pg.Pool({
//     user: "postgres",
//     host: "localhost",
//     database: "SocialMedia",
//     password: "password",
//     port: 5432
// });

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL, // DATABASE_URL will be set in Render
    ssl: {
      rejectUnauthorized: false
    }
  });
  

export default pool;