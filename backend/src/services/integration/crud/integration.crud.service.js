import { Integration } from "../../../models/integration/integration.model.js";
import { AppError } from "../../../utils/AppErrors.js";

export const getIntegration = async(userId, provider) => {
    const data = await Integration.getIntegration({userId, provider});

    if (data.length == 0) {
        return {
            success: true,
            message: "No Integration exist."
        }
    }

    return {
        success: true,
        message: "All Integration Fetched.",
        data
    }
}
