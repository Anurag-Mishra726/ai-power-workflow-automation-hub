import { NonRetriableError } from "inngest";
import { createExecutionResult } from "../../../../utils/executionResult.js";

const EVENT_HANDLER_MAP = new Set([
  "push",
  "pull_opened",
  "pull_closed",
  "pull_merged",
  "issue_created",
  "issue_closed",
  "issue_comment_added",
]);

export const githubExecutor = async ({ data, nodeId, context, userId }) => {
  if (!data?.isConfigured || !data?.config?.event) {
    throw new NonRetriableError("GitHub node is not configured.");
  }

  const configuredEvent = data.config.event;
  const hasWebhookEvent = EVENT_HANDLER_MAP.has(configuredEvent);

  if (hasWebhookEvent) {
    
  }

  if (configuredEvent !== webhookData.event) {
    throw new NonRetriableError(`GitHub event mismatch. Expected ${configuredEvent}, received ${webhookData.event}.`);
  }

  return createExecutionResult({
    output: {
      nodeId,
      triggered: true,
      startTime: Date.now(),
      endTime: Date.now(),
      data: webhookData,
      status: true,
    },
  });
};
