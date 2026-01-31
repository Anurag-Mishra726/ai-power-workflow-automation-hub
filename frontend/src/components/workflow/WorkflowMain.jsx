import { useState } from "react";
import "./WorkflowMain.css";
import WorkflowEmptyState from "./WorkflowEmptyState"; 
import WorkflowList from "./WorkflowList";
import { useGetWorkflowMetadata } from "@/hooks/useWorkflowApi ";

const WorkflowMain = () => {

  const {data, isLoading, error} = useGetWorkflowMetadata();
    
  if(isLoading){
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error loading workflows</div>;
  }

  const isEmpty = data.workflowMetadata.length === 0;

  console.log(data);

  return (
    <>

      {
        isEmpty ? (
          <WorkflowEmptyState/>
        ) : (
          <WorkflowList data={data.workflowMetadata} />
        )

      }
           
    </>
  );
};

export default WorkflowMain;
