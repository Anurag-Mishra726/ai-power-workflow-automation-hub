import { useQuery } from "@tanstack/react-query";
import { getExecutionDetail, getExecutions } from "@/api/execution.api";

export const useExecutions = () => {
  return useQuery({
    queryKey: ["executions"],
    queryFn: getExecutions,
    staleTime: 5 * 1000,
  });
};

export const useExecutionDetail = (executionId) => {
  return useQuery({
    queryKey: ["executions", executionId],
    queryFn: () => getExecutionDetail(executionId),
    enabled: Boolean(executionId),
  });
};
