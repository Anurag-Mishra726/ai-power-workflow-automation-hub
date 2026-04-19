import { getExecutionDetail, getUserExecutions } from "../services/execution/execution.repositories.js";

export const executionList = async (req, res) => {
  try {
    const result = await getUserExecutions(req.user);
    res.status(200).json({ success: true, executions: result.executions });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};

export const executionDetail = async (req, res) => {
  try {
    const executionId = Number(req.params.id);

    if (!executionId) {
      return res.status(400).json({ success: false, message: "Execution id is required" });
    }

    const execution = await getExecutionDetail(req.user, executionId);

    if (!execution) {
      return res.status(404).json({ success: false, message: "Execution not found" });
    }

    res.status(200).json({ success: true, execution });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};
