import {useMutation} from '@tanstack/react-query';
import { saveWorkflowApi } from '@/api/workflow.api';
import { saveWorkflow } from '@/service/workflowSave.service';
import { toast } from "react-hot-toast";

export const useWorkflowSave = () => {
    // return useMutation({
    //     mutationFn: saveWorkflowApi,
    //     onSuccess: (data) =>{
    //         console.log("Workflow saved successfully:", data);
    //     }
    // });

    return useMutation({
        mutationFn: async () =>{
            
            const payload = await saveWorkflow();
            console.log("Payload to be saved:", payload);
            return saveWorkflowApi(payload);
        },
        onSuccess: (data) => {
            toast.success("Workflow saved successfully!");
            console.log("Saved workflow:", data);
        },
        onError: (error) => {
            toast.error(error.message || "Failed to save workflow");
            console.error("Error saving workflow:", error);
        }
    });
}

