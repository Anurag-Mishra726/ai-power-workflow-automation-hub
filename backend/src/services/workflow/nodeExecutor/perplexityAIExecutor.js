import { perplexity } from '@ai-sdk/perplexity';
import { generateText } from "ai";
import { createExecutionResult } from "../../../utils/executionResult.js";
import { NonRetriableError } from "inngest";
import { aiIntegration } from "../../../models/aiIntegration.model.js"
import Handlebars from "handlebars";
import { httpRequestChannel } from "../../../inngest/workflowStatus.js";

export const perplexityAIExecutor = async ({data, nodeId, context, userId, publish}) => {
    await publish(
        httpRequestChannel().status({
            nodeId,
            status: "loading",
        })
    );

    if (!userId) {
        await publish(
            httpRequestChannel().status({
                nodeId,
                status: "error",
            })
        );
        throw new NonRetriableError("UserId is missing!")
    }

    if (!data.isConfigured || !data.config.variable || !data.config.userPrompt) {
        await publish(
            httpRequestChannel().status({
                nodeId,
                status: "error",
            })
        );
        throw new NonRetriableError("Node is not configured!")
    }

   const apiKey = await aiIntegration.apiKey({ 
        userId, 
        provider: "perplexity",
    });

    if(!apiKey) {
        await publish(
        httpRequestChannel().status({
            nodeId,
            status: "error",
        })
    );
        throw new NonRetriableError("Perplexity API key is not configured.");
    }

    try {
        const templateContext = context || {};
        const compiledSystemPrompt = Handlebars.compile(
            data.config.systemPrompt || "You are a helpful assistant. Respond clearly and concisely. And keep it short."
        )(templateContext);
        const compiledUserPrompt = Handlebars.compile(data.config.userPrompt)(templateContext);

        const result = await generateText({
            model:  perplexity('sonar-pro'),
            system: compiledSystemPrompt,
            prompt: compiledUserPrompt,
            apiKey
        });

        await publish(
            httpRequestChannel().status({
                nodeId,
                status: "success",
            })
        );

        return createExecutionResult({
            output: {
                text: result.text,
            }
        });
    } catch (error) {
        console.log(error);
        await publish(
        httpRequestChannel().status({
            nodeId,
            status: "error",
        })
    );
        throw new NonRetriableError("Failed to generate text with Perplexity AI.");
    }

}
