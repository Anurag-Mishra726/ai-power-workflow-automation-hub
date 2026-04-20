import { inngest } from "./client.js";
import { NonRetriableError } from "inngest";
import { Workflow } from "../models/workflow.model.js";
import { sortWorkflowNodes } from "../utils/toposortNodes.js";
import { getNodeExecutor } from "../services/workflow/nodeExecutor/executorRegistry.js";
import { httpRequestChannel } from "./workflowStatus.js";
//import { processWorkflowPolling } from "../services/pollingService.js";
import { processWorkflowPolling } from "../services/polling/polling.service.js";
import { Execution } from "../models/execution.model.js";

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    onFailure: async ({ event, error }) => {
      const workflowId = event?.data?.workflowId;
      const inngestId = event?.id;

      if (!workflowId || !inngestId) {
        return;
      }

      try {
        const userRecord = await Workflow.getUserId({ workflowId });
        const outputData = event?.data?.initialData || null;

        const result = await Execution.markFailure({
          inngestId,
          workflowId,
          errorMsg: error?.message || "Execution failed after retries",
          output: outputData,
        });

        if (result?.affectedRows === 0 && userRecord?.user_id) {
          await Execution.create({
            inngestId,
            userId: userRecord.user_id,
            workflowId,
            status: "failed",
            output: outputData,
          });

          await Execution.markFailure({
            inngestId,
            workflowId,
            errorMsg: error?.message || "Execution failed after retries",
            output: outputData,
          });
        }
      } catch (failureError) {
        console.error("Failed to persist execution failure", failureError);
      }
    },
  },
  {
    event: "workflow/execute",
    channel: [httpRequestChannel()],
  },

  async ({ event, step, publish }) => {
    const workflowId = event.data.workflowId;
    const inngestId = event.id;

    if (!workflowId) {
      throw new NonRetriableError("Workflow Id is missing!");
    }

    const userId = await step.run("find-userId", async () => {
      const user = await Workflow.getUserId({ workflowId });
      if (!user?.user_id) {
        throw new NonRetriableError("User not found!");
      }
      return user.user_id;
    });

    await step.run("store-execution-start", async () => {
      await Execution.create({
        inngestId,
        userId,
        workflowId,
        status: "running",
        output: event.data.initialData || {},
      });

      await Workflow.incrementWorkflowRuns({ workflowId });
      return true;
    });

    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflowGraph = await Workflow.getWorkflowGraph({ workflowId });

      try {
        const executableNodes = await sortWorkflowNodes(workflowGraph);
        return executableNodes;
      } catch (error) {
        throw new NonRetriableError(error.message || "Invalid workflow!");
      }
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
          publish,
        });
      });

      context[node?.data?.config?.variable || node.id] = response;
    }

    await step.run("store-execution-success", async () => {
      await Execution.markSuccess({
        inngestId,
        workflowId,
        output: context,
      });
      return true;
    });

    return { workflowId, result: context };
  },
);

export const pollWorkflowTriggers = inngest.createFunction(
  { id: "poll-workflow-triggers" },
  { cron: "*/1 * * * *" },
  async ({ step }) => {
    const result = await step.run("polling-system", async () => {
      console.log("Polling workflow triggers...");
      //return processWorkflowPolling();
      return;
    });

    return result;
  },
);
