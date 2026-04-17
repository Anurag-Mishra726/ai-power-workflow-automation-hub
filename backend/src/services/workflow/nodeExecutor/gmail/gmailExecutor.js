import { NonRetriableError } from "inngest";
import { handleNewEmailTrigger } from "./triggers/newEmail.js";
import { handleSendEmail } from "./actions/sendEmail.js";
import { createExecutionResult } from "../../../../utils/executionResult.js";

const EVENT_HANDLER_MAP = {
  new_email: handleNewEmailTrigger,
  email_from_sender: handleNewEmailTrigger,
};

const ACTION_HANDLER_MAP = {
  send_email: handleSendEmail,
};

export const gmailExecutor = async ({ data, nodeId, context, userId }) => {
  try {
    if (!data.isConfigured || !data.config?.event) {
      throw new NonRetriableError("Node is not configured.");
    }

    const event = data.config.event;

    if (EVENT_HANDLER_MAP[event]) {
      return await EVENT_HANDLER_MAP[event]({ data, nodeId, context, userId });
    }

    if (ACTION_HANDLER_MAP[event]) {
      return await ACTION_HANDLER_MAP[event]({ data, nodeId, context, userId });
    }

    throw new NonRetriableError("Unsupported Gmail event.");
  } catch (error) {
    console.error("Gmail Executor Error:", error?.response?.data || error);

    return createExecutionResult({
      error: error.message || "Failed to execute Gmail action",
    });

    // throw new NonRetriableError(
    //   error?.response?.data?.error?.message ||
    //     error.message ||
    //     "Failed to execute Gmail action",
    // );
  }
};
