import pool from "../../config/db.js";
import { AppError } from "../../utils/AppErrors.js";

const query = async (sql, params = [], client = pool) => {
  try {
    const [rows] = await client.execute(sql, params);
    return rows;
  } catch (err) {
    console.error("❌ DB Error:", err.message);
    throw new AppError("Database query Failed : OAuth Integration Models", 500);
  }
};

export const Integration = {        // external_id == team.id for slack

    exists: async({userId, provider, teamId}, client = pool) => {
        const rows = await query(
            "SELECT EXISTS (SELECT 1 FROM integrations WHERE user_id = ? AND provider = ? AND external_id = ?) AS apiKeyExists",
            [userId, provider, teamId], 
            client
        );
        return Number(rows[0].apiKeyExists) === 1;
    },

    insertTokenProvider: async({userId, provider, teamId, name}, client = pool) => {
        const rows = await query(
            `INSERT INTO integrations (user_id, provider, external_id, name) VALUES (?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE 
            name = VALUES(name),
            id = LAST_INSERT_ID(id) `,
            [userId, provider, teamId, name], 
            client
        );

        return rows[0];
    },

    insertOAuthToken: async ({ 
            integrationId, 
            accessToken, 
            refreshToken, 
            tokenType, 
            scope, 
            expiresAt, 
            last_refreshed_at 
        }, client = pool) => {

        const rows = await query(
            `INSERT INTO integration_accounts (integration_id, access_token, refresh_token, token_type, scope, expires_at, last_refreshed_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            access_token = VALUES(access_token),
            refresh_token = VALUES(refresh_token),
            token_type = VALUES(token_type),
            scope = VALUES(scope),
            expires_at = VALUES(expires_at),
            last_refreshed_at = VALUES(last_refreshed_at)
            `,
            [integrationId, accessToken, refreshToken, tokenType, scope, expiresAt, last_refreshed_at], 
            client
        );

        return rows[0];
    }
}