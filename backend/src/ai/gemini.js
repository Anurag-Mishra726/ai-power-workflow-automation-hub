import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const googleAI = createGoogleGenerativeAI();

export const geminiFlash = googleAI("gemini-2.0-flash");