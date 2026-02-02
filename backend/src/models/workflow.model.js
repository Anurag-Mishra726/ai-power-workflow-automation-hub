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
            "SELECT * FROM workflow_graphs WHERE id =?",
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

        const result = await query(
            `UPDATE workflows SET ${setClause} WHERE id = ? AND user_id = ?`,
            values,
            client
        );

        return result;
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

        const result = await query(
            `UPDATE workflow_graphs SET ${setClause} WHERE workflow_id = ? `,
            values,
            client
        );

        return result;
    },

    deleteWorkflow: async ({ userId, workflowId }, client = pool) => {

        await query(
            "DELETE FROM workflows WHERE id = ? AND user_id = ?",
            [workflowId, userId],
            client
        );
        return;
    }
}
