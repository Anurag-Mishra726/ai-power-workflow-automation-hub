import pool from "../config/db.js";
import { AppError } from "../utils/AppErrors.js";

const query = async (sql, params = [], client = pool) => {
  try {
    const [rows] = await client.execute(sql, params);
    return rows;
  } catch (err) {
    console.error("❌ DB Error (executions):", err.message);
    throw new AppError("Database query failed: Execution Model", 500);
  }
};

const safeJson = (value) => {
  if (value === undefined) return null;
  return JSON.stringify(value);
};

export const Execution = {
  create: async (
    { inngestId, userId, workflowId, status = "running", startAt = new Date(), attempt = 1, output = null },
    client = pool,
  ) => {
    return query(
      `INSERT INTO executions (inngest_id, user_id, workflow_id, status, start_at, attempt, output)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [inngestId, userId, workflowId, status, startAt, attempt, safeJson(output)],
      client,
    );
  },

  markSuccess: async ({ inngestId, workflowId, output = {} }, client = pool) => {
    return query(
      `UPDATE executions
       SET status = 'success', completed_at = NOW(), output = ?, error_msg = NULL
       WHERE inngest_id = ? AND workflow_id = ?`,
      [safeJson(output), inngestId, workflowId],
      client,
    );
  },

  markFailure: async ({ inngestId, workflowId, errorMsg, output = null }, client = pool) => {
    return query(
      `UPDATE executions
       SET status = 'failed', completed_at = NOW(), error_msg = ?, output = ?
       WHERE inngest_id = ? AND workflow_id = ?`,
      [errorMsg || "Workflow execution failed", safeJson(output), inngestId, workflowId],
      client,
    );
  },

  listByUser: async ({ userId }, client = pool) => {
    return query(
      `SELECT e.id, e.inngest_id, e.workflow_id, e.status, e.start_at, e.completed_at, e.updated_at, e.attempt, e.error_msg,
              w.name AS workflow_name
       FROM executions e
       INNER JOIN workflows w ON e.workflow_id = w.id
       WHERE e.user_id = ?
       ORDER BY e.updated_at DESC`,
      [userId],
      client,
    );
  },

  getById: async ({ id, userId }, client = pool) => {
    const rows = await query(
      `SELECT e.*, w.name AS workflow_name
       FROM executions e
       INNER JOIN workflows w ON e.workflow_id = w.id
       WHERE e.id = ? AND e.user_id = ?
       LIMIT 1`,
      [id, userId],
      client,
    );

    return rows[0] || null;
  },
};
