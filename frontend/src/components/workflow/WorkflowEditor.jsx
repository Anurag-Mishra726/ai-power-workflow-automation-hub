import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useState } from "react";
import {PlaceholderNode, AddNodeBtn} from "./nodes/PlaceholderNode";

const initialNodes = [
  {
    id: "n1",
    position: { x: 0, y: 0 },
    data: {},
    type: "triggerPlaceholder",
  },
];

const nodeTypes = {
  triggerPlaceholder: PlaceholderNode,
};

const initialEdges = [];

const WorkflowEditor = () => {

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  return (
    <>
    
      <div className="w-full h-full relative ">  
                
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          className="bg-[#000000]"
          style={{ background: "#000000" }}
        >

          <Panel position="top-right">
            <AddNodeBtn/>
          </Panel>
          
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

          <Background variant="dots" gap={10} size={1} />
        </ReactFlow>
      </div>
    </>
  );
};

export default WorkflowEditor;
