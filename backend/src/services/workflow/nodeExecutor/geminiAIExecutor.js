import { google } from '@ai-sdk/google';
import { generateText } from "ai";
import { createExecutionResult } from "../../../utils/executionResult.js";
import { NonRetriableError } from "inngest";
import { aiIntegration } from "../../../models/aiIntegration.model.js"
import Handlebars from 'handlebars';
import { httpRequestChannel } from "../../../inngest/workflowStatus.js";

export const geminiAIExecutor = async ({data, nodeId, context, userId, publish}) => {
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
        throw new NonRetriableError("User Id is missing");
    }

    if (!data.isConfigured || !data.config.variable || !data.config.userPrompt) {
        await publish(
            httpRequestChannel().status({
                nodeId,
                status: "error",
            })
        );
        throw new NonRetriableError("Node is not configured.")
    }

    const apiKey = await aiIntegration.apiKey({ 
        userId, 
        provider: "gemini",
    });

    if(!apiKey) {
        await publish(
        httpRequestChannel().status({
            nodeId,
            status: "error",
        })
    );
        throw new NonRetriableError("Google Generative AI API key is not configured.");
    }
    const startTime = Date.now();

    try {
        const compiledSystemPrompt = Handlebars.compile(
            data.config.systemPrompt || "You are a helpful assistant. Respond clearly and concisely. And keep it short."
        )(context);
        const compiledUserPrompt = Handlebars.compile(data.config.userPrompt)(context);

        const result = await generateText({
            model:  google('gemini-2.5-flash'),
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
                nodeId,
                triggered: true,
                startTime,
                endTime: Date.now(),
                status: true,
                data: {
                    text: result.text,
                    prompt: compiledUserPrompt,
                }
            }
        });
    } catch (error) {
        console.log("Gemini Error ", error);
        await publish(
            httpRequestChannel().status({
                nodeId,
                status: "error",
            })
        );
        throw new NonRetriableError("Failed to generate text with Google Generative AI.");
    }
}
