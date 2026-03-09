
import { google } from '@ai-sdk/google';
import { generateText } from "ai";
import { createExecutionResult } from "../../../utils/executionResult.js";
import { NonRetriableError } from "inngest";

export const geminiAIExecutor = async ({data, nodeId, context, publish}) => {
    if (!data.isConfigured || !data.config.variable || !data.config.userPrompt) {
        throw new NonRetriableError("Node is not configured.")
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if(!apiKey) {
        throw new NonRetriableError("Google Generative AI API key is not configured.");
    }

    try {
        const result = await generateText({
            model:  google('gemini-2.5-flash'),
            system: data.config.systemPrompt || "You are a helpful assistant. Respond clearly and concisely. And keep it short.",
            prompt: data.config.userPrompt,
            apiKey
        });

        return createExecutionResult({
            output: {
                text: result.text,
            }
        });
    } catch (error) {
        console.log(error);
        throw new NonRetriableError("Failed to generate text with Google Generative AI.");
    }

}
