import pool from "../config/db.js";
import { Workflow } from "../models/workflow.model.js";
import { AppError } from "../utils/AppErrors.js";

export const saveWorkflowData = async (userData, saveWorkflowData) => {

    const {workflowId, workflowName, nodes, edges} = saveWorkflowData;
    const userId = userData.userId
    const triggerType = nodes[0].data.triggerType;

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const existingWorkflow = await Workflow.exists({workflowId, userId}, connection);

        if (!existingWorkflow) {

            await Workflow.insertWorkflowsData({
                workflowId, 
                userId, 
                workflowName, 
                triggerType
            }, connection );

            await Workflow.insertWorkflowGraphData({
                workflowId, 
                nodes, 
                edges
            }, connection );

        } else {
            await Workflow.updateWorkflowsData({
                workflowId,
                userId,
                workflowName,
                triggerType
            }, connection );

            await Workflow.updateWorkflowGraphData({
                workflowId,
                nodes,
                edges
            }, connection );
        }

        const workflowData = await Workflow.getFullWorkflow({workflowId, userId}, connection)

        console.log(workflowData);

        await connection.commit();

        return { 
            message: "Workflow saved successfully.", 
            status: 200,
            workflowId: workflowData.id,
            workflowName: workflowData.name,
            workflowStatus: workflowData.status,
            workflowTriggerType: workflowData.trigger_type,
            workflowCreatedAt: workflowData.created_at,
            workflowNodes: workflowData.nodes,
            workflowEdges: workflowData.edges,
            workflowUpdatedAt: workflowData.updated_at
        };
    } catch (error) {
        await connection.rollback();
        throw new AppError("Something went wong!", 500)
    } finally {
        connection.release();
    }    
} 

export const getWorkflowMetadata = async (userData) => {
    const userId = userData.userId;

    const result = await Workflow.getWorkflowMetadata({userId});

    if (!result) {
        return {
            message: "No workflow created yet!",
            workflowData: null
        }
    }

    console.log(result);

    return {
        message: "All Workflow are fetched",
        status: 200,
        workflowMetadata: result,
    }
}

// create a workflowId on backend send to frontend for user also.