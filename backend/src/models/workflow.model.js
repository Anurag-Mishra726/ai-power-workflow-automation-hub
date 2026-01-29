import pool from "../config/db.js";
import { AppError } from "../utils/AppErrors.js";

const query = async (sql, params = []) => {
  try {
    const [rows] = await pool.execute(sql, params);
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
    insertWorkflowsData: async ({workflowId, userId, workflowName, triggerType}) => {
        const rows = await query(
            "INSERT INTO workflows (id, user_id, name, trigger_type) VALUES (?, ?, ?, ?)",
            [workflowId, userId, workflowName, triggerType]
        );
    },

    updateWorkflowsData: async ({workflowId, userId, ...updatableFields}) => {
        
        const { setClause, values } = genericQueryGenerator(updatableFields, { workflowId, userId });

        const result = await query(
            `UPDATE workflows SET ${setClause} WHERE id = ? AND user_id = ?`,
            values
        );

        return result;
    },

    insertWorkflowGraphData: async ({workflowId, nodes, edges}) => {
        const rows = await query(
            "INSERT INTO workflow_graphs (workflow_id, nodes, edges) VALUES (?, ?, ?)",
            [workflowId, nodes, edges]
        )
    },

    updateWorkflowGraphData: async ({workflowId, ...updatableFields}) => {

        const { setClause, values } = genericQueryGenerator(updatableFields, { workflowId });

        const result = await query(
            `UPDATE workflow_graphs SET ${setClause} WHERE workflow_id = ? `,
            values
        );

        return result;
    },

    findById: async({workflowId, userId}) => {
        const rows = await query(
            "SELECT id, user_id, name, status, trigger_type FROM workflows WHERE id = ? AND user_id = ?",
            [workflowId, userId]
        );
        return rows[0] || null;
    },
}
