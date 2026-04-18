import { httpRequestChannel } from "../../../inngest/workflowStatus.js";
import { createExecutionResult } from "../../../utils/executionResult.js";

export const googleFormExecutor = async ({data, nodeId, context, publish}) => {
    await publish(
        httpRequestChannel().status({
            nodeId,
            status: "loading",
        })
    );

    await publish(
        httpRequestChannel().status({
            nodeId,
            status: "success",
        })
    );

    return createExecutionResult({
        output: {
            nodeId,
            triggered: true,
            startTime: Date.now(),
        }
    })
}