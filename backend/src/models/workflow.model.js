import pool from "../config/db.js";
import { AppError } from "../utils/AppErrors.js";

const query = async (sql, params = [], client = pool) => {
  try {
    const [rows] = await client.execute(sql, params);
    return rows;
  } catch (err) {
    console.error("❌ DB Error:", err.message);
    throw new AppError("Database query Failed : Workflow Models", 500);
  }
};

const genericQueryGenerator = ( updatableFields, idFilters) => {
    const columnMap = {
        workflowName: "name",
        status: "status",
        triggerType: "trigger_type",
        nodes: "nodes",
        edges: "edges"
    };

    const fields = Object.keys(updatableFields).filter((key) => updatableFields[key] !== undefined );

    if (fields.length === 0) throw new Error("No fields provided for update");

    const setClause = fields.map((field) => `${columnMap[field] || field} = ?`).join(", ");

    const values = fields.map((field) => 
        (field === 'nodes' || field === 'edges') ? JSON.stringify(updatableFields[field]) : updatableFields[field]
    );

    values.push(...Object.values(idFilters));

    return {setClause, values}
}

export const Workflow = {

    exists: async({workflowId, userId}, client = pool) => {
        const rows = await query(
            "SELECT EXISTS (SELECT 1 FROM workflows WHERE id = ? AND user_id = ?) AS workflowExists",
            [workflowId, userId],
            client
        );
        return Number(rows[0].workflowExists) === 1;
    },

    getUserId: async({workflowId}) => {
        const rows = await query(
            "SELECT user_id FROM workflows WHERE id = ?",
            [workflowId]
        );
        return rows[0];
    },

    getWorkflowMetadata: async ({userId}, client = pool) => {
        const rows = await query(
            "SELECT * FROM workflows WHERE user_id = ?",
            [userId],
            client
        );

        return rows || null;
    },

    getWorkflowGraph: async ({workflowId}, client = pool) => {
        const rows = await query(
            "SELECT * FROM workflow_graphs WHERE workflow_id = ?",
            [workflowId],
            client
        );

        return rows[0] || null;
    },

    getFullWorkflow: async ({workflowId, userId}, client = pool) => {
        const rows = await query(
            `SELECT
                w.id, w.name, w.status, w.trigger_type, w.created_at, 
                wg.nodes, wg.edges,
                GREATEST(w.updated_at, wg.updated_at) AS updated_at
            FROM workflows w
            INNER JOIN workflow_graphs wg ON w.id = wg.workflow_id
            WHERE w.id = ? AND user_id = ?`,
            [workflowId, userId],
            client
        );

        return rows[0] || null;
    },

    insertWorkflowsData: async ({workflowId, userId, workflowName, triggerType}, client = pool) => {
        const rows = await query(
            "INSERT INTO workflows (id, user_id, name, trigger_type) VALUES (?, ?, ?, ?)",
            [workflowId, userId, workflowName, triggerType],
            client
        );
    },

    updateWorkflowsData: async ({workflowId, userId, ...updatableFields}, client = pool) => {
        
        const { setClause, values } = genericQueryGenerator(updatableFields, { workflowId, userId });

        const rows = await query(
            `UPDATE workflows SET ${setClause} WHERE id = ? AND user_id = ?`,
            values,
            client
        );

        return rows;
    },

    insertWorkflowGraphData: async ({workflowId, nodes, edges}, client = pool) => {
        const rows = await query(
            "INSERT INTO workflow_graphs (workflow_id, nodes, edges) VALUES (?, ?, ?)",
            [workflowId, nodes, edges],
            client
        )
    },

    updateWorkflowGraphData: async ({workflowId, ...updatableFields}, client = pool) => {

        const { setClause, values } = genericQueryGenerator(updatableFields, { workflowId });

        const rows = await query(
            `UPDATE workflow_graphs SET ${setClause} WHERE workflow_id = ? `,
            values,
            client
        );

        return rows;
    },

    deleteWorkflow: async ({ userId, workflowId }, client = pool) => {

        await query(
            "DELETE FROM workflows WHERE id = ? AND user_id = ?",
            [workflowId, userId],
            client
        );
        return;
    },

    insertWorkflowTriggerTypes: async ({userId, workflowId, nodeId, triggerType, configJson, lastChecked}, client = pool) => {
        const rows = await query(
            `INSERT INTO workflow_triggers (user_id, workflow_id, node_id, trigger_type, config_json, last_checked) 
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [userId, workflowId, nodeId, triggerType, configJson, lastChecked],
            client
        );
    },

    updateWorkflowTriggerTypes: async ({userId, workflowId, nodeId, triggerType, configJson, lastChecked}, client = pool) => {
        console.log(configJson);
        const rows = await query(
            `UPDATE workflow_triggers SET trigger_type = ?, config_json = ?, last_checked = ? WHERE user_id = ? AND workflow_id = ? AND node_id = ?`,
            [triggerType, configJson, lastChecked, userId, workflowId, nodeId],
            client
        );
    },

    getPollingTriggers: async (client = pool) => {
        const rows = await query(
            `SELECT id, user_id, workflow_id, node_id, trigger_type, page_token, config_json, poll_interval, last_checked
            FROM workflow_triggers
            WHERE is_active = TRUE
                AND trigger_type IN ('gmail', 'googleDrive', 'googleForm')
                AND (next_poll_at IS NULL OR next_poll_at <= NOW())
            ORDER BY next_poll_at ASC`,
            [],
            client
        );

        return rows;
    },

    updatePollingCheckpoint: async ({ triggerId, pageToken, lastChecked, pollInterval }, client = pool) => {
        const rows = await query(
            `UPDATE workflow_triggers
            SET page_Token = ?,
                last_checked = ?,
                next_poll_at = DATE_ADD(?, INTERVAL ? SECOND)
            WHERE id = ?`,
            [pageToken, lastChecked, lastChecked, pollInterval, triggerId],
            client
        );

        return rows;
    },
}
