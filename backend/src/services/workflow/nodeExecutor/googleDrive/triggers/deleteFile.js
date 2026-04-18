import { createExecutionResult } from "../../../../../utils/executionResult.js";


export const handleDeleteFileTrigger = async ({ 
  nodeId,
  context,
}) => {
    const triggerData = context?.triggerData;

    return createExecutionResult({
        output: {
        nodeId,
        triggered: true,
        data: {
          fileId: triggerData?.id,
          name: triggerData?.name,
          eventType: triggerData?.eventType,
          time: triggerData?.time,
        },
        startTime: Date.now(),
      }
    });
}