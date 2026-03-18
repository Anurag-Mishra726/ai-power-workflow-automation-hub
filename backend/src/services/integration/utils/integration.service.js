import { AppError } from "../../../utils/AppErrors.js";
import { getSlackAuthUrl, handleSlackCallback } from "../slack/slack.auth.service.js";

const getProviderUrl = {
    slack: getSlackAuthUrl
}

export const integrationOAuthService = async(provider, workflowId) => {  // Do i need to make this integrationOAuthService func async/await ?
    const getUrl = await getProviderUrl[provider];
    const url = getUrl(workflowId);
    
    if (!url) {
        throw new AppError("Unsupported Provider!");
    }
    return url;
}

const handleCallback = {
    slack: handleSlackCallback
}

export const integrationHandleOAuthCallback = async (provider, code) => {
    const callback = handleCallback[provider];
    await callback(code);
}
