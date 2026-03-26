import { AppError } from "../../../utils/AppErrors.js";

import { getSlackAuthUrl, handleSlackCallback, saveSlackIntegration } from "../slack/slack.auth.service.js";
import { getIntegration } from "../slack/slack.crud.service.js";

import { getGoogleAuthUrl, handleGoogleCallback, saveGoogleIntegration } from "../google/google.auth.service.js";

import { getGithubAuthUrl, handleGithubCallback, saveGithubIntegration } from "../github/github.auth.service.js";

const getProviderUrl = {
    slack: getSlackAuthUrl,
    googleDrive: getGoogleAuthUrl,
    gmail: getGoogleAuthUrl,
    googleForm: getGoogleAuthUrl,
    github: getGithubAuthUrl,
}

const handleCallback = {
    slack: handleSlackCallback,
    googleDrive: handleGoogleCallback,
    gmail: handleGoogleCallback,
    googleForm: handleGoogleCallback,
    github: handleGithubCallback,
}

const handleInsertToken = {
    slack: saveSlackIntegration,
    googleDrive: saveGoogleIntegration,
    gmail: saveGoogleIntegration,
    googleForm: saveGoogleIntegration,
    github: saveGithubIntegration,
}

const handleCRUD = {
    slack: getIntegration
}


export const integrationOAuthGetUrl = async (provider, workflowId, userId) => { 
    const fn = getProviderUrl[provider];
    if (!fn) throw new AppError("Unsupported Provider!", 400);
    return await fn(userId, workflowId, provider);
}


export const integrationHandleOAuthCallback = async (provider, code, userId) => {
    const fn = handleCallback[provider];
    console.log(fn);
    if (!fn) throw new AppError("Unsupported Provider!", 400);
    return await fn(code, userId);
}


export const integrationInsertOAuthToken = async (provider, data) => {
    const fn = handleInsertToken[provider];
    if (!fn) throw new AppError("Unsupported Provider!", 400);
    return await fn(data);
}

export const integrationCRUD = async (userId, provider) => {
    const fn = handleCRUD[provider];
    if (!fn) {
        throw new AppError("Unsupported Provider!", 400);
    }
    return await fn(userId, provider);
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

