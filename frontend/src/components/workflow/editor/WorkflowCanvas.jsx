import { ReactFlow, Background, Controls, MiniMap } from "@xyflow/react";
import useEditorUIStore from "@/stores/workflowEditorStore";
const WorkflowCanvas = ({
  nodes,
  edges,
  nodeTypes,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
}) => {

  const closeNodeMenu = useEditorUIStore(s => s.closeNodeMenu);

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