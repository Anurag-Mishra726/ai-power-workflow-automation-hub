import { inngest } from "./client.js";
import { NonRetriableError } from "inngest";
import { Workflow } from "../models/workflow.model.js";
import { sortWorkflowNodes } from "../utils/toposortNodes.js";
import { getNodeExecutor } from "../services/workflow/nodeExecutor/executorRegistry.js";

// import {gemini, perplexity} from "../ai/generateText.js";
// import { generateText } from "ai";
// import { perplexitySonar } from "../ai/perplexity.js";

export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow" },
  { event: "workflow/execute" },

  async ({ event, step }) => {
    const workflowId = event.data.workflowId;
    if (!workflowId) {
      throw new NonRetriableError("Workflow Id is missing!");
    }

    const sortedNodes = await step.run("prepare-workflow", async () => {
  
      const workflowGraph = await Workflow.getWorkflowGraph({ workflowId });

      try {
        const executableNodes = await sortWorkflowNodes(workflowGraph);
        //const sortedExecutableNodes = executableNodes.filter((n) => n?.data?.triggerType !== "manual");
        return executableNodes;
      } catch (error) {
        throw new NonRetriableError(error.message || "Invalid workflow!");
      }

    });

    let context = {
      nodes: {},
    };

    for (const node of sortedNodes) {
      console.log("---------",node)
      const triggerType = node?.data?.triggerType;

      // if (!triggerType || !node.data?.isConfigured) {
      //   console.warn(`Skipping node ${node.id}: missing triggerType or not configured!`);
      //   continue;
      // }

      const nodeExecutor = getNodeExecutor(triggerType);
      const result = await step.run(`node-${node.id}`, async () => {
        return await nodeExecutor({
          data: node.data,
          nodeId: node.id,
          context,
        });
      });

      // if (!result || typeof result !== "object" || !("output" in result)) {
      //   throw new NonRetriableError(
      //     `Invalid execution result from node ${node.id}`
      //   );
      // }
     //console.log("result ", result);
      context.nodes[node.id] = result;
    }

    console.log(context);

    //await step.sleep("test", "5s");
    return { workflowId, result: context };
  },
);
