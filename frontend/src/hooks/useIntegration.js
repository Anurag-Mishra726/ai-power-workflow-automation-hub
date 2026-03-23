import { getIntegration } from "@/api/integration.api";
import { useQuery } from "@tanstack/react-query";

export const useGetIntegration = (provider) => {
    return useQuery({
        queryKey: ["integration", provider],
        queryFn: () => getIntegration(provider),
        refetchOnMount: true,
    });
}