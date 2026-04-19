import { Execution } from "../../models/execution.model.js";

export const getUserExecutions = async (userData) => {
  const userId = userData.userId;
  const executions = await Execution.listByUser({ userId });
  return { executions };
};

export const getExecutionDetail = async (userData, executionId) => {
  const userId = userData.userId;
  const execution = await Execution.getById({ id: executionId, userId });
  return execution;
};
