import { AppError } from "../../../utils/AppErrors.js";
import { getSlackAuthUrl, handleSlackCallback, saveSlackIntegration } from "../slack/slack.auth.service.js";

const getProviderUrl = {
    slack: getSlackAuthUrl
}

export const integrationOAuthGetUrl = async(provider, workflowId, userId) => {  // Do i need to make this integrationOAuthService func async/await ?
    const fn = getProviderUrl[provider];
    if (!fn) throw new AppError("Unsupported Provider!", 400);
    return await fn(workflowId, userId);
}

const handleCallback = {
    slack: handleSlackCallback
}

export const integrationHandleOAuthCallback = async (provider, code, userId) => {
    const fn = handleCallback[provider];
    if (!fn) throw new AppError("Unsupported Provider!", 400);
    return await fn(code, userId);
}

const handleInsertToken = {
    slack: saveSlackIntegration
}

export const integrationInsertOAuthToken = async (provider, data) => {
    const fn = handleInsertToken[provider];
    if (!fn) throw new AppError("Unsupported Provider!", 400);
    return await fn(data);
}
