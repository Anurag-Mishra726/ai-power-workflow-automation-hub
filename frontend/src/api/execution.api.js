import api from "@/utils/axiox";

export const getExecutions = async () => {
  const res = await api.get("/executions");
  return res.data;
};

export const getExecutionDetail = async (executionId) => {
  const res = await api.get(`/executions/${executionId}`);
  return res.data;
};
