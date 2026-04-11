import { AppError } from "../../../utils/AppErrors.js";

import { getSlackAuthUrl, handleSlackCallback, saveSlackIntegration } from "../slack/slack.auth.service.js";
import { getSlackIntegration } from "../slack/slack.crud.service.js";

import { getGoogleAuthUrl, handleGoogleCallback, saveGoogleIntegration } from "../google/google.auth.service.js";
import { getGoogleIntegration } from "../google/google.crud.service.js";

import { getGithubAuthUrl, handleGithubCallback, saveGithubIntegration } from "../github/github.auth.service.js";
import { getGithubIntegration } from "../github/github.crud.service.js";

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
    slack: getSlackIntegration,
    googleDrive: getGoogleIntegration,
    gmail: getGoogleIntegration,
    googleForm: getGoogleIntegration,
    github: getGithubIntegration,
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
