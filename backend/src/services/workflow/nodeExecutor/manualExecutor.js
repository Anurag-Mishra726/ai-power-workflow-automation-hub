import { createExecutionResult } from "../../../utils/executionResult.js";
import { NonRetriableError } from "inngest";


export const manualExecutor = async ({data, nodeId, context}) => {
    
    if (!data.isConfigured) {
        throw new NonRetriableError("Node is not configured.")
    }

    return createExecutionResult({
        output:{
            nodeId,
            triggered: true,
            startTime: Date.now()
        },
    });
}
