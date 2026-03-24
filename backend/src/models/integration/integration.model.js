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

    sameIntegrationExists: async({userId, provider, teamId}, client = pool) => {
        const rows = await query(
            "SELECT EXISTS (SELECT 1 FROM integrations WHERE user_id = ? AND provider = ? AND external_id = ?) AS sameIntegrationExists",
            [userId, provider, teamId], 
            client
        );
        return Number(rows[0].sameIntegrationExists) === 1;
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

        return rows;
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
    },

    getIntegration: async({userId, provider}, client = pool) => {
        const rows = await query(
            `SELECT
                i.id,
                i.name,
                i.provider,
                i.external_id,
                ia.access_token,
                ia.token_type,
                ia.scope,
                ia.refresh_token,
                ia.last_refreshed_at,
                ia.expires_at
            FROM integrations AS i
            INNER JOIN integration_accounts AS ia ON i.id = ia.integration_id
            WHERE i.user_id = ? AND i.provider = ?`,
            [userId, provider],
            client
        );
        
        return rows;
    },

    getIntegrationAccountToken: async ({ userId, provider, externalId }, client = pool) => {
        const rows = await query(
            `SELECT ia.access_token
            FROM integrations AS i
            INNER JOIN integration_accounts AS ia ON i.id = ia.integration_id
            WHERE i.user_id = ? AND i.provider = ? AND i.external_id = ?
            LIMIT 1`,
            [userId, provider, externalId],
            client
        );

        return rows[0]?.access_token || null;
    },
}