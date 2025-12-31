import { inngest } from "./client.js";
import {gemini, perplexity} from "../ai/generateText.js";
import { generateText } from "ai"; 
import { perplexitySonar } from "../ai/perplexity.js";



export const helloWorld = inngest.createFunction(
    {id: "hello-world"},
    {event: "test/hello"},
    async({event, step}) => {
        console.log("Hello, World!", event);
        console.log("Event data:", event.data);

        const greeting = await step.run("greet", async () => {
            const name  = event.data.name || "Guest";
            const greetMsg = `Hello, ${name}! Welcome to AI Power Workflow Automation Hub.`;
            console.log("this is the first step of the GRRETING FUNCTION ---> ", greetMsg);
            return greetMsg;
        });

        await step.sleep("wait-5-seconds", 5000);

        await step.run("log-completed", async () => {
            console.log("Logs completed");
            return {message: "Greeting process completed.", completed: true};
        });

        return{
            message: "Function execution finished.",
            timestamp: new Date().toISOString(),
            eventId: event.id,
        }
    }
);



export const aiTest = inngest.createFunction(
  { id: "test-ai" },
  { event: "test/ai" },
  async ({ step }) => {
    const { steps } = await step.ai.wrap(
      "Test-AI-Step",
      generateText,  
      {
        model: perplexitySonar,     
        prompt: "What is the capital of India? List 2 more facts."
      }
    );
    console.log("Printingin the funtion Inngest : ", steps);
    return {
      aiResponse: steps
    };
  }
);
