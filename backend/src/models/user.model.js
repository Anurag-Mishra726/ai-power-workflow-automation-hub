import pool from "../config/db.js";

const query = async (sql, params = []) => {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (err) {
    console.error("❌ DB Error:", err.message);
    throw err;
  }
};

export const User = {

  createUser: async({username, email, password_hash, signup_ip}) => {
    const result = await query(
      "INSERT INTO users (username, email, password_hash, signup_ip) VALUES (?, ?, ?, ?)",
      [username, email, password_hash, signup_ip]
    );

    const rows = await query(
      "SELECT id, username, email FROM users WHERE id = ?",
      [result.insertId]
    )

    return rows[0];
  },

  findByEmail: async (email) => {
    const rows = await query(
      "SELECT id, username, email, password_hash FROM users WHERE email = ? LIMIT 1",
      [email]
    );
    return rows[0] || null;
  },

  findById: async (id) => {
    const rows = await query(
      "SELECT id, username, email FROM users WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  }

}