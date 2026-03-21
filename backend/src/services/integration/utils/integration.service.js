import { AppError } from "../../../utils/AppErrors.js";
import { getSlackAuthUrl, handleSlackCallback, saveSlackIntegration } from "../slack/slack.auth.service.js";

const getProviderUrl = {
    slack: getSlackAuthUrl
}

const handleCallback = {
    slack: handleSlackCallback
}

const handleInsertToken = {
    slack: saveSlackIntegration
}


export const integrationOAuthGetUrl = async(provider, workflowId, userId) => { 
    const fn = getProviderUrl[provider];
    if (!fn) throw new AppError("Unsupported Provider!", 400);
    return await fn(workflowId, userId);
}


export const integrationHandleOAuthCallback = async (provider, code, userId) => {
    const fn = handleCallback[provider];
    if (!fn) throw new AppError("Unsupported Provider!", 400);
    return await fn(code, userId);
}


export const integrationInsertOAuthToken = async (provider, data) => {
    const fn = handleInsertToken[provider];
    if (!fn) throw new AppError("Unsupported Provider!", 400);
    return await fn(data);
}

// const data = {
//   userId: 1,
//   provider: "slack",
//   teamId: "T0123456789",
//   name: "AI-Powered Workflow Automation Hub",
//   accessToken: "xoxp-1234567890-1234567890-1234567890123",
//   tokenType: "bot",
//   scope: "chat:write,channels:read,groups:read,im:read,mpim:read",
//   refreshToken: "xoxr-1234567890-1234567890123-abcdef1234567890abcdef1234567890",
// };

