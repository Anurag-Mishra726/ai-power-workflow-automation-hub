import { saveWorkflowData, getWorkflowMetadata } from "../services/workflow.service.js";

export const saveWorkflow = async (req, res) => {
    try {
        const workflow = await saveWorkflowData(req.user, req.body);
        return res.status(200 || workflow.status).json({
            message: workflow.message || "Workflow saved successfully.",
            success: true,
            workflowId: workflow.workflowId,
            workflowName: workflow.workflowName,
            workflowStatus: workflow.workflowStatus,
            workflowTriggerType: workflow.workflowTriggerType,
            workflowCreatedAt: workflow.workflowCreatedAt,
            workflowUpdatedAt: workflow.workflowUpdatedAt,
            nodes: workflow.workflowNodes,
            edges: workflow.workflowEdges,
        });
    } catch (error) {
        console.error(error);
        res.status(error.statusCode || 500).json({ 
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
}
export const workflowMetadata = async (req, res) => {
    try {
        const workflow = await getWorkflowMetadata(req.user);

        return res.status(200 || workflow.status).json({
            message: "All Workflow are fetched",
            success: true,
            workflowMetadata: workflow.workflowMetadata,
        });
    } catch (error) {
        console.error(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
}