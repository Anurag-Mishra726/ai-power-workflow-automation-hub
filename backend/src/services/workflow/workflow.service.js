import pool from "../../config/db.js";
import { Workflow } from "../../models/workflow.model.js";
import { AppError } from "../../utils/AppErrors.js";

export const saveWorkflowData = async (userData, saveWorkflowData) => {

    const {workflowId, workflowName, nodes, edges} = saveWorkflowData;
    const userId = userData.userId
    const triggerType = nodes[0].data.triggerType;

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const existingWorkflow = await Workflow.exists({workflowId, userId}, connection);
        console.log("*******%%%%%%: ", existingWorkflow)
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

        const workflowData = await Workflow.getFullWorkflow({workflowId, userId}, connection);

        //console.log(workflowData);

        await connection.commit();

        return { 
            message: "Workflow saved successfully.", 
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

    return {
        message: "All Workflow are fetched",
        workflowMetadata: result,
    }
}

export const getWorkflowGraph = async ( userData, workflowId ) => {
    const userId = userData.userId;

    const workflowGraph = await Workflow.getFullWorkflow({workflowId, userId});

    if (!workflowGraph) {
        return{
            message: "No workflow found.",
            workflowGraph: null,
        }
    }

    return{
        message: "Workflow Graph is fetched.",
        workflowId: workflowGraph.id,
        workflowName: workflowGraph.name,
        workflowStatus: workflowGraph.status,
        workflowTriggerType: workflowGraph.trigger_type,
        workflowCreatedAt: workflowGraph.created_at,
        workflowNodes: workflowGraph.nodes,
        workflowEdges: workflowGraph.edges,
        workflowUpdatedAt: workflowGraph.updated_at
    }
}

export const deleteWorkflow = async (userData, workflowId) => {

    const userId = userData.userId;
    console.log("user and workflow id : ", userId, workflowId);

    const workflowExists = await Workflow.exists({workflowId, userId});
    console.log(workflowExists);
    if (!workflowExists) {
        throw new AppError("Workflow Not Found!", 404);
    }

    await Workflow.deleteWorkflow({ userId, workflowId });
    return { message: "Workflow deleted successfully" };

}

export const generateWorkflowId = () => {
    const id = crypto.randomUUID();
    return id;
}