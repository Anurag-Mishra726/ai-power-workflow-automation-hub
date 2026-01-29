import { saveWorkflowData } from "../services/workflow.service.js";

export const saveWorkflow = async (req, res) => {
    try {
        const workflow = await saveWorkflowData(req.user, req.body);
        return res.status(201 || workflow.status).json({
            message: workflow.message || "Workflow saved successfully!",
            success: true,
        });
    } catch (error) {
        console.error(error);
        res.status(error.statusCode || 500).json({ 
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
}