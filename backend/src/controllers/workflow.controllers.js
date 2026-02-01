import { 
    generateWorkflowId, 
    saveWorkflowData, 
    getWorkflowMetadata, 
    getWorkflowGraph, 
    deleteWorkflow,
} from "../services/workflow.service.js";


export const getWorkflowId = (req, res) => {
    const workflowId = generateWorkflowId();
    console.log(workflowId);
    res.status(200).json({
        message: "Id created.",
        success: true,
        workflowId: workflowId
    });
    //TODOs : create the id sotre in db workflows table by implementing auto feature when user clicks create btn and while saving for the check the id is valid or not 
};

export const saveWorkflow = async (req, res) => {
    try {
        const workflow = await saveWorkflowData(req.user, req.body);

        res.status(200).json({
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

        res.status(200).json({
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

export const workflowGraphData = async (req, res) => {
    try {
        const workflowId = req.query.workflowId;
        if(!workflowId){
            return res.status(400).json({
                message: "Workflow Not Found!!"
            });
        }
        const workflow = await getWorkflowGraph(req.user, workflowId);
        if(!workflow){
            return res.status(404).json({
                message: "Workflow not found",
                success: false,
            })
        }

        res.status(200).json({
            message: workflow.message || "Workflow found successfully.",
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

export const deleteWorkflowData = async(req, res) => {
    try {
        const workflowId = req.query.workflowId;
        if (!workflowId) {
            return res.status(400).json({
                message: "WorkflowId not found! Bad request.",
                success: false
            });
        }
        const result = await deleteWorkflow(req.user, workflowId);
        res.status(204).json({
            message: "Workflow deleted successfully",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error?.message || "Something went wrong!",
            success: false
        });
    }
} 