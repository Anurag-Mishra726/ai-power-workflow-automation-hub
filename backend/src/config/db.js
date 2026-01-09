import mysql2 from "mysql2/promise";

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: Number(process.env.DB_PORT) || 3306,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export async function connectDB() {
  try {
        const connection = await pool.getConnection();
        console.log("-- Connected to MySQL ID:", connection.threadId);
        
        await connection.ping();
        console.log("-- Database ping successful.", );
        
        connection.release();
    } catch (error) {
        console.error("❌  Database connection failed:");
        console.error(error.message);
        process.exit(1); 
    }
}

export default pool;