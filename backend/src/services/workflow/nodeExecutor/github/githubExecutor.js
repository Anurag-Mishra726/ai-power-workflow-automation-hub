import { NonRetriableError } from "inngest";
import { createExecutionResult } from "../../../../utils/executionResult.js";
import { githubTriggerEvent } from "./triggers/githubTriggerEvent.js";
import { handleCreateIssue } from "./actions/createIssue.js";
import { handleCommentOnIssue } from "./actions/commentOnIssue.js";
import { handleCreatePullRequest } from "./actions/createPullRequest.js";

const EVENT_HANDLER_MAP = {
  push: githubTriggerEvent,
  pull_request_opened: githubTriggerEvent,
  pull_request_closed: githubTriggerEvent,
  pull_request_merged: githubTriggerEvent,
  issues_opened: githubTriggerEvent,
  issue_opened: githubTriggerEvent,
  issue_created: githubTriggerEvent,
  issues_closed: githubTriggerEvent,
  issue_closed: githubTriggerEvent,
  issue_comment_created: githubTriggerEvent,
  issue_comment_added: githubTriggerEvent,
};

const ACTION_HANDLER_MAP = {
  create_issue: handleCreateIssue,
  issue_create: handleCreateIssue,
  comment_on_issue: handleCommentOnIssue,
  issue_comment: handleCommentOnIssue,
  create_pull_request: handleCreatePullRequest,
};

export const githubExecutor = async ({ data, nodeId, context, userId }) => {
  try {
    if (!data?.isConfigured || !data?.config) {
      throw new NonRetriableError("GitHub node is not configured.");
    }

    const configuredEvent = data.config.event;
    const configuredAction = data.config.action;

    if (configuredEvent && EVENT_HANDLER_MAP[configuredEvent]) {
      return await EVENT_HANDLER_MAP[configuredEvent]({ data, nodeId, context, userId });
    }

     if (configuredAction && ACTION_HANDLER_MAP[configuredAction]) {
      return await ACTION_HANDLER_MAP[configuredAction]({ data, nodeId, context, userId });
    }

    throw new NonRetriableError("Unsupported GitHub event or action.");
  } catch (error) {
    console.error("GitHub Executor Error:", error?.response?.data || error);

    return createExecutionResult({
      error: error?.response?.data?.message || error.message || "GitHub execution failed",
    });
  }
};
