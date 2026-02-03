import pool from "../../config/db.js";
import { inngest } from "../../inngest/client.js";
import { Workflow } from "../../models/workflow.model.js";
import { AppError } from "../../utils/AppErrors.js";

export const executeWorkflowService = async (userData, workflowId) => {
   try {

    const userId = userData.userId;
    console.log("user and workflow id : ", userId, workflowId);

    const workflowExists = await Workflow.exists({workflowId, userId});
    //console.log(workflowExists);
    if (!workflowExists) {
        throw new AppError("Workflow Not Found! Save and try again.", 404);
    }
    const workflowGraph = await Workflow.getWorkflowGraph({workflowId});
     await inngest.send({
        name: "workflow/execute",
        data: {
            userId: userId,
            workflowId: workflowId,
        }
    });
    //sortWorkflow(workflowGraph)
    return ;

   } catch (error) {
    console.log(error);
    throw new AppError(error.message || "Something went worong!", 500);
   }
}