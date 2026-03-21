import {useMutation, useQuery} from '@tanstack/react-query';
import { saveWorkflow } from '@/service/workflowSave.service';
import { toast } from "react-hot-toast";
import useWorkflowData from '@/stores/workflowDataStore';
import { useNavigate } from 'react-router-dom';
import { 
    saveWorkflowApi, 
    getWorkflowMetadata, 
    getWorkflowGraph, 
    generateWorkflowId, 
    deleteWorkflow,
    executeWorkflow,
 } from '@/api/workflow.api';

export const useWorkflowSave = () => {

    const {
        setWorkflowId, 
        setWorkflowName, 
        setNodesInStore, 
        setEdgesInStore, 
        setWorkflowStatus,
        setWorkflowTriggerType,
        setWorkflowCreatedAt,
        setWorkflowUpdatedAt,
    } = useWorkflowData();

    return useMutation({
        mutationFn: async () => {
            const payload = saveWorkflow();
            //console.log("Payload to be saved:", payload);
            return await saveWorkflowApi(payload);
        },
        onSuccess: (data) => {
            setWorkflowId(data.workflowId);
            setWorkflowName(data.workflowName);
            setWorkflowStatus(data.workflowStatus);
            setWorkflowTriggerType(data.workflowTriggerType);
            setWorkflowCreatedAt(data.workflowCreatedAt);
            setWorkflowUpdatedAt(data.workflowUpdatedAt);
            setNodesInStore(data.nodes);
            setEdgesInStore(data.edges);

            toast.success("Workflow saved successfully!");
            //console.table("Saved workflow:", data);
        },
        onError: (error) => {
            toast.error( error.message || "Failed to save workflow");
            console.error("Error saving workflow:", error);
        }
    });
}

export const useGetWorkflowMetadata = () => {
    
    return useQuery({
        queryKey: ["workflows", "graph" ],
        queryFn: getWorkflowMetadata,
        staleTime: 3 * 1000,
    });
}

export const useGetWorkflowGraph = () => {
    const {
        setWorkflowId, 
        setWorkflowName, 
        setNodesInStore, 
        setEdgesInStore, 
        setWorkflowStatus,
        setWorkflowTriggerType,
        setWorkflowCreatedAt,
        setWorkflowUpdatedAt,
    } = useWorkflowData();
    // TODOs : use useQuery here for retrieving workflow graph data.
    return useMutation({
        mutationFn: getWorkflowGraph,
        onSuccess: (data) => {
            //console.log(data);
            setWorkflowId(data.workflowId);
            setWorkflowName(data.workflowName);
            setWorkflowStatus(data.workflowStatus);
            setWorkflowTriggerType(data.workflowTriggerType);
            setWorkflowCreatedAt(data.workflowCreatedAt);
            setWorkflowUpdatedAt(data.workflowUpdatedAt);
            setNodesInStore(data.nodes);
            setEdgesInStore(data.edges);
        }
    });
}

export const useGenerateWorkflowId = () => {
    const { setWorkflowId, clearData} = useWorkflowData();
    const navigate = useNavigate();
    return useMutation({
        mutationFn: generateWorkflowId,
        onSuccess: (data) => {
            clearData();
            setWorkflowId(data.workflowId);
            navigate(`/workflow/new/${data.workflowId}`)
            console.log(data);
        },
        onError: (error) => {
            console.warn("Failed to generate workflow.", error.message || error);
            toast.error("Failed to generate workflow. Please try again.");
        }
    });
};

export const useDeleteWorkflow = () => {
    const {clearData} = useWorkflowData();
    const navigate = useNavigate();
    return useMutation({
        mutationFn: deleteWorkflow,
        onSuccess: () => {
            navigate('/workflow');
            clearData();
            toast.success("Workflow deleted successfully.");
        },
        onError: (error) => {
            console.log(error);
            navigate('/workflow');
            clearData();
            //toast.error(error || "Failed to delete workflow");
        }
    })
}

export const useExecuteWorkflow = () => {
    return useMutation({
        mutationFn: executeWorkflow,
        onSuccess: (data) => {
            console.log(data);
            toast.success("Workflow executed successfully.");
        },
        onError: (error) => {
            console.log(error);
            toast.error(error || "Failed to execute!");
        }
    })
}