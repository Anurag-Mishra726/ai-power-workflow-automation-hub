import "./WorkflowMain.css";
import LoadingState from "../common/LoadingState";
import ErrorState from "../common/ErrorState";
import WorkflowEmptyState from "./WorkflowEmptyState"; 
import WorkflowList from "./WorkflowList";
import { useGetWorkflowMetadata } from "@/hooks/useWorkflowApi ";

const WorkflowMain = () => {

  const {data, isLoading, error} = useGetWorkflowMetadata();
    
  if(isLoading){
    return (
      <div className="flex justify-center items-center mt-40">
        <LoadingState
            text="LOADING*WORKFLOWS*"
            onHover="speedUp"
            spinDuration={20}
            className="custom-class"
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center mt-40">
        <ErrorState/>
      </div>
    )
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
