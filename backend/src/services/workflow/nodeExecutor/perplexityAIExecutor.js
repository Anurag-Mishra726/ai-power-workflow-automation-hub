import { perplexity } from '@ai-sdk/perplexity';
import { generateText } from "ai";
import { createExecutionResult } from "../../../utils/executionResult.js";
import { NonRetriableError } from "inngest";
import { aiIntegration } from "../../../models/aiIntegration.model.js"


export const perplexityAIExecutor = async ({data, nodeId, context, userId, publish}) => {

    if (!userId) {
        throw new NonRetriableError("UserId is missing!")
    }

    if (!data.isConfigured || !data.config.variable || !data.config.userPrompt) {
        throw new NonRetriableError("Node is not configured!")
    }

   const apiKey = await aiIntegration.apiKey({ 
        userId, 
        provider: "perplexity",
    });

    if(!apiKey) {
        throw new NonRetriableError("Perplexity API key is not configured.");
    }

    try {
        const result = await generateText({
            model:  perplexity('sonar-pro'),
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
        throw new NonRetriableError("Failed to generate text with Perplexity AI.");
    }

}
