import React from 'react'
import { FlaskConical } from "lucide-react";
import { useExecuteWorkflow } from '@/hooks/useWorkflowApi ';

const ExecuteWorkflowButton = ({workflowId}) => {
  const { mutate, isPending, isError } = useExecuteWorkflow();
  return (
     <div>
        <button
        onClick={() => {
            mutate(workflowId)
            console.log("Workflow executed!", workflowId);
        }}
        className="px-4 py-3 flex items-center gap-2 bg-black text-white font-bold text-[18px]  tracking-wider border-2 border-white 
        rounded-lg hover:bg-white hover:text-black transition-all duration-200 ease-in-out shadow-lg hover:shadow-xl active:scale-95">
        <FlaskConical size={20}  />{isPending ? "Executing..." : "Execute Workflow"}
        </button>
    </div>
  )
}

export default ExecuteWorkflowButton;
