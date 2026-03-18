import { integrationOAuthService, integrationHandleOAuthCallback } from "../../../services/integration/utils/integration.service.js";

export const startOAuth = async (req, res) => {
    try {
        const { provider } = req.params;
        const {workflowId } = req.query
        console.log("OAuth WorkflowId : ", workflowId);
        if (!workflowId) {
            res.status(400).json({
                message: "Invalid request! WorkflowId is missing!",
                success: false
            });
        }

        const url = await integrationOAuthService(provider, workflowId);

        return res.redirect(url);

    } catch (error) {
        console.log("OAuth Error: ", error);
        res.status(error.statusCode || 500).json({ 
            success: false,
            message: error.message || "Internal Server Error!"
        });
    }

}

export const handleOAuthCallback = async (req, res) => {
    try {
        const { provider } = req.params;
        const { code, workflowId } = req.query;
        console.log("OAuth Callback WorkflowId : ", workflowId);
        await integrationHandleOAuthCallback(provider, code);

        return res.redirect(`http://localhost:5173/workflow/${workflowId}`);
    } catch (error) {
        console.log("OAuth Callback Error: ", error);
        res.status( error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error!"
        });
    }
};
