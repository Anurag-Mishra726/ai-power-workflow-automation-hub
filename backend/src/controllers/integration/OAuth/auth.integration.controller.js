import { 
    integrationOAuthGetUrl, 
    integrationHandleOAuthCallback, 
    integrationInsertOAuthToken
 } from "../../../services/integration/utils/integration.service.js";
import { handleGithubCallback } from "../../../services/integration/github/github.auth.service.js";

export const startOAuth = async (req, res) => {
    try {
        const { provider } = req.params;
        const {workflowId } = req.query;
        const userId = req.user.userId;

        if (!workflowId) {
            return res.status(400).json({
                message: "Invalid request! WorkflowId is missing!",
                success: false
            });
        }

        const url = await integrationOAuthGetUrl(provider, workflowId, userId);
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
        const { code } = req.query;
        const { state } = req.query;

        const decoded = JSON.parse(
            Buffer.from(state, "base64").toString("utf-8")
        );

        const {workflowId, userId, provider } = decoded;

        if (!code) {
            console.error("Code is missing.......");
            return res.redirect(`http://localhost:5173/workflow/${workflowId}`);
        }
        
        const data = await integrationHandleOAuthCallback(provider, code, userId);
        //console.log("DATA : ", data);
        await integrationInsertOAuthToken(provider, data);

        return res.redirect(`http://localhost:5173/workflow/${workflowId}`);

    } catch (error) {
        console.log("OAuth Callback Error: ", error);
        res.status( error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error!"
        });
    }
};


export const handleGithubSetupCallback = async (req, res) => {

    try {
        const {
            installation_id,
            state
        } = req.query;

        const decoded = JSON.parse(
            Buffer.from(state, "base64").toString("utf-8")
        );

        const { workflowId, userId } = decoded;

        if (!installation_id) {
            return res.redirect(
              `http://localhost:5173/workflow/`
            );
        }

        await handleGithubCallback(
            userId,
            installation_id,
        );

        return res.redirect(
          `http://localhost:5173/workflow/${workflowId}`
        );

    } catch (error) {
        console.log("GitHub Setup Callback Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
