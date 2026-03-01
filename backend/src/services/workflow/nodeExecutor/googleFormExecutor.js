import { NonRetriableError } from "inngest";
import { httpRequestChannel } from "../../../inngest/workflowStatus.js";
import Handlebars from 'handlebars';
import { createExecutionResult } from "../../../utils/executionResult.js";

export const googleFormExecutor = async ({data, nodeId, context, publish}) => {
    console.log("Google Form: ", context);
    return createExecutionResult({
        output: {
            nodeId,
            triggered: true,
            startTime: Date.now(),
        }
    })
}