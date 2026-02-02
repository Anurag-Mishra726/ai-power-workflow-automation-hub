import { inngest } from "./client.js";
import { NonRetriableError } from "inngest";
import { Workflow } from "../models/workflow.model.js";

// import {gemini, perplexity} from "../ai/generateText.js";
// import { generateText } from "ai"; 
// import { perplexitySonar } from "../ai/perplexity.js";


export const executeWorkflow = inngest.createFunction(
    {id: "execute-workflow"},
    {event: "workflow/execute"},

    async({event, step}) => {
      const workflowId = event.data.workflowId;
      if (!workflowId) {
        throw new NonRetriableError("Workflow Id is missing!");
      }

      const nodes = await step.run("prepare-workflow", async () => {
        const workflowGraph = await Workflow.getWorkflowGraph({workflowId});
        //console.log(workflowGraph);
        return workflowGraph;
      })

      //await step.sleep("test", "5s");
      return {nodes};
    }
);




