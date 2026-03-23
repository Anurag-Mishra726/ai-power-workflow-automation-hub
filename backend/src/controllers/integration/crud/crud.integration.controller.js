import { getIntegration } from "../../../services/integration/crud/integration.crud.service.js";

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

        const result = await getIntegration(userId, provider);

        return res.status(200).json({
            success: true,
            message: result?.message || "All Integration Fetched.",
            data: result?.data
        });
    } catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({ 
            success: false,
            message: error.message || "Internal Server Error!"
        });
    }
}
