import { createExecutionResult } from "../../../utils/executionResult.js";
import { NonRetriableError } from "inngest";
import { httpRequestChannel } from "../../../inngest/workflowStatus.js";

export const manualExecutor = async ({data, nodeId, context, publish}) => {
    await publish(
        httpRequestChannel().status({
            nodeId,
            status: "loading",
        })
    );
    
    if (!data.isConfigured) {
        await publish(
            httpRequestChannel().status({
                nodeId,
                status: "error",
            })
        );
        throw new NonRetriableError("Node is not configured.")
    }

    await publish(
        httpRequestChannel().status({
            nodeId,
            status: "success",
        })
    );

    return createExecutionResult({
        output:{
            nodeId,
            triggered: true,
            startTime: Date.now()
        },
    });
}
