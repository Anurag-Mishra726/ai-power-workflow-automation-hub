import { inngest } from "./client.js";
import { NonRetriableError } from "inngest";
import { Workflow } from "../models/workflow.model.js";
import { sortWorkflowNodes } from "../utils/toposortNodes.js";
import { getNodeExecutor } from "../services/workflow/nodeExecutor/executorRegistry.js";
import { httpRequestChannel } from "./workflowStatus.js";
//import { processWorkflowPolling } from "../services/pollingService.js";
import { processWorkflowPolling } from "../services/polling/polling.service.js";

export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow" },
  { event: "workflow/execute",
    channel: [httpRequestChannel()],
  },

  async ({ event, step, publish }) => {
    const workflowId = event.data.workflowId;
    if (!workflowId) {
      throw new NonRetriableError("Workflow Id is missing!");
    }

    const sortedNodes = await step.run("prepare-workflow", async () => {

      const workflowGraph = await Workflow.getWorkflowGraph({ workflowId });

      try {
        const executableNodes = await sortWorkflowNodes(workflowGraph);
        return executableNodes;
      } catch (error) {
        throw new NonRetriableError(error.message || "Invalid workflow!");
      }

    });

    const userId = await step.run("find-userId", async () =>{
      const userId = await Workflow.getUserId({workflowId});
      return userId.user_id;
    });

    let context = event.data.initialData || {};

    for (const node of sortedNodes) {
      const triggerType = node?.data?.triggerType;

      const nodeExecutor = getNodeExecutor(triggerType);
      const response = await step.run(`node-${node.id}`, async () => {
       
        return await nodeExecutor({
          data: node.data,
          nodeId: node.id,
          context,
          userId,
          publish
        });
      });          
      
      context[node?.data?.config?.variable || node.id] = response;
    }

    //console.log(context);
    return { workflowId, result: context };
  },
);


export const pollWorkflowTriggers = inngest.createFunction(
  { id: "poll-workflow-triggers" },
  { cron: "*/1 * * * *" },
  async ({ step }) => {
    const result = await step.run("poll-gmail-drive-triggers", async () => {
      console.log("Polling workflow triggers...");
      //return;
      return processWorkflowPolling();
    });

    return result;
  }
);




