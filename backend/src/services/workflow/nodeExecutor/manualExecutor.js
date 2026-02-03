import { createExecutionResult } from "../../../utils/executionResult.js";
import { NonRetriableError } from "inngest";


export const manualExecutor = async ({data, nodeId, context}) => {
    //console.log("Manual Trigger :--> ", data);

    if (!data.isConfigured) {
        //throw new AppError("Node is not configured");
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

// export const manualExecutor = async ({data, nodeId, context, step}) => {
//     const result = await step.run("manual-trigger", async() => {
//         return createExecutionResult({
//             output: { nodeId, triggered: true, startTime: Date.now() }
//         });
//     });

//     //  Return FULL context with this node's result added
//     return {
//         ...context,
//         nodes: {
//             ...context.nodes,  // Keep previous nodes' results
//             [nodeId]: result   // Add current node's result
//         }
//     };
// };
