import pool from "../config/db.js";
import { AppError } from "../utils/AppErrors.js";

const query = async (sql, params = []) => {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (err) {
    console.error("❌ DB Error:", err.message);
    throw new AppError("Database query Failed : AI Integration Models", 500);
  }
};

export const aiIntegration = {
    exists: async({userId, provider}) => {
        const rows = await query(
            "SELECT EXISTS (SELECT 1 FROM ai_integrations WHERE user_id = ? AND provider = ?) AS apiKeyExists",
            [userId, provider]
        );
        return Number(rows[0].apiKeyExists) === 1;
    },

    getApiKey: async({userId, provider}) => {
        const rows = await query(
            "SELECT * FROM ai_integrations WHERE user_id = ? AND provider = ? LIMIT 1",
            [userId, provider]
        );
        return rows[0] || null;
    },

    apiKey: async({userId, provider}) => {
        const rows = await query(
            "SELECT api_key FROM ai_integrations WHERE user_id = ? AND provider = ? LIMIT 1",
            [userId, provider]
        );
        return rows[0] || null;
    },

    getAllApiKeys: async({userId}) => {
        const rows = await query(
            "SELECT * FROM ai_integrations WHERE user_id = ?",
            [userId]
        );
        return rows || null
    },

    insertApiKey: async({userId, name, apiKey, provider}) => {
        const rows = await query(
            "INSERT INTO ai_integrations (user_id, name, provider, api_key) VALUES (?, ?, ?, ?)",
            [userId, name, provider, apiKey]
        );
        return rows;
    },

    updateApiKey: async({userId, name, apiKey, provider}) => {
        const rows = await query(
            "UPDATE ai_integrations SET name = ?, api_key = ? WHERE user_id = ? AND provider = ?",
            [name, apiKey, userId, provider]
        );
        return rows;
    },

    deleteApiKey: async({userId, provider}) => {
        const rows = await query(
            "DELETE FROM ai_integrations WHERE user_id = ? AND provider = ?",
            [userId, provider]
        );
        return;
    }
}