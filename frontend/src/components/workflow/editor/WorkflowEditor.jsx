import { useEffect } from "react";
import { useWorkflow } from "../hooks/useWorkflow";
import WorkflowCanvas from "./WorkflowCanvas";
import WorkflowSidebar from "./WorkflowSidebar";
import useEditorUIStore from "@/stores/workflowEditorStore";
import ConfigSidebar from "./sidebar/ConfigSidebar";

const WorkflowEditor = () => {

  const workflow = useWorkflow();
  const {isSidebarOpen, isConfigSidebarOpen} = useEditorUIStore();
  const deleteNodeId = useEditorUIStore((s) => s.deleteNodeRequestId);
  const clearDeleteNodeRequest = useEditorUIStore( (s) => s.clearDeleteNodeRequest );

  const hasUnsavedChanges = workflow.nodes.length > 0 || isSidebarOpen || isConfigSidebarOpen;

  // useEffect(() => {
  //   const handleBeforeUnload = (e) => {
  //     if (hasUnsavedChanges) {
  //       e.preventDefault();
  //       e.returnValue = "You have unsaved workflow changes!";
  //     }
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  // }, [hasUnsavedChanges]);

  useEffect(() => {
    if (!deleteNodeId) return;
    workflow.deleteNode(deleteNodeId);
    clearDeleteNodeRequest();
  }, [deleteNodeId]);

  return (
    <>
      <div className="w-full h-full relative">

        <div className={`flex-1 h-full w-full`}>

          <WorkflowCanvas
            nodes={workflow.nodes}
            edges={workflow.edges}
            nodeTypes={workflow.nodeTypes}
            onNodesChange={workflow.onNodesChange}
            onEdgesChange={workflow.onEdgesChange}
            onConnect={workflow.onConnect}
            onNodeClick={workflow.onNodeClick}
          />

        </div>

        {isSidebarOpen && 
        <WorkflowSidebar 
          onClose={workflow.closeSideBar} 
          setTriggerType={workflow.setTriggerType}
        />}

        {isConfigSidebarOpen && 
          <ConfigSidebar nodes={workflow.nodes} onClose={workflow.closeConfigSidebar} setNodeConfig={workflow.setNodeConfig} />
        }


      </div>
    </>
  );
};

export default WorkflowEditor;