import {
  manualExecuteWorkflowService,
  googleFormExecuteWorkflowService,
} from "../services/workflow/inngest/workflowEcecute.js";

export const manualExecuteWorkflow = async (req, res) => {
  try {
    const { workflowId } = req.params;

    if (!workflowId) {
      return res.status(400).json({
        message: "WorkflowId not found! Bad request.",
        success: false,
      });
    }
    await manualExecuteWorkflowService(req.user, workflowId);

    return res.status(200).json({
      message: "Workflow Executed Successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Bad Request",
      success: false,
    });
  }
};

export const googleFormExecuteWorkflow = async (req, res) => {
  try {
    const { workflowId } = req.params;

    if (!workflowId) {
      return res.status(400).json({
        message: "WorkflowId not found! Bad request.",
        success: false,
      });
    }

    await googleFormExecuteWorkflowService(workflowId, req.body);
    return res.status(200).json({
      recived: true,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
    });
  }
};
