import {useMutation, useQuery} from '@tanstack/react-query';
import {
    getAllIntegration,
    addApiKey,
    getApiKey,
    updateApiKey,
    deleteApiKey,
    apiKeyExists,
} from '@/api/integration.api'
import { queryClient } from '@/utils/queryClient';

export const useGetAllIntegrations = () => {
    return useQuery({
        queryKey: ["integrations", "allapikeys"],
        queryFn: getAllIntegration,
        staleTime: 3 * 1000,
    });
}

export const useAddApiKey = () => {
    return useMutation({
        mutationFn: addApiKey,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["integrations", "allapikeys"]})
        }
    });
}

export const useApiKeyExists = (provider) => {
    return useQuery({
        queryKey: ["integration", provider],
        queryFn: () => apiKeyExists(provider),
        refetchOnMount: true,
    });
}

export const useGetApiKey = (provider) => {
    return useQuery({
        queryKey: ["single", "apikey"],
        queryFn: () => getApiKey(provider),
        staleTime: 0,
        refetchOnMount: true
    });
}

export const useUpdateApiKey = () => {
    return useMutation({
        mutationFn: updateApiKey,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["integrations", "allapikeys"]})
        }
    });
}

export const useDeleteApiKey = () => {
    return useMutation({
        mutationFn: deleteApiKey,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["integrations", "allapikeys"]})
        }
    });
}