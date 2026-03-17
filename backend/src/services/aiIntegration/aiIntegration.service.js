import {aiIntegration} from "../../models/aiIntegration.model.js";
import { encrypt, decrypt } from "../../utils/encryption.js";
import { AppError } from "../../utils/AppErrors.js";

export const addApiKey = async ({ userId, name, provider, apiKey }) => {

    const exists = await aiIntegration.exists({ userId, provider });

    if (exists) {
      throw new AppError("API key for this provider already exists!", 400);
    }

    const encryptedKey = encrypt(apiKey);

    const result = await aiIntegration.insertApiKey({
      userId,
      name,
      provider,
      apiKey: encryptedKey
    });

    return {
      message: "API key added successfully.",
      id: result.insertId
    };
}

export const apiKeyExists = async ({userId, provider}) => {
    const exists = await aiIntegration.exists({ userId, provider });

    if (!exists) {
      return {
        message: "API key not found.",
        exists: false
      }    
    }

    return {
      message: "API Key Exists.",
      exists: true
    }
}

export const getApiKey = async ({ userId, provider }) => {

    const record = await aiIntegration.getApiKey({ userId, provider });

    if (!record) {
      throw new AppError("API key not found!", 404);
    }

    const decryptedKey = decrypt(record.api_key);

    return {
      id: record.id,
      name: record.name,
      provider: record.provider,
      apiKey: decryptedKey,
      createdAt: record.created_at,
    };
}

export const getAllApiKeys = async ({ userId }) => {

    const result = await aiIntegration.getAllApiKeys({ userId });

    if (!result) {
        throw new AppError("No API keys found!", 404);
    }

    const decryptedResults = result.map(record => {
      return {
        id: record.id,
        name: record.name,
        provider: record.provider,
        apiKey: decrypt(record.api_key),
        createdAt: record.created_at,
      }
    });

    return decryptedResults;
}

export const updateApiKey = async ({ userId, name, provider, apiKey }) => {

    const exists = await aiIntegration.exists({ userId, provider });

    if (!exists) {
      throw new AppError("API key does not exist!", 404);
    }

    const encryptedKey = encrypt(apiKey);

    await aiIntegration.updateApiKey({
      userId,
      name,
      provider,
      apiKey: encryptedKey
    });

    return {
      message: "API key updated successfully."
    };
}

export const deleteApiKey = async ({ userId, provider }) => {

    const exists = await aiIntegration.exists({ userId, provider });

    if (!exists) {
      throw new AppError("API key not found!", 404);
    }

    await aiIntegration.deleteApiKey({ userId, provider });

    return {
      message: "API key deleted successfully."
    };
}
