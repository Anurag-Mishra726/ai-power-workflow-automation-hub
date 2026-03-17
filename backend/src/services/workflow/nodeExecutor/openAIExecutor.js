import { openai } from '@ai-sdk/openai';
import { generateText } from "ai";
import { createExecutionResult } from "../../../utils/executionResult.js";
import { NonRetriableError } from "inngest";
import { aiIntegration } from "../../../models/aiIntegration.model.js"

export const openAIExecutor = async ({data, nodeId, context, userId, publish}) => {

    if (!userId) {
        throw new NonRetriableError("User Id is missing");
    }

    if (!data.isConfigured || !data.config.variable || !data.config.userPrompt) {
        throw new NonRetriableError("Node is not configured.")
    }

    const apiKey = await aiIntegration.apiKey({ 
        userId, 
        provider: "openai",
    });

    //TODOs: This is going to fail if the trigger is google form because in the initial data (context there is no userId). Solve this..

    if(!apiKey) {
        throw new NonRetriableError("OpenAI API key is not configured.");
    }

    try {
        const openaiProvider = createOpenAI({
            apiKey: apiKey
        });
        const result = await generateText({
            model:  openaiProvider('gpt-5'),
            system: data.config.systemPrompt || "You are a helpful assistant. Respond clearly and concisely. And keep it short.",
            prompt: data.config.userPrompt,
            apiKey: apiKey
        });

        return createExecutionResult({
            output: {
                text: result.text,
            }
        });
    } catch (error) {
        console.log(error);
        throw new NonRetriableError("Failed to generate text with ChatGPT.");
    }

}
