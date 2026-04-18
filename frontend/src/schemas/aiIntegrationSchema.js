import {z} from "zod";

export const AiIntegrationSchema = z.object({
    name: z.string({message: "Name is required!"})
        .min(3, {message: "Name must be at least 3 characters long!"})
        .max(50, {message: "Name must be at most 50 characters long!"}),
    provider: z.enum(["openai", "gemini", "perplexity"], {message: "Please select a valid ai-provider !"}),
    apiKey: z.string({message: "API Key is required!"}).min(1, {message: "API Key is required !"}),
});