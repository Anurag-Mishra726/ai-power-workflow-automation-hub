import { generateText } from "ai";
import { geminiFlash } from "./gemini.js";
import { perplexitySonar } from "./perplexity.js";

export const gemini = async (prompt) => {
    const { text } = await generateText({
        model: geminiFlash,
        system: "You are a helpful assistant. Respond clearly and concisely. And keep it short.",
        prompt: prompt
    });
    console.log(text);
    return text;
}

export const perplexity = async (prompt) => {
    const {text} = await generateText({
        model: perplexitySonar,
        prompt: prompt
    });
    console.log(text);
    return text;
}