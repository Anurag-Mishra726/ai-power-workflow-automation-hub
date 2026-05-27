import { 
    integrationOAuthGetUrl, 
    integrationHandleOAuthCallback, 
    integrationInsertOAuthToken
 } from "../../../services/integration/utils/integration.service.js";
import { handleGithubCallback } from "../../../services/integration/github/github.auth.service.js";
import { Integration } from "../../../models/integration/integration.model.js";

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

        if (!installation_id) {
            return res.redirect(
              `http://localhost:5173/workflow/`
            );
        }

        let workflowId;
        let userId;

        if (state) {
            const decoded = JSON.parse(Buffer.from(state, "base64").toString("utf-8"));
            workflowId = decoded.workflowId;
            userId = decoded.userId;
        } else {                                                       
            userId = await Integration.findUserByIntegrationId({
                provider: "github",
                externalId: installation_id
            });

            if (userId) {
                return res.redirect("http://localhost:5173/workflow/")
            }
        }
 // when the event comes form the github directly without state then we dont need to update the db here later i have to remove this code and if the sate is missing just redirect the user to the workflow page.

        await handleGithubCallback(
            userId,
            installation_id,
        );

        return res.redirect( 
            workflowId 
            ? `http://localhost:5173/workflow/${workflowId}`
            : `http://localhost:5173/workflow/`
        );

    } catch (error) {
        console.log("GitHub Setup Callback Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
