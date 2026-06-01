import { NonRetriableError } from "inngest";
import { createExecutionResult } from "../../../../../utils/executionResult.js";

const EVENT_ALIASES = {
  issues_opened: "issue_opened",
  issue_created: "issue_opened",
  issue_opened: "issue_opened",
  issues_closed: "issue_closed",
  issue_closed: "issue_closed",
  pull_opened: "pull_request_opened",
  pull_request_opened: "pull_request_opened",
  pull_closed: "pull_request_closed",
  pull_request_closed: "pull_request_closed",
  pull_merged: "pull_request_merged",
  pull_request_merged: "pull_request_merged",
  issue_comment_added: "issue_comment_created",
  issue_comment_created: "issue_comment_created",
  push: "push",
};

const normalizeEvent = (event) => EVENT_ALIASES[event] || event;

export const githubTriggerEvent = async ({ data, nodeId, context }) => {
  const configuredEvent = normalizeEvent(data?.config?.event);
  const webhookData = context?.githubWebhook;
  const receivedEvent = normalizeEvent(webhookData?.event);
  const startTime = Date.now();

  if (!configuredEvent) {
    throw new NonRetriableError("GitHub trigger event is not configured.");
  }

  if (!webhookData) {
    throw new NonRetriableError("GitHub webhook payload is missing.");
  }

  if (configuredEvent !== receivedEvent) {
    throw new NonRetriableError(
      `GitHub event mismatch. Expected ${configuredEvent}, received ${receivedEvent}.`,
    );
  }

  return createExecutionResult({
    output: {
      nodeId,
      triggered: true,
      event: receivedEvent,
      repository: webhookData.repoName,
      repositoryId: webhookData.repoId,
      branch: webhookData.branch || webhookData.targetBranch || null,
      startTime,
      endTime: Date.now(),
      status: true,
      data: webhookData,
    },
  });
};
