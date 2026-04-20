import { NonRetriableError } from "inngest";
import { httpRequestChannel } from "../../../../inngest/workflowStatus.js";
import { createExecutionResult } from "../../../../utils/executionResult.js";

export const httpWebhookExecutor = async ({data, nodeId, context, publish}) => {
    await publish(
        httpRequestChannel().status({
            nodeId,
            status: "loading",
        })
    );

    if (!data.isConfigured || !["GET", "POST", "PUT", "PATCH", "DELETE"].includes(data?.config?.method) || !data.config.variable ) {
        await publish(
            httpRequestChannel().status({
                nodeId,
                status: "error",
            })
        );
        throw new NonRetriableError("Node is not configured.")
    }

    if (["POST", "PUT", "PATCH"].includes(method) && !data.config.body && !data.config.headers) {
        await publish(
            httpRequestChannel().status({
                nodeId,
                status: "error",
            })
        );
        throw new NonRetriableError("Node is not configured.");
    }

    const startTime = Date.now();

    return createExecutionResult({
        output:{
            nodeId,
            triggered: true,
            startTime: startTime,
            endTime: Date.now(), 
            data: context?.payload || {},
        },
    });
}