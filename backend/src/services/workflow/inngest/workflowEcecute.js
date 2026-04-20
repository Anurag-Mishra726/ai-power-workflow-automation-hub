import { inngest } from "../../../inngest/client.js";
import { Workflow } from "../../../models/workflow.model.js";
import { AppError } from "../../../utils/AppErrors.js";

export const manualExecuteWorkflowService = async (userData, workflowId) => {
   try {

    const userId = userData.userId;
    console.log("user and workflow id : ", userId, workflowId);

    const workflowExists = await Workflow.exists({workflowId, userId});

    if (!workflowExists) {
        throw new AppError("Workflow Not Found! Save and try again.", 404);
    }

    await inngest.send({
        name: "workflow/execute",
        data: {
            workflowId: workflowId,
            initialData: {
                userId: userId
            }
        }
    });
    return ;

   } catch (error) {
    console.log(error);
    throw new AppError(error.message || "Something went worong!", 500);
   }
}

export const httpWebhookExecuteWorkflowService = async (workflowId, payload) => {
    try {
        await inngest.send({
            name: "workflow/execute",
            data: {
                workflowId: workflowId,
                initialData: {
                    httpWebhook: payload
                }
            }
        });
    } catch (error) {
        console.log(error);
        throw new AppError(error.message || "Something went worong!", 500);
    }
}
