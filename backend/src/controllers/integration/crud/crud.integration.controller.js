import { getIntegration } from "../../../services/integration/slack/slack.crud.service.js";
import { integrationCRUD } from "../../../services/integration/utils/integration.service.js";

export const getIntegrationController = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { provider } = req.params;

        if (!userId || !provider) {
            return res.status(400).json({
                message: "Invalid request! Provider or UserId is missing!",
                success: false
            });
        }
        //await new Promise(resolve => setTimeout(resolve, 5000))
        const result = await integrationCRUD(userId, provider);
        
        return res.status(200).json({
            success: true,
            message: result?.message || "All Integration Fetched.",
            data: result.data
        });
    } catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({ 
            success: false,
            message: error.message || "Internal Server Error!"
        });
    }
}
