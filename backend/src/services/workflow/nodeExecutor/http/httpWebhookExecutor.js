import { NonRetriableError } from "inngest";
import { httpRequestChannel } from "../../../../inngest/workflowStatus.js";
import { createExecutionResult } from "../../../../utils/executionResult.js";

const ALLOWED_METHODS = ["ANY", "GET", "POST", "PUT", "PATCH", "DELETE"];

export const httpWebhookExecutor = async ({ data, nodeId, context, publish }) => {
  await publish(
    httpRequestChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  const config = data?.config || {};
  const method = String(config?.method || "").toUpperCase();

  if (!data?.isConfigured || !config?.variable || !config?.url || !ALLOWED_METHODS.includes(method)) {
    await publish(
      httpRequestChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("Webhook node is not configured correctly.");
  }

  const requestPayload = context?.httpWebhook;

  if (!requestPayload || typeof requestPayload !== "object") {
    await publish(
      httpRequestChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("No webhook request payload found in execution context.");
  }

  const incomingMethod = String(requestPayload?.method || "").toUpperCase();

  if (!incomingMethod || (method !== "ANY" && incomingMethod !== method)) {
    await publish(
      httpRequestChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError(`Webhook method mismatch. Expected ${method}, received ${incomingMethod || "UNKNOWN"}.`);
  }

  const startTime = Date.now();

  await publish(
    httpRequestChannel().status({
      nodeId,
      status: "success",
    }),
  );

  return createExecutionResult({
    output: {
      nodeId,
      triggered: true,
      startTime,
      endTime: Date.now(),
      data: {
        method: incomingMethod,
        headers: requestPayload?.headers || {},
        query: requestPayload?.query || {},
        body: requestPayload?.body || {},
      },
      status: true,
    },
  });
};
