import { ReactFlow, Background, Controls, MiniMap, Panel } from "@xyflow/react";
import '@xyflow/react/dist/style.css'; // It was missing add at the end of main.jsx, but I think it's better to import it here in the component where ReactFlow is used. Don't know why it was this breaks the style when it was not imported. Before it was not imported at all, and I don't know how it was working without styles. And suddenly it was not working, so I added the import and it works fine now. Maybe it was cached before or something.
import useEditorUIStore from "@/stores/workflowEditorStore";
import useWorkflowData from "@/stores/workflowDataStore";
import ExecuteWorkflowButton from "./ExecuteWorkflowButton";
//import { ExecutionStatus } from "@/hooks/useRealtimeStatus";

const WorkflowCanvas = ({
  nodes,
  edges,
  nodeTypes,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
}) => {

  // ExecutionStatus();

  const closeNodeMenu = useEditorUIStore(s => s.closeNodeMenu);
  const {workflowId, workflowNodes} = useWorkflowData();

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={() => {closeNodeMenu()}}
        // snapGrid={[10, 10]}
        // snapToGrid
        // panOnScroll
        // panOnDrag={false}
        // selectionOnDrag
        fitView
        fitViewOptions={{ padding: 0.5 }}
        minZoom={0.5}
        maxZoom={1.2}
        className="bg-[#000000]"
        style={{ background: "#000000" }}
        deleteKeyCode={null}
      >
        <Controls
          className="react-flow__controls "
          showInteractive={true}
          style={{
            background: "#111827",
            border: "1px solid #1f2937",
            borderRadius: "6px",
          }}
        />

       {
        workflowNodes && workflowNodes[0]?.data?.triggerType === "manual" && 
         <Panel position="bottom-center">
          <ExecuteWorkflowButton workflowId={workflowId} />
          </Panel>
       }

        <MiniMap
          nodeColor={() => "#e0e0e0"}
          maskColor="rgba(0,0,0,0)"
          style={{ backgroundColor: "#0f0f0f", borderRadius: "6px" }}
        />

        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </>
  );
};

export default WorkflowCanvas;