import { Workflow } from "../models/workflow.model.js";

export const saveWorkflowData = async (userData, saveWorkflowData) => {

    const {workflowId, workflowName, nodes, edges} = saveWorkflowData;
    const userId = userData.userId
    const triggerType = nodes[0].data.triggerType;

    const existingWorkflow = await Workflow.findById({workflowId, userId});

    if (!existingWorkflow) {
        await Workflow.insertWorkflowsData({
            workflowId, 
            userId, 
            workflowName, 
            triggerType
        });

        await Workflow.insertWorkflowGraphData({
            workflowId, 
            nodes, 
            edges
        });
        return { 
            message: "Workflow created successfully", 
            id: workflowId,
            status: 201, 
        };

    } else {
        await Workflow.updateWorkflowsData({
            workflowId,
            userId,
            workflowName,
            triggerType
        });

        await Workflow.updateWorkflowGraphData({
            workflowId,
            nodes,
            edges
        });

        return { 
            message: "Workflow updated successfully", 
            id: workflowId,
            status: 200,
        };
    }
} 

// create a workflowId on backend send to frontend for user also.