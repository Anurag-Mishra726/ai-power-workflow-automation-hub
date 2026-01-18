import { useWorkflow } from "../hooks/useWorkflow";
import WorkflowCanvas from "./WorkflowCanvas";
import WorkflowSidebar from "./WorkflowSidebar";
import useEditorUIStore from "@/stores/workflowEditorStore";

const WorkflowEditor = () => {
  const workflow = useWorkflow();
  const {isSidebarOpen} = useEditorUIStore();
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
          nodes={workflow.nodes} 
          setNodes={workflow.setNodes} 
          setTriggerType={workflow.setTriggerType}
        />}

      </div>
    </>
  );
};

export default WorkflowEditor;